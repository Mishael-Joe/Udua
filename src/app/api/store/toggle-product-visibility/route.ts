import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const requestBody = await request.json();
    const { productId } = requestBody.data;

    // console.log(`requestBody`, requestBody);

    // Validate the productId
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Find the product by ID
    const product = await Product.findById(productId).select('isVisible');

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Toggle visibility
    product.isVisible = !product.isVisible;

    // Save the updated product
    await product.save();

    return NextResponse.json(
      { message: "Product visibility updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error: Failed to update product visibility:`, error);
    return NextResponse.json(
      { error: `Failed to update product visibility: ${error.message}` },
      { status: 500 }
    );
  }
}
