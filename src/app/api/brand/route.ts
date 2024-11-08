import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import Store from "@/lib/models/store.model";
import Product from "@/lib/models/product.model";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { storeID } = requestBody;
  // console.log('requestBody', requestBody)
  try {
    // Connect to the database
    await connectToDB();

    // Retrieve the store ID from the token

    if (!storeID) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    // Find the store by its ID
    const product = Product.findOne().select(`_id`);
    const store = await Store.findById(storeID)
  .select("-password -storeOwner -updatedAt -pendingBalance")
  .populate({
    path: "products",
    match: { isVerifiedProduct: true },
    select: "_id productName productImage productPrice" // Replace with the fields you want to include
  })
  .exec();


    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Return success response
    // console.log("store", store);
    return NextResponse.json(
      { message: "Store details fetched successfully.", store: store },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching store details", error);
    return NextResponse.json(
      { error: `Error fetching store details: ${error.message}` },
      { status: 500 }
    );
  }
}
