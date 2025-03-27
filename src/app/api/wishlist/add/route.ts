// app/api/wishlist/add/route.ts
import { connectToDB } from "@/lib/mongoose";
import Wishlist from "@/lib/models/wishlist.model";
import { NextRequest, NextResponse } from "next/server";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, productType } = body;
  try {
    // Authenticate user
    const userId = await getUserDataFromToken(request);
    console.log("userId", userId);
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!productId || !productType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate product type
    const validProductTypes = ["physicalproducts", "digitalproducts"];
    if (!validProductTypes.includes(productType)) {
      return NextResponse.json(
        { error: "Invalid product type" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        products: [],
      });
    }

    // Check for existing item
    const exists = wishlist.products.some(
      (item: any) =>
        item.productId.toString() === productId &&
        item.productType === productType
    );

    if (!exists) {
      wishlist.products.push({
        productId: productId,
        productType: productType,
      });
      await wishlist.save();
    }

    return NextResponse.json({
      success: true,
      message: "Product added to wishlist",
      wishlist: wishlist,
    });
  } catch (error: any) {
    console.error("Wishlist error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
