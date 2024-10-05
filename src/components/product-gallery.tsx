"use client";

import { useState } from "react";
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

type Response = {
  status: number;
  message: any;
}

export function ProductGallery({ product, isLikedProduct }: ForProductGallery) {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleWishlist = async (val: string) => {
    try {
      if (val === "addToWishlist") {
        setIsLoading(true);
        const response: Response = await addToWishlist(product._id!);
        // console.log('res', response)

        if (response.message === 'User not authenticated') {
          router.push('/sign-in')
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
        // console.log('res', response)

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
    <div className="flex flex-col-reverse">
      {/* Image Grid */}
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
                  className="pointer-events-none absolute inset-0 rounded-md ring-4 ring-indigo-500 ring-offset-2"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </ul>
      </div>

      {/* Main Image */}
      <div className="aspect-h-1 aspect-w-1 w-full p-3.5 sm:p-0 relative">
        {isLoading && (
          <button>
            <Loader className="w-10 h-10 z-10 p-1 top-12 left-6 md:top-10 md:left-3 absolute animate-spin" />
          </button>
        )}
        {isLikedProduct && !isLoading && (
          <button onClick={() => handleWishlist("removeFromWishlist")}>
            <Heart className=" text-white rounded p-1 top-12 left-6 md:top-10 md:left-3 bg-red-500 w-10 h-10 z-10 absolute" />
          </button>
        )}
        {!isLikedProduct && !isLoading && (
          <button onClick={() => handleWishlist("addToWishlist")}>
            <Heart className=" rounded p-1 top-12 left-6 md:top-10 md:left-3 text-black bg-slate-100 w-10 h-10 z-10 absolute" />
          </button>
        )}
        <Link href={`/brand/${product.storeID}`}>
        <button>
            <Store className=" rounded p-1 top-12 right-6 md:top-10 md:right-3 text-black bg-slate-100 w-10 h-10 z-10 absolute" />
          </button>
        </Link>
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
          className="h-96 w-full border-2 border-gray-200 object-cover object-center shadow-sm dark:border-gray-800 sm:rounded-lg"
        />
      </div>
    </div>
  );
}
