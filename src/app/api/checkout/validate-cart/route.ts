import { type NextRequest, NextResponse } from "next/server";
import { DealService } from "@/lib/services/deal.service";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import { currencyOperations } from "@/lib/utils";
import { connectToDB } from "@/lib/mongoose";
import Cart from "@/lib/models/cart.model";
import Product from "@/lib/models/product.model";
import EBook from "@/lib/models/digital-product.model";

/**
 * POST: Validates cart items before checkout
 * Checks:
 * 1. Stock availability for physical products
 * 2. Flash sale remaining inventory
 * 3. Deal validity (dates, usage limits, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const userID = await getUserDataFromToken(request);
    if (!userID) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    await connectToDB();

    // Get the cart with populated product details
    const cart = await Cart.findOne({ user: userID }).populate({
      path: "items.product",
      select: "_id name price images productType sizes title coverIMG storeID",
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    const validationErrors = [];
    let cartTotal = 0;

    // First pass: calculate cart total for minimum cart value validation
    for (const item of cart.items) {
      const itemTotal = currencyOperations.multiply(
        item.priceAtAdd,
        item.quantity
      );
      cartTotal = currencyOperations.add(cartTotal, itemTotal);
    }

    // Second pass: validate each cart item
    for (const item of cart.items) {
      // Get the full product details based on product type
      let product;
      if (item.productType === "physicalproducts") {
        product = await Product.findById(item.product._id);

        // Validate stock for physical products
        if (item.selectedSize && item.selectedSize.size !== undefined) {
          // Size-based product
          const size = product.sizes.find(
            (s) => s.size === item.selectedSize.size
          );
          if (!size) {
            validationErrors.push(
              `Size ${item.selectedSize.size} no longer available for ${product.name}`
            );
            continue;
          }

          if (size.quantity < item.quantity) {
            validationErrors.push(
              `Insufficient stock for ${product.name} (Size: ${item.selectedSize.size}). Available: ${size.quantity}, Requested: ${item.quantity}`
            );
          }
        } else {
          // Regular product
          if (product.productQuantity < item.quantity) {
            validationErrors.push(
              `Insufficient stock for ${product.name}. Available: ${product.productQuantity}, Requested: ${item.quantity}`
            );
          }
        }
      } else {
        // Digital product - no stock validation needed
        product = await EBook.findById(item.product._id);
      }

      // Validate deal if applied
      if (item.dealInfo) {
        const validation = await DealService.validateDeal(
          item.dealInfo.dealId,
          item.quantity,
          item.selectedSize?.size,
          cartTotal
        );

        if (!validation.isValid) {
          validationErrors.push(
            `Deal for ${product.name || product.title} is no longer valid: ${
              validation.error
            }`
          );
        }
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error validating cart:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// import { type NextRequest, NextResponse } from "next/server";
// import { connectToDB } from "@/lib/mongoose";
// import Cart from "@/lib/models/cart.model";
// import Product from "@/lib/models/product.model";
// import EBook from "@/lib/models/digital-product.model";
// import Deal from "@/lib/models/deal.model";
// import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";

// /**
//  * POST: Validates cart items before checkout
//  * Checks:
//  * 1. Stock availability for physical products
//  * 2. Flash sale remaining inventory
//  * 3. Deal validity (dates, usage limits, etc.)
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const userID = await getUserDataFromToken(request);
//     if (!userID) {
//       return NextResponse.json(
//         { success: false, error: "User not authenticated" },
//         { status: 401 }
//       );
//     }

//     await connectToDB();

//     // Get the cart with populated product details
//     const cart = await Cart.findOne({ user: userID }).populate({
//       path: "items.product",
//       select: "_id name price images productType sizes title coverIMG storeID",
//     });

//     if (!cart || cart.items.length === 0) {
//       return NextResponse.json(
//         { success: false, error: "Cart is empty" },
//         { status: 400 }
//       );
//     }

//     const validationErrors = [];

//     // Validate each cart item
//     for (const item of cart.items) {
//       // Get the full product details based on product type
//       let product;
//       if (item.productType === "physicalproducts") {
//         product = await Product.findById(item.product._id);

//         // Validate stock for physical products
//         if (item.selectedSize && item.selectedSize.size !== undefined) {
//           // console.log("item:", item.selectedSize);
//           // Size-based product
//           const size = product.sizes.find(
//             (s) => s.size === item.selectedSize.size
//           );
//           if (!size) {
//             validationErrors.push(
//               `Size ${item.selectedSize.size} no longer available for ${product.name}`
//             );
//             continue;
//           }

//           if (size.quantity < item.quantity) {
//             validationErrors.push(
//               `Insufficient stock for ${product.name} (Size: ${item.selectedSize.size}). Available: ${size.quantity}, Requested: ${item.quantity}`
//             );
//           }
//         } else {
//           // Regular product
//           if (product.productQuantity < item.quantity) {
//             validationErrors.push(
//               `Insufficient stock for ${product.name}. Available: ${product.productQuantity}, Requested: ${item.quantity}`
//             );
//           }
//         }
//       } else {
//         // Digital product - no stock validation needed
//         product = await EBook.findById(item.product._id);
//       }

//       // Validate deal if applied
//       if (item.dealInfo) {
//         const deal = await Deal.findById(item.dealInfo.dealId);

//         if (!deal) {
//           validationErrors.push(
//             `Deal for ${product.name || product.title} no longer exists`
//           );
//           continue;
//         }

//         // Check if deal is still active
//         const now = new Date();
//         if (!deal.isActive || deal.startDate > now || deal.endDate < now) {
//           validationErrors.push(
//             `Deal for ${product.name || product.title} has expired`
//           );
//           continue;
//         }

//         // Check usage limit
//         if (deal.usageLimit && deal.usageCount >= deal.usageLimit) {
//           validationErrors.push(
//             `Deal for ${
//               product.name || product.title
//             } has reached its usage limit`
//           );
//           continue;
//         }

//         // Check flash sale remaining inventory
//         if (
//           deal.dealType === "flash_sale" &&
//           deal.flashSaleRemaining !== undefined
//         ) {
//           if (deal.flashSaleRemaining < item.quantity) {
//             validationErrors.push(
//               `Flash sale for ${
//                 product.name || product.title
//               } has limited stock. Available: ${
//                 deal.flashSaleRemaining
//               }, Requested: ${item.quantity}`
//             );
//             continue;
//           }
//         }

//         // Check size-specific deals
//         if (
//           deal.applyToSizes &&
//           deal.applyToSizes.length > 0 &&
//           item.selectedSize
//         ) {
//           if (!deal.applyToSizes.includes(item.selectedSize.size)) {
//             validationErrors.push(
//               `Deal for ${product.name} does not apply to size ${item.selectedSize.size}`
//             );
//             continue;
//           }
//         }
//       }
//     }

//     if (validationErrors.length > 0) {
//       return NextResponse.json(
//         { success: false, errors: validationErrors },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     console.error("Error validating cart:", error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }
