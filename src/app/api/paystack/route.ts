"use strict";

import { NextResponse } from "next/server";
import Product from "@/lib/models/product.model"; // Import Product model
import { Product as Products, RequestBodyTypes } from "@/types";
import { GroupedCart } from "@/app/(root)/checkout/page";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { amount, selectedShippingMethods, cartItemsWithShippingMethod } =
      requestBody;
    const { email, phone_number, name, uniqueRef } = requestBody.customer;
    const {
      address,
      secondary_phone_number,
      city,
      state,
      postal_code,
      itemsInCart,
      deliveryMethod,
      userID,
    }: RequestBodyTypes = requestBody.meta;

    const subamount = Number(amount * 100);

    let updatedCartItems;

    if (cartItemsWithShippingMethod) {
      updatedCartItems = cartItemsWithShippingMethod.map(
        (item: GroupedCart) => {
          const selectedMethod = selectedShippingMethods[item.storeID];
          const { shippingMethods, ...restOfItem } = item;

          return {
            ...restOfItem,
            selectedShippingMethod: selectedMethod || null, // Ensure fallback to null
          };
        }
      );
    }

    // Collect all product IDs
    const productIDs = updatedCartItems!.flatMap(
      (item: GroupedCart) =>
        item.products
          .map((productInCart) => {
            if (productInCart.productType === "physicalproducts") {
              return productInCart.product._id;
            }
            return undefined; // Explicitly return undefined for non-physical products
          })
          .filter(Boolean) // Filter out undefined values
    );

    // console.log("productIDs", productIDs);

    // Fetch all physical products at once
    const productsFromDB = await Product.find({ _id: { $in: productIDs } });
    // console.log("productsFromDB", productsFromDB);

    // Create a map for quick lookup
    const productMap = new Map(
      productsFromDB.map((product) => [product._id.toString(), product])
    );
    // console.log("productMap", productMap);

    // Iterate through cart items and use the pre-fetched products
    for (const item of updatedCartItems!) {
      for (const productInCart of item.products) {
        if (productInCart.productType === "physicalproducts") {
          console.log("productInCart", productInCart);
          const product = productMap.get(productInCart.product._id.toString());

          if (!product) {
            return NextResponse.json(
              { error: `Product not found: ${productInCart.product._id}` },
              { status: 400 }
            );
          }

          // Check stock for products without sizes
          if (!productInCart.selectedSize?.size) {
            if (product.productQuantity! < productInCart.quantity!) {
              return NextResponse.json(
                {
                  error: `Insufficient stock for product: ${product.name}. Available: ${product.productQuantity}, Requested: ${productInCart.quantity}`,
                },
                { status: 400 }
              );
            }
          }
          // Check stock for products with sizes
          else {
            const selectedProductSize = product.sizes?.find(
              (size: any) => size.size === productInCart.selectedSize?.size
            );

            if (!selectedProductSize) {
              return NextResponse.json(
                {
                  error: `Selected size not available for product: ${product.name}`,
                },
                { status: 400 }
              );
            }

            if (
              selectedProductSize.quantity < productInCart.selectedSize.quantity
            ) {
              return NextResponse.json(
                {
                  error: `Insufficient stock for product: ${product.name} (Size: ${productInCart.selectedSize.size}). Available: ${selectedProductSize.quantity}, Requested: ${productInCart.quantity}`,
                },
                { status: 400 }
              );
            }
          }
        }
      }
    }

    // Proceed to Payment Initialization
    const url = "https://api.paystack.co/transaction/initialize";
    const fields = {
      email,
      amount: subamount,
      reference: uniqueRef,
      customer: {
        first_name: name,
        phone: phone_number,
      },
      metadata: {
        userID,
        name,
        city,
        state,
        address,
        postal_code,
        phone_number,
        itemsInCart: updatedCartItems,
        deliveryMethod,
        secondary_phone_number,
      },
    };

    // Uncomment and use this block when ready to send requests to Paystack
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify(fields),
    });

    const result = await response.json();
    return NextResponse.json(result);

    // return NextResponse.json(updatedCartItems);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred during the request." },
      { status: 500 }
    );
  }
}

// "use strict";

// import { NextResponse } from "next/server";
// import Product from "@/lib/models/product.model"; // Import Product model
// import { RequestBodyTypes } from "@/types";

// export async function POST(request: Request) {
//   const requestBody = await request.json();
//   const { amount } = requestBody;
//   const { email, phone_number, name, uniqueRef } = requestBody.customer;
//   const {
//     address,
//     secondary_phone_number,
//     city,
//     state,
//     postal_code,
//     itemsInCart,
//     deliveryMethod,
//     userID,
//   }: RequestBodyTypes = requestBody.meta;

//   const subamount = Number(amount * 100);
//   // console.log("uniqueRef", uniqueRef);

//   try {
//     // Inventory Check
//     // console.log("itemsInCart", itemsInCart);
//     for (const item of itemsInCart) {
//       const product = await Product.findById(item._id);
//       if (!product) {
//         return NextResponse.json(
//           { error: `Product not found: ${item._id}` },
//           { status: 400 }
//         );
//       }

//       if (product.productQuantity < item.quantity!) {
//         return NextResponse.json(
//           {
//             error: `Insufficient stock for product: ${product.productName}. Available: ${product.productQuantity}, Requested: ${item.quantity}`,
//           },
//           { status: 400 }
//         );
//       }
//     }

//     // Proceed to Payment Initialization
//     const url = "https://api.paystack.co/transaction/initialize";
//     const fields = {
//       email: email,
//       amount: subamount,
//       reference: uniqueRef,
//       customer: {
//         first_name: name,
//         phone: phone_number,
//       },
//       metadata: {
//         userID: userID,
//         name: name,
//         city: city,
//         state: state,
//         address: address,
//         postal_code: postal_code,
//         phone_number: phone_number,
//         itemsInCart: itemsInCart,
//         deliveryMethod: deliveryMethod,
//         secondary_phone_number: secondary_phone_number,
//       },
//     };

//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//       },
//       body: JSON.stringify(fields),
//     });

//     const result = await response.json();

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { error: "An error occurred during the request." },
//       { status: 500 }
//     );
//   }
// }

let orderData = {
  cartItems: [
    {
      storeID: "66fbae5615b9fec5eac1b9bb",
      products: [
        {
          product: {
            _id: "670075f70d87b0b2b62ad1aa",
            storeID: "66fbae5615b9fec5eac1b9bb",
            productType: "physicalproducts",
            images: [
              "https://res.cloudinary.com/dhngvbjtz/image/upload/v1728083446/qfewevb0j8yfakrjxgsv.jpg",
            ],
            name: "Roberto Cavalli Oil Perfume",
            price: "5500",
            category: ["Body_Care_Products"],
          },
          storeID: "66fbae5615b9fec5eac1b9bb",
          quantity: "1",
          productType: "physicalproducts",
          _id: "67dd7b98f70a42ccfd5e03f5",
          price: "5500",
        },
        {
          selectedSize: {
            size: "43",
            price: "22000",
            quantity: "7",
          },
          product: {
            _id: "67859c2a0ae0ef727dae0573",
            storeID: "66fbae5615b9fec5eac1b9bb",
            productType: "physicalproducts",
            images: [
              "https://res.cloudinary.com/dhngvbjtz/image/upload/v1736809498/posa5etppfozu5snpndo.jpg",
            ],
            name: "Barker Emerson Oxford Shoes",
            sizes: [
              {
                size: "43",
                price: "22000",
                quantity: "7",
                _id: "67859c2a0ae0ef727dae0574",
              },
              {
                size: "44",
                price: "24500",
                quantity: "9",
                _id: "67859c2a0ae0ef727dae0575",
              },
              {
                size: "45",
                price: "26000",
                quantity: "5",
                _id: "67859c2a0ae0ef727dae0576",
              },
            ],
            category: ["Fashion"],
          },
          storeID: "66fbae5615b9fec5eac1b9bb",
          quantity: "1",
          productType: "physicalproducts",
          _id: "67dd7ba2f70a42ccfd5e0419",
          price: "22000",
        },
        {
          product: {
            _id: "675e786172b144a2ec0fce92",
            storeID: "66fbae5615b9fec5eac1b9bb",
            title:
              "Atomic Habits: Tiny Changes, Remarkable Results by James Clear",
            category: "Non-Fiction",
            price: "4500",
            coverIMG: [
              "https://res.cloudinary.com/dhngvbjtz/image/upload/v1734244448/gjzx5wxant0aii1hqvhi.png",
            ],
            productType: "digitalproducts",
          },
          storeID: "66fbae5615b9fec5eac1b9bb",
          quantity: "1",
          productType: "digitalproducts",
          _id: "67dd8387f70a42ccfd5e0686",
          price: "4500",
        },
      ],
      selectedShippingMethod: {
        name: "Standard Shipping",
        price: "1200",
        estimatedDeliveryDays: "5",
        isActive: "true",
        description: "Within 4-5 business days.",
      },
    },
  ],
  userID: "664c45ec0095f5f097c9ed09",
  userEmail: "mishaeljoe55@gmail.com",
  shippingAddress:
    "Cross River State, Calabar, 10 Ekpenyoung Abasi Street, Calabar",
  shippingMethod: undefined,
  status: "success",
  paymentType: "card",
  postalCode: "203557",
  amount: 33200,
  transactionReference: "Udua9d99cdd4-028f-4df0-9982-1bb814ce17fe",
};
