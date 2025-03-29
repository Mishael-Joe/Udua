import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import Wishlist from "@/lib/models/wishlist.model";
import Product from "@/lib/models/product.model";
import EBook from "@/lib/models/digital-product.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const userId = await getUserDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = Product.findOne().select("_id");
    const ebook = EBook.findOne().select("_id");

    const wishlist = await Wishlist.findOne({ user: userId })
      .populate({
        path: "products.productId",
        select: "name price sizes images title coverIMG productType", // Add required fields
      })
      .lean();

    // console.log("wishlist", wishlist);

    if (!wishlist) {
      return NextResponse.json(
        { message: "Wishlist not found" },
        { status: 404 } // Proper status code
      );
    }

    return NextResponse.json({ wishlist: wishlist }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error fetching wishlist: ${error.message}` },
      { status: 500 }
    );
  }
}
