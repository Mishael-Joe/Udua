// app/api/cart/add-product/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Cart from "@/lib/models/cart.model";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import Product from "@/lib/models/product.model";
import EBook from "@/lib/models/digital-product.model";

/**
 * POST: Add an item to the cart.
 * Expected JSON body:
 * {
 *   userId: string,
 *   productID: string,
 *   productType: "Physical Product" | "Digital Product",
 *   quantity: number,
 *   selectedSize?: { size: string, price: number }  // Optional for size-based products
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productID, productType, quantity, selectedSize, storeID } = body;

    const userId = await getUserDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        {
          error: "Please log in to add items to your cart.",
        },
        { status: 400 }
      );
    }

    if (!productID || !productType || !quantity || !storeID) {
      return NextResponse.json(
        {
          error:
            "userId, productID, productType, quantity and storeID are required",
        },
        { status: 400 }
      );
    }

    await connectToDB();

    // Find the user's cart or create a new one if none exists.
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Fetch product details to get the current price
    let product;
    let originalPrice = 0;

    if (productType === "physicalproducts") {
      product = await Product.findById(productID);
      // For size-based products, use the price from the selected size
      originalPrice = selectedSize ? selectedSize.price : product.price;
    } else {
      product = await EBook.findById(productID);
      originalPrice = product.price;
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if the item already exists in the cart. For physical products with sizes,
    // compare the selected size as well.
    let itemIndex = cart.items.findIndex((item: any) => {
      if (item.product.toString() !== productID) return false;
      if (item.productType !== productType) return false;
      if (productType === "Physical Product" && selectedSize) {
        return (
          item.selectedSize && item.selectedSize.size === selectedSize.size
        );
      }
      return true;
    });

    if (itemIndex > -1) {
      // Update the quantity for the existing item.
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add the item to the cart as a new entry.
      cart.items.push({
        product: productID,
        storeID,
        productType,
        quantity,
        selectedSize: selectedSize || undefined,
        priceAtAdd: originalPrice,
        originalPrice: originalPrice,
      });
    }

    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json(
      { message: "Cart updated", cart },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

{
  /* This feature is under construction and it is comming soon. #-DEALS */
}

// import { type NextRequest, NextResponse } from "next/server";
// import { connectToDB } from "@/lib/mongoose";
// import Cart from "@/lib/models/cart.model";
// import Product from "@/lib/models/product.model";
// import EBook from "@/lib/models/digital-product.model";
// import Deal from "@/lib/models/deal.model";
// import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";

// /**
//  * Checks if a product has any active deals and returns the best deal
//  * @param productId - The ID of the product to check
//  * @returns The best active deal for the product, or null if no deals are active
//  */
// async function getActiveDealForProduct(productId: string) {
//   try {
//     const now = new Date();

//     // Find active deals that include this product
//     const deals = await Deal.find({
//       productIds: { $in: [productId] },
//       isActive: true,
//       startDate: { $lte: now },
//       endDate: { $gte: now },
//     }).sort({ value: -1 }); // Sort by highest value first

//     if (!deals || deals.length === 0) {
//       return null;
//     }

//     // If multiple deals apply, prioritize based on deal type and value
//     let bestDeal = deals[0];

//     if (deals.length > 1) {
//       // First prioritize flash sales
//       const flashSales = deals.filter((deal) => deal.dealType === "flash_sale");
//       if (flashSales.length > 0) {
//         // Sort flash sales by highest value
//         flashSales.sort((a, b) => b.value - a.value);
//         bestDeal = flashSales[0];
//       } else {
//         // If no flash sales, find the deal with the highest discount
//         deals.sort((a, b) => {
//           // For percentage deals, higher percentage is better
//           if (a.dealType === "percentage" && b.dealType === "percentage") {
//             return b.value - a.value;
//           }
//           // For fixed deals, higher amount is better
//           if (a.dealType === "fixed" && b.dealType === "fixed") {
//             return b.value - a.value;
//           }
//           // Prioritize percentage deals over fixed for high-value items
//           if (a.dealType === "percentage" && b.dealType === "fixed") {
//             return 1; // Percentage first
//           }
//           if (a.dealType === "fixed" && b.dealType === "percentage") {
//             return -1; // Percentage first
//           }
//           // Sort by end date (sooner ending first) if same type and value
//           return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
//         });
//         bestDeal = deals[0];
//       }
//     }

