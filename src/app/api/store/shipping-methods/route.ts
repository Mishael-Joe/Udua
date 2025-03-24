// api/store/shipping-methods
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import Store from "@/lib/models/store.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    // Get the request body
    const requestBody = await request.json();
    const { fullValues } = requestBody;
    // console.log("Request Body:", fullValues);

    const storeID = await getStoreIDFromToken(request);

    if (!storeID) {
      return NextResponse.json(
        { error: "Unauthorized: Store ID missing" },
        { status: 401 }
      );
    }

    // Check for existing shipping method with the same name
    const existingMethod = await Store.findOne({
      _id: storeID,
      "shippingMethods.name": fullValues.name,
    });

    if (existingMethod) {
      return NextResponse.json(
        { error: `Shipping method '${fullValues.name}' already exists` },
        { status: 409 } // 409 Conflict
      );
    }

    // Add new shipping method if no duplicate found
    const updatedStore = await Store.findByIdAndUpdate(
      storeID,
      { $push: { shippingMethods: fullValues } },
      { new: true, runValidators: true }
    );

    if (!updatedStore) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Shipping method added",
        shippingMethod: requestBody,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding shipping method:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
