import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { accountNumber, bankCode } = requestBody.config;

    const url = `https://api.paystack.co/bank/resolve?account_number=${Number(
      accountNumber
    )}&bank_code=${Number(bankCode)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const result = await response.json();

    // console.log("result", result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: "An error occurred during the request." },
      { status: 500 }
    );
  }
}
