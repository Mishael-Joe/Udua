"use client";

import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Loader, Star, UserCircle2Icon } from "lucide-react";
import { Button } from "./ui/button";

type ProductReviews = {
  _id: string;
  product: string;
  buyer: {
    firstName: string;
    lastName: string;
  };
  rating: number;
  reviewText: string;
  createdAt: Date;
  order: string;
};

const ProductReviewComponent = ({
  product,
}: {
  product: { _id: string; productType: string };
}) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [productReviews, setProductReviews] = useState<ProductReviews[] | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCounts, setReviewCounts] = useState({
    totalReviews: 0,
    total1Star: 0,
    total2Star: 0,
    total3Star: 0,
    total4Star: 0,
    total5Star: 0,
  });
  // console.log("product", product);

  // Intersection Observer and data fetching logic remains the same...

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300 fill-gray-100"
        }`}
      />
    ));
  };

  const starCountData = [
    { stars: 5, count: reviewCounts.total5Star },
    { stars: 4, count: reviewCounts.total4Star },
    { stars: 3, count: reviewCounts.total3Star },
    { stars: 2, count: reviewCounts.total2Star },
    { stars: 1, count: reviewCounts.total1Star },
  ];

  // Fetch product reviews once the component is visible and on page change
  useEffect(() => {
    // if (!hasBeenVisible) return;

    const fetchProductReviews = async () => {
      try {
        const response = await axios.post("/api/fetch-product-reviews", {
          productID: product._id,
          productType: product.productType,
          page: currentPage, // Pagination control
          limit: 5, // 5 reviews per page
        });

        const {
          reviews,
          totalPages,
          averageRating,
          totalReviews,
          total1Star,
          total2Star,
          total3Star,
          total4Star,
          total5Star,
        } = response.data;
        // console.log("Product Reviews:", reviews);

        setProductReviews(reviews);
        setTotalPages(totalPages);
        setAverageRating(averageRating);
        setReviewCounts({
          totalReviews,
          total1Star,
          total2Star,
          total3Star,
          total4Star,
          total5Star,
        });
      } catch (error: any) {
        console.error("Failed to fetch Product Reviews:", error.message);
      }
    };

    fetchProductReviews();
  }, [hasBeenVisible, currentPage, product._id]);

  return (
    <Card className="border shadow-sm rounded-lg" ref={elementRef}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">
          Customer Reviews
        </CardTitle>
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex flex-col">
              <div className="flex">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-sm text-gray-500">
                {reviewCounts.totalReviews} verified reviews
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:flex md:gap-4">
            {starCountData.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <span className="text-sm">{item.stars}★</span>
                <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{
                      width: `${
                        (item.count / reviewCounts.totalReviews) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {productReviews === null ? (
          <div className="flex justify-center py-8">
            <Loader className="animate-spin w-8 h-8" />
          </div>
        ) : productReviews.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {productReviews.map((review) => (
                <Card
                  key={review._id}
                  className="relative border rounded-lg hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <UserCircle2Icon className="w-8 h-8 text-gray-400" />
                      <div>
                        <h3 className="font-medium">{`${review.buyer.firstName} ${review.buyer.lastName}`}</h3>
                        <span className="flex items-center gap-1 text-sm text-green-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified Purchase
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {review.reviewText}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    currentPage === index + 1
                      ? "hover:bg-udua-orange-primary bg-orange-400 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-udua-orange-primary"
                  }`}
                  size={`icon`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <div className="mb-4 text-xl">📝</div>
            <p className="text-lg">No reviews yet</p>
            <p className="text-sm">Be the first to share your experience!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductReviewComponent;
