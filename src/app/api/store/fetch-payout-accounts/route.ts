import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import Store from "@/lib/models/store.model";

export async function POST(request: NextRequest) {
  try {
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

    // Get the payout accounts from the store document
    const payoutAccounts = store.payoutAccounts;

    // Return the payout accounts in the response
    return NextResponse.json(
      { message: "payout Accounts found", payoutAccounts: payoutAccounts },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching store payout accounts:", error);
    return NextResponse.json(
      { error: `Error fetching store payout accounts: ${error.message}` },
      { status: 500 }
    );
  }
}
