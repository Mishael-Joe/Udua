import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Order from "@/lib/models/order.model";
import Product from "@/lib/models/product.model";
import EBook from "@/lib/models/digital-product.model";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { orderID } = requestBody;
    // console.log(`requestBody`, requestBody);

    await connectToDB();

    const products = await Product.findOne({}).select("_id");
    const digitalProducts = await EBook.findOne({}).select("_id");
    const orderDetail = await Order.findById(orderID)
      .populate({
        path: "products.physicalProducts",
        select: "_id name images price productType",
      })
      .populate({
        path: "products.digitalProducts",
        select: "_id title coverIMG price productType",
      })
      .exec();

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
