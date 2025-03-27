import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyPaystackTransaction } from "@/lib/services/payment.service";
import { Queue } from "@/lib/services/queue.service";

// Create a queue for processing orders asynchronously
const orderQueue = new Queue();

export async function POST(request: Request) {
  const requestBody = await request.json();
  const headers = request.headers;
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  // Verify webhook signature
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(requestBody))
    .digest("hex");
  const signature = headers.get("x-paystack-signature");

  if (hash !== signature) {
    return NextResponse.json(
      { message: "This request isn't from Paystack" },
      { status: 401 }
    );
  }

  try {
    // Extract transaction reference
    const transactionReference = requestBody.data.reference;

    // Verify the transaction (this should be quick)
    const transactionData = await verifyPaystackTransaction(
      transactionReference
    );

    if (!transactionData) {
      return NextResponse.json(
        { message: "Failed to verify transaction" },
        { status: 400 }
      );
    }

    const { status, eventStatus, metadata, customer } = transactionData;

    // If payment is successful, queue the order processing
    if (eventStatus === true && status === "success") {
      // Queue the order processing task
      orderQueue.add({
        cartItems: metadata.itemsInCart,
        userID: metadata.userID,
        userEmail: customer.email,
        shippingAddress: `${metadata.state}, ${metadata.city}, ${metadata.address}`,
        shippingMethod: metadata.deliveryMethod,
        status,
        paymentType: transactionData.channel,
        postalCode: metadata.postal_code,
        amount: transactionData.amount / 100,
        transactionReference,
      });

      // Immediately acknowledge the webhook
      return NextResponse.json(
        { message: "Webhook received and order queued for processing" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Payment was not successful" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

// "use strict";

// import Product from "@/lib/models/product.model";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import crypto from "crypto";
// import Store from "@/lib/models/store.model";
// import Order from "@/lib/models/order.model";
// import {
//   CartItems,
//   DigitalProduct,
//   Product as Products,
//   Store as Stores,
// } from "@/types";
// import { calculateCommission } from "@/constant/constant";
// import nodemailer from "nodemailer";
// import EBook from "@/lib/models/digital-product.model";

// type APIProduct = Omit<Products, "productQuantity"> & {
//   productQuantity: number;
//   save: any;
// };

// type APIStore = Stores & {
//   save: any;
// };

// const transporter = nodemailer.createTransport({
//   host: "smtp.zoho.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "mishaeljoe55@zohomail.com",
//     pass: process.env.NEXT_SECRET_APP_SPECIFIED_KEY,
//   },
// });

// export async function POST(request: Request) {
//   const requestBody = await request.json();
//   // console.log("requestBody", requestBody);
//   const headers = request.headers;
//   const secret = process.env.PAYSTACK_SECRET_KEY!;

//   const transactionReference = requestBody.data.reference;
//   const hash = crypto
//     .createHmac("sha512", secret)
//     .update(JSON.stringify(requestBody))
//     .digest("hex");
//   const signature = headers.get("x-paystack-signature");

//   if (hash == signature) {
//     // Verify the transaction

//     try {
//       const response = await fetch(
//         `https://api.paystack.co/transaction/verify/${transactionReference}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           },
//         }
//       );

//       const result = await response.json();
//       // console.log("result", result);

//       const cartItems: CartItems[] = result.data.metadata.itemsInCart;
//       // const cartItems: ResultDataMetadataItemsInCart[] =
//       //   result.data.metadata.itemsInCart;
//       // console.log("cartItems", cartItems);

//       const userID = result.data.metadata.userID;
//       const userEmail = result.data.customer.email;
//       const shippingAddress = `${result.data.metadata.state}, ${result.data.metadata.city}, ${result.data.metadata.address}`;
//       const shippingMethod = result.data.metadata.deliveryMethod;
//       const eventStatus = result.status;
//       const chargeData = result.data;
//       const status = chargeData.status;
//       const paymentType = chargeData.channel;
//       const postalCode = result.data.metadata.postal_code;
//       // console.log("postalCode", postalCode);

//       if (eventStatus === true && status === "success") {
//         const session = await mongoose.startSession();
//         session.startTransaction();

//         try {
//           const orderProducts = [];
//           const notifications = []; // To notify the store that a product has been sold
//           const insufficientProducts = [];
//           const stores: string[] = [];

//           // product operation begins
//           for (const item of cartItems) {
//             const { productType, quantity } = item;

//             if (productType === "physicalproducts") {
//               // Query the physical product by product._id
//               const product: APIProduct = await Product.findById(
//                 item.product._id
//               ).session(session);

//               // console.log("product", product);

//               // Product not found
//               if (!product) {
//                 throw new Error(`Product not found: ${item.product._id}`);
//               }

//               // Check stock for products without sizes
//               if (!item.selectedSize) {
//                 if (product.productQuantity < quantity) {
//                   insufficientProducts.push({ product, quantity });
//                   continue; // Skip to the next product
//                 }

//                 // Reduce product quantity by the quantity purchased and save within a session
//                 product.productQuantity -= quantity;
//                 await product.save({ session });
//               } else {
//                 // Check stock for products with sizes
//                 const selectedSize = item.selectedSize;
//                 const selectedProductSize = product.sizes?.find(
//                   (size) => size.size === item.selectedSize?.size
//                 );
//                 // console.log(
//                 //   "selected procut sizefffffffff",
//                 //   selectedProductSize
//                 // );

//                 if (
//                   !selectedProductSize ||
//                   selectedProductSize.quantity < quantity
//                 ) {
//                   insufficientProducts.push({
//                     product,
//                     quantity,
//                     selectedSize,
//                   });
//                   continue; // Skip to the next product
//                 }

//                 // Reduce size-specific product quantity
//                 selectedProductSize.quantity -= quantity;
//                 await product.save({ session });
//               }

//               // Store operations for physical products continues
//               // calculate Total Product Purchased Amount for product without sizes
//               if (!item.selectedSize) {
//                 const totalProductPurchasedAmount = product.price! * quantity;
//                 const pendingBalance = calculateCommission(
//                   totalProductPurchasedAmount
//                 ).settleAmount;
//                 // console.log(
//                 //   "totalProductPurchasedAmount",
//                 //   totalProductPurchasedAmount
//                 // );
//                 // console.log("ppendingBalance", pendingBalance);

//                 const store: APIStore = await Store.findById(
//                   product.storeID
//                 ).session(session);

//                 if (store) {
//                   notifications.push({
//                     storeEmail: store.storeEmail,
//                     productName: product.name,
//                     quantity,
//                   });

//                   store.pendingBalance += pendingBalance;
//                   await store.save({ session });
//                 }

//                 if (stores.includes(product.storeID)) {
//                   continue;
//                 } else {
//                   stores.push(product.storeID);
//                 }

//                 orderProducts.push({
//                   product: product._id,
//                   store: product.storeID,
//                   quantity,
//                   price: product.price! * quantity, // Ensure the price is always defined. TODO: Work on this, i got this error: 'product.price' is possibly 'undefined'. and i included '!' just to make it pass TS check
//                 });
//                 // console.log("orderProducts", orderProducts);
//               } else {
//                 // calculate Total Product Purchased Amount for product with sizes
//                 const selectedProductSize = product.sizes?.find(
//                   (size) => size.size === item.selectedSize?.size
//                 );
//                 // console.log("selected procut size", selectedProductSize);
//                 const totalProductPurchasedAmount =
//                   selectedProductSize?.price! * quantity;
//                 const pendingBalance = calculateCommission(
//                   totalProductPurchasedAmount
//                 ).settleAmount;
//                 // console.log(
//                 //   "totalProductPurchasedAmount",
//                 //   totalProductPurchasedAmount
//                 // );
//                 // console.log("ppendingBalance", pendingBalance);

//                 const store: APIStore = await Store.findById(
//                   product.storeID
//                 ).session(session);

//                 if (store) {
//                   notifications.push({
//                     storeEmail: store.storeEmail,
//                     productName: product.name,
//                     quantity,
//                   });

//                   store.pendingBalance += pendingBalance;
//                   await store.save({ session });
//                 }

//                 orderProducts.push({
//                   product: product._id,
//                   store: product.storeID,
//                   quantity,
//                   price: selectedProductSize?.price! * quantity, // Ensure the price is always defined. TODO: Work on this, i got this error: 'product.price' is possibly 'undefined'. and i included '!' just to make it pass TS check
//                 });
//                 // console.log("orderProductsyyyy", orderProducts);

//                 if (stores.includes(product.storeID)) {
//                   continue;
//                 } else {
//                   stores.push(product.storeID);
//                 }
//               }
//             } else if (productType === "digitalproducts") {
//               // Query the digital product Model by product._id
//               const digitalProduct: DigitalProduct = await EBook.findById(
//                 item.product._id
//               ).session(session);

//               // Product not found
//               if (!digitalProduct) {
//                 throw new Error(
//                   `Digital Product(EBook) not found: ${item.product._id}`
//                 );
//               }
//               // Handle digital product: generate download link and send to user

//               // Retrieve the S3 key for the product
//               const s3Key = digitalProduct.s3Key;

//               if (!s3Key) {
//                 throw new Error(
//                   `S3 key not found for digital product: ${digitalProduct.title}`
//                 );
//               }

//               // Call your backend API route to generate the download link
//               const downloadUrlResponse = await fetch(
//                 `${
//                   process.env.BASE_URL
//                 }/api/s3-bucket/generate-download-url?s3Key=${encodeURIComponent(
//                   s3Key
//                 )}`
//               );

//               // Check if the response is successful
//               // console.log("downloadUrlResponse", downloadUrlResponse);
//               if (!downloadUrlResponse.ok) {
//                 throw new Error(
//                   `Failed to get download URL for digital product: ${digitalProduct.title}`
//                 );
//               }

//               const { downloadUrl } = await downloadUrlResponse.json(); // Extract the signed URL from the API response

//               // Send the download link to the user via email
//               const mailOptions = {
//                 from: '"Your E-commerce Site" <mishaeljoe55@zohomail.com>',
//                 to: userEmail, // User's email
//                 subject: "Your Digital Product Purchase",
//                 text: `Thank you for your purchase! You can download your digital product, ${digitalProduct.title}, using the link below. This link will expire in 1 hour:\n\n${downloadUrl}`,
//               };

//               transporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                   console.error("Error sending email:", error);
//                 } else {
//                   console.log("Download link sent to user:", info.response);
//                 }
//               });

//               const totalProductPurchasedAmount =
//                 digitalProduct.price * quantity;
//               const pendingBalance = calculateCommission(
//                 totalProductPurchasedAmount
//               ).settleAmount;
//               // console.log(
//               //   "totalProductPurchasedAmount",
//               //   totalProductPurchasedAmount
//               // );
//               // console.log("pendingBalance", pendingBalance);

//               const store: APIStore = await Store.findById(
//                 digitalProduct.storeID
//               ).session(session);

//               if (store) {
//                 notifications.push({
//                   storeEmail: store.storeEmail,
//                   productName: digitalProduct.title,
//                   quantity,
//                 });

//                 store.pendingBalance += pendingBalance;
//                 await store.save({ session });
//               }

//               orderProducts.push({
//                 product: item.product._id,
//                 store: digitalProduct.storeID,
//                 quantity,
//                 price: item.product.price, // Digital products have a fixed price
//               });
//               // console.log("orderProductsdddd", orderProducts);

//               if (stores.includes(digitalProduct.storeID)) {
//                 continue;
//               } else {
//                 stores.push(digitalProduct.storeID);
//               }
//             }
//           }
//           // product operation ends

//           // Handle insufficient products if any exist
//           if (insufficientProducts.length > 0) {
//             // Notify sellers about insufficient stock and send stock alert email
//             for (const {
//               product,
//               quantity,
//               selectedSize,
//             } of insufficientProducts) {
//               const store: APIStore = await Store.findById(
//                 product.storeID
//               ).session(session);

//               if (store) {
//                 let emailText = "";

//                 // If the product has a selected size
//                 if (selectedSize) {
//                   emailText = `Your product ${product.name} (Size: ${selectedSize.size}) is low on stock. Ordered quantity: ${selectedSize.quantity}, Available quantity: ${selectedSize.quantity}. Please restock.`;
//                 } else {
//                   // No selected size (for non-size-based products)
//                   emailText = `Your product ${product.name} is low on stock. Ordered quantity: ${quantity}, Available quantity: ${product.productQuantity}. Please restock.`;
//                 }

//                 const mailOptions = {
//                   from: '"Your E-commerce Site" <mishaeljoe55@zohomail.com>',
//                   to: store.storeEmail,
//                   subject: "Stock Alert Notification",
//                   text: emailText,
//                 };

//                 transporter.sendMail(mailOptions, (error, info) => {
//                   if (error) {
//                     console.error("Error sending email:", error);
//                   } else {
//                     console.log("Email sent:", info.response);
//                   }
//                 });
//               }
//             }
//           }

//           if (orderProducts.length > 0) {
//             // console.log(`orderProducts[0]`, orderProducts);
//             // console.log(`orderProducts[0].product,`, orderProducts[0].product);

//             const order = new Order({
//               user: userID,
//               stores: stores,
//               products: orderProducts,
//               totalAmount: chargeData.amount / 100,
//               status: status,
//               shippingAddress: shippingAddress,
//               shippingMethod: shippingMethod,
//               paymentMethod: paymentType,
//               paymentStatus: status === "success" ? "paid" : "Decline",
//               deliveryStatus: "Order Placed",
//               postalCode: postalCode,
//             });

//             await order.save({ session });
//           }

//           await session.commitTransaction();
//           session.endSession();

//           for (const notification of notifications) {
//             const mailOptions = {
//               from: '"Your E-commerce Site" <mishaeljoe55@zohomail.com>',
//               to: notification.storeEmail,
//               subject: "Product Sold Notification",
//               text: `Your product ${notification.productName} has been sold. Quantity: ${notification.quantity}`,
//             };

//             transporter.sendMail(mailOptions, (error, info) => {
//               if (error) {
//                 console.error("Error sending email:", error);
//               } else {
//                 console.log("Email sent:", info.response);
//               }
//             });
//           }

//           // console.log("orderProducts", orderProducts);

//           return NextResponse.json(
//             { message: "Payment and notifications processed successfully" },
//             { status: 200 }
//           );
//         } catch (err) {
//           await session.abortTransaction();
//           session.endSession();
//           console.error("Transaction error:", err);
//           return NextResponse.json(
//             { error: "An error occurred while processing the transaction" },
//             { status: 500 }
//           );
//         }
//       } else {
//         return NextResponse.json(
//           { message: "Payment was not successful" },
//           { status: 400 }
//         );
//       }
//     } catch (error) {
//       console.error("Error verifying transaction:", error);
//       return NextResponse.json(
//         { error: "Error verifying transaction" },
//         { status: 500 }
//       );
//     }
//   } else {
//     return NextResponse.json(
//       { message: "This request isn't from Paystack" },
//       { status: 401 }
//     );
//   }
// }
