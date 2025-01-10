"use strict";

import { NextResponse } from "next/server";

export async function POST() {
  try {
    const url = "https://api.paystack.co/bank";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const result = await response.json();
    // console.log("BANKS", result);
    // Send the Paystack response to the client
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred during the request." },
      { status: 500 }
    );
  }
}
