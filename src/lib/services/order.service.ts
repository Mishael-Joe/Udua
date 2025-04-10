import mongoose from "mongoose";
import Product from "@/lib/models/product.model";
import Store from "@/lib/models/store.model";
import Order from "@/lib/models/order.model";
import EBook from "@/lib/models/digital-product.model";
import Cart from "@/lib/models/cart.model";
import { DealService } from "./deal.service";
import { sendEmail } from "./email.service";
import { currencyOperations, calculateCommission } from "../utils";

interface InsufficientStock {
  productId: string;
  productName: string;
  requestedQuantity: number;
  availableQuantity: number;
  size?: string;
}

interface NotificationItem {
  storeEmail: string;
  productName: string;
  quantity: number;
  orderId?: string;
}

/**
 * Main function to process an order
 * @param orderData The complete order data from the checkout
 * @returns The created order ID
 */
export async function processOrder(orderData: any): Promise<string> {
  // Start a MongoDB session for transaction support
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Initialize collections for tracking
    const storeSubOrders: Record<
      string,
      {
        store: string;
        products: any[];
        totalAmount: number;
        originalSubtotal: number;
        savings: number;
        appliedDeals: any[];
        shippingMethod?: {
          name: string;
          price: number;
          estimatedDeliveryDays: string;
          description: string;
        };
        deliveryStatus: string;
        payoutStatus: string;
      }
    > = {};
    const notifications: NotificationItem[] = [];
    const insufficientStockItems: InsufficientStock[] = [];
    const digitalProductDownloads = [];
    const dealUpdates = [];

    // Process each store's cart items
    for (const storeGroup of orderData.cartItems) {
      const { storeID, products, selectedShippingMethod } = storeGroup;

      // Initialize store sub-order if it doesn't exist
      if (!storeSubOrders[storeID]) {
        storeSubOrders[storeID] = {
          store: storeID,
          products: [],
          totalAmount: 0,
          originalSubtotal: 0,
          savings: 0,
          appliedDeals: [],
          shippingMethod: selectedShippingMethod
            ? {
                name: selectedShippingMethod.name,
                price: Number(selectedShippingMethod.price),
                estimatedDeliveryDays:
                  selectedShippingMethod.estimatedDeliveryDays || "5-7 days",
                description: selectedShippingMethod.description || "",
              }
            : undefined,
          deliveryStatus: "Order Placed",
          payoutStatus: "",
        };
      }

      // Process each product in the store group
      for (const item of products) {
        // Convert string values to numbers for consistency
        const quantity = Number(item.quantity);
        const priceAtAdd = Number(item.priceAtAdd);
        const originalPrice = Number(item.originalPrice);

        if (item.productType === "physicalproducts") {
          // Process physical product
          const product = await Product.findById(item.product._id).session(
            session
          );

          if (!product) {
            throw new Error(`Product not found: ${item.product._id}`);
          }

          // Validate stock
          let hasStock = true;
          let availableQuantity = 0;

          if (item.selectedSize) {
            // Size-based product
            const size = product.sizes.find(
              (s: { size: number }) => s.size === item.selectedSize.size
            );
            if (!size) {
              throw new Error(
                `Size ${item.selectedSize.size} not found for product ${product.name}`
              );
            }

            availableQuantity = size.quantity;
            if (size.quantity < quantity) {
              hasStock = false;
            } else {
              // Update stock
              size.quantity -= quantity;
            }
          } else {
            // Regular product
            availableQuantity = product.productQuantity;
            if (product.productQuantity < quantity) {
              hasStock = false;
            } else {
              // Update stock
              product.productQuantity -= quantity;
            }
          }

          if (!hasStock) {
            insufficientStockItems.push({
              productId: item.product._id,
              productName: product.name || "Unknown Product",
              requestedQuantity: quantity,
              availableQuantity,
              size: item.selectedSize?.size,
            });
            continue;
          }

          // Save product with updated stock
          await product.save({ session });

          // Add to store sub-orders
          const orderProduct = {
            physicalProducts: item.product._id,
            store: storeID,
            quantity,
            priceAtOrder: priceAtAdd,
            originalPrice,
            selectedSize: item.selectedSize
              ? {
                  size: item.selectedSize.size,
                  price: Number(item.selectedSize.price),
                }
              : undefined,
            dealInfo: (item.dealInfo && item.dealInfo) || null,
          };

          // Add deal info if a deal was applied
          if (item.dealInfo) {
            orderProduct["dealInfo"] = {
              dealId: item.dealInfo.dealId,
              dealType: item.dealInfo.dealType,
              value: item.dealInfo.value,
              name: item.dealInfo.name,
            };
          }

          storeSubOrders[storeID].products.push(orderProduct);

          // Update store totals
          const itemTotal = currencyOperations.multiply(priceAtAdd, quantity);
          const originalItemTotal = currencyOperations.multiply(
            originalPrice,
            quantity
          );
          const itemSavings = originalItemTotal - itemTotal;

          storeSubOrders[storeID].totalAmount = currencyOperations.add(
            storeSubOrders[storeID].totalAmount,
            itemTotal
          );

          storeSubOrders[storeID].originalSubtotal = currencyOperations.add(
            storeSubOrders[storeID].originalSubtotal,
            originalItemTotal
          );

          storeSubOrders[storeID].savings = currencyOperations.add(
            storeSubOrders[storeID].savings,
            itemSavings
          );

          // Update store balance and prepare notification
          await updateStoreBalance(
            storeID,
            itemTotal,
            product.name || "Unknown Product",
            quantity,
            session,
            notifications
          );

          // Track deal for analytics update
          if (item.dealInfo) {
            dealUpdates.push({
              dealId: item.dealInfo.dealId,
              userId: orderData.userID,
              quantity,
              discountAmount: itemSavings,
              orderTotal: itemTotal,
            });

            // Track applied deals for the store
            if (
              !storeSubOrders[storeID].appliedDeals.some(
                (d) => d.dealId.toString() === item.dealInfo.dealId
              )
            ) {
              storeSubOrders[storeID].appliedDeals.push({
                dealId: item.dealInfo.dealId,
                dealType: item.dealInfo.dealType,
                value: item.dealInfo.value,
                name: item.dealInfo.name,
              });
            }
          }
        } else if (item.productType === "digitalproducts") {
          // Process digital product
          const digitalProduct = await EBook.findById(item.product._id).session(
            session
          );

          if (!digitalProduct) {
            throw new Error(`Digital product not found: ${item.product._id}`);
          }

          // Add to store sub-orders
          const orderProduct = {
            digitalProducts: item.product._id,
            store: storeID,
            quantity,
            priceAtOrder: priceAtAdd,
            originalPrice,
            dealInfo: (item.dealInfo && item.dealInfo) || null,
          };

          // Add deal info if a deal was applied
          if (item.dealInfo) {
            orderProduct["dealInfo"] = {
              dealId: item.dealInfo.dealId,
              dealType: item.dealInfo.dealType,
              value: item.dealInfo.value,
              name: item.dealInfo.name,
            };
          }

          storeSubOrders[storeID].products.push(orderProduct);

          // Update store totals
          const itemTotal = currencyOperations.multiply(priceAtAdd, quantity);
          const originalItemTotal = currencyOperations.multiply(
            originalPrice,
            quantity
          );
          const itemSavings = originalItemTotal - itemTotal;

          storeSubOrders[storeID].totalAmount = currencyOperations.add(
            storeSubOrders[storeID].totalAmount,
            itemTotal
          );

          storeSubOrders[storeID].originalSubtotal = currencyOperations.add(
            storeSubOrders[storeID].originalSubtotal,
            originalItemTotal
          );

          storeSubOrders[storeID].savings = currencyOperations.add(
            storeSubOrders[storeID].savings,
            itemSavings
          );

          // Prepare download link for digital product
          if (digitalProduct.s3Key) {
            const downloadUrl = await generateDownloadUrl(digitalProduct.s3Key);
            digitalProductDownloads.push({
              email: orderData.userEmail,
              title: digitalProduct.title,
              url: downloadUrl,
            });
          }

          // Update store balance and prepare notification
          await updateStoreBalance(
            storeID,
            itemTotal,
            digitalProduct.title,
            quantity,
            session,
            notifications
          );

          // Track deal for analytics update
          if (item.dealInfo) {
            dealUpdates.push({
              dealId: item.dealInfo.dealId,
              userId: orderData.userID,
              quantity,
              discountAmount: itemSavings,
              orderTotal: itemTotal,
            });

            // Track applied deals for the store
            if (
              !storeSubOrders[storeID].appliedDeals.some(
                (d) => d.dealId.toString() === item.dealInfo.dealId
              )
            ) {
              storeSubOrders[storeID].appliedDeals.push({
                dealId: item.dealInfo.dealId,
                dealType: item.dealInfo.dealType,
                value: item.dealInfo.value,
                name: item.dealInfo.name,
              });
            }
          }
        }
      }

      // Add shipping cost to store total amount
      if (selectedShippingMethod) {
        storeSubOrders[storeID].totalAmount = currencyOperations.add(
          storeSubOrders[storeID].totalAmount,
          Number(selectedShippingMethod.price)
        );
      }
    }

    // Check if we have any products to process
    if (Object.keys(storeSubOrders).length === 0) {
      // If there are insufficient stock items, throw an error
      if (insufficientStockItems.length > 0) {
        throw new Error(
          `Insufficient stock for ${insufficientStockItems.length} product(s). Please update your cart.`
        );
      }
      throw new Error("No valid products to process in the order");
    }

    // Convert storeSubOrders to array for the order
    const subOrders = Object.values(storeSubOrders);

    // Calculate the total amount and savings for the entire order
    const orderTotalAmount = subOrders.reduce(
      (sum, subOrder: any) => currencyOperations.add(sum, subOrder.totalAmount),
      0
    );

    const orderTotalSavings = subOrders.reduce(
      (sum, subOrder: any) => currencyOperations.add(sum, subOrder.savings),
      0
    );

    // Get store IDs for the order
    const storeIds = Object.keys(storeSubOrders);

    // Create the main order with all sub-orders
    const order = new Order({
      user: orderData.userID,
      stores: storeIds,
      subOrders,
      totalAmount: orderTotalAmount,
      totalSavings: orderTotalSavings,
      status: "processing",
      postalCode: orderData.postalCode || "",
      shippingAddress: orderData.shippingAddress || "",
      paymentMethod: orderData.paymentType,
      paymentStatus: "paid",
      paymentReference: orderData.transactionReference,
    });

    // Save the order
    const savedOrder = await order.save({ session });

    // Update deal analytics
    for (const dealUpdate of dealUpdates) {
      await DealService.updateDealAnalytics(
        dealUpdate.dealId,
        dealUpdate.userId,
        dealUpdate.quantity,
        dealUpdate.discountAmount,
        dealUpdate.orderTotal,
        session
      );
    }

    // Clear the user's cart
    await Cart.findOneAndUpdate(
      { user: orderData.userID },
      { $set: { items: [] } },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Send notifications and download links after transaction is committed
    await sendNotifications(notifications, savedOrder._id.toString());
    await sendDigitalProductDownloads(digitalProductDownloads);

    return savedOrder._id.toString();
  } catch (error) {
    // Rollback the transaction if any error occurs
    await session.abortTransaction();
    session.endSession();

    console.error("Error processing order:", error);
    throw error;
  }
}

