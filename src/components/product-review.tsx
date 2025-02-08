"use client";

import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Loader, Star, UserCircle2Icon } from "lucide-react";

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
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    currentPage === index + 1
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
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

// "use client";

// import axios from "axios";
// import React, { useRef, useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import { Loader, Star, UserCircle2Icon } from "lucide-react";
// import { ReviewSpinningLoader } from "@/utils/spinning-loader";

// // Define the structure of a product review
// type ProductReviews = {
//   _id: string;
//   product: string;
//   buyer: {
//     firstName: string;
//     lastName: string;
//   };
//   rating: number;
//   reviewText: string;
//   createdAt: Date;
//   order: string;
// };

// const ProductReviewComponent = ({ product }: { product: { _id: string } }) => {
//   // Ref for the component container to observe its visibility
//   const elementRef = useRef<HTMLDivElement | null>(null);

//   // Track if the component has been visible in the viewport
//   const [hasBeenVisible, setHasBeenVisible] = useState(false);

//   // State for product reviews and pagination
//   const [productReviews, setProductReviews] = useState<ProductReviews[] | null>(
//     null
//   );
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [averageRating, setAverageRating] = useState(0);
//   const [reviewCounts, setReviewCounts] = useState({
//     totalReviews: 0,
//     total1Star: 0,
//     total2Star: 0,
//     total3Star: 0,
//     total4Star: 0,
//     total5Star: 0,
//   });

//   // Use Intersection Observer to detect when the component is visible
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           // When the component is at least 10% visible, mark it as visible
//           if (entry.isIntersecting) {
//             setHasBeenVisible(true);
//             observer.disconnect(); // Stop observing after the first intersection
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );
//     if (elementRef.current) {
//       observer.observe(elementRef.current);
//     }
//     return () => {
//       observer.disconnect();
//     };
//   }, []);

//   // Fetch product reviews once the component is visible and on page change
//   useEffect(() => {
//     if (!hasBeenVisible) return;

//     const fetchProductReviews = async () => {
//       try {
//         const response = await axios.post("/api/fetch-product-reviews", {
//           productID: product._id,
//           page: currentPage, // Pagination control
//           limit: 5, // 5 reviews per page
//         });

//         const {
//           reviews,
//           totalPages,
//           averageRating,
//           totalReviews,
//           total1Star,
//           total2Star,
//           total3Star,
//           total4Star,
//           total5Star,
//         } = response.data;

//         setProductReviews(reviews);
//         setTotalPages(totalPages);
//         setAverageRating(averageRating);
//         setReviewCounts({
//           totalReviews,
//           total1Star,
//           total2Star,
//           total3Star,
//           total4Star,
//           total5Star,
//         });
//       } catch (error: any) {
//         console.error("Failed to fetch Product Reviews:", error.message);
//       }
//     };

//     fetchProductReviews();
//   }, [hasBeenVisible, currentPage, product._id]);

//   /**
//    * Helper function to render star icons based on a given rating.
//    * It returns a list of 5 stars with filled styling up to the rating value.
//    */
//   const renderStars = (rating: number) => {
//     return Array.from({ length: 5 }, (_, index) => (
//       <Star
//         key={index}
//         width={17}
//         height={17}
//         className={
//           index < rating
//             ? "text-yellow-500 fill-yellow-500"
//             : "dark:text-white dark:fill-white fill-gray-500 text-gray-500"
//         }
//       />
//     ));
//   };

//   // Prepare review count data to render each star rating count
//   const starCountData = [
//     { stars: 5, count: reviewCounts.total5Star },
//     { stars: 4, count: reviewCounts.total4Star },
//     { stars: 3, count: reviewCounts.total3Star },
//     { stars: 2, count: reviewCounts.total2Star },
//     { stars: 1, count: reviewCounts.total1Star },
//   ];

//   return (
//     <Card className="border-0 sm:border mb-8 shadow-none" ref={elementRef}>
//       <CardHeader className="py-0 sm:py-3">
//         <CardTitle className="text-base md:text-xl">
//           Verified Customer Feedback
//         </CardTitle>
//       </CardHeader>

