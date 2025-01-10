import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import Order from "@/lib/models/order.model";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderID = searchParams.get("orderID");
  // console.log("sellerID", sellerID);

  try {
    await connectToDB();

    const order = await Order.findById(orderID);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: `Seller found`, data: order },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
