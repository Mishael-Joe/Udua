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
import { Star, UserCircle2Icon } from "lucide-react";

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
  const [productReviews, setProductReviews] = useState<ProductReviews[] | null>(null);

  // Average Rating state
  const [averageRating, setAverageRating] = useState<number | null>(null);

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
        });
        setProductReviews(response.data.reviews);
        
        // Calculate and set the average rating
        const totalRating = response.data.reviews.reduce(
          (acc: number, review: ProductReviews) => acc + review.rating,
          0
        );
        const avgRating = totalRating / response.data.reviews.length;
        setAverageRating(avgRating);

      } catch (error: any) {
        console.error("Failed to fetch Product Reviews", error.message);
      }
    };

    fetchProductReviews();
  }, [isVisibles]);

  return (
    <Card className="border-0 sm:border">
      <CardHeader>
        <CardTitle>Verified Customer Feedback</CardTitle>
        <CardDescription>
          What customers are saying about this product
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={elementRef}>
          {/* Display Average Rating */}
          {averageRating !== null && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-semibold">Average Product Rating: {averageRating.toFixed(1)}</span>
              <div className="flex">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    width={25}
                    height={25}
                    className={`${
                      index < Math.round(averageRating)
                        ? `text-yellow-500 fill-yellow-500` // Filled star for average rating
                        : `dark:text-white dark:fill-white fill-gray-500 text-gray-500` // Unfilled star
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Display Individual Reviews */}
          <div>
            {productReviews?.map((reviews, i) => (
              <Card key={i} className="relative">
                <CardHeader>
                  <CardDescription className="flex flex-row gap-3 relative">
                    <span className="text-green-600 absolute right-1 top-1 font-semibold">
                      Verified
                    </span>
                    <p>
                      <UserCircle2Icon />
                    </p>
                    <p>{`${reviews.buyer.firstName} ${reviews.buyer.lastName}`}</p>
                  </CardDescription>
                </CardHeader>

                <CardContent>{reviews.reviewText}</CardContent>
                <CardFooter className="w-full flex justify-between">
                  <p className="flex">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        width={25}
                        height={25}
                        className={`${
                          index < reviews.rating
                            ? `text-yellow-500 fill-yellow-500`
                            : `dark:text-white dark:fill-white fill-gray-500 text-gray-500`
                        }`}
                      />
                    ))}
                  </p>
                  <p>
                    {new Date(reviews.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductReviewComponent;
