import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/product.model";

import Order from "@/lib/models/order.model";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import EBook from "@/lib/models/digital-product.model";

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

    const products = await Product.findOne({}).select("_id");
    const digitalProducts = await EBook.findOne({}).select("_id");
    const orders = await Order.find({
      stores: { $in: [storeID.toString()] },
      deliveryStatus: {
        $in: ["Order Placed", "Processing", "Shipped", "Out for Delivery"],
      }, // Multiple statuses
    })
      .populate({
        path: "products.physicalProducts",
        select: "_id name images price productType", // Replace with the fields you want to include
      })
      .populate({
        path: "products.digitalProducts",
        select: "_id title coverIMG price productType", // Replace with the fields you want to include
      })
      .select("-totalAmount -updatedAt")
      .exec();

    // console.log(`orders`, orders);

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
