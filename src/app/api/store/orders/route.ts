import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/product.model";

import Order from "@/lib/models/order.model";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const storeID = await getStoreIDFromToken(request);

    if (!storeID) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findOne({}).select("_id name").exec();
    //TODO: REVIEW THIS CODE DONW
    const orders = await Order.find({
      stores: { $in: [storeID.toString()] },
      deliveryStatus: {
        $in: ["Order Placed", "Processing", "Shipped", "Out for Delivery"],
      }, // Multiple statuses
    })
      .populate({
        path: "products.product",
        match: { storeID: storeID.toString() },
      })
      .select("-totalAmount -updatedAt")
      .exec();

    // console.log(`orders`, orders)

    return NextResponse.json(
      { message: "Orders found", orders },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error fetching orders: ${error.message}` },
      { status: 500 }
    );
  }
}
