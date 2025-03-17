import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import ProductReview from "@/lib/models/product-review.model";
import { ObjectId } from "mongodb"; // or "mongoose"
import { Types } from "mongoose";
import User from "@/lib/models/user.model";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { productID, page = 1, limit = 10 } = requestBody; // Default page 1, limit 10

    // Validate productID
    if (!productID) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDB();

    // Convert productID to ObjectId
    const productObjectId = Types.ObjectId.createFromHexString(productID);

    // Pagination calculations
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch total reviews for the product (for calculating the total number of pages)
    const totalReviews = await ProductReview.countDocuments({
      product: productID,
    });

    const user = User.findOne().select("_id");

    // Fetch paginated reviews
    const reviews = await ProductReview.find({ product: productID })
      .populate({
        path: "buyer",
        select: "_id firstName lastName", // Include relevant buyer details
      })
      .skip(skip)
      .limit(limitNumber);

    // Aggregate review statistics (total reviews for each star rating)
    const reviewStats = await ProductReview.aggregate([
      { $match: { product: productObjectId } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Calculate average rating
    const averageRatingResult = await ProductReview.aggregate([
      { $match: { product: productObjectId } },
      { $group: { _id: null, average: { $avg: "$rating" } } },
    ]);
    const averageRating =
      averageRatingResult.length > 0 ? averageRatingResult[0].average : 0;

    // Review counts for each star rating
    const reviewCounts = {
      total1Star: 0,
      total2Star: 0,
      total3Star: 0,
      total4Star: 0,
      total5Star: 0,
    };

    reviewStats.forEach((stat) => {
      if (stat._id === 1) reviewCounts.total1Star = stat.count;
      if (stat._id === 2) reviewCounts.total2Star = stat.count;
      if (stat._id === 3) reviewCounts.total3Star = stat.count;
      if (stat._id === 4) reviewCounts.total4Star = stat.count;
      if (stat._id === 5) reviewCounts.total5Star = stat.count;
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalReviews / limitNumber);

    // Return paginated reviews and stats
    return NextResponse.json(
      {
        message: "Product reviews found.",
        reviews, // Paginated reviews
        totalReviews, // Total number of reviews
        totalPages, // Total number of pages based on limit
        currentPage: pageNumber, // Current page number
        averageRating, // Average rating
        ...reviewCounts, // Review counts for each star
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error fetching product reviews: ${error.message}` },
      { status: 500 }
    );
  }
}
