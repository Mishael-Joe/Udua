import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import ProductReview from "@/lib/models/product-review.model";
import User from "@/lib/models/user.model";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { productID } = requestBody;
  // console.log('requestBody', requestBody)
  try {
    // Connect to the database
    await connectToDB();

    const user = await User.findOne().select('_id')
    // Create a new review
    const reviews = await ProductReview.find({ product: productID }).populate({
      path: "buyer",
      select: "_id firstName lastName", // Replace with the fields you want to include
    }); // Optionally populate buyer info

    if (!reviews.length) {
      return NextResponse.json(
        { message: "No reviews found for this product.", reviews: reviews },
        { status: 400 }
      );
    }
    // Return success response
    // console.log("store", store);
    return NextResponse.json(
      { message: "Product reviews found.", reviews: reviews },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error fetching product reviews: ${error.message}` },
      { status: 500 }
    );
  }
}