/**
 * Updates a store's pending balance
 */
async function updateStoreBalance(
  storeID: string,
  amount: number,
  productName: string,
  quantity: number,
  session: mongoose.ClientSession,
  notifications: any[]
): Promise<void> {
  const store = await Store.findById(storeID).session(session);

  if (!store) {
    throw new Error(`Store not found: ${storeID}`);
  }

  // Calculate the commission and settle amount
  const { settleAmount } = calculateCommission(amount);

  // Update the store's pending balance
  store.pendingBalance += settleAmount;
  await store.save({ session });

  // Add notification for the store
  notifications.push({
    storeEmail: store.storeEmail,
    productName,
    quantity,
  });
}

/**
 * Generates a download URL for a digital product
 */
async function generateDownloadUrl(s3Key: string): Promise<string> {
  try {
    const response = await fetch(
      `${
        process.env.BASE_URL
      }/api/s3-bucket/generate-download-url?s3Key=${encodeURIComponent(s3Key)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to generate download URL for s3Key: ${s3Key}`);
    }

    const { downloadUrl } = await response.json();
    return downloadUrl;
  } catch (error) {
    console.error("Error generating download URL:", error);
    throw error;
  }
}

/**
 * Sends notifications to stores about their sold products
 */
async function sendNotifications(
  notifications: any[],
  orderId: string
): Promise<void> {
  const sendPromises = notifications.map((notification) => {
    return sendEmail({
      to: notification.storeEmail,
      subject: "New Order Notification",
      text: `You have a new order (#${orderId})! Your product "${notification.productName}" has been purchased. Quantity: ${notification.quantity}. Please check your store dashboard for more details.`,
    });
  });

  await Promise.all(sendPromises);
}

/**
 * Sends download links for digital products
 */
