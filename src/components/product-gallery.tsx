"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { shimmer, toBase64 } from "@/lib/image";
import type { ForProductGallery } from "@/types";
import { Heart, Loader, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { addProductToRecentlyViewed } from "@/lib/helpers/recently-viewed";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";

// Constants for consistent image handling
const ASPECT_RATIO = 1; // 1:1 square aspect ratio for all product images
const IMAGE_QUALITY = 90;

export function ProductGallery({ product, isLikedProduct }: ForProductGallery) {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [like, setLike] = useState(isLikedProduct);
  console.log("isLikedProduct", isLikedProduct);
  const images =
    product.productType === "physicalproducts"
      ? product.images
      : product.coverIMG;

  useEffect(() => {
    addProductToRecentlyViewed(product._id);
  }, [product._id]);

  // Initialize GLightbox on component mount
  useEffect(() => {
    const lightbox = GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
    });

    return () => {
      lightbox.destroy();
    };
  }, []);

  // Updated client-side usage
  const handleWishlistAction = async (actionType: "add" | "remove") => {
    setIsLoading(true);
    if (actionType === "add") {
      try {
        const response = await fetch("/api/wishlist/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product._id,
            productType: product.productType,
          }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error);
        setLike(true);

        // Handle successful response
        toast({ title: "Success", description: data.message });
      } catch (error) {
        console.error("Wishlist error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await fetch("/api/wishlist/remove", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product._id,
            productType: product.productType,
          }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error);
        setLike(false);
        toast({ title: "Success", description: data.message });
      } catch (error) {
        console.error("Removal failed:", error);
        // Show error toast
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col md:sticky lg:top-14">
      <div className="relative">
        {/* Wishlist and Store buttons */}
        <button
          aria-label={like ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => handleWishlistAction(like ? "remove" : "add")}
          className="absolute z-10 top-4 left-4 md:top-6 md:left-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="w-8 h-8 p-1 animate-spin text-white bg-black/20 rounded-full" />
          ) : (
            <Heart
              fill={like ? "currentColor" : "none"}
              className={`w-8 h-8 p-1 rounded-full ${
                like ? "text-red-500" : "text-black bg-white/80"
              }`}
            />
          )}
        </button>

        {product.productType === "physicalproducts" && (
          <Link
            href={`/brand/${product.storeID}`}
            className="absolute z-10 top-4 right-4 md:top-6 md:right-6"
          >
            <Store className="w-8 h-8 p-1 rounded-full text-black bg-white/80" />
          </Link>
        )}

        {/* Main product image with consistent aspect ratio */}
        <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden">
          <a
            href={images[selectedImage]}
            className="glightbox block h-full w-full"
            aria-label="Enlarge image"
          >
            <Image
              priority
              src={images[selectedImage] || "/placeholder.svg"}
              alt={`Main display for ${product.name || product.title}`}
              fill
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(600, 600)
              )}`}
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
              quality={IMAGE_QUALITY}
            />
          </a>
        </div>
      </div>

      {/* Thumbnails with consistent aspect ratio */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-4">
        {images.map((image, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
              idx === selectedImage
                ? "border-udua-orange-primary"
                : "border-transparent hover:border-gray-300"
            }`}
            aria-label={`Select image ${idx + 1}`}
            aria-current={idx === selectedImage ? "true" : "false"}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Thumbnail ${idx + 1}`}
              fill
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(150, 150)
              )}`}
              className="object-cover"
              sizes="(max-width: 640px) 25vw, 150px"
              loading={idx > 2 ? "lazy" : "eager"}
              quality={IMAGE_QUALITY}
            />
          </button>
        ))}
      </div>

      {/* Digital product details */}
      {product.productType === "digitalproducts" && (
        <div className="mt-6 space-y-4">
          {/* Your digital product details */}
        </div>
      )}
    </div>
  );
}
