import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import Store from "@/lib/models/store.model";
import Product from "@/lib/models/product.model";
import EBook from "@/lib/models/digital-product.model";

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

    const product = await Product.findOne().select("_id");
    const ebook = await EBook.findOne().select("_id");

    // Find the store by its ID
    const store = await Store.findById(storeID)
      .select(
        "-password -storeOwner -updatedAt -forgotpasswordToken -forgotpasswordTokenExpiry"
      )
      .populate({
        path: "physicalProducts",
        match: { isVerifiedProduct: true },
        select: "_id name images price sizes productType", // Replace with the fields you want to include
      })
      .populate({
        path: "digitalProducts",
        // match: { isVerifiedProduct: true },
        select: "_id title coverIMG price productType", // Replace with the fields you want to include
      })
      .exec();

    // console.log("store", store);

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Combine physicalProducts and digitalProducts into one array
    const storeItems = [
      ...store.physicalProducts.map((product: any) => ({ ...product._doc })),
      ...store.digitalProducts.map((ebook: any) => ({ ...ebook._doc })),
    ];

    // Replace the products field with storeItems and remove the ebooks field
    const storeWithItems = {
      ...store._doc,
      products: storeItems, // Replace products with combined storeItems
    };

    delete storeWithItems.physicalProducts; // Optionally remove physicalProducts field. After replacing products with storeItems, we delete the ebooks field using delete storeWithItems.physicalProducts to avoid redundancy.
    delete storeWithItems.digitalProducts; // Optionally remove digitalProducts field. After replacing products with storeItems, we delete the ebooks field using delete storeWithItems.digitalProducts to avoid redundancy.

    // Return success response
    // console.log("store", storeWithItems);
    return NextResponse.json(
      { message: "Store details fetched successfully.", store: storeWithItems },
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
