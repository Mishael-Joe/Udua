import Store from "@/lib/models/store.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { recipient_code, amount, reference } = requestBody;
    console.log("requestBody", requestBody);

    const fields = {
      //   "source": "balance",
      amount: amount / 100,
      reference: reference,
      recipient: recipient_code,
      reason: "Order Settlement",
    };

    const url = `https://api.paystack.co/transfer`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify(fields),
    });

    const result = await response.json();

    console.log("result", result);

    // if (result.status) {
    //   const store = await Store.findById(storeId).select("recipientCode");

    //   //   const existingPayoutAccount = store.payoutAccounts.find(
    //   //     (account: any) => account.bankDetails.bankCode === bankCode
    //   //   );

    //   //   existingPayoutAccount.recipientCode = result.data.recipient_code;

    //   store.recipientCode = result.data.recipient_code;

    //   await store.save();
    // }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: "An error occurred during the request." },
      { status: 500 }
    );
  }
}

const requestBody = {
  recipient_code: "RCP_k7f2glhywinhpvl",
  amount: 2876000,
  reference: "Udua47095c3d-3877-427a-9e7d-9e5d4e3f3d67",
};
const result = {
  status: false,
  message: "You cannot initiate third party payouts as a starter business",
  meta: {
    nextStep: "You'll need to upgrade your business to a Registered Business.",
  },
  type: "api_error",
  code: "transfer_unavailable",
};
//    POST /api/admin/transfer 200 in 1042ms
