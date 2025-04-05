import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const storeID = await getStoreIDFromToken(request);

    if (!storeID) {
      console.error(`store ID is required`);
      return NextResponse.json(
        { error: "store ID ID is required" },
        { status: 400 }
      );
    }

    const storeProducts = await Product.find({
      storeID: storeID.toString(),
    })
      .select("_id productType name")
      // .select("_id images coverIMG productType name title")
      .exec();

    // console.log(`storeProducts`, storeProducts);

    return NextResponse.json(
      { message: "Products found", products: storeProducts },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error fetching products: ${error.message}` },
      { status: 500 }
    );
  }
}
