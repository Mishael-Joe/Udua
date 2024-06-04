"use strict";

import { NextResponse } from "next/server";
import Product from "@/lib/models/product.model"; // Import Product model
import { RequestBodyTypes } from "@/types";

export async function POST(request: Request) {
  const requestBody = await request.json();
  const { amount } = requestBody;
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
  console.log("uniqueRef", uniqueRef);

  try {
    // Inventory Check
    console.log("itemsInCart", itemsInCart);
    for (const item of itemsInCart) {
      const product = await Product.findById(item._id);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item._id}` },
          { status: 400 }
        );
      }

      if (product.productQuantity < item.quantity!) {
        return NextResponse.json(
          {
            error: `Insufficient stock for product: ${product.productName}. Available: ${product.productQuantity}, Requested: ${item.quantity}`,
          },
          { status: 400 }
        );
      }
    }

    // Proceed to Payment Initialization
    const url = "https://api.paystack.co/transaction/initialize";
    const fields = {
      email: email,
      amount: subamount,
      reference: uniqueRef,
      customer: {
        first_name: name,
        phone: phone_number,
      },
      metadata: {
        userID: userID,
        name: name,
        city: city,
        state: state,
        address: address,
        postal_code: postal_code,
        phone_number: phone_number,
        itemsInCart: itemsInCart,
        deliveryMethod: deliveryMethod,
        secondary_phone_number: secondary_phone_number,
      },
    };

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
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred during the request." },
      { status: 500 }
    );
  }
}
