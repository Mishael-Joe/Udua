import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Settlement from "@/lib/models/settlement.model";
import Store from "@/lib/models/store.model"; // Assuming you have a Store model for fetching store details
import Order from "@/lib/models/order.model"; // Assuming you have an Order model for fetching order details

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { settlementID } = requestBody;
    await connectToDB();

    // Fetch the settlement along with the store and order details
    const store = Store.findOne().select("_id");
    const order = Order.findOne().select("_id");
    const settlement = await Settlement.findById(settlementID)
      .populate({
        path: "storeID",
        select: "name storeEmail", // Select store name and email
      })
      .populate({
        path: "mainOrderID",
        // select: "orderNumber products totalAmount", // Select order details, products, and total amount
      })
      .select("-updatedAt") // Exclude the updatedAt field
      .lean();

    // If the settlement doesn't exist, return a 404 response
    if (!settlement) {
      return NextResponse.json(
        { message: "Settlement not found" },
        { status: 404 }
      );
    }

    console.log("settlement", settlement);

    // Return the fetched settlement details
    return NextResponse.json(
      { message: "Settlement found", settlement },
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
