import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/product.model";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productID = searchParams.get("productID");
  // console.log("productID", productID);

  try {
    await connectToDB();

    const product = await Product.findById(productID);

    if (!product) {
      return NextResponse.json(
        { error: "product ID required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: `Product found`, data: product },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { productID, type } = requestBody;
  // console.log("requestBody", requestBody);
  // console.log("productID", productID);
  // console.log("type", type);

  if (type === "VerifyProduct") {
    try {
      await connectToDB();

      const product = await Product.findById(productID);

      if (!product) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
      }

      product.isVerifiedProduct = true;
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

  if (type === "UnVerifyProduct") {
    try {
      await connectToDB();

      const product = await Product.findById(productID);

      if (!product) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
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
}