//     return bestDeal;
//   } catch (error) {
//     console.error("Error fetching active deal for product:", error);
//     return null;
//   }
// }

// /**
//  * Calculates the discounted price based on the deal type and value
//  * @param originalPrice - The original price of the product
//  * @param deal - The deal to apply
//  * @returns The discounted price
//  */
// function calculateDiscountedPrice(originalPrice: number, deal: any) {
//   if (!deal) return originalPrice;

//   if (deal.dealType === "percentage" || deal.dealType === "flash_sale") {
//     return originalPrice - originalPrice * (deal.value / 100);
//   } else if (deal.dealType === "fixed") {
//     return Math.max(0, originalPrice - deal.value);
//   }

//   return originalPrice;
// }

// /**
//  * POST: Add an item to the cart with deal-aware pricing
//  * Expected JSON body:
//  * {
//  *   productID: string,
//  *   productType: "physicalproducts" | "digitalproducts",
//  *   quantity: number,
//  *   selectedSize?: { size: string, price: number, quantity: number },
//  *   storeID: string
//  * }
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { productID, productType, quantity, selectedSize, storeID } = body;

//     const userId = await getUserDataFromToken(request);

//     if (!userId) {
//       return NextResponse.json(
//         {
//           error: "Please log in to add items to your cart.",
//         },
//         { status: 400 }
//       );
//     }

//     if (!productID || !productType || !quantity || !storeID) {
//       return NextResponse.json(
//         {
//           error: "productID, productType, quantity and storeID are required",
//         },
//         { status: 400 }
//       );
//     }

//     await connectToDB();

//     // Find the user's cart or create a new one if none exists
//     let cart = await Cart.findOne({ user: userId });
//     if (!cart) {
//       cart = new Cart({ user: userId, items: [] });
//     }

//     // Fetch product details to get the current price
//     let product;
//     let originalPrice = 0;

//     if (productType === "physicalproducts") {
//       product = await Product.findById(productID);
//       // For size-based products, use the price from the selected size
//       originalPrice = selectedSize ? selectedSize.price : product.price;
//     } else {
//       product = await EBook.findById(productID);
//       originalPrice = product.price;
//     }

//     if (!product) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     // Check if the product has any active deals
//     const activeDeal = await getActiveDealForProduct(productID);

//     // Calculate the effective price based on any active deals
//     const priceAtAdd = calculateDiscountedPrice(originalPrice, activeDeal);

//     // Prepare deal info if a deal is active
//     let dealInfo = null;
//     if (activeDeal) {
//       dealInfo = {
//         dealId: activeDeal._id,
//         dealType: activeDeal.dealType,
//         value: activeDeal.value,
//         name: activeDeal.name,
//         endDate: activeDeal.endDate,
//       };
//     }

//     // Check if the item already exists in the cart
//     const itemIndex = cart.items.findIndex((item: any) => {
//       if (item.product.toString() !== productID) return false;
//       if (item.productType !== productType) return false;
//       if (productType === "physicalproducts" && selectedSize) {
//         return (
//           item.selectedSize && item.selectedSize.size === selectedSize.size
//         );
//       }
//       return true;
//     });

//     if (itemIndex > -1) {
//       // Update the quantity for the existing item
//       // Note: We don't update the price or deal info as it was captured at the time of initial add
//       cart.items[itemIndex].quantity += quantity;
//     } else {
//       // Add the item to the cart as a new entry with deal-aware pricing
//       cart.items.push({
//         product: productID,
//         storeID,
//         productType,
//         quantity,
//         selectedSize: selectedSize || undefined,
//         priceAtAdd,
//         originalPrice,
//         dealInfo: dealInfo || undefined,
//       });
//     }

//     cart.updatedAt = new Date();
//     await cart.save();

//     return NextResponse.json(
//       {
//         message: "Cart updated",
//         cart,
//         dealApplied: !!dealInfo,
//         discount: dealInfo ? originalPrice - priceAtAdd : 0,
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Error adding item to cart:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
