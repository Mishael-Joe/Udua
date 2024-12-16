import Product from "@/lib/models/product.model";
import Store from "@/lib/models/store.model";
import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectToDB();

    // // Update all stores by adding the new fields if they don't already exist
    // const result = await Store.updateMany(
    //   {}, // Match all stores
    //   {
    //     $set: {
    //       forgotpasswordToken: null, // Setting default as null
    //       forgotpasswordTokenExpiry: null,
    //       payoutAccounts: [], // Empty array for payout accounts
    //       payoutHistory: [], // Empty array for payout history
    //     },
    //   }
    // );

    // Update all stores by adding the new fields if they don't already exist
    // const result = await User.updateMany(
    //   {}, // Match all stores
    //   {
    //     $unset: {
    //       isSeller: '', // Setting default as null
    //       userProducts: '',
    //     },
    //   }
    // );

    // Rename productPrice to price in all documents
    const resultss = await Product.updateMany(
      {},
      { $rename: { productPrice: "price" } }
    );

    const result = await Product.updateMany(
      {},
      {
        $set: {
          productType: "Physical Product", // Add or update the 'isVisible' field for all products
        },
      }
    );

    const results = await Store.updateMany(
      {}, // Apply to all stores
      {
        $set: {
          ebooks: [],
        },
      },
      { multi: true } // Update all documents
    );

    const body = {
      result,
      results,
    };
    return NextResponse.json(
      { message: "Store model updated successfully", body },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error updating store model." },
      { status: 500 }
    );
  }
}
