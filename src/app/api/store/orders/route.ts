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

    const product = await Product.findOne({}).select("_id productName").exec();
    //TODO: REVIEW THIS CODE DONW
    const orders = await Order.find({ sellers: { $in: [storeID.toString()] } })
      .populate({
        path: "products.product",
        match: { accountId: storeID.toString() },
      })
      .exec();

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
