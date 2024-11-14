import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Order from "@/lib/models/order.model";
import Product from "@/lib/models/product.model";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { orderID } = requestBody;
    // console.log(`requestBody`, requestBody);

    await connectToDB();

    // Retrieve the store ID from the token
    const storeID = await getStoreIDFromToken(request);

    if (!storeID) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findOne().select(`_id`);

    const orderDetail = await Order.findById(orderID)
      .populate({
        path: "products.product",
        match: { storeID: storeID.toString() },
      })
      .exec();

    // console.log(`orderDetail`, orderDetail);

    if (!orderDetail) {
      return NextResponse.json(
        { error: "Order Details not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Order Details found", orderDetail: orderDetail },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error fetching product:`, error);
    return NextResponse.json(
      { error: `Error fetching product: ${error.message}` },
      { status: 500 }
    );
  }
}
