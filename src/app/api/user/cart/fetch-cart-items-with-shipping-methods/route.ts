// app/api/user/cart/fetch-cart-items-with-shipping-methods/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Cart from "@/lib/models/cart.model";
import Product from "@/lib/models/product.model";
import EBook from "@/lib/models/digital-product.model";
import Store from "@/lib/models/store.model"; // Import Store model
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";

export async function POST(request: NextRequest) {
  try {
    const userID = await getUserDataFromToken(request);
    if (!userID) {
      return NextResponse.json(
        { message: "User not logged in" },
        { status: 307 }
      );
    }

    await connectToDB();

    // Retrieve the cart and populate the product details for each item.
    const cart = await Cart.findOne({ user: userID }).populate({
      path: "items.product",
      select:
        "_id name price images productType sizes title coverIMG category storeID", // Include storeID
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { totalQuantity: 0, totalPrice: 0, items: [] },
        { status: 200 }
      );
    }

    let totalQuantity = 0;
    let totalPrice = 0;

    // Group cart items by storeID
    const storeProductGroups: { [storeID: string]: any[] } = {};

    for (const item of cart.items) {
      const storeID = item.product.storeID.toString(); // Correct the storeID reference

      // Initialize group if not already present
      if (!storeProductGroups[storeID]) {
        storeProductGroups[storeID] = [];
      }

      let product;
      let itemPrice = 0;

      if (item.product.productType === "physicalproducts") {
        product = await Product.findById(item.product._id);
        if (item.selectedSize && item.selectedSize.price) {
          itemPrice = item.selectedSize.price;
        } else {
          itemPrice = product.price;
        }
      } else if (item.product.productType === "digitalproducts") {
        product = await EBook.findById(item.product._id);
        itemPrice = product.price;
      }

      totalPrice += itemPrice * item.quantity;
      totalQuantity += item.quantity;

      // Add only the _doc element of the item to the group for this store
      storeProductGroups[storeID].push({
        ...item._doc, // Get only the raw document fields (_doc)
        price: itemPrice,
        // quantity: item.quantity,
        // selectedSize: item.selectedSize, // Include any custom fields from the cart item
      });
    }

    // Define the type for storeShippingDetails
    const storeShippingDetails: { [key: string]: any[] } = {}; // Object where keys are storeIDs (string), and values are arrays of shipping methods

    // Fetch shipping methods for each store
    for (const storeID of Object.keys(storeProductGroups)) {
      const store = await Store.findById(storeID).select("shippingMethods");
      if (store) {
        storeShippingDetails[storeID] = store.shippingMethods;
      }
    }

    // Prepare the response with grouped products and shipping methods
    const groupedCart = Object.keys(storeProductGroups).map((storeID) => ({
      storeID,
      products: storeProductGroups[storeID],
      shippingMethods: storeShippingDetails[storeID] || [], // Attach shipping methods
    }));

    return NextResponse.json(
      { totalQuantity, totalPrice, groupedCart },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// // app/api/user/cart/fetch-cart-items-with-shipping-methods/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { connectToDB } from "@/lib/mongoose";
// import Cart from "@/lib/models/cart.model";
// import Product from "@/lib/models/product.model";
// import EBook from "@/lib/models/digital-product.model";
// import Store from "@/lib/models/store.model"; // Import Store model
// import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";

// export async function POST(request: NextRequest) {
//   try {
//     const userID = await getUserDataFromToken(request);
//     if (!userID) {
//       return NextResponse.json(
//         { message: "User not logged in" },
//         { status: 307 }
//       );
//     }

//     await connectToDB();

//     // Retrieve the cart and populate the product details for each item.
//     const cart = await Cart.findOne({ user: userID }).populate({
//       path: "items.product",
//       select:
//         "_id name price images productType sizes title coverIMG category storeID", // Include storeID
//     });

//     if (!cart || cart.items.length === 0) {
//       return NextResponse.json(
//         { totalQuantity: 0, totalPrice: 0, items: [] },
//         { status: 200 }
//       );
//     }

//     let totalQuantity = 0;
//     let totalPrice = 0;

//     // Group cart items by storeID
//     const storeProductGroups: { [storeID: string]: any[] } = {};

//     for (const item of cart.items) {
//       const storeID = item.storeID.toString();

//       // Initialize group if not already present
//       if (!storeProductGroups[storeID]) {
//         storeProductGroups[storeID] = [];
//       }

//       let product;
//       let itemPrice = 0;

//       if (item.productType === "physicalproducts") {
//         product = await Product.findById(item.product._id);
//         if (item.selectedSize && item.selectedSize.price) {
//           itemPrice = item.selectedSize.price;
//         } else {
//           itemPrice = product.price;
//         }
//       } else if (item.productType === "digitalproducts") {
//         product = await EBook.findById(item.product._id);
//         itemPrice = product.price;
//       }

//       totalPrice += itemPrice * item.quantity;
//       totalQuantity += item.quantity;

//       // Add item to the group for this store
//       storeProductGroups[storeID].push({ ...item, price: itemPrice });
//     }

//     // Define the type for storeShippingDetails
//     const storeShippingDetails: { [key: string]: any[] } = {}; // Object where keys are storeIDs (string), and values are arrays of shipping methods

//     // Fetch shipping methods for each store
//     for (const storeID of Object.keys(storeProductGroups)) {
//       const store = await Store.findById(storeID).select("shippingMethods");
//       if (store) {
//         storeShippingDetails[storeID] = store.shippingMethods;
//       }
//     }

//     // Prepare the response with grouped products and shipping methods
//     const groupedCart = Object.keys(storeProductGroups).map((storeID) => ({
//       storeID,
//       products: storeProductGroups[storeID],
//       shippingMethods: storeShippingDetails[storeID] || [], // Attach shipping methods
//     }));

//     // console.log("groupedCart", groupedCart);

//     return NextResponse.json(
//       { totalQuantity, totalPrice, groupedCart },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Error fetching cart:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
