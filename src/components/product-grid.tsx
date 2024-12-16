"use client";

import Image from "next/image";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { shimmer, toBase64 } from "@/lib/image";
import { addCommasToNumber } from "@/lib/utils";
import { ForProductGrid } from "@/types";

export function ProductGrid({ products }: ForProductGrid) {
  if (products.length === 0) {
    return (
      <div className="mx-auto grid h-96 w-full place-items-center rounded-md border-2 border-dashed bg-gray-50 py-10 text-center dark:bg-gray-900">
        <div>
          <XCircle className="mx-auto h-10 w-10 text-gray-500 dark:text-gray-200" />
          <h1 className="mt-2 text-xl font-bold tracking-tight text-gray-500 dark:text-gray-200 sm:text-2xl">
            No products found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-3 lg:gap-x-8">
      {products.map((product) => (
        <Link
          key={product._id}
          href={`/products/${product._id}`}
          className="group text-sm"
        >
          {product.type === "Physical Product" ? (
            <>
              <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
                <Image
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    shimmer(300, 150)
                  )}`}
                  src={product.productImage[0]}
                  alt={product.productName}
                  width={300}
                  height={150}
                  className="h-full w-full object-cover object-center"
                  quality={90}
                />
              </div>

              <h3
                className="mt-1 font-medium"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  WebkitLineClamp: 1, // Limits the text to 3 lines
                  maxHeight: "1.5em", // Adjust this based on the number of lines and line height
                  lineHeight: "1.5em", // Adjust based on font size for accurate height control
                }}
              >
                {product.productName}
              </h3>
              <p className="mt-1 font-medium">
                &#8358; {addCommasToNumber(product.productPrice as number)}{" "}
              </p>
            </>
          ) : (
            <>
              <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
                <Image
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    shimmer(300, 150)
                  )}`}
                  src={product.coverIMG[0]}
                  alt={product.title}
                  width={300}
                  height={150}
                  className="h-full w-full object-cover object-center"
                  quality={90}
                />
              </div>

              <h3
                className="mt-1 font-medium"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  WebkitLineClamp: 1, // Limits the text to 3 lines
                  maxHeight: "1.5em", // Adjust this based on the number of lines and line height
                  lineHeight: "1.5em", // Adjust based on font size for accurate height control
                }}
              >
                {product.title}
              </h3>
              <p className="mt-1 font-medium">
                &#8358; {addCommasToNumber(product.price as number)}{" "}
              </p>
            </>
          )}
        </Link>
      ))}
    </div>
  );
}
