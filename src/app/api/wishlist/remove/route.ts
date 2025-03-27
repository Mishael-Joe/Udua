// app/api/wishlist/remove/route.ts
import { connectToDB } from "@/lib/mongoose";
import Wishlist from "@/lib/models/wishlist.model";
import { NextRequest, NextResponse } from "next/server";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import mongoose from "mongoose";

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { productId, productType } = body;
  try {
    await connectToDB();
    // Authentication check
    const userId = await getUserDataFromToken(request);
    console.log("userId", userId);
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Validate request body
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

    // Find and update wishlist using atomic operation
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      {
        $pull: {
          products: {
            productId: new mongoose.Types.ObjectId(productId),
            productType: productType,
          },
        },
      },
      { new: true } // Return updated document
    );

    if (!updatedWishlist) {
      return NextResponse.json(
        { error: "Wishlist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: updatedWishlist,
    });
  } catch (error: any) {
    console.error("Wishlist removal error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
