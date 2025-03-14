import { NextRequest, NextResponse } from "next/server";
import Order from "@/lib/models/order.model";
import { connectToDB } from "@/lib/mongoose";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { trackingId } = requestBody;

  //   console.log("requestBody", requestBody);

  if (!trackingId) {
    return NextResponse.json(
      { error: "Tracking ID is required" },
      { status: 400 }
    );
  }

  try {
    await connectToDB();
    const order = await Order.findOne({ _id: trackingId })
      .populate({
        path: "products.physicalProducts",
        select: "_id name images price productType",
      })
      .populate({
        path: "products.digitalProducts",
        select: "_id title coverIMG price productType",
      })
      .select("deliveryStatus createdAt stores products updatedAt")
      .exec();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // console.log("order", order);

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error fetching order: ${error.message}` },
      { status: 500 }
    );
  }
}