//       {productReviews === null ? (
//         // Display a spinning loader while fetching reviews
//         <ReviewSpinningLoader />
//       ) : (
//         <>
//           <CardContent className="flex flex-col sm:flex-row gap-8">
//             {/* Left Section: Average Rating & Review Counts */}
//             <div className="basis-1/4">
//               <div>
//                 <span className="text-sm font-semibold">
//                   Total Reviews: {reviewCounts.totalReviews}
//                 </span>
//                 <div className="flex items-center gap-2 mt-2">
//                   <span className="text-sm font-semibold">Average Rating:</span>
//                   <div
//                     className="flex items-center"
//                     aria-label={`Average rating ${averageRating.toFixed(
//                       1
//                     )} out of 5`}
//                   >
//                     {renderStars(Math.round(averageRating))}
//                     <span className="ml-1">({averageRating.toFixed(1)})</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Render review counts for each star rating */}
//               <div className="mt-4">
//                 {starCountData.map((item, index) => (
//                   <div key={index} className="flex gap-2 items-center mb-1">
//                     <div
//                       className="flex"
//                       aria-label={`${item.stars} star reviews`}
//                     >
//                       {renderStars(item.stars)}
//                     </div>
//                     <span>{item.count}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Right Section: Individual Reviews & Pagination */}
//             {productReviews.length > 0 ? (
//               <div className="basis-3/4">
//                 <CardDescription className="text-end pb-2">
//                   What customers are saying about this product
//                 </CardDescription>
//                 {/* Render each review */}
//                 <div>
//                   {productReviews.map((review, i) => (
//                     <Card key={review._id || i} className="relative mb-4">
//                       <CardHeader>
//                         <CardDescription className="flex flex-row gap-3 relative">
//                           <span className="text-green-600 absolute right-1 top-1 font-semibold">
//                             Verified
//                           </span>
//                           <UserCircle2Icon />
//                           <span>{`${review.buyer.firstName} ${review.buyer.lastName}`}</span>
//                         </CardDescription>
//                       </CardHeader>
//                       <CardContent>{review.reviewText}</CardContent>
//                       <CardFooter className="w-full flex justify-between items-center">
//                         <div
//                           className="flex"
//                           aria-label={`Rating: ${review.rating} out of 5`}
//                         >
//                           {renderStars(review.rating)}
//                         </div>
//                         <span className="text-sm">
//                           {new Date(review.createdAt).toLocaleDateString(
//                             "en-US",
//                             {
//                               year: "numeric",
//                               month: "long",
//                               day: "numeric",
//                             }
//                           )}
//                         </span>
//                       </CardFooter>
//                     </Card>
//                   ))}
//                 </div>

//                 {/* Pagination Controls */}
//                 <div className="flex justify-center gap-2 mt-4">
//                   {Array.from({ length: totalPages }, (_, index) => (
//                     <button
//                       key={index + 1}
//                       onClick={() => setCurrentPage(index + 1)}
//                       className={`px-4 py-2 rounded ${
//                         currentPage === index + 1
//                           ? "bg-udua-orange-primary text-white"
//                           : "bg-gray-200 text-gray-700"
//                       }`}
//                       aria-label={`Go to page ${index + 1}`}
//                     >
//                       {index + 1}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               // Display a friendly message when there are no reviews
//               <div className="sm:h-48 w-full flex justify-center items-center">
//                 <Card className="border-none shadow-none flex justify-center">
//                   <CardHeader>
//                     <CardDescription>No reviews yet</CardDescription>
//                   </CardHeader>
//                 </Card>
//               </div>
//             )}
//           </CardContent>
//         </>
//       )}
//     </Card>
//   );
// };

// export default ProductReviewComponent;

// "use client";

// import { ForProductInfo } from "@/types";
// import axios from "axios";
// import React, { useRef, useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import { Loader, Star, UserCircle2Icon } from "lucide-react";
// import { ReviewSpinningLoader } from "@/utils/spinning-loader";

// type ProductReviews = {
//   _id: string;
//   product: string;
//   buyer: {
//     firstName: string;
//     lastName: string;
//   };
//   rating: number;
//   reviewText: string;
//   createdAt: Date;
//   order: string;
// };

// const ProductReviewComponent = ({ product }: { product: { _id: string } }) => {
//   const elementRef = useRef<HTMLDivElement | null>(null);
//   const [isVisible, setIsVisible] = useState(false);
//   const [isVisibles, setIsVisibles] = useState(false);
//   const [productReviews, setProductReviews] = useState<ProductReviews[] | null>(
//     null
//   );
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [averageRating, setAverageRating] = useState(0);
//   const [reviewCounts, setReviewCounts] = useState({
//     totalReviews: 0,
//     total1Star: 0,
//     total2Star: 0,
//     total3Star: 0,
//     total4Star: 0,
//     total5Star: 0,
//   });

