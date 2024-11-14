import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import Settlement from "@/lib/models/settlement.model";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { orderID, settlementAmount, selectedPayoutAccount } = requestBody;

    // console.log(`requestBody`, requestBody);

    await connectToDB();
    const storeID = await getStoreIDFromToken(request);

    if (!storeID) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    // Create a new settlement request
    const settlement = new Settlement({
      storeID,
      orderID,
      settlementAmount,
      payoutAccount: selectedPayoutAccount,
      payoutStatus: "requested",
    });

    await settlement.save();

    return NextResponse.json(
      { message: "Settlement requested successfully", settlement },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error fetching orders: ${error.message}` },
      { status: 500 }
    );
  }
}
