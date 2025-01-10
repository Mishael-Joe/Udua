import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import Wishlist from "@/lib/models/wishlist.model";
import Product from "@/lib/models/product.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const userId = await getUserDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findOne({}).select("_id productName").exec();

    const wishlist = await Wishlist.findOne({ user: userId })
      .populate("products")
      .exec();

    // console.log(wishlist)

    if (!wishlist) {
      return NextResponse.json(
        { message: "Wishlist not found" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Wishlist found", wishlist: wishlist },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error fetching wishlist: ${error}` },
      { status: 500 }
    );
  }
}