async function sendDigitalProductDownloads(
  downloads: Array<{ email: string; title: string; url: string }>
): Promise<void> {
  const sendPromises = downloads.map((download) => {
    return sendEmail({
      to: download.email,
      subject: `Your Digital Purchase: ${download.title}`,
      text: `Thank you for your purchase! You can download "${download.title}" using the link below. This link will expire in 24 hours:

${download.url}

If you have any issues with your download, please contact customer support.`,
    });
  });

  await Promise.all(sendPromises);
}

// import mongoose from "mongoose";
// import Product from "@/lib/models/product.model";
// import Store from "@/lib/models/store.model";
// import Order from "@/lib/models/order.model";
// import EBook from "@/lib/models/digital-product.model";
// import Cart from "@/lib/models/cart.model";
// import { sendEmail } from "./email.service";
// import {
//   calculateEstimatedDeliveryDays,
//   currencyOperations,
//   calculateCommission,
// } from "../utils";

// // Type definitions
// interface ProductData {
//   _id: string;
//   storeID: string;
//   productType: "physicalproducts" | "digitalproducts";
//   name?: string;
//   title?: string;
//   price: number;
//   images?: string[];
//   coverIMG?: string[];
//   category: string | string[];
//   sizes?: Array<{
//     size: string;
//     price: number;
//     quantity: number;
//     _id: string;
//   }>;
// }

// interface SelectedSize {
//   size: string;
//   price: number;
//   quantity: number;
// }

// interface CartProduct {
//   product: ProductData;
//   storeID: string;
//   quantity: number;
//   productType: "physicalproducts" | "digitalproducts";
//   _id: string;
//   selectedSize?: SelectedSize;
//   price: number;
// }

// interface ShippingMethod {
//   name: string;
//   price: number;
//   estimatedDeliveryDays: number;
//   isActive: boolean;
//   description?: string;
// }

// interface CartStoreGroup {
//   storeID: string;
//   products: CartProduct[];
//   selectedShippingMethod: ShippingMethod;
// }

// interface OrderData {
//   cartItems: CartStoreGroup[];
//   userID: string;
//   userEmail: string;
//   shippingAddress: string;
//   shippingMethod?: string;
//   status: string;
//   paymentType: string;
//   postalCode: string;
//   amount: number;
//   transactionReference: string;
// }

// interface OrderProductItem {
//   physicalProducts?: mongoose.Types.ObjectId | string;
//   digitalProducts?: mongoose.Types.ObjectId | string;
//   store: string;
//   quantity: number;
//   price: number;
//   selectedSize?: {
//     size: string;
//     price: number;
//   };
// }

// interface StoreOrdersMap {
//   [storeId: string]: OrderProductItem[];
// }

// interface InsufficientStock {
//   productId: string;
//   productName: string;
//   requestedQuantity: number;
//   availableQuantity: number;
//   size?: string;
// }

// interface NotificationItem {
//   storeEmail: string;
//   productName: string;
//   quantity: number;
//   orderId?: string;
// }

// /**
//  * Main function to process an order
//  * @param orderData The complete order data from the checkout
//  * @returns The created order ID
//  */
// export async function processOrder(orderData: OrderData): Promise<string> {
//   // Start a MongoDB session for transaction support
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Initialize collections for tracking
//     const storeOrders: StoreOrdersMap = {};
//     const notifications: NotificationItem[] = [];
//     const insufficientStockItems: InsufficientStock[] = [];
//     const digitalProductDownloads: Array<{
//       email: string;
//       title: string;
//       url: string;
//     }> = [];

//     // Process each store's cart items
//     for (const storeGroup of orderData.cartItems) {
//       const { storeID, products, selectedShippingMethod } = storeGroup;

//       // Initialize store order group if it doesn't exist
//       if (!storeOrders[storeID]) {
//         storeOrders[storeID] = [];
//       }

//       // Process each product in the store group
//       for (const item of products) {
//         // Convert string values to numbers for consistency
//         const quantity = Number(item.quantity);
//         const price = Number(item.price);

//         if (item.productType === "physicalproducts") {
//           // Process physical product
//           const stockValidation = await validateAndUpdatePhysicalProductStock(
//             item,
//             quantity,
//             session
//           );

//           if (!stockValidation.success) {
//             insufficientStockItems.push({
//               productId: item.product._id,
//               productName: item.product.name || "Unknown Product",
//               requestedQuantity: quantity,
//               availableQuantity: stockValidation.availableQuantity,
//               size: item.selectedSize?.size,
//             });
//             continue;
//           }

//           // Add to store orders
//           storeOrders[storeID].push({
//             physicalProducts: item.product._id,
//             store: storeID,
//             quantity,
//             price: currencyOperations.multiply(price, quantity),
//             selectedSize: item.selectedSize
//               ? {
//                   size: item.selectedSize.size,
//                   price: Number(item.selectedSize.price),
//                 }
//               : undefined,
//           });

//           // Update store balance and prepare notification
//           await updateStoreBalance(
//             storeID,
//             currencyOperations.multiply(price, quantity),
//             item.product.name || "Unknown Product",
//             quantity,
//             session,
//             notifications
//           );
//         } else if (item.productType === "digitalproducts") {
//           // Process digital product
//           const digitalProduct = await EBook.findById(item.product._id).session(
//             session
//           );

//           if (!digitalProduct) {
//             throw new Error(`Digital product not found: ${item.product._id}`);
//           }

//           // Add to store orders
//           storeOrders[storeID].push({
//             digitalProducts: item.product._id,
//             store: storeID,
//             quantity,
//             price: currencyOperations.multiply(price, quantity),
//           });

//           // Prepare download link for digital product
//           if (digitalProduct.s3Key) {
//             const downloadUrl = await generateDownloadUrl(digitalProduct.s3Key);
//             digitalProductDownloads.push({
//               email: orderData.userEmail,
//               title: digitalProduct.title,
//               url: downloadUrl,
//             });
//           }

//           // Update store balance and prepare notification
//           await updateStoreBalance(
//             storeID,
//             currencyOperations.multiply(price, quantity),
//             digitalProduct.title,
//             quantity,
//             session,
//             notifications
//           );
//         }
//       }
//     }

//     // Check if we have any products to process
//     if (Object.keys(storeOrders).length === 0) {
//       // If there are insufficient stock items, throw an error
//       if (insufficientStockItems.length > 0) {
//         throw new Error(
//           `Insufficient stock for ${insufficientStockItems.length} product(s). Please update your cart.`
//         );
//       }
//       throw new Error("No valid products to process in the order");
//     }

//     // Create sub-orders for each store
//     const subOrders = Object.keys(storeOrders).map((storeId) => {
//       const products = storeOrders[storeId];

