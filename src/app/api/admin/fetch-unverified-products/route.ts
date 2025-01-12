import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const UnverifiedProducts = await Product.find({
      isVerifiedProduct: false,
    })
      .select("_id name images price")
      .exec();
    // console.log(`UnverifiedProducts`, UnverifiedProducts)

    return NextResponse.json(
      {
        message: "Unverified Products found",
        UnverifiedProducts: UnverifiedProducts,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error fetching Unverified products: ${error.message}` },
      { status: 500 }
    );
  }
}
