import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";

export async function DELETE(request: NextRequest) {
  try {
    await connectToDB();
    const sellerId = await getUserDataFromToken(request);

    if (!sellerId) {
      return NextResponse.json(
        { error: "Seller ID is required" },
        { status: 400 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findOneAndDelete({
      _id: productId,
      accountId: sellerId.toString(),
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error deleting product: ${error.message}` },
      { status: 500 }
    );
  }
}
