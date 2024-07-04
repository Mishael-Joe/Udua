import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import Wishlist from "@/lib/models/wishlist.model";

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

    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products"
    );

    if (!wishlist) {
      return NextResponse.json(
        { message: "Wishlist not found" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Wishlist not found", wishlist: wishlist },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error fetching wishlist: ${error.message}` },
      { status: 500 }
    );
  }
}