//       // Find the shipping method for this store
//       const storeGroup = orderData.cartItems.find(
//         (group) => group.storeID === storeId
//       );
//       const shippingMethod = storeGroup?.selectedShippingMethod;

//       // Calculate total amount for this store's products
//       const productsTotal = products.reduce(
//         (sum, product) => currencyOperations.add(sum, product.price),
//         0
//       );
//       const shippingCost = shippingMethod ? Number(shippingMethod.price) : 0;
//       const totalAmount = currencyOperations.add(productsTotal, shippingCost);

//       // Create sub-order object with shipping method as an object
//       return {
//         store: storeId,
//         products: products,
//         totalAmount,
//         shippingMethod: {
//           name: shippingMethod?.name || "Standard Shipping",
//           price: Number(shippingMethod?.price || 0),
//           estimatedDeliveryDays: calculateEstimatedDeliveryDays(
//             Number(shippingMethod?.estimatedDeliveryDays || 5)
//           ),
//           description: shippingMethod?.description || "",
//         },
//         deliveryStatus: "Order Placed",
//       };
//     });

//     // Calculate the total amount for the entire order
//     const orderTotalAmount = subOrders.reduce(
//       (sum, subOrder) => currencyOperations.add(sum, subOrder.totalAmount),
//       0
//     );

//     // Create the main order with all sub-orders
//     const order = new Order({
//       user: orderData.userID,
//       stores: Object.keys(storeOrders),
//       subOrders,
//       totalAmount: orderTotalAmount,
//       status: orderData.status,
//       postalCode: orderData.postalCode,
//       shippingAddress: orderData.shippingAddress,
//       paymentMethod: orderData.paymentType,
//       paymentStatus: orderData.status === "success" ? "paid" : "declined",
//       transactionReference: orderData.transactionReference,
//     });

//     // Save the order
//     const savedOrder = await order.save({ session });

//     // Clear the user's cart
//     await Cart.findOneAndUpdate(
//       { user: orderData.userID },
//       { $set: { items: [] } },
//       { session }
//     );

//     // Commit the transaction
//     await session.commitTransaction();
//     session.endSession();

//     // Send notifications and download links after transaction is committed
//     await sendNotifications(notifications, savedOrder._id.toString());
//     await sendDigitalProductDownloads(digitalProductDownloads);

//     return savedOrder._id.toString();
//   } catch (error) {
//     // Rollback the transaction if any error occurs
//     await session.abortTransaction();
//     session.endSession();

//     console.error("Error processing order:", error);
//     throw error;
//   }
// }

// /**
//  * Validates and updates stock for physical products
//  */
// async function validateAndUpdatePhysicalProductStock(
//   item: CartProduct,
//   quantity: number,
//   session: mongoose.ClientSession
// ): Promise<{ success: boolean; availableQuantity: number }> {
//   const product = await Product.findById(item.product._id).session(session);

//   if (!product) {
//     throw new Error(`Product not found: ${item.product._id}`);
//   }

//   // Check if the product has sizes and a selected size
//   if (item.selectedSize) {
//     const selectedSize = product.sizes?.find(
//       (size: SelectedSize) => size.size === item.selectedSize?.size
//     );

//     if (!selectedSize) {
//       throw new Error(
//         `Size ${item.selectedSize.size} not found for product ${product.name}`
//       );
//     }

//     // Check if there's enough stock for the selected size
//     if (selectedSize.quantity < quantity) {
//       return {
//         success: false,
//         availableQuantity: selectedSize.quantity,
//       };
//     }

//     // Update the stock for the selected size
//     selectedSize.quantity -= quantity;
//     await product.save({ session });

//     return { success: true, availableQuantity: selectedSize.quantity };
//   } else {
//     // Check if there's enough stock for the product
//     if (product.productQuantity < quantity) {
//       return {
//         success: false,
//         availableQuantity: product.productQuantity,
//       };
//     }

//     // Update the stock for the product
//     product.productQuantity -= quantity;
//     await product.save({ session });

//     return { success: true, availableQuantity: product.productQuantity };
//   }
// }

// /**
//  * Updates a store's pending balance
//  */
// async function updateStoreBalance(
//   storeID: string,
//   amount: number,
//   productName: string,
//   quantity: number,
//   session: mongoose.ClientSession,
//   notifications: NotificationItem[]
// ): Promise<void> {
//   const store = await Store.findById(storeID).session(session);

//   if (!store) {
//     throw new Error(`Store not found: ${storeID}`);
//   }

//   // Calculate the commission and settle amount
//   const { settleAmount } = calculateCommission(amount);

//   // Update the store's pending balance
//   store.pendingBalance += settleAmount;
//   // store.platformFee += platformFee;
//   // store.totalEarnings += settleAmount;

//   await store.save({ session });

//   // Add notification for the store
//   notifications.push({
//     storeEmail: store.storeEmail,
//     productName,
//     quantity,
//   });
// }

