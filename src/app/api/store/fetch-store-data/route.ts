import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import Store from "@/lib/models/store.model";

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDB();
    
    // Retrieve the store ID from the token
    const storeID = await getStoreIDFromToken(request);

    if (!storeID) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    // Find the store by its ID
    const store = await Store.findById(storeID).select('-password -storeOwner -updatedAt').exec();

    if (!store) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }

    // Return success response
    // console.log('store', store)
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
