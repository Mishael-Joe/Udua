import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import Settlement from "@/lib/models/settlement.model";
import Store from "@/lib/models/store.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const storeID = await getStoreIDFromToken(request);

    if (!storeID) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    const pendingSettlements = await Settlement.find({
      storeID: storeID,
      payoutStatus: ["Requested", "Processing"],
    });

    // console.log(`pendingSettlements`, pendingSettlements);

    return NextResponse.json(
      { message: "Fetched Settlement successfully", pendingSettlements },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error processing settlement request: ${error.message}` },
      { status: 500 }
    );
  }
}
