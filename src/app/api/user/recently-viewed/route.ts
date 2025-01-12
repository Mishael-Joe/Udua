import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import EBook from "@/lib/models/digital-product.model";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { productIds } = requestBody;
    // console.log(`requestBody`, requestBody);
    // console.log(`productIDs`, productIds);

    await connectToDB();

    const products = await Product.find({ _id: { $in: productIds } }).select(
      "name price images productType"
    );
    const eBooks = await EBook.find({ _id: { $in: productIds } }).select(
      "title price coverIMG productType"
    );

    const combinedProducts = [...products, ...eBooks];

    if (!products) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    // console.log(`combinedProducts`, combinedProducts);
    return NextResponse.json(
      { message: "Recently viewed Products found", products: combinedProducts },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error fetching Recently viewed product:`, error);
    return NextResponse.json(
      { error: `Error fetching Recently viewed product: ${error.message}` },
      { status: 500 }
    );
  }
}
