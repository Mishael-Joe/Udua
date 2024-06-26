"use client";

import { useState } from "react";
import Image from "next/image";
import { shimmer, toBase64 } from "@/lib/image";
import { ForProductGallery } from "@/types";

export function ProductGallery({ product }: ForProductGallery) {
  const [selectedImage, setSelectedImage] = useState(0);
  return (
    <div className="flex flex-col-reverse">
      {/* Image Grid */}
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <ul className="grid grid-cols-4 gap-6">
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
      <div className="aspect-h-1 aspect-w-1 w-full p-3.5 sm:p-0">
        <Image
          priority
          // src={urlForImage(product.images[selectedImage]).url()}
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