//   useEffect(() => {
//     const handleScroll = () => {
//       if (elementRef.current) {
//         const rect = elementRef.current.getBoundingClientRect();
//         let count = 0;
//         const isVisible =
//           rect.top >= 0 &&
//           rect.left >= 0 &&
//           rect.bottom <=
//             (window.innerHeight || document.documentElement.clientHeight) &&
//           rect.right <=
//             (window.innerWidth || document.documentElement.clientWidth);
//         setIsVisible(isVisible);
//         if (isVisible) {
//           count++;
//           if (count === 1) {
//             setIsVisibles(true);
//           }
//         }
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll();

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   useEffect(() => {
//     if (!isVisibles) return;

//     const fetchProductReviews = async () => {
//       try {
//         const response = await axios.post("/api/fetch-product-reviews", {
//           productID: product._id,
//           page: currentPage, // pass current page for pagination
//           limit: 5, // limit to 5 reviews per page
//         });

//         // console.log('response', response)

//         const {
//           reviews,
//           totalPages,
//           averageRating,
//           totalReviews,
//           total1Star,
//           total2Star,
//           total3Star,
//           total4Star,
//           total5Star,
//         } = response.data;

//         setProductReviews(reviews);
//         setTotalPages(totalPages);
//         setAverageRating(averageRating);

//         // Set review counts for each star rating
//         setReviewCounts({
//           totalReviews,
//           total1Star,
//           total2Star,
//           total3Star,
//           total4Star,
//           total5Star,
//         });
//       } catch (error: any) {
//         console.error("Failed to fetch Product Reviews", error.message);
//       }
//     };

//     fetchProductReviews();
//   }, [isVisibles, currentPage]);

//   const spinningLoader = (
//     <div className="w-full min-h-screen flex items-center justify-center">
//       <p className="w-full h-full flex items-center justify-center">
//         <Loader className="animate-spin" /> Loading...
//       </p>
//     </div>
//   );

//   return (
//     <Card className="border-0 sm:border mb-8 shadow-none" ref={elementRef}>
//       <CardHeader className=" py-0 sm:py-3">
//         <CardTitle className="text-base md:text-xl">
//           Verified Customer Feedback
//         </CardTitle>
//       </CardHeader>

//       {productReviews === null ? (
//         <ReviewSpinningLoader />
//       ) : (
//         <>
//           <CardContent className="flex flex-col sm:flex-row gap-8">
//             <div className="basis-1/4">
//               {/* Display Average Rating */}
//               {averageRating !== null && (
//                 <div className="">
//                   <span className="text-sm font-semibold">
//                     Total Reviews: {reviewCounts.totalReviews}
//                   </span>

//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-semibold">
//                       Average Rating:
//                     </span>
//                     <div className="flex items-center">
//                       {Array.from({ length: 5 }, (_, index) => (
//                         <Star
//                           key={index}
//                           width={17}
//                           height={17}
//                           className={`${
//                             index < Math.round(averageRating)
//                               ? `text-yellow-500 fill-yellow-500` // Filled star for average rating
//                               : `dark:text-white dark:fill-white fill-gray-500 text-gray-500` // Unfilled star
//                           }`}
//                         />
//                       ))}
//                       ({averageRating.toFixed(1)})
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Display Review Counts */}
//               <div className="">
//                 <div className="flex gap-2 items-center">
//                   <div className="flex">
//                     {Array.from({ length: 5 }, (_, index) => (
//                       <Star
//                         key={index}
//                         width={17}
//                         height={17}
//                         className={`${
//                           index < 5
//                             ? `text-yellow-500 fill-yellow-500` // Filled star for average rating
//                             : `dark:text-white dark:fill-white fill-gray-500 text-gray-500` // Unfilled star
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   {reviewCounts.total5Star}
//                 </div>
//                 <div className="flex gap-2 items-center">
//                   <div className="flex">
//                     {Array.from({ length: 5 }, (_, index) => (
//                       <Star
//                         key={index}
//                         width={17}
//                         height={17}
//                         className={`${
//                           index < 4
//                             ? `text-yellow-500 fill-yellow-500` // Filled star for average rating
//                             : `dark:text-white dark:fill-white fill-gray-500 text-gray-500` // Unfilled star
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   {reviewCounts.total4Star}
//                 </div>
//                 <div className="flex gap-2 items-center">
//                   <div className="flex">
//                     {Array.from({ length: 5 }, (_, index) => (
//                       <Star
//                         key={index}
//                         width={17}
//                         height={17}
//                         className={`${
//                           index < 3
//                             ? `text-yellow-500 fill-yellow-500` // Filled star for average rating
//                             : `dark:text-white dark:fill-white fill-gray-500 text-gray-500` // Unfilled star
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   {reviewCounts.total3Star}
//                 </div>
//                 <div className="flex gap-2 items-center">
//                   <div className="flex">
//                     {Array.from({ length: 5 }, (_, index) => (
//                       <Star
//                         key={index}
//                         width={17}
//                         height={17}
//                         className={`${
//                           index < 2
//                             ? `text-yellow-500 fill-yellow-500` // Filled star for average rating
//                             : `dark:text-white dark:fill-white fill-gray-500 text-gray-500` // Unfilled star
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   {reviewCounts.total2Star}
//                 </div>
//                 <div className="flex gap-2 items-center">
//                   <div className="flex">
//                     {Array.from({ length: 5 }, (_, index) => (
//                       <Star
//                         key={index}
//                         width={17}
//                         height={17}
//                         className={`${
//                           index < 1
//                             ? `text-yellow-500 fill-yellow-500` // Filled star for average rating
//                             : `dark:text-white dark:fill-white fill-gray-500 text-gray-500` // Unfilled star
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   {reviewCounts.total1Star}
//                 </div>
//               </div>
//             </div>

//             {productReviews.length > 0 ? (
//               <div className=" basis-3/4">
//                 <CardDescription className=" text-end pb-2">
//                   What customers are saying about this product
//                 </CardDescription>
//                 {/* Display Individual Reviews */}
//                 <div>
//                   {productReviews?.map((review, i) => (
//                     <Card key={i} className="relative">
//                       <CardHeader>
//                         <CardDescription className="flex flex-row gap-3 relative">
//                           <span className="text-green-600 absolute right-1 top-1 font-semibold">
//                             Verified
//                           </span>
//                           <p>
//                             <UserCircle2Icon />
//                           </p>
//                           <p>{`${review.buyer.firstName} ${review.buyer.lastName}`}</p>
//                         </CardDescription>
//                       </CardHeader>

//                       <CardContent>{review.reviewText}</CardContent>
//                       <CardFooter className="w-full flex justify-between">
//                         <p className="flex">
//                           {Array.from({ length: 5 }, (_, index) => (
//                             <Star
//                               key={index}
//                               width={17}
//                               height={17}
//                               className={`${
//                                 index < review.rating
//                                   ? `text-yellow-500 fill-yellow-500`
//                                   : `dark:text-white dark:fill-white fill-gray-500 text-gray-500`
//                               }`}
//                             />
//                           ))}
//                         </p>
//                         <p>
//                           {new Date(review.createdAt).toLocaleDateString(
//                             "en-US",
//                             {
//                               year: "numeric",
//                               month: "long",
//                               day: "numeric",
//                             }
//                           )}
//                         </p>
//                       </CardFooter>
//                     </Card>
//                   ))}
//                 </div>

//                 {/* Pagination controls */}
//                 <div className="flex justify-center gap-2 mt-4">
//                   {Array.from({ length: totalPages }, (_, index) => (
//                     <button
//                       key={index + 1}
//                       onClick={() => setCurrentPage(index + 1)}
//                       className={`px-4 py-2 rounded ${
//                         currentPage === index + 1
//                           ? " bg-udua-orange-primary text-white"
//                           : "bg-gray-200 text-gray-700"
//                       }`}
//                     >
//                       {index + 1}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="sm:h-48 w-full flex justify-center items-center">
//                 <Card className=" border-none shadow-none flex justify-center">
//                   <CardHeader>
//                     <CardDescription>No reviews yet</CardDescription>
//                   </CardHeader>
//                 </Card>
//               </div>
//             )}
//           </CardContent>
//         </>
//       )}
//     </Card>
//   );
// };

// export default ProductReviewComponent;
