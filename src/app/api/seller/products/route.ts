import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoose";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import Product from "@/lib/models/product.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const sellerId = await getUserDataFromToken(request);

    if (!sellerId) {
      return NextResponse.json(
        { error: "Seller ID is required" },
        { status: 400 }
      );
    }

    const sellerProducts = await Product.find({
      accountId: sellerId.toString(),
    }).exec();

    return NextResponse.json(
      { message: "Products found", products: sellerProducts },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error fetching products: ${error.message}` },
      { status: 500 }
    );
  }
}
