// import { type NextRequest, NextResponse } from "next/server";
// import { connectToDB } from "@/lib/mongoose";
// import Cart from "@/lib/models/cart.model";
// import Product from "@/lib/models/product.model";
// import Order from "@/lib/models/order.model";
// import { DealService } from "@/lib/services/deal.service";
// import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
// import { v4 as uuidv4 } from "uuid";

// /**
//  * POST: Process an order after payment is successful
//  * 1. Updates product inventory
//  * 2. Updates flash sale remaining inventory
//  * 3. Increments deal usage count
//  * 4. Creates order record
//  * 5. Clears the cart
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { paymentReference, paymentMethod, shippingMethods } = body;

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

//     // Start a MongoDB session for transaction
//     const session = await Cart.startSession();
//     session.startTransaction();

//     try {
//       // Group items by store
//       const storeGroups = {};
//       let totalAmount = 0;
//       let totalSavings = 0;

//       for (const item of cart.items) {
//         const storeID = item.storeID.toString();

//         if (!storeGroups[storeID]) {
//           storeGroups[storeID] = {
//             storeID,
//             items: [],
//             subtotal: 0,
//             originalSubtotal: 0,
//             savings: 0,
//             shippingCost: 0,
//             appliedDeals: [],
//           };
//         }

//         // Add item to store group
//         storeGroups[storeID].items.push(item);

//         // Calculate item totals
//         const itemTotal = item.priceAtAdd * item.quantity;
//         const originalItemTotal = item.originalPrice * item.quantity;
//         const itemSavings = originalItemTotal - itemTotal;

//         // Add to store totals
//         storeGroups[storeID].subtotal += itemTotal;
//         storeGroups[storeID].originalSubtotal += originalItemTotal;
//         storeGroups[storeID].savings += itemSavings;

//         // Add to order totals
//         totalAmount += itemTotal;
//         totalSavings += itemSavings;

//         // Add shipping cost if provided
//         if (shippingMethods && shippingMethods[storeID]) {
//           storeGroups[storeID].shippingCost = shippingMethods[storeID].price;
//           totalAmount += shippingMethods[storeID].price;
//         }

//         // Track applied deals
//         if (
//           item.dealInfo &&
//           !storeGroups[storeID].appliedDeals.some(
//             (d) => d.dealId === item.dealInfo.dealId
//           )
//         ) {
//           storeGroups[storeID].appliedDeals.push({
//             dealId: item.dealInfo.dealId,
//             dealType: item.dealInfo.dealType,
//             value: item.dealInfo.value,
//             name: item.dealInfo.name,
//           });
//         }
//       }

//       // Process each item: update inventory and deal analytics
//       for (const item of cart.items) {
//         // Update inventory for physical products
//         if (item.productType === "physicalproducts") {
//           const product = await Product.findById(item.product._id).session(
//             session
//           );

//           if (!product) {
//             throw new Error(`Product not found: ${item.product._id}`);
//           }

//           if (item.selectedSize) {
//             // Update size-specific inventory
//             const sizeIndex = product.sizes.findIndex(
//               (s) => s.size === item.selectedSize.size
//             );

//             if (sizeIndex !== -1) {
//               product.sizes[sizeIndex].quantity -= item.quantity;
//             }
//           } else {
//             // Update general inventory
//             product.productQuantity -= item.quantity;
//           }

//           await product.save({ session });
//         }

//         // Update deal analytics if a deal was applied
//         if (item.dealInfo) {
//           // Validate the deal is still applicable
//           const validation = await DealService.validateDeal(
//             item.dealInfo.dealId,
//             item.quantity,
//             item.selectedSize?.size
//           );

//           if (!validation.isValid) {
//             console.warn(
//               `Deal validation failed for item ${item._id}: ${validation.error}`
//             );
//             // Continue processing the order even if the deal is no longer valid
//             // The price was already captured at cart add time
//           } else {
//             // Calculate the discount amount
//             const discountAmount =
//               (item.originalPrice - item.priceAtAdd) * item.quantity;

//             // Update deal analytics
//             await DealService.updateDealAnalytics(
//               item.dealInfo.dealId,
//               userID,
//               item.quantity,
//               discountAmount,
//               item.priceAtAdd * item.quantity,
//               session
//             );
//           }
//         }
//       }

//       // Create order record
//       const orderNumber = `ORD-${Date.now()}-${uuidv4().substring(0, 8)}`;

//       // Prepare store orders
//       const storeOrders = Object.values(storeGroups).map((group) => {
//         const storeGroup = group as any;

//         // Prepare order items
//         const orderItems = storeGroup.items.map((item) => {
//           const orderItem: any = {
//             product: item.product._id,
//             productType: item.productType,
//             quantity: item.quantity,
//             priceAtOrder: item.priceAtAdd,
//             originalPrice: item.originalPrice,
//           };

//           // Add selected size if applicable
//           if (item.selectedSize) {
//             orderItem.selectedSize = {
//               size: item.selectedSize.size,
//               price: item.selectedSize.price,
//             };
//           }

//           // Add deal info if applicable
//           if (item.dealInfo) {
//             orderItem.dealInfo = {
//               dealId: item.dealInfo.dealId,
//               dealType: item.dealInfo.dealType,
//               value: item.dealInfo.value,
//               name: item.dealInfo.name,
//             };
//           }

//           return orderItem;
//         });

//         // Calculate store order total with shipping
//         const storeTotal = storeGroup.subtotal + storeGroup.shippingCost;

//         // Create store order object
//         return {
//           storeID: storeGroup.storeID,
//           items: orderItems,
//           subtotal: storeGroup.subtotal,
//           originalSubtotal: storeGroup.originalSubtotal,
//           savings: storeGroup.savings,
//           shippingCost: storeGroup.shippingCost,
//           totalAmount: storeTotal,
//           appliedDeals: storeGroup.appliedDeals,
//           shippingMethod: shippingMethods?.[storeGroup.storeID] || null,
//           status: "processing",
//         };
//       });

//       // Create the order
//       const order = new Order({
//         user: userID,
//         orderNumber,
//         storeOrders,
//         totalAmount,
//         totalSavings,
//         paymentReference,
//         paymentMethod,
//         status: "processing",
//       });

//       await order.save({ session });

//       // Clear the cart
//       cart.items = [];
//       await cart.save({ session });

//       // Commit the transaction
//       await session.commitTransaction();

//       return NextResponse.json({
//         success: true,
//         orderNumber,
//         orderId: order._id,
//       });
//     } catch (error) {
//       // Abort the transaction on error
//       await session.abortTransaction();
//       throw error;
//     } finally {
//       // End the session
//       session.endSession();
//     }
//   } catch (error: any) {
//     console.error("Error processing order:", error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }
