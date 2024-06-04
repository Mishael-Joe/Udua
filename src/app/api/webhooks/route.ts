"use strict";

import Product from "@/lib/models/product.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import crypto from "crypto";

import User from "@/lib/models/user.model"; // Import User model
import Order from "@/lib/models/order.model"; // Import Order model
import {
  Product as Products,
  ResultDataMetadataItemsInCart,
  User as APIUser,
} from "@/types";

type APIProduct = Omit<Products, "productQuantity"> & {
  productQuantity: number;
  save: any;
};

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

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "mishaeljoe55@zohomail.com",
      pass: process.env.NEXT_SECRET_APP_SPECIFIED_KEY,
    },
  });

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
      const eventStatus = result.status;
      const chargeData = result.data;
      const status = chargeData.status;

      if (eventStatus === true && status === "success") {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          const orderProducts = [];
          const notifications = [];
          const insufficientProducts = [];

          for (const { _id, quantity } of cartItems) {
            const product: APIProduct = await Product.findById(_id).session(
              session
            );
            // console.log(`product`, product);
            // NOTE: accountId serves as the owner of the product i.e ownerID

            if (!product) {
              throw new Error(`Product not found: ${_id}`);
            }

            if (product.productQuantity < quantity) {
              insufficientProducts.push({ product, quantity });
              continue; // Skip to the next product
            }

            product.productQuantity -= quantity;
            await product.save({ session });

            const seller: APIUser = await User.findById(
              product.accountId
            ).session(session);
            // NOTE: accountId serves as the owner of the product i.e ownerID
            // console.log(`seller`, seller);
            if (seller) {
              notifications.push({
                sellerEmail: seller.email,
                productName: product.productName,
                quantity,
              });
            }

            orderProducts.push({
              product: product._id,
              seller: product.accountId,
              quantity,
              price: product.productPrice * quantity,
            });
          }

          if (insufficientProducts.length > 0) {
            // Handle insufficient products: notify the seller and potentially refund
            // NOTE: accountId serves as the owner of the product i.e ownerID
            for (const { product, quantity } of insufficientProducts) {
              const seller: APIUser = await User.findById(
                product.accountId
              ).session(session);
              if (seller) {
                const mailOptions = {
                  from: '"Your E-commerce Site" <mishaeljoe55@zohomail.com>',
                  to: seller.email,
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
            // console.log(
            //   `orderProducts[0].product!.accountId,`,
            //   orderProducts[0].seller
            // );
            const order = new Order({
              // user: chargeData.customer.id,
              user: userID,
              seller: orderProducts[0].seller,
              products: orderProducts,
              totalAmount: chargeData.amount / 100,
              status: "paid",
            });

            await order.save({ session });
          }

          await session.commitTransaction();
          session.endSession();

          for (const notification of notifications) {
            const mailOptions = {
              from: '"Your E-commerce Site" <mishaeljoe55@zohomail.com>',
              to: notification.sellerEmail,
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
