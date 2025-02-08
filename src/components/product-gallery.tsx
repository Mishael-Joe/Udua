"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { shimmer, toBase64 } from "@/lib/image";
import type { ForProductGallery } from "@/types";
import { Heart, Loader, Store } from "lucide-react";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/actions/product.action";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { addProductToRecentlyViewed } from "@/lib/helpers/recently-viewed";
import "@splidejs/react-splide/css";
import GLightbox from "glightbox"; // Import GLightbox
import "glightbox/dist/css/glightbox.min.css"; // Import GLightbox CSS
import { Splide, SplideSlide } from "react-splide-ts";
import "@splidejs/react-splide/css";

type Response = {
  status: number;
  message: any;
};

// Constants for consistent image handling
const ASPECT_RATIO = 2 / 1.8; // 3:4 aspect ratio for all products
const MAIN_IMAGE_WIDTH = 800;
const MAIN_IMAGE_HEIGHT = MAIN_IMAGE_WIDTH * ASPECT_RATIO;
const THUMBNAIL_SIZE = 200;

export function ProductGallery({ product, isLikedProduct }: ForProductGallery) {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [action, setAction] = useState<string | null>(null);
  const images =
    product.productType === "Physical Product"
      ? product.images
      : product.coverIMG;

  useEffect(() => {
    addProductToRecentlyViewed(product._id);
  }, [product._id]);

  // Initialize GLightbox on component mount
  useEffect(() => {
    GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
    });
  }, []);

  useEffect(() => {
    const handleWishlist = async () => {
      if (!action || isLoading) return; // Prevent re-trigger if already loading

      try {
        setIsLoading(true);

        // Perform the correct action (add or remove)
        const response =
          action === "add"
            ? await addToWishlist(product._id)
            : await removeFromWishlist(product._id);

        // Check if the user is not authenticated
        if (response.message === "User not authenticated") {
          router.push("/sign-in");
          return;
        }

        // Show toast based on response status
        toast({
          variant: response.status === 200 ? "default" : "destructive",
          title: response.status === 200 ? "Success" : "Error",
          description:
            response.status === 200
              ? `Product ${
                  action === "add" ? "added to" : "removed from"
                } your Wishlist`
              : `Failed to ${action} wishlist item`,
        });

        // Reset action after successful operation
        setAction(null);
      } catch (error) {
        console.error("Wishlist error:", error);
        // toast({
        //   variant: "destructive",
        //   title: "Error",
        //   description: "An unexpected error occurred",
        // });
      } finally {
        setIsLoading(false);
        router.refresh(); // Refresh the router after completion
      }
    };

    handleWishlist();
  }, [action, isLoading]);

  const renderWishlistButton = () => (
    <button
      aria-label={isLikedProduct ? "Remove from wishlist" : "Add to wishlist"}
      onClick={() => setAction(isLikedProduct ? "remove" : "add")}
      className="absolute z-10 top-4 left-4 md:top-6 md:left-6"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader className="w-8 h-8 p-1 animate-spin text-white bg-black/20 rounded-full" />
      ) : (
        <Heart
          fill={isLikedProduct ? "currentColor" : "none"}
          className={`w-8 h-8 p-1 rounded-full ${
            isLikedProduct ? "text-red-500" : "text-black bg-white/80"
          }`}
        />
      )}
    </button>
  );

  const renderStoreButton = () => (
    <Link
      href={`/brand/${product.storeID}`}
      className="absolute z-10 top-4 right-4 md:top-6 md:right-6"
    >
      <Store className="w-8 h-8 p-1 rounded-full text-black bg-white/80" />
    </Link>
  );

  const renderMainImage = () => (
    <div className="relative md:w-full" style={{ aspectRatio: ASPECT_RATIO }}>
      <a
        href={images[selectedImage]}
        className="glightbox block h-full w-full"
        aria-label="Enlarge image"
      >
        <Image
          priority
          src={images[selectedImage]}
          alt={`Main display for ${product.name || product.title}`}
          fill
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(
            shimmer(MAIN_IMAGE_WIDTH, MAIN_IMAGE_HEIGHT)
          )}`}
          className="object-contain bg-gray-50 cursor-zoom-in rounded"
          sizes="(max-width: 640px) 100vw, 800px"
        />
      </a>
    </div>
  );

  const renderThumbnails = () => (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 px-4">
      {images.map((image, idx) => (
        <button
          key={idx}
          onClick={() => setSelectedImage(idx)}
          className="relative aspect-square group"
          aria-label={`Select image ${idx + 1}`}
        >
          <div className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-90">
            <Image
              src={image}
              alt={`Thumbnail ${idx + 1}`}
              fill
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(THUMBNAIL_SIZE, THUMBNAIL_SIZE)
              )}`}
              className="object-cover"
              sizes="(max-width: 640px) 33vw, 200px"
              loading={idx > 2 ? "lazy" : "eager"}
            />
          </div>
          <div
            className={`absolute inset-0 ring-2 transition-all duration-200 ${
              idx === selectedImage
                ? "ring-udua-orange-primary"
                : "ring-transparent group-hover:ring-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );

  const renderDigitalDetails = () => {
    if (product.productType !== "Digital Product") return null;

    const details = [
      { key: "author", label: "Author", icon: "/author-sign-svgrepo-com.svg" },
      { key: "language", label: "Language", icon: "/language-svgrepo-com.svg" },
      {
        key: "publisher",
        label: "Publisher",
        icon: "/office-building-svgrepo-com.svg",
      },
      { key: "isbn", label: "ISBN", icon: "/bar-code-svgrepo-com.svg" },
    ];

    return (
      <div className="mt-8">
        <Splide
          options={{
            perPage: 2,
            perMove: 1,
            gap: "1rem",
            breakpoints: {
              640: { perPage: 3 },
              1024: { perPage: 4 },
            },
            pagination: false,
            arrows: true,
          }}
          aria-label="Product details"
        >
          {details.map(
            ({ key, label, icon }) =>
              product[key as keyof typeof product] && (
                <SplideSlide key={key} className="py-4">
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Image
                      src={icon}
                      width={40}
                      height={40}
                      alt=""
                      className="mb-2"
                      aria-hidden="true"
                    />
                    <div className="text-center">
                      <p className="text-sm text-gray-600">{label}</p>
                      <p className="font-medium line-clamp-1">
                        {/* {product[key as keyof typeof product]} */}
                      </p>
                    </div>
                  </div>
                </SplideSlide>
              )
          )}
        </Splide>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:sticky lg:top-14">
      <div className="relative">
        {renderWishlistButton()}
        {product.productType === "Physical Product" && renderStoreButton()}
        {renderMainImage()}
      </div>

      {renderThumbnails()}
      {renderDigitalDetails()}

      {product.fileSize && (
        <div className="mt-4 px-4 text-center">
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="text-sm text-gray-600 hover:text-black transition-colors"
            aria-expanded={isVisible}
          >
            {isVisible ? "Hide Details" : "Show More Details"}
          </button>
          {isVisible && (
            <p className="mt-2 text-sm">File Size: {product.fileSize} MB</p>
          )}
        </div>
      )}
    </div>
  );
}
// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { shimmer, toBase64 } from "@/lib/image";
// import { ForProductGallery } from "@/types";
// import { Heart, Loader, Store } from "lucide-react";
// import {
//   addToWishlist,
//   removeFromWishlist,
// } from "@/lib/actions/product.action";
// import { useRouter } from "next/navigation";
// import { useToast } from "@/components/ui/use-toast";
// import Link from "next/link";
// import GLightbox from "glightbox"; // Import GLightbox
// import "glightbox/dist/css/glightbox.min.css"; // Import GLightbox CSS
// import { Splide, SplideSlide } from "react-splide-ts";
// import "@splidejs/react-splide/css";
// import { addProductToRecentlyViewed } from "@/lib/helpers/recently-viewed";

// type Response = {
//   status: number;
//   message: any;
// };

// export function ProductGallery({ product, isLikedProduct }: ForProductGallery) {
//   const { toast } = useToast();
//   const router = useRouter();
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isVisible, setIsVisible] = useState(false);
//   addProductToRecentlyViewed(product._id);
//   const toggleVisibility = () => {
//     setIsVisible(!isVisible);
//   };

//   // Initialize GLightbox on component mount
//   useEffect(() => {
//     GLightbox({
//       selector: ".glightbox",
//       touchNavigation: true,
//       loop: true,
//     });
//   }, []);

//   const handleWishlist = async (val: string) => {
//     try {
//       if (val === "addToWishlist") {
//         setIsLoading(true);
//         const response: Response = await addToWishlist(product._id!);

//         if (response.message === "User not authenticated") {
//           router.push("/sign-in");
//         }

//         if (response.status === 200) {
//           toast({
//             variant: "default",
//             title: `Succesful`,
//             description: `Product added to your Wishlist`,
//           });
//         }

//         if (response.status === 401) {
//           toast({
//             variant: "destructive",
//             title: `Error`,
//             description: `An Error occurred while adding this product to your Wishlist`,
//           });
//         }
//       }

//       if (val === "removeFromWishlist") {
//         setIsLoading(true);
//         const response: Response = await removeFromWishlist(product._id!);

//         if (response.status === 200) {
//           toast({
//             variant: "default",
//             title: `Succesful`,
//             description: `Product removed from your Wishlist`,
//           });
//         }

//         if (response.status === 401) {
//           toast({
//             variant: "destructive",
//             title: `Error`,
//             description: `An Error occurred while removing this product from your Wishlist`,
//           });
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//       router.refresh();
//     }
//   };

//   return (
//     <div className="flex flex-col md:sticky lg:top-14">
//       {/* Image Grid */}
//       {product.productType === "Physical Product" ? (
//         <>
//           {/* Main Image */}
//           <div className="aspect-h-1 aspect-w-1 w-full p-3.5 sm:p-0 relative">
//             {isLoading && (
//               <button>
//                 <Loader className="w-8 h-8 z-10 p-1 top-12 left-6 md:top-10 md:left-3 absolute animate-spin" />
//               </button>
//             )}
//             {isLikedProduct && !isLoading && (
//               <button onClick={() => handleWishlist("removeFromWishlist")}>
//                 <Heart className=" text-white rounded p-1 top-12 left-6 md:top-10 md:left-3 bg-red-500 w-8 h-8 z-10 absolute" />
//               </button>
//             )}
//             {!isLikedProduct && !isLoading && (
//               <button onClick={() => handleWishlist("addToWishlist")}>
//                 <Heart className=" rounded p-1 top-12 left-6 md:top-10 md:left-3 text-black bg-slate-100 w-8 h-8 z-10 absolute" />
//               </button>
//             )}

//             <Link href={`/brand/${product.storeID}`}>
//               <button>
//                 <Store className=" rounded p-1 top-12 right-6 md:top-10 md:right-3 text-black bg-slate-100 w-8 h-8 z-10 absolute" />
//               </button>
//             </Link>

//             {/* GLightbox trigger for main image */}
//             <a href={product.images[selectedImage]} className="glightbox">
//               <Image
//                 priority
//                 src={product.images[selectedImage]}
//                 alt={`Main ${product.name} image`}
//                 width={600}
//                 height={750}
//                 placeholder="blur"
//                 blurDataURL={`data:image/svg+xml;base64,${toBase64(
//                   shimmer(600, 750)
//                 )}`}
//                 className="h-96 cursor-zoom-in w-full border-2 border-gray-200 object-cover object-center shadow-sm dark:border-gray-800 sm:rounded-lg"
//               />
//             </a>
//           </div>

//           {/* Thumbnail images */}
//           <div className="mx-auto sm:mt-4 w-full max-w-2xl px-3.5 lg:max-w-none">
//             <ul className="grid grid-cols-3 gap-2 sm:gap-6">
//               {product.images.map((image, imageIndex) => (
//                 <div
//                   key={imageIndex}
//                   onClick={() => setSelectedImage(imageIndex)}
//                   className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase hover:bg-gray-50"
//                 >
//                   <span className="absolute inset-0 overflow-hidden rounded-md">
//                     <Image
//                       placeholder="blur"
//                       blurDataURL={`data:image/svg+xml;base64,${toBase64(
//                         shimmer(200, 200)
//                       )}`}
//                       src={image}
//                       width={200}
//                       height={200}
//                       alt=""
//                       className="h-full w-full object-cover object-center"
//                     />
//                   </span>
//                   {imageIndex === selectedImage && (
//                     <span
//                       className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-udua-orange-primary ring-offset-2"
//                       aria-hidden="true"
//                     />
//                   )}
//                 </div>
//               ))}
//             </ul>
//           </div>
//         </>
//       ) : (
//         <>
//           {/* Main Image */}
//           <div className="aspect-h-1 aspect-w-1 w-full sm:max-w-lg sm:mx-auto p-3.5 sm:p-0 relative">
//             {isLoading && (
//               <button>
//                 <Loader className="w-8 h-8 z-10 p-1 top-12 left-6 md:top-10 md:left-3 absolute animate-spin" />
//               </button>
//             )}
//             {isLikedProduct && !isLoading && (
//               <button onClick={() => handleWishlist("removeFromWishlist")}>
//                 <Heart className=" text-white rounded p-1 top-12 left-6 md:top-10 md:left-3 bg-red-500 w-8 h-8 z-10 absolute" />
//               </button>
//             )}
//             {!isLikedProduct && !isLoading && (
//               <button onClick={() => handleWishlist("addToWishlist")}>
//                 <Heart className=" rounded p-1 top-12 left-6 md:top-10 md:left-3 text-black bg-slate-100 w-8 h-8 z-10 absolute" />
//               </button>
//             )}

//             {/* GLightbox trigger for main image */}
//             <a href={product.coverIMG[selectedImage]} className="glightbox">
//               <Image
//                 priority
//                 src={product.coverIMG[selectedImage]}
//                 alt={`Main ${product.name} image`}
//                 width={500}
//                 height={650}
//                 placeholder="blur"
//                 blurDataURL={`data:image/svg+xml;base64,${toBase64(
//                   shimmer(600, 750)
//                 )}`}
//                 className="h-[32rem] cursor-zoom-in w-full border-2 border-gray-200 object-fit object-center shadow-sm  sm:rounded-lg"
//               />
//             </a>
//           </div>

//           {/* Thumbnail images */}
//           <div className="mx-auto mt-4 w-full max-w-2xl px-3.5 lg:max-w-none">
//             <ul className="grid grid-cols-3 gap-2 sm:gap-6 h-[10rem]">
//               {product.coverIMG.map((image, imageIndex) => (
//                 <div
//                   key={imageIndex}
//                   onClick={() => setSelectedImage(imageIndex)}
//                   className="relative flex h-full cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase hover:bg-gray-50"
//                 >
//                   <span className="absolute inset-0 overflow-hidden rounded-md">
//                     <Image
//                       placeholder="blur"
//                       blurDataURL={`data:image/svg+xml;base64,${toBase64(
//                         shimmer(200, 200)
//                       )}`}
//                       src={image}
//                       width={200}
//                       height={200}
//                       alt=""
//                       className="h-[10rem] w-full object-fit object-center"
//                     />
//                   </span>
//                   {imageIndex === selectedImage && (
//                     <span
//                       className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-udua-orange-primary ring-offset-2"
//                       aria-hidden="true"
//                     />
//                   )}
//                 </div>
//               ))}
//             </ul>
//           </div>

//           <div className="mt-6">
//             <Splide
//               options={{
//                 fixedWidth: "12rem",
//                 fixedHeight: "9rem",
//                 gap: "1rem",
//                 type: "slide",
//                 rewind: false,
//                 focus: 0,
//                 autoplay: false,
//                 speed: 1000,
//                 interval: 5000,
//                 height: "10rem",
//                 arrows: true,
//                 pagination: false,
//                 omitEnd: true,
//                 classes: {
//                   // Add classes for arrows.
//                   arrows: "splide__arrows splide-next",
//                   prev: "splide__arrow--prev splide-next",
//                   next: "splide__arrow--next splide-next",
//                 },
//               }}
//               className="flex justify-evenly"
//               aria-label="Reviews from Users"
//             >
//               {product.author && (
//                 <SplideSlide>
//                   <div className="h-full flex flex-col items-center p-2">
//                     <Image
//                       data-splide-lazy="path-to-the-image"
//                       src={`/author-sign-svgrepo-com.svg`}
//                       width={30}
//                       height={30}
//                       alt="Image 1"
//                       className="w-30 h-30 pt-3"
//                     />
//                     <div className="pt-2 text-center">
//                       <p className=" text-sm">Author</p>
//                       <p
//                         className="font-semibold"
//                         style={{
//                           display: "-webkit-box",
//                           WebkitBoxOrient: "vertical",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           WebkitLineClamp: 1, // Limits the text to 3 lines
//                           maxHeight: "4.5em", // Adjust this based on the number of lines and line height
//                           lineHeight: "1.5em", // Adjust based on font size for accurate height control
//                         }}
//                       >
//                         {product.author}
//                       </p>
//                     </div>
//                   </div>
//                 </SplideSlide>
//               )}

//               {product.language && (
//                 <SplideSlide>
//                   <div className="h-full flex flex-col items-center p-2">
//                     <Image
//                       data-splide-lazy="path-to-the-image"
//                       src={`/language-svgrepo-com.svg`}
//                       width={30}
//                       height={30}
//                       alt="Image 1"
//                       className="w-30 h-30 pt-3"
//                     />
//                     <div className="pt-2 text-center">
//                       <p className=" text-sm">Laguage</p>
//                       <p
//                         className="font-semibold"
//                         style={{
//                           display: "-webkit-box",
//                           WebkitBoxOrient: "vertical",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           WebkitLineClamp: 1, // Limits the text to 3 lines
//                           maxHeight: "4.5em", // Adjust this based on the number of lines and line height
//                           lineHeight: "1.5em", // Adjust based on font size for accurate height control
//                         }}
//                       >
//                         {product.language}
//                       </p>
//                     </div>
//                   </div>
//                 </SplideSlide>
//               )}

//               {product.publisher && (
//                 <SplideSlide>
//                   <div className="h-full flex flex-col items-center p-2">
//                     <Image
//                       data-splide-lazy="path-to-the-image"
//                       src={`/office-building-svgrepo-com.svg`}
//                       width={30}
//                       height={30}
//                       alt="Image 1"
//                       className="w-30 h-30 pt-3"
//                     />
//                     <div className="pt-2 text-center">
//                       <p className=" text-sm">Publisher</p>
//                       <p
//                         className="font-semibold"
//                         style={{
//                           display: "-webkit-box",
//                           WebkitBoxOrient: "vertical",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           WebkitLineClamp: 1, // Limits the text to 3 lines
//                           maxHeight: "4.5em", // Adjust this based on the number of lines and line height
//                           lineHeight: "1.5em", // Adjust based on font size for accurate height control
//                         }}
//                       >
//                         {product.publisher}
//                       </p>
//                     </div>
//                   </div>
//                 </SplideSlide>
//               )}

//               {product.isbn && (
//                 <SplideSlide>
//                   <div className="h-full flex flex-col items-center p-2">
//                     <Image
//                       data-splide-lazy="path-to-the-image"
//                       src={`/bar-code-svgrepo-com.svg`}
//                       width={30}
//                       height={30}
//                       alt="Image 1"
//                       className="w-30 h-30 pt-3"
//                     />
//                     <div className="pt-2 text-center">
//                       <p className=" text-sm">ISBN</p>
//                       <p
//                         className="font-semibold"
//                         style={{
//                           display: "-webkit-box",
//                           WebkitBoxOrient: "vertical",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           WebkitLineClamp: 1, // Limits the text to 3 lines
//                           maxHeight: "4.5em", // Adjust this based on the number of lines and line height
//                           lineHeight: "1.5em", // Adjust based on font size for accurate height control
//                         }}
//                       >
//                         {product.isbn}
//                       </p>
//                     </div>
//                   </div>
//                 </SplideSlide>
//               )}
//             </Splide>
//           </div>

//           <div className=" w-full">
//             <button
//               className="text-xs text-center w-full"
//               onClick={toggleVisibility}
//             >
//               {isVisible ? "See Less" : "See More"}
//             </button>

//             {isVisible && (
//               <div className="hidden-div">
//                 {/* <p>category: {product.category}</p>
//                 <p>Sub-category: {product.subcategory}</p> */}
//                 <p>File Size: {product.fileSize} MB</p>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
