"use strict";

import Product from "@/lib/models/product.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import crypto from "crypto";
import Store from "@/lib/models/store.model";
import Order from "@/lib/models/order.model";
import {
  Product as Products,
  ResultDataMetadataItemsInCart,
  Store as Stores,
} from "@/types";
import { calculateCommission } from "@/constant/constant";
import nodemailer from "nodemailer";

type APIProduct = Omit<Products, "productQuantity"> & {
  productQuantity: number;
  save: any;
};

type APIStore = Stores & {
  save: any;
};

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: "mishaeljoe55@zohomail.com",
    pass: process.env.NEXT_SECRET_APP_SPECIFIED_KEY,
  },
});

export async function POST(request: Request) {
  const requestBody = await request.json();
  // console.log("requestBody", requestBody);
  const headers = request.headers;
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  const transactionReference = requestBody.data.reference;
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(requestBody))
    .digest("hex");
  const signature = headers.get("x-paystack-signature");

  if (hash === signature) {
    // Verify the transaction

    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${transactionReference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      const result = await response.json();
      // console.log("result", result);

      const cartItems: ResultDataMetadataItemsInCart[] =
        result.data.metadata.itemsInCart;
      // console.log("cartItems", cartItems);

      const userID = result.data.metadata.userID;
      const shippingAddress = `${result.data.metadata.state}, ${result.data.metadata.city}, ${result.data.metadata.address}`;
      const shippingMethod = result.data.metadata.deliveryMethod;
      const eventStatus = result.status;
      const chargeData = result.data;
      const status = chargeData.status;
      const paymentType = chargeData.channel;

      if (eventStatus === true && status === "success") {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          const orderProducts = [];
          const notifications = []; // to inform the store that one of its products has been sold
          const insufficientProducts = [];
          const stores = [];

          // product operation begins
          for (const { _id, quantity } of cartItems) {
            const product: APIProduct = await Product.findById(_id).session(
              session
            );
            // console.log(`product`, product);
            // NOTE: StoreID serves as the store this product belongs to

            // Product not found
            if (!product) {
              throw new Error(`Product not found: ${_id}`);
            }

            // Insufficient Products
            if (product.productQuantity < quantity) {
              insufficientProducts.push({ product, quantity });
              continue; // Skip to the next product
            }

            // Reduce the product Quantity by the Quantity purchased the save it within a session
            product.productQuantity -= quantity;
            await product.save({ session });

            // store operation begins
            // calculate pending balance of the store. This is done by multiplying the 
            // product price and the bought qty then taking away our commission or charges
            const totalProductPurchasedAmount = product.productPrice * quantity;
            const pendingBalance = calculateCommission(totalProductPurchasedAmount).settleAmount

            // console.log('pendingBalance', pendingBalance)
            const store: APIStore = await Store.findById(
              product.storeID
            ).session(session);
            // NOTE: storeID serves as the store the product belongs to.
            // console.log(`store`, store);

            if (store) {
              notifications.push({
                storeEmail: store.storeEmail,
                productName: product.productName,
                quantity,
              });

              store.pendingBalance += pendingBalance;
              await store.save({ session });
            }

            stores.push(product.storeID);

            orderProducts.push({
              product: product._id,
              store: product.storeID,
              quantity,
              price: product.productPrice * quantity,
            });
          }
          // product operation ends

          if (insufficientProducts.length > 0) {
            // Handle insufficient products: notify the seller and potentially refund
            // NOTE: accountId serves as the owner of the product i.e ownerID
            for (const { product, quantity } of insufficientProducts) {
              const store: APIStore = await Store.findById(
                product.storeID
              ).session(session);

              if (store) {
                const mailOptions = {
                  from: '"Your E-commerce Site" <mishaeljoe55@zohomail.com>',
                  to: store.storeEmail,
                  subject: "Stock Alert Notification",
                  text: `Your product ${product.productName} is low on stock. Ordered quantity: ${quantity}, Available quantity: ${product.productQuantity}. Please restock.`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.error("Error sending email:", error);
                  } else {
                    console.log("Email sent:", info.response);
                  }
                });
              }
            }

            // Optionally, handle refund for insufficient products
            // This can be a separate logic based on business rules
          }

          if (orderProducts.length > 0) {
            // console.log(`orderProducts[0]`, orderProducts[0]);
            // console.log(`orderProducts[0].product,`, orderProducts[0].product);

            const order = new Order({
              user: userID,
              stores: stores,
              products: orderProducts,
              totalAmount: chargeData.amount / 100,
              status: status,
              shippingAddress: shippingAddress,
              shippingMethod: shippingMethod,
              paymentMethod: paymentType,
              paymentStatus: status === "success" ? "paid" : "Decline",
              deliveryStatus: "Order Placed",
            });

            await order.save({ session });
          }

          await session.commitTransaction();
          session.endSession();

          for (const notification of notifications) {
            const mailOptions = {
              from: '"Your E-commerce Site" <mishaeljoe55@zohomail.com>',
              to: notification.storeEmail,
              subject: "Product Sold Notification",
              text: `Your product ${notification.productName} has been sold. Quantity: ${notification.quantity}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error("Error sending email:", error);
              } else {
                console.log("Email sent:", info.response);
              }
            });
          }

          return NextResponse.json(
            { message: "Payment and notifications processed successfully" },
            { status: 200 }
          );
        } catch (err) {
          await session.abortTransaction();
          session.endSession();
          console.error("Transaction error:", err);
          return NextResponse.json(
            { error: "An error occurred while processing the transaction" },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { message: "Payment was not successful" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Error verifying transaction:", error);
      return NextResponse.json(
        { error: "Error verifying transaction" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "This request isn't from Paystack" },
      { status: 401 }
    );
  }
}
