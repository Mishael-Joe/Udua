import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import Settlement from "@/lib/models/settlement.model";

export async function POST(request: NextRequest) {
  try {
    // const requestBody = await request.json();
    // const { orderID } = requestBody;
    // // console.log("orderID", orderID);

    await connectToDB();
    const storeID = await getStoreIDFromToken(request);

    if (!storeID) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    // Fetch the settlement for the store and order
    const pendingSettlements = await Settlement.find({
      storeID: storeID.toString(),
      payoutStatus: { $in: ["Requested", "Processing"] },
    })
      .select("-updatedAt -storeID")
      .lean();

    // Fetch the settlement for the store and order
    const successfulSettlements = await Settlement.find({
      storeID: storeID.toString(),
      payoutStatus: { $in: ["Paid", "Failed"] },
    })
      .select("-updatedAt -storeID")
      .lean();

    const pendingSettlementAmount = pendingSettlements.reduce(
      (total, settlement) => total + settlement.settlementAmount,
      0
    );

    const data = {
      pendingSettlements,
      pendingSettlementAmount,
      successfulSettlements,
    };

    // console.log(`data`, data);

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
