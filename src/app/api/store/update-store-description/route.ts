import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import Store from "@/lib/models/store.model";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { updatedDescription  } = requestBody;

    // Ensure the description is provided
    if (!updatedDescription ) {
      return NextResponse.json(
        { error: "Store description is required" },
        { status: 400 }
      );
    }

    // console.log('description:', updatedDescription );

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
    const store = await Store.findById(storeID);

    if (!store) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }

    // Update the store description
    store.description = updatedDescription ;

    // Save the updated store to the database
    await store.save();

    // Return success response
    return NextResponse.json(
      { message: "Store description updated successfully." },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error updating store description:", error);
    return NextResponse.json(
      { error: `Error updating store description: ${error.message}` },
      { status: 500 }
    );
  }
}
