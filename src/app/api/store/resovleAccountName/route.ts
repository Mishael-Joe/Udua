"use strict";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { accountNumber, bankCode } = requestBody;

    const url = `https://api.paystack.co//bank/resolve?account_number=${Number(accountNumber)}&bank_code=${bankCode}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    // const url =
    //   "https://nigeria-bank-account-validation.p.rapidapi.com/?account_number=2553203398&bank_code=057";
    // const options = {
    //   method: "GET",
    //   headers: {
    //     "x-rapidapi-key": "593339e85emshd1227b6b2b51096p13bebfjsn2779a7908c13",
    //     "x-rapidapi-host": "nigeria-bank-account-validation.p.rapidapi.com",
    //   },
    // };

    // const response = await fetch(url, options);
    const result = await response //.text();
    console.log('bankCode', bankCode);

    // const result = await response; //.json();
    console.log("BANKS", result);
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
