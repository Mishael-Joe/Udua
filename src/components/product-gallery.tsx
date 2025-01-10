"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { shimmer, toBase64 } from "@/lib/image";
import { ForProductGallery } from "@/types";
import { Heart, Loader, Store } from "lucide-react";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/actions/product.action";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import GLightbox from "glightbox"; // Import GLightbox
import "glightbox/dist/css/glightbox.min.css"; // Import GLightbox CSS
import { Splide, SplideSlide } from "react-splide-ts";
import "@splidejs/react-splide/css";

type Response = {
  status: number;
  message: any;
};

export function ProductGallery({ product, isLikedProduct }: ForProductGallery) {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Initialize GLightbox on component mount
  useEffect(() => {
    GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
    });
  }, []);

  const handleWishlist = async (val: string) => {
    try {
      if (val === "addToWishlist") {
        setIsLoading(true);
        const response: Response = await addToWishlist(product._id!);

        if (response.message === "User not authenticated") {
          router.push("/sign-in");
        }

        if (response.status === 200) {
          toast({
            variant: "default",
            title: `Succesful`,
            description: `Product added to your Wishlist`,
          });
        }

        if (response.status === 401) {
          toast({
            variant: "destructive",
            title: `Error`,
            description: `An Error occurred while adding this product to your Wishlist`,
          });
        }
      }

      if (val === "removeFromWishlist") {
        setIsLoading(true);
        const response: Response = await removeFromWishlist(product._id!);

        if (response.status === 200) {
          toast({
            variant: "default",
            title: `Succesful`,
            description: `Product removed from your Wishlist`,
          });
        }

        if (response.status === 401) {
          toast({
            variant: "destructive",
            title: `Error`,
            description: `An Error occurred while removing this product from your Wishlist`,
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col md:sticky md:top-14">
      {/* Image Grid */}
      {product.productType === "Physical Product" ? (
        <>
          {/* Main Image */}
          <div className="aspect-h-1 aspect-w-1 w-full p-3.5 sm:p-0 relative">
            {isLoading && (
              <button>
                <Loader className="w-8 h-8 z-10 p-1 top-12 left-6 md:top-10 md:left-3 absolute animate-spin" />
              </button>
            )}
            {isLikedProduct && !isLoading && (
              <button onClick={() => handleWishlist("removeFromWishlist")}>
                <Heart className=" text-white rounded p-1 top-12 left-6 md:top-10 md:left-3 bg-red-500 w-8 h-8 z-10 absolute" />
              </button>
            )}
            {!isLikedProduct && !isLoading && (
              <button onClick={() => handleWishlist("addToWishlist")}>
                <Heart className=" rounded p-1 top-12 left-6 md:top-10 md:left-3 text-black bg-slate-100 w-8 h-8 z-10 absolute" />
              </button>
            )}

            <Link href={`/brand/${product.storeID}`}>
              <button>
                <Store className=" rounded p-1 top-12 right-6 md:top-10 md:right-3 text-black bg-slate-100 w-8 h-8 z-10 absolute" />
              </button>
            </Link>

            {/* GLightbox trigger for main image */}
            <a href={product.productImage[selectedImage]} className="glightbox">
              <Image
                priority
                src={product.productImage[selectedImage]}
                alt={`Main ${product.productName} image`}
                width={600}
                height={750}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(600, 750)
                )}`}
                className="h-96 cursor-zoom-in w-full border-2 border-gray-200 object-cover object-center shadow-sm dark:border-gray-800 sm:rounded-lg"
              />
            </a>
          </div>

          {/* Thumbnail images */}
          <div className="mx-auto mt-6 w-full max-w-2xl px-3.5 lg:max-w-none">
            <ul className="grid grid-cols-3 gap-2 sm:gap-6">
              {product.productImage.map((image, imageIndex) => (
                <div
                  key={imageIndex}
                  onClick={() => setSelectedImage(imageIndex)}
                  className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase hover:bg-gray-50"
                >
                  <span className="absolute inset-0 overflow-hidden rounded-md">
                    <Image
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                        shimmer(200, 200)
                      )}`}
                      src={image}
                      width={200}
                      height={200}
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </span>
                  {imageIndex === selectedImage && (
                    <span
                      className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-udua-orange-primary ring-offset-2"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          {/* Main Image */}
          <div className="aspect-h-1 aspect-w-1 w-full sm:max-w-lg sm:mx-auto p-3.5 sm:p-0 relative">
            {isLoading && (
              <button>
                <Loader className="w-8 h-8 z-10 p-1 top-12 left-6 md:top-10 md:left-3 absolute animate-spin" />
              </button>
            )}
            {isLikedProduct && !isLoading && (
              <button onClick={() => handleWishlist("removeFromWishlist")}>
                <Heart className=" text-white rounded p-1 top-12 left-6 md:top-10 md:left-3 bg-red-500 w-8 h-8 z-10 absolute" />
              </button>
            )}
            {!isLikedProduct && !isLoading && (
              <button onClick={() => handleWishlist("addToWishlist")}>
                <Heart className=" rounded p-1 top-12 left-6 md:top-10 md:left-3 text-black bg-slate-100 w-8 h-8 z-10 absolute" />
              </button>
            )}

            {/* GLightbox trigger for main image */}
            <a href={product.coverIMG[selectedImage]} className="glightbox">
              <Image
                priority
                src={product.coverIMG[selectedImage]}
                alt={`Main ${product.productName} image`}
                width={500}
                height={650}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(600, 750)
                )}`}
                className="h-[32rem] cursor-zoom-in w-full border-2 border-gray-200 object-fit object-center shadow-sm  sm:rounded-lg"
              />
            </a>
          </div>

          {/* Thumbnail images */}
          <div className="mx-auto mt-4 w-full max-w-2xl px-3.5 lg:max-w-none">
            <ul className="grid grid-cols-3 gap-2 sm:gap-6 h-[10rem]">
              {product.coverIMG.map((image, imageIndex) => (
                <div
                  key={imageIndex}
                  onClick={() => setSelectedImage(imageIndex)}
                  className="relative flex h-full cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase hover:bg-gray-50"
                >
                  <span className="absolute inset-0 overflow-hidden rounded-md">
                    <Image
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                        shimmer(200, 200)
                      )}`}
                      src={image}
                      width={200}
                      height={200}
                      alt=""
                      className="h-[10rem] w-full object-fit object-center"
                    />
                  </span>
                  {imageIndex === selectedImage && (
                    <span
                      className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-udua-orange-primary ring-offset-2"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <Splide
              options={{
                fixedWidth: "12rem",
                fixedHeight: "9rem",
                gap: "1rem",
                type: "slide",
                rewind: false,
                focus: 0,
                autoplay: false,
                speed: 1000,
                interval: 5000,
                height: "10rem",
                arrows: true,
                pagination: false,
                omitEnd: true,
                classes: {
                  // Add classes for arrows.
                  arrows: "splide__arrows splide-next",
                  prev: "splide__arrow--prev splide-next",
                  next: "splide__arrow--next splide-next",
                },
              }}
              className="flex justify-evenly"
              aria-label="Reviews from Users"
            >
              {product.author && (
                <SplideSlide>
                  <div className="h-full flex flex-col items-center p-2">
                    <Image
                      data-splide-lazy="path-to-the-image"
                      src={`/author-sign-svgrepo-com.svg`}
                      width={30}
                      height={30}
                      alt="Image 1"
                      className="w-30 h-30 pt-3"
                    />
                    <div className="pt-2 text-center">
                      <p className=" text-sm">Author</p>
                      <p
                        className="font-semibold"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: 1, // Limits the text to 3 lines
                          maxHeight: "4.5em", // Adjust this based on the number of lines and line height
                          lineHeight: "1.5em", // Adjust based on font size for accurate height control
                        }}
                      >
                        {product.author}
                      </p>
                    </div>
                  </div>
                </SplideSlide>
              )}

              {product.language && (
                <SplideSlide>
                  <div className="h-full flex flex-col items-center p-2">
                    <Image
                      data-splide-lazy="path-to-the-image"
                      src={`/language-svgrepo-com.svg`}
                      width={30}
                      height={30}
                      alt="Image 1"
                      className="w-30 h-30 pt-3"
                    />
                    <div className="pt-2 text-center">
                      <p className=" text-sm">Laguage</p>
                      <p
                        className="font-semibold"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: 1, // Limits the text to 3 lines
                          maxHeight: "4.5em", // Adjust this based on the number of lines and line height
                          lineHeight: "1.5em", // Adjust based on font size for accurate height control
                        }}
                      >
                        {product.language}
                      </p>
                    </div>
                  </div>
                </SplideSlide>
              )}

              {product.publisher && (
                <SplideSlide>
                  <div className="h-full flex flex-col items-center p-2">
                    <Image
                      data-splide-lazy="path-to-the-image"
                      src={`/office-building-svgrepo-com.svg`}
                      width={30}
                      height={30}
                      alt="Image 1"
                      className="w-30 h-30 pt-3"
                    />
                    <div className="pt-2 text-center">
                      <p className=" text-sm">Publisher</p>
                      <p
                        className="font-semibold"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: 1, // Limits the text to 3 lines
                          maxHeight: "4.5em", // Adjust this based on the number of lines and line height
                          lineHeight: "1.5em", // Adjust based on font size for accurate height control
                        }}
                      >
                        {product.publisher}
                      </p>
                    </div>
                  </div>
                </SplideSlide>
              )}

              {product.isbn && (
                <SplideSlide>
                  <div className="h-full flex flex-col items-center p-2">
                    <Image
                      data-splide-lazy="path-to-the-image"
                      src={`/bar-code-svgrepo-com.svg`}
                      width={30}
                      height={30}
                      alt="Image 1"
                      className="w-30 h-30 pt-3"
                    />
                    <div className="pt-2 text-center">
                      <p className=" text-sm">ISBN</p>
                      <p
                        className="font-semibold"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: 1, // Limits the text to 3 lines
                          maxHeight: "4.5em", // Adjust this based on the number of lines and line height
                          lineHeight: "1.5em", // Adjust based on font size for accurate height control
                        }}
                      >
                        {product.isbn}
                      </p>
                    </div>
                  </div>
                </SplideSlide>
              )}
            </Splide>
          </div>

          <div className=" w-full">
            <button
              className="text-xs text-center w-full"
              onClick={toggleVisibility}
            >
              {isVisible ? "See Less" : "See More"}
            </button>

            {isVisible && (
              <div className="hidden-div">
                {/* <p>category: {product.category}</p>
                <p>Sub-category: {product.subcategory}</p> */}
                <p>File Size: {product.fileSize} MB</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
