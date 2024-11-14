import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import Store from "@/lib/models/store.model";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { payoutMethod, bankDetails } = requestBody;
    // console.log("payoutMethod", payoutMethod);
    // console.log("bankDetails", bankDetails);

    // Validate request payload
    if (!payoutMethod || !bankDetails) {
      return NextResponse.json(
        { error: "Payout method and bank details are required" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDB();

    // Retrieve the store ID from the token
    const storeID = await getStoreIDFromToken(request);

    if (!storeID) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    // Find the store by its ID
    const store = await Store.findById(storeID);

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Check if the store already has 3 payout accounts
    if (store.payoutAccounts.length >= 3) {
      return NextResponse.json(
        { error: "You can only add up to 3 payout accounts." },
        { status: 400 }
      );
    }

    // Check if a payout account with the same payout method and bank details already exists
    const existingPayoutAccount = store.payoutAccounts.find(
      (account: any) =>
        account.payoutMethod === payoutMethod &&
        account.bankDetails.accountNumber === bankDetails.accountNumber && 
        account.bankDetails.bankName === bankDetails.bankName && 
        account.bankDetails.accountHolderName === bankDetails.accountHolderName
    );

    if (existingPayoutAccount) {
      // Update the existing payout account
      existingPayoutAccount.bankDetails = bankDetails;
    } else {
      // Add a new payout account
      store.payoutAccounts.push({
        payoutMethod,
        bankDetails,
      });
    }

    // Save the updated store to the database
    await store.save();

    // Return success response
    return NextResponse.json(
      { message: "Store payout account updated successfully.", store },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating store payout account:", error);
    return NextResponse.json(
      { error: `Error updating store payout account: ${error.message}` },
      { status: 500 }
    );
  }
}
