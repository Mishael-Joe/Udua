import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Settlement from "@/lib/models/settlement.model";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { settlementID } = requestBody;
    // console.log("settlementID", settlementID);
    await connectToDB();

    // Fetch the settlement for the store and order
    const settlement = await Settlement.findById(settlementID)
      .select("-updatedAt")
      .lean();

    // Return the settlement details
    return NextResponse.json(
      { message: "Settlements found", settlement },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching settlement details:", error);
    return NextResponse.json(
      { error: `Error fetching details: ${error.message}` },
      { status: 500 }
    );
  }
}
