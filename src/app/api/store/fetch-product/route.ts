import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { productID } = requestBody;
    // console.log(`requestBody`, requestBody);
    // console.log(`productID`, productID);

    await connectToDB();

    const product = await Product.findById(productID).exec();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product found", product: product },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error fetching product:`, error);
    return NextResponse.json(
      { error: `Error fetching product: ${error.message}` },
      { status: 500 }
    );
  }
}
