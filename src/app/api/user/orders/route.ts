import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Order from "@/lib/models/order.model";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import Product from "@/lib/models/product.model";
import EBook from "@/lib/models/digital-product.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const userId = await getUserDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const products = await Product.findOne({}).select("_id");
    const digitalProducts = await EBook.findOne({}).select("_id");
    const userOrders = await Order.find({ user: userId.toString() })
      .populate({
        path: "products.physicalProducts",
        select: "_id name images price productType",
      })
      .populate({
        path: "products.digitalProducts",
        select: "_id title coverIMG price productType",
      })
      .select("totalAmount status createdAt deliveryStatus");

    console.log("userOrders", userOrders);

    return NextResponse.json(
      { message: "Orders found", orders: userOrders },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error fetching orders: ${error}` },
      { status: 500 }
    );
  }
}