// /**
//  * Generates a download URL for a digital product
//  */
// async function generateDownloadUrl(s3Key: string): Promise<string> {
//   try {
//     const response = await fetch(
//       `${
//         process.env.BASE_URL
//       }/api/s3-bucket/generate-download-url?s3Key=${encodeURIComponent(s3Key)}`
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to generate download URL for s3Key: ${s3Key}`);
//     }

//     const { downloadUrl } = await response.json();
//     return downloadUrl;
//   } catch (error) {
//     console.error("Error generating download URL:", error);
//     throw error;
//   }
// }

// /**
//  * Sends notifications to stores about their sold products
//  */
// async function sendNotifications(
//   notifications: NotificationItem[],
//   orderId: string
// ): Promise<void> {
//   const sendPromises = notifications.map((notification) => {
//     return sendEmail({
//       to: notification.storeEmail,
//       subject: "New Order Notification",
//       text: `You have a new order (#${orderId})! Your product "${notification.productName}" has been purchased. Quantity: ${notification.quantity}. Please check your store dashboard for more details.`,
//     });
//   });

//   await Promise.all(sendPromises);
// }

// /**
//  * Sends download links for digital products
//  */
// async function sendDigitalProductDownloads(
//   downloads: Array<{ email: string; title: string; url: string }>
// ): Promise<void> {
//   const sendPromises = downloads.map((download) => {
//     return sendEmail({
//       to: download.email,
//       subject: `Your Digital Purchase: ${download.title}`,
//       text: `Thank you for your purchase! You can download "${download.title}" using the link below. This link will expire in 24 hours:\n\n${download.url}\n\nIf you have any issues with your download, please contact customer support.`,
//     });
//   });

//   await Promise.all(sendPromises);
// }

// import mongoose from "mongoose";
// import Product from "@/lib/models/product.model";
// import Store from "@/lib/models/store.model";
// import Order from "@/lib/models/order.model";
// import EBook from "@/lib/models/digital-product.model";
// import type {
//   CartItems,
//   DigitalProduct,
//   Product as Products,
//   Store as Stores,
// } from "@/types";
// import { calculateCommission } from "@/constant/constant";
// import { sendEmail } from "./email.service";
// import Cart from "../models/cart.model";

// type APIProduct = Omit<Products, "productQuantity"> & {
//   productQuantity: number;
//   save: any;
// };

// type APIStore = Stores & {
//   save: any;
// };

// type OrderData = {
//   cartItems: CartItems[];
//   userID: string;
//   userEmail: string;
//   shippingAddress: string;
//   shippingMethod: string;
//   status: string;
//   paymentType: string;
//   postalCode: string;
//   amount: number;
//   transactionReference: string;
// };

// type OrderProducts = {
//   physicalProducts?: Products["_id"];
//   digitalProducts?: DigitalProduct["_id"];
//   store: string;
//   quantity: number;
//   price: number;
// };

// type InsufficientProducts = {
//   product: APIProduct;
//   quantity: number;
//   selectedSize?: {
//     price: number;
//     size: string;
//     quantity: number;
//   };
// };

// type Notifications = {
//   productName: string;
//   storeEmail: string;
//   quantity: number;
// };

// // Interface for order product items that will be stored in storeOrders
// interface OrderProductItem {
//   physicalProducts?: mongoose.Types.ObjectId | string;
//   digitalProducts?: mongoose.Types.ObjectId | string;
//   store: string;
//   quantity: number;
//   price: number;
// }

// // Type for the storeOrders object - a record where keys are store IDs and values are arrays of OrderProductItem
// type StoreOrdersMap = Record<string, OrderProductItem[]>;

// /**
//  * Processes an order by updating inventory, creating order records, and sending notifications
//  * @param orderData The order data to process
//  */
// export async function processOrder(orderData: OrderData): Promise<void> {
//   const {
//     cartItems,
//     userID,
//     userEmail,
//     shippingAddress,
//     shippingMethod,
//     status,
//     paymentType,
//     postalCode,
//     amount,
//   } = orderData;
//   console.log("cartItems", cartItems);
//   console.log("orderData", orderData);

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const orderProducts: OrderProducts[] = [];
//     const notifications: Notifications[] = [];
//     const insufficientProducts: InsufficientProducts[] = [];
//     const stores: string[] = [];

//     // Object to track sub-orders by store
//     const storeOrders: StoreOrdersMap = {};

//     // Process each item in the cart
//     for (const item of cartItems) {
//       if (item.productType === "physicalproducts") {
//         await processPhysicalProduct(
//           item,
//           session,
//           orderProducts,
//           notifications,
//           insufficientProducts,
//           stores,
//           storeOrders
//         );
//       } else if (item.productType === "digitalproducts") {
//         await processDigitalProduct(
//           item,
//           session,
//           orderProducts,
//           notifications,
//           stores,
//           userEmail,
//           storeOrders
//         );
//       }
//     }

//     // Handle insufficient products
//     await handleInsufficientProducts(insufficientProducts, session);

//     // Replace the orderPromises section with this code:

//     // Create a single order with multiple sub-orders
//     const subOrders = Object.keys(storeOrders).map((storeId) => {
//       const products = storeOrders[storeId];

//       // Calculate the total amount for this store's products
//       const totalAmount = products.reduce(
//         (acc, product) => acc + product.price,
//         0
//       );

//       // Create a sub-order object following the SubOrderSchema structure
//       return {
//         store: storeId,
//         products: products,
//         totalAmount: totalAmount,
//         shippingMethod: shippingMethod,
//         deliveryStatus: "Order Placed",
//       };
//     });

//     // Calculate the total amount for the entire order
//     const orderTotalAmount = subOrders.reduce(
//       (acc, subOrder) => acc + subOrder.totalAmount,
//       0
//     );

//     // Create a single order with all sub-orders
//     const order = new Order({
//       user: userID,
//       stores: Object.keys(storeOrders), // All stores involved in this order
//       subOrders: subOrders,
//       totalAmount: orderTotalAmount,
//       status: status,
//       postalCode: postalCode,
//       shippingAddress: shippingAddress,
//       paymentMethod: paymentType,
//       paymentStatus: status === "success" ? "paid" : "Decline",
//     });

//     await order.save({ session });

//     // Clear user's cart
//     const cart = await Cart.findOne({ user: userID });
//     if (cart) {
//       cart.items = [];
//       await cart.save({ session });
//     }

//     await session.commitTransaction();
//     session.endSession();

//     // Send notifications after transaction is committed
//     for (const notification of notifications) {
//       await sendEmail({
//         to: notification.storeEmail,
//         subject: "Product Sold Notification",
//         text: `Your product ${notification.productName} has been sold. Quantity: ${notification.quantity}`,
//       });
//     }

//     console.log("Order processed successfully");
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Error processing order:", error);
//     throw error;
//   }
// }

// /**
//  * Processes a physical product order
//  */
// async function processPhysicalProduct(
//   item: CartItems,
//   session: mongoose.ClientSession,
//   orderProducts: OrderProducts[],
//   notifications: Notifications[],
//   insufficientProducts: InsufficientProducts[],
//   stores: string[],
//   storeOrders: StoreOrdersMap
// ): Promise<void> {
//   const { quantity, storeID } = item;

//   // Query the physical product by product._id
//   const product: APIProduct = await Product.findById(item.product._id).session(
//     session
//   );

//   if (!product) {
//     throw new Error(`Product not found: ${item.product._id}`);
//   }

//   // Process product without sizes
//   if (!item.selectedSize) {
//     if (product.productQuantity < quantity) {
//       insufficientProducts.push({ product, quantity });
//       return;
//     }

//     // Reduce product quantity
//     product.productQuantity -= quantity;
//     await product.save({ session });

//     // Update store balance
//     const totalProductPurchasedAmount = product.price! * quantity;
//     await updateStoreBalance(
//       product.storeID,
//       totalProductPurchasedAmount,
//       product.name,
//       quantity,
//       session,
//       notifications,
//       stores
//     );

//     if (!storeOrders[storeID]) {
//       storeOrders[storeID] = [];
//     }
//     storeOrders[storeID].push({
//       physicalProducts: product._id!,
//       store: product.storeID,
//       quantity,
//       price: product.price! * quantity,
//     });

//     // storeOrders[storeID].push(product);

//     // orderProducts.push({
//     //   physicalProducts: product._id!,
//     //   store: product.storeID,
//     //   quantity,
//     //   price: product.price! * quantity,
//     // });
//   }
//   // Process product with sizes
//   else {
//     const selectedSize = item.selectedSize;
//     const selectedProductSize = product.sizes?.find(
//       (size) => size.size === selectedSize?.size
//     );

//     // if (!selectedProductSize || selectedProductSize.quantity < quantity) {
//     //   insufficientProducts.push({ product, quantity, selectedSize });
//     //   return;
//     // }

//     // // Reduce size-specific quantity
//     // selectedProductSize.quantity -= quantity;
//     // await product.save({ session });

//     // Update store balance
//     const totalProductPurchasedAmount = selectedProductSize!.price * quantity;
//     await updateStoreBalance(
//       product.storeID,
//       totalProductPurchasedAmount,
//       product.name,
//       quantity,
//       session,
//       notifications,
//       stores
//     );

//     if (!storeOrders[storeID]) {
//       storeOrders[storeID] = [];
//     }
//     storeOrders[storeID].push({
//       physicalProducts: product._id!,
//       store: product.storeID,
//       quantity,
//       price: selectedProductSize!.price * quantity,
//     });

//     // orderProducts.push({
//     //   physicalProducts: product._id!,
//     //   store: product.storeID,
//     //   quantity,
//     //   price: selectedProductSize!.price * quantity,
//     // });
//   }
// }

// /**
//  * Processes a digital product order
//  */
// async function processDigitalProduct(
//   item: CartItems,
//   session: mongoose.ClientSession,
//   orderProducts: OrderProducts[],
//   notifications: Notifications[],
//   stores: string[],
//   userEmail: string,
//   storeOrders: StoreOrdersMap
// ): Promise<void> {
//   const { quantity, storeID } = item;

//   // Query the digital product
//   const digitalProduct: DigitalProduct = await EBook.findById(
//     item.product._id
//   ).session(session);

//   if (!digitalProduct) {
//     throw new Error(`Digital Product not found: ${item.product._id}`);
//   }

//   // Generate and send download link
//   const s3Key = digitalProduct.s3Key;
//   if (!s3Key) {
//     throw new Error(
//       `S3 key not found for digital product: ${digitalProduct.title}`
//     );
//   }

//   const downloadUrl = await generateDownloadUrl(s3Key);

//   await sendEmail({
//     to: userEmail,
//     subject: "Your Digital Product Purchase",
//     text: `Thank you for your purchase! You can download your digital product, ${digitalProduct.title}, using the link below. This link will expire in 1 hour:\n\n${downloadUrl}`,
//   });

//   // Update store balance
//   const totalProductPurchasedAmount = digitalProduct.price * quantity;
//   await updateStoreBalance(
//     digitalProduct.storeID,
//     totalProductPurchasedAmount,
//     digitalProduct.title,
//     quantity,
//     session,
//     notifications,
//     stores
//   );

//   if (!storeOrders[storeID]) {
//     storeOrders[storeID] = [];
//   }
//   storeOrders[storeID].push({
//     digitalProducts: item.product._id,
//     store: digitalProduct.storeID,
//     quantity,
//     price: item.product.price,
//   });

//   // orderProducts.push({
//   //   digitalProducts: item.product._id,
//   //   store: digitalProduct.storeID,
//   //   quantity,
//   //   price: item.product.price,
//   // });
// }

// /**
//  * Updates a store's pending balance and adds notification
//  */
// async function updateStoreBalance(
//   storeID: string,
//   totalAmount: number,
//   productName: string,
//   quantity: number,
//   session: mongoose.ClientSession,
//   notifications: Notifications[],
//   stores: string[]
// ): Promise<void> {
//   const pendingBalance = calculateCommission(totalAmount).settleAmount;
//   const store: APIStore = await Store.findById(storeID).session(session);

//   if (store) {
//     notifications.push({
//       storeEmail: store.storeEmail,
//       productName,
//       quantity,
//     });

//     store.pendingBalance += pendingBalance;
//     await store.save({ session });

//     if (!stores.includes(storeID)) {
//       stores.push(storeID);
//     }
//   }
// }

// /**
//  * Handles insufficient product stock
//  */
// async function handleInsufficientProducts(
//   insufficientProducts: InsufficientProducts[],
//   session: mongoose.ClientSession
// ): Promise<void> {
//   for (const { product, quantity, selectedSize } of insufficientProducts) {
//     const store: APIStore = await Store.findById(product.storeID).session(
//       session
//     );

//     if (store) {
//       const emailText = selectedSize
//         ? `Your product ${product.name} (Size: ${selectedSize.size}) is low on stock. Ordered quantity: ${quantity}, Available quantity: ${selectedSize.quantity}. Please restock.`
//         : `Your product ${product.name} is low on stock. Ordered quantity: ${quantity}, Available quantity: ${product.productQuantity}. Please restock.`;

//       await sendEmail({
//         to: store.storeEmail,
//         subject: "Stock Alert Notification",
//         text: emailText,
//       });
//     }
//   }
// }

// /**
//  * Generates a download URL for a digital product
//  */
// async function generateDownloadUrl(s3Key: string): Promise<string> {
//   try {
//     const response = await fetch(
//       `${
//         process.env.BASE_URL
//       }/api/s3-bucket/generate-download-url?s3Key=${encodeURIComponent(s3Key)}`
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to generate download URL for s3Key: ${s3Key}`);
//     }

//     const { downloadUrl } = await response.json();
//     return downloadUrl;
//   } catch (error) {
//     console.error("Error generating download URL:", error);
//     throw error;
//   }
// }

// pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppllllllllllllllllllluuuuuuuuuuuuuuuuuuuuuuuh
// import mongoose from "mongoose";
// import Product from "@/lib/models/product.model";
// import Store from "@/lib/models/store.model";
// import Order from "@/lib/models/order.model";
// import EBook from "@/lib/models/digital-product.model";
// import type {
//   CartItems,
//   DigitalProduct,
//   Product as Products,
//   Store as Stores,
// } from "@/types";
// import { calculateCommission } from "@/constant/constant";
// import { sendEmail } from "./email.service";
// import Cart from "../models/cart.model";

// type APIProduct = Omit<Products, "productQuantity"> & {
//   productQuantity: number;
//   save: any;
// };

// type APIStore = Stores & {
//   save: any;
// };

// type OrderData = {
//   cartItems: CartItems[];
//   userID: string;
//   userEmail: string;
//   shippingAddress: string;
//   shippingMethod: string;
//   status: string;
//   paymentType: string;
//   postalCode: string;
//   amount: number;
//   transactionReference: string;
// };

// type OrderProducts = {
//   physicalProducts?: Products["_id"];
//   digitalProducts?: DigitalProduct["_id"];
//   store: string;
//   quantity: number;
//   price: number;
// };

// type InsufficientProducts = {
//   product: APIProduct;
//   quantity: number;
//   selectedSize?: {
//     price: number;
//     size: string;
//     quantity: number;
//   };
// };

// type Notifications = {
//   productName: string;
//   storeEmail: string;
//   quantity: number;
// };

// /**
//  * Processes an order by updating inventory, creating order records, and sending notifications
//  * @param orderData The order data to process
//  */
// export async function processOrder(orderData: OrderData): Promise<void> {
//   const {
//     cartItems,
//     userID,
//     userEmail,
//     shippingAddress,
//     shippingMethod,
//     status,
//     paymentType,
//     postalCode,
//     amount,
//   } = orderData;

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const orderProducts: OrderProducts[] = [];
//     const notifications: Notifications[] = [];
//     const insufficientProducts: InsufficientProducts[] = [];
//     const stores: string[] = [];

//     // Object to track sub-orders by store
//     const storeOrders: Record<string, any[]> = {};

//     // Process each item in the cart
//     for (const item of cartItems) {
//       if (item.productType === "physicalproducts") {
//         await processPhysicalProduct(
//           item,
//           session,
//           orderProducts,
//           notifications,
//           insufficientProducts,
//           stores,
//           storeOrders
//         );
//       } else if (item.productType === "digitalproducts") {
//         await processDigitalProduct(
//           item,
//           session,
//           orderProducts,
//           notifications,
//           stores,
//           userEmail,
//           storeOrders
//         );
//       }
//     }

//     // Handle insufficient products
//     await handleInsufficientProducts(insufficientProducts, session);

//     // Array to hold promises for creating each sub-order
//     const orderPromises = Object.keys(storeOrders).map(async (storeId) => {
//       const orderProducts = storeOrders[storeId];

//       // Calculate the total amount for this store's products
//       // Help me calculate this
//       // const totalAmount = orderProducts.reduce(
//       //   (acc, product) => acc + product.price * product.quantity, 0
//       // );

//       // Create the sub-order for this store
//       const newOrder = new Order({
//         user: userID,
//         stores: [storeId], // Each sub-order contains a single store
//         products: orderProducts,
//         totalAmount: 7777, // change this once you have calculated the total amount
//         postalCode: postalCode,
//         shippingAddress: shippingAddress,
//         shippingMethod: shippingMethod,
//         paymentMethod: paymentType,
//         status: "Order Placed",
//         deliveryStatus: "Processing",
//       });

//       return await newOrder.save({ session }); // Save the sub-order to the database
//     });

//     // Execute all order creation promises
//     const createdOrders = await Promise.all(orderPromises);

//     // // Create order if there are products
//     // if (orderProducts.length > 0) {
//     //   const order = new Order({
//     //     user: userID,
//     //     stores: stores,
//     //     products: orderProducts,
//     //     totalAmount: amount,
//     //     status: status,
//     //     shippingAddress: shippingAddress,
//     //     shippingMethod: shippingMethod,
//     //     paymentMethod: paymentType,
//     //     paymentStatus: status === "success" ? "paid" : "Decline",
//     //     deliveryStatus: "Order Placed",
//     //     postalCode: postalCode,
//     //   });

//     //   await order.save({ session });

//     //   // Clear user's cart
//     //   const cart = await Cart.findOne({ user: userID });
//     //   if (cart) {
//     //     cart.items = [];
//     //     await cart.save({ session });
//     //   }
//     // }

//     await session.commitTransaction();
//     session.endSession();

//     // Send notifications after transaction is committed
//     for (const notification of notifications) {
//       await sendEmail({
//         to: notification.storeEmail,
//         subject: "Product Sold Notification",
//         text: `Your product ${notification.productName} has been sold. Quantity: ${notification.quantity}`,
//       });
//     }

//     console.log("Order processed successfully");
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Error processing order:", error);
//     throw error;
//   }
// }

// /**
//  * Processes a physical product order
//  */
// async function processPhysicalProduct(
//   item: CartItems,
//   session: mongoose.ClientSession,
//   orderProducts: OrderProducts[],
//   notifications: Notifications[],
//   insufficientProducts: InsufficientProducts[],
//   stores: string[],
//   storeOrders: Record<string, any[]>
// ): Promise<void> {
//   const { quantity, storeID } = item;

//   // Query the physical product by product._id
//   const product: APIProduct = await Product.findById(item.product._id).session(
//     session
//   );

//   if (!product) {
//     throw new Error(`Product not found: ${item.product._id}`);
//   }

//   // Process product without sizes
//   if (!item.selectedSize) {
//     if (product.productQuantity < quantity) {
//       insufficientProducts.push({ product, quantity });
//       return;
//     }

//     // Reduce product quantity
//     product.productQuantity -= quantity;
//     await product.save({ session });

//     // Update store balance
//     const totalProductPurchasedAmount = product.price! * quantity;
//     await updateStoreBalance(
//       product.storeID,
//       totalProductPurchasedAmount,
//       product.name,
//       quantity,
//       session,
//       notifications,
//       stores
//     );

//     if (!storeOrders[storeID]) {
//       storeOrders[storeID] = [];
//     }
//     storeOrders[storeID].push({
//       physicalProducts: product._id!,
//       store: product.storeID,
//       quantity,
//       price: product.price! * quantity,
//     });

//     // storeOrders[storeID].push(product);

//     // orderProducts.push({
//     //   physicalProducts: product._id!,
//     //   store: product.storeID,
//     //   quantity,
//     //   price: product.price! * quantity,
//     // });
//   }
//   // Process product with sizes
//   else {
//     const selectedSize = item.selectedSize;
//     const selectedProductSize = product.sizes?.find(
//       (size) => size.size === selectedSize?.size
//     );

//     // if (!selectedProductSize || selectedProductSize.quantity < quantity) {
//     //   insufficientProducts.push({ product, quantity, selectedSize });
//     //   return;
//     // }

//     // // Reduce size-specific quantity
//     // selectedProductSize.quantity -= quantity;
//     // await product.save({ session });

//     // Update store balance
//     const totalProductPurchasedAmount = selectedProductSize!.price * quantity;
//     await updateStoreBalance(
//       product.storeID,
//       totalProductPurchasedAmount,
//       product.name,
//       quantity,
//       session,
//       notifications,
//       stores
//     );

//     if (!storeOrders[storeID]) {
//       storeOrders[storeID] = [];
//     }
//     storeOrders[storeID].push({
//       physicalProducts: product._id!,
//       store: product.storeID,
//       quantity,
//       price: selectedProductSize!.price * quantity,
//     });

//     // orderProducts.push({
//     //   physicalProducts: product._id!,
//     //   store: product.storeID,
//     //   quantity,
//     //   price: selectedProductSize!.price * quantity,
//     // });
//   }
// }

// /**
//  * Processes a digital product order
//  */
// async function processDigitalProduct(
//   item: CartItems,
//   session: mongoose.ClientSession,
//   orderProducts: OrderProducts[],
//   notifications: Notifications[],
//   stores: string[],
//   userEmail: string,
//   storeOrders: Record<string, any[]>
// ): Promise<void> {
//   const { quantity, storeID } = item;

//   // Query the digital product
//   const digitalProduct: DigitalProduct = await EBook.findById(
//     item.product._id
//   ).session(session);

//   if (!digitalProduct) {
//     throw new Error(`Digital Product not found: ${item.product._id}`);
//   }

//   // Generate and send download link
//   const s3Key = digitalProduct.s3Key;
//   if (!s3Key) {
//     throw new Error(
//       `S3 key not found for digital product: ${digitalProduct.title}`
//     );
//   }

//   const downloadUrl = await generateDownloadUrl(s3Key);

//   await sendEmail({
//     to: userEmail,
//     subject: "Your Digital Product Purchase",
//     text: `Thank you for your purchase! You can download your digital product, ${digitalProduct.title}, using the link below. This link will expire in 1 hour:\n\n${downloadUrl}`,
//   });

//   // Update store balance
//   const totalProductPurchasedAmount = digitalProduct.price * quantity;
//   await updateStoreBalance(
//     digitalProduct.storeID,
//     totalProductPurchasedAmount,
//     digitalProduct.title,
//     quantity,
//     session,
//     notifications,
//     stores
//   );

//   if (!storeOrders[storeID]) {
//     storeOrders[storeID] = [];
//   }
//   storeOrders[storeID].push({
//     digitalProducts: item.product._id,
//     store: digitalProduct.storeID,
//     quantity,
//     price: item.product.price,
//   });

//   // orderProducts.push({
//   //   digitalProducts: item.product._id,
//   //   store: digitalProduct.storeID,
//   //   quantity,
//   //   price: item.product.price,
//   // });
// }

// /**
//  * Updates a store's pending balance and adds notification
//  */
// async function updateStoreBalance(
//   storeID: string,
//   totalAmount: number,
//   productName: string,
//   quantity: number,
//   session: mongoose.ClientSession,
//   notifications: Notifications[],
//   stores: string[]
// ): Promise<void> {
//   const pendingBalance = calculateCommission(totalAmount).settleAmount;
//   const store: APIStore = await Store.findById(storeID).session(session);

//   if (store) {
//     notifications.push({
//       storeEmail: store.storeEmail,
//       productName,
//       quantity,
//     });

//     store.pendingBalance += pendingBalance;
//     await store.save({ session });

//     if (!stores.includes(storeID)) {
//       stores.push(storeID);
//     }
//   }
// }

// /**
//  * Handles insufficient product stock
//  */
// async function handleInsufficientProducts(
//   insufficientProducts: InsufficientProducts[],
//   session: mongoose.ClientSession
// ): Promise<void> {
//   for (const { product, quantity, selectedSize } of insufficientProducts) {
//     const store: APIStore = await Store.findById(product.storeID).session(
//       session
//     );

//     if (store) {
//       const emailText = selectedSize
//         ? `Your product ${product.name} (Size: ${selectedSize.size}) is low on stock. Ordered quantity: ${quantity}, Available quantity: ${selectedSize.quantity}. Please restock.`
//         : `Your product ${product.name} is low on stock. Ordered quantity: ${quantity}, Available quantity: ${product.productQuantity}. Please restock.`;

//       await sendEmail({
//         to: store.storeEmail,
//         subject: "Stock Alert Notification",
//         text: emailText,
//       });
//     }
//   }
// }

// /**
//  * Generates a download URL for a digital product
//  */
// async function generateDownloadUrl(s3Key: string): Promise<string> {
//   try {
//     const response = await fetch(
//       `${
//         process.env.BASE_URL
//       }/api/s3-bucket/generate-download-url?s3Key=${encodeURIComponent(s3Key)}`
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to generate download URL for s3Key: ${s3Key}`);
//     }

//     const { downloadUrl } = await response.json();
//     return downloadUrl;
//   } catch (error) {
//     console.error("Error generating download URL:", error);
//     throw error;
//   }
// }

// /**
//  * Function to create an order and split it based on stores.
//  * @param userId - The ID of the user placing the order.
//  * @param products - An array of products, including product details such as store, quantity, and price.
//  * @param shippingInfo - Object containing shipping address, postal code, etc.
//  * @param paymentMethod - The payment method selected by the user.
//  * @returns Promise of created order(s)
//  */
// async function createOrder(
//   userId: mongoose.Schema.Types.ObjectId,
//   products: any[],
//   shippingInfo: any,
//   paymentMethod: string
// ) {
//   // Object to track sub-orders by store
//   const storeOrders: Record<string, any[]> = {};

//   // Iterate through the products to group them by store
//   products.forEach((product) => {
//     const storeId = product.store.toString();
//     if (!storeOrders[storeId]) {
//       storeOrders[storeId] = [];
//     }
//     storeOrders[storeId].push(product);
//   });

//   // Array to hold promises for creating each sub-order
//   const orderPromises = Object.keys(storeOrders).map(async (storeId) => {
//     const orderProducts = storeOrders[storeId];

//     // Calculate the total amount for this store's products
//     const totalAmount = orderProducts.reduce(
//       (acc, product) => acc + product.price * product.quantity,
//       0
//     );

//     // Create the sub-order for this store
//     const newOrder = new Order({
//       user: userId,
//       stores: [storeId], // Each sub-order contains a single store
//       products: orderProducts,
//       totalAmount,
//       postalCode: shippingInfo.postalCode,
//       shippingAddress: shippingInfo.shippingAddress,
//       shippingMethod: shippingInfo.shippingMethod,
//       paymentMethod,
//       status: "Order Placed",
//       deliveryStatus: "Processing",
//     });

//     return await newOrder.save(); // Save the sub-order to the database
//   });

//   // Execute all order creation promises
//   const createdOrders = await Promise.all(orderPromises);

//   return createdOrders; // Return the array of created orders (sub-orders)
// }

// export default createOrder;
