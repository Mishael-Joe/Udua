import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import ProductReview from "@/lib/models/product-review.model";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { rating, writeUp, orderID, productID } = requestBody.body;
  // console.log('requestBody', requestBody)
  try {
    // Connect to the database
    await connectToDB();
    const userID = await getUserDataFromToken(request);

    // Retrieve the store ID from the token

    if (!userID) {
      return NextResponse.json(
        { error: "user ID is required" },
        { status: 400 }
      );
    }

    // Check if rating is valid
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Create a new review
    const review = new ProductReview({
      product: productID,
      buyer: userID,
      rating: rating,
      reviewText: writeUp,
      order: orderID,
    });

    // Save the review to the database
    await review.save();

    // Return success response
    // console.log("store", store);
    return NextResponse.json(
      { message: "Product review created successfully.", review: review },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating product review", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "You have already submitted a review for this product" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: `Error creating product review: ${error.message}` },
      { status: 500 }
    );
  }
}
