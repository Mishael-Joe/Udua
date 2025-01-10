import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import Settlement from "@/lib/models/settlement.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    // Fetch the settlement for the store and order
    const pendingSettlements = await Settlement.find({
      payoutStatus: { $in: ["requested", "processing"] },
    }).select("-updatedAt -storeID").lean();

    const pendingSettlementAmount = pendingSettlements.reduce(
      (total, settlement) => total + settlement.settlementAmount,
      0
    );

    const data = {
        pendingSettlements,
        pendingSettlementAmount,
    }

    // Return the settlement details
    return NextResponse.json(
      { message: "Settlements found", data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching settlements:", error);
    return NextResponse.json(
      { error: `Error fetching settlements: ${error.message}` },
      { status: 500 }
    );
  }
}
