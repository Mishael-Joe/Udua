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
    product.productType === "physicalproducts"
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
    if (product.productType !== "digitalproducts") return null;

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
        {product.productType === "physicalproducts" && renderStoreButton()}
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
