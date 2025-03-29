import Product from "@/lib/models/product.model";
import Store from "@/lib/models/store.model";
import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectToDB();

    // Update all users by adding a store to the 'stores' array if the store doesn't already exist
    const result = await User.updateMany(
      {}, // Match all users
      {
        $push: {
          stores: {
            _id: "66fbae5615b9fec5eac1b9bb",
          },
        },
      }
    );

    // Example: Rename fields in all Product documents
    // const result = await Product.updateMany(
    //   {},
    //   {
    //     $rename: {
    //       productName: "name",
    //       productPrice: "price",
    //       productSizes: "sizes",
    //       productImage: "images",
    //       productDescription: "description",
    //       productSpecification: "specifications",
    //       productCategory: "category",
    //       productSubCategory: "subCategory",
    //     },
    //   }
    // );

    // Example: Set productType field in all Product documents
    // const result = await Product.updateMany(
    //   {},
    //   {
    //     $set: {
    //       productType: "Physical Product",
    //     },
    //   }
    // );

    // Example: Add an empty ebooks array to all Store documents
    // const result = await Store.updateMany(
    //   {}, // Apply to all stores
    //   {
    //     $set: {
    //       ebooks: [],
    //     },
    //   }
    // );

    return NextResponse.json(
      { message: "User model updated successfully", result },
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
