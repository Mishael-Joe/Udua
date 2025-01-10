"use client";

import { ForProductInfo } from "@/types";
import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Loader, Star, UserCircle2Icon } from "lucide-react";
import { ReviewSpinningLoader } from "@/utils/spinning-loader";

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

const ProductReviewComponent = ({ product }: { product: { _id: string } }) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibles, setIsVisibles] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        let count = 0;
        const isVisible =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <=
            (window.innerWidth || document.documentElement.clientWidth);
        setIsVisible(isVisible);
        if (isVisible) {
          count++;
          if (count === 1) {
            setIsVisibles(true);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isVisibles) return;

    const fetchProductReviews = async () => {
      try {
        const response = await axios.post("/api/fetch-product-reviews", {
          productID: product._id,
          page: currentPage, // pass current page for pagination
          limit: 5, // limit to 5 reviews per page
        });

        // console.log('response', response)

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

        setProductReviews(reviews);
        setTotalPages(totalPages);
        setAverageRating(averageRating);

        // Set review counts for each star rating
        setReviewCounts({
          totalReviews,
          total1Star,
          total2Star,
          total3Star,
          total4Star,
          total5Star,
        });
      } catch (error: any) {
        console.error("Failed to fetch Product Reviews", error.message);
      }
    };

    fetchProductReviews();
  }, [isVisibles, currentPage]);

  const spinningLoader = (
    <div className="w-full min-h-screen flex items-center justify-center">
      <p className="w-full h-full flex items-center justify-center">
        <Loader className="animate-spin" /> Loading...
      </p>
    </div>
  );

  return (
    <Card className="border-0 sm:border mb-8 shadow-none" ref={elementRef}>
      <CardHeader className=" py-0 sm:py-3">
        <CardTitle className="text-base md:text-xl">
          Verified Customer Feedback
        </CardTitle>
      </CardHeader>

      {productReviews === null ? (
        <ReviewSpinningLoader />
      ) : (
        <>
          <CardContent className="flex flex-col sm:flex-row gap-8">
            <div className="basis-1/4">
              {/* Display Average Rating */}
              {averageRating !== null && (
                <div className="">
                  <span className="text-sm font-semibold">
                    Total Reviews: {reviewCounts.totalReviews}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      Average Rating:
                    </span>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          width={17}
                          height={17}
                          className={`${
                            index < Math.round(averageRating)
                              ? `text-yellow-500 fill-yellow-500` // Filled star for average rating
                              : `dark:text-white dark:fill-white fill-gray-500 text-gray-500` // Unfilled star
                          }`}
                        />
                      ))}
                      ({averageRating.toFixed(1)})
                    </div>
                  </div>
                </div>
              )}

              {/* Display Review Counts */}
              <div className="">
                <div className="flex gap-2 items-center">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        width={17}
                        height={17}
                        className={`${
                          index < 5
                            ? `text-yellow-500 fill-yellow-500` // Filled star for average rating
                            : `dark:text-white dark:fill-white fill-gray-500 text-gray-500` // Unfilled star
                        }`}
                      />
                    ))}
                  </div>
                  {reviewCounts.total5Star}
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        width={17}
                        height={17}
                        className={`${
                          index < 4
                            ? `text-yellow-500 fill-yellow-500` // Filled star for average rating
                            : `dark:text-white dark:fill-white fill-gray-500 text-gray-500` // Unfilled star
                        }`}
                      />
                    ))}
                  </div>
                  {reviewCounts.total4Star}
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        width={17}
                        height={17}
                        className={`${
                          index < 3
                            ? `text-yellow-500 fill-yellow-500` // Filled star for average rating
                            : `dark:text-white dark:fill-white fill-gray-500 text-gray-500` // Unfilled star
                        }`}
                      />
                    ))}
                  </div>
                  {reviewCounts.total3Star}
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        width={17}
                        height={17}
                        className={`${
                          index < 2
                            ? `text-yellow-500 fill-yellow-500` // Filled star for average rating
                            : `dark:text-white dark:fill-white fill-gray-500 text-gray-500` // Unfilled star
                        }`}
                      />
                    ))}
                  </div>
                  {reviewCounts.total2Star}
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        width={17}
                        height={17}
                        className={`${
                          index < 1
                            ? `text-yellow-500 fill-yellow-500` // Filled star for average rating
                            : `dark:text-white dark:fill-white fill-gray-500 text-gray-500` // Unfilled star
                        }`}
                      />
                    ))}
                  </div>
                  {reviewCounts.total1Star}
                </div>
              </div>
            </div>

            {productReviews.length > 0 ? (
              <div className=" basis-3/4">
                <CardDescription className=" text-end pb-2">
                  What customers are saying about this product
                </CardDescription>
                {/* Display Individual Reviews */}
                <div>
                  {productReviews?.map((review, i) => (
                    <Card key={i} className="relative">
                      <CardHeader>
                        <CardDescription className="flex flex-row gap-3 relative">
                          <span className="text-green-600 absolute right-1 top-1 font-semibold">
                            Verified
                          </span>
                          <p>
                            <UserCircle2Icon />
                          </p>
                          <p>{`${review.buyer.firstName} ${review.buyer.lastName}`}</p>
                        </CardDescription>
                      </CardHeader>

                      <CardContent>{review.reviewText}</CardContent>
                      <CardFooter className="w-full flex justify-between">
                        <p className="flex">
                          {Array.from({ length: 5 }, (_, index) => (
                            <Star
                              key={index}
                              width={17}
                              height={17}
                              className={`${
                                index < review.rating
                                  ? `text-yellow-500 fill-yellow-500`
                                  : `dark:text-white dark:fill-white fill-gray-500 text-gray-500`
                              }`}
                            />
                          ))}
                        </p>
                        <p>
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Pagination controls */}
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 rounded ${
                        currentPage === index + 1
                          ? " bg-udua-orange-primary text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="sm:h-48 w-full flex justify-center items-center">
                <Card className=" border-none shadow-none flex justify-center">
                  <CardHeader>
                    <CardDescription>No reviews yet</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default ProductReviewComponent;
