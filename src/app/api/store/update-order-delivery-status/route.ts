import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Order from "@/lib/models/order.model";
import Product from "@/lib/models/product.model";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { orderID, updatedDeliveryStatus } = requestBody.body;
    // console.log(`requestBody`, requestBody);

    await connectToDB();

    const product = await Product.findOne().select(`_id`)
    const orderDetail = await Order.findById(orderID).exec();

    // console.log(`orderDetail`, orderDetail)
    if (!orderDetail) {
      return NextResponse.json({ error: "Order Details not found" }, { status: 404 });
    }

    orderDetail.deliveryStatus = updatedDeliveryStatus
    await orderDetail.save()

    return NextResponse.json(
      { message: "Order Details Updated Successfully"},
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error Failed to update order Delivery Status.:`, error);
    return NextResponse.json(
      { error: `Error Failed to update order Delivery Status: ${error.message}` },
      { status: 500 }
    );
  }
}