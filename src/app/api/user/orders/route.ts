import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Order from "@/lib/models/order.model";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import Product from "@/lib/models/product.model";

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

    const userOrders = await Order.find({ user: userId.toString() })
      .populate('products.product')
    //   .populate('sellers', 'name') // Adjust field to be populated if necessary
      .exec();

    return NextResponse.json(
      { message: "Orders found", orders: userOrders },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error fetching orders: ${error.message}` },
      { status: 500 }
    );
  }
}
