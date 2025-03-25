import Store from "@/lib/models/store.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { accountNumber, bankCode, accountName, storeId } =
      requestBody.config;
    console.log("requestBody", requestBody);

    const fields = {
      type: "nuban",
      name: accountName,
      account_number: Number(accountNumber),
      bank_code: Number(bankCode),
      currency: "NGN",
    };

    const url = `https://api.paystack.co/transferrecipient`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify(fields),
    });

    const result = await response.json();

    console.log("result", result);

    if (result.status) {
      const store = await Store.findById(storeId).select("recipientCode");

      //   const existingPayoutAccount = store.payoutAccounts.find(
      //     (account: any) => account.bankDetails.bankCode === bankCode
      //   );

      //   existingPayoutAccount.recipientCode = result.data.recipient_code;

      store.recipientCode = result.data.recipient_code;

      await store.save();
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: "An error occurred during the request." },
      { status: 500 }
    );
  }
}
