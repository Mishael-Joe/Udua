import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import Settlement from "@/lib/models/settlement.model";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { orderID } = requestBody;
    // console.log("orderID", orderID);

    await connectToDB();
    const storeID = await getStoreIDFromToken(request);

    if (!storeID) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    // Fetch the settlement for the store and order
    const settlement = await Settlement.findOne({
      storeID: storeID.toString(),
      orderID: orderID.toString(),
    }).lean();

    // Check if the settlement was found
    if (!settlement) {
      return NextResponse.json(
        { error: "Settlement not found" },
        { status: 404 }
      );
    }

    // Return the settlement details
    return NextResponse.json(
      { message: "Settlement found", settlement },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching settlement:", error);
    return NextResponse.json(
      { error: `Error fetching settlement: ${error.message}` },
      { status: 500 }
    );
  }
}
