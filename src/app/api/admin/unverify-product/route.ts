import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/product.model";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { productID } = requestBody;
  // console.log("requestBody", requestBody);
  // console.log("productID", productID);

  try {
    await connectToDB();

    const product = await Product.findById(productID);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 401 });
    }

    product.isVerifiedProduct = false;
    await product.save();

    return NextResponse.json(
      { message: `successful`, data: product },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
