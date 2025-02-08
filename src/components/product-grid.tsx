"use client";

import Image from "next/image";
import Link from "next/link";
import { BellIcon, XCircle } from "lucide-react";
import { shimmer, toBase64 } from "@/lib/image";
import { addCommasToNumber } from "@/lib/utils";
import type { ForProductGrid } from "@/types";

/**
 * ProductGrid Component - Displays a grid of products with optimized rendering
 *
 * Key Features:
 * - Accessible product cards with semantic HTML
 * - Optimized image loading and placeholders
 * - Price formatting and error handling
 * - Responsive grid layout
 * - SEO-friendly product links
 */
export function ProductGrid({ products }: ForProductGrid) {
  // Early return for empty state
  if (products.length === 0) {
    return (
      <div
        className="mx-auto grid h-96 w-full place-items-center rounded-md border-2 border-dashed bg-gray-50 py-10 text-center dark:bg-gray-900"
        role="alert"
        aria-live="polite"
      >
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
    <div>
      {/* Accessible Announcement Banner */}
      <div
        className="w-full py-2 border border-udua-orange-primary rounded text-xs flex gap-2 items-center px-4"
        role="region"
        aria-label="Quality assurance announcement"
      >
        <BellIcon
          width={15}
          height={15}
          className="text-udua-orange-primary"
          aria-hidden="true"
        />
        <div className="scrolling-container" aria-live="polite">
          <p className="scrolling-text text-udua-orange-primary">
            All products on Udua are verified to meet high-quality standards,
            ensuring reliability and customer satisfaction.
          </p>
        </div>
      </div>

      {/* Optimized Product Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-3 md:grid-cols-4 lg:gap-x-8 lg:grid-cols-5 pt-4">
        {products.map((product) => {
          const isPhysicalProduct = product.productType === "Physical Product";
          const productUrl = `/product/${product._id}`;
          const price = isPhysicalProduct
            ? product.price ?? product.sizes?.[0]?.price
            : product.price;

          return (
            <article
              key={product._id}
              className="group text-sm"
              aria-labelledby={`product-${product._id}-title`}
            >
              <Link
                href={productUrl}
                className="block"
                prefetch={false} // Optimize navigation performance
              >
                {/* Product Image Container */}
                <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
                  <Image
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      shimmer(300, 150)
                    )}`}
                    src={
                      isPhysicalProduct
                        ? product.images[0]
                        : product.coverIMG[0]
                    }
                    alt={isPhysicalProduct ? product.name : product.title}
                    width={300}
                    height={150}
                    className="h-full w-full object-cover object-center"
                    quality={85} // Reduced for better performance
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    loading="lazy"
                  />
                </div>

                {/* Product Details */}
                <h3
                  id={`product-${product._id}-title`}
                  className="mt-1 font-medium line-clamp-1"
                >
                  {isPhysicalProduct ? product.name : product.title}
                </h3>
                {price !== null && (
                  <p className="mt-1 font-medium" aria-label="Product price">
                    &#8358; {addCommasToNumber(price)}
                  </p>
                )}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { BellIcon, XCircle } from "lucide-react";
// import { shimmer, toBase64 } from "@/lib/image";
// import { addCommasToNumber } from "@/lib/utils";
// import { ForProductGrid } from "@/types";

// export function ProductGrid({ products }: ForProductGrid) {
//   if (products.length === 0) {
//     return (
//       <div className="mx-auto grid h-96 w-full place-items-center rounded-md border-2 border-dashed bg-gray-50 py-10 text-center dark:bg-gray-900">
//         <div>
//           <XCircle className="mx-auto h-10 w-10 text-gray-500 dark:text-gray-200" />
//           <h1 className="mt-2 text-xl font-bold tracking-tight text-gray-500 dark:text-gray-200 sm:text-2xl">
//             No products found
//           </h1>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className=" w-full py-2 border border-udua-orange-primary rounded text-xs flex gap-2 items-center px-4">
//         <span>
//           <BellIcon
//             width={15}
//             height={15}
//             className=" text-udua-orange-primary"
//           />
//         </span>{" "}
//         <div className="scrolling-container">
//           <p className="scrolling-text text-udua-orange-primary">
//             All products on Udua are verified to meet high-quality standards,
//             ensuring reliability and customer satisfaction.
//           </p>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-3 md:grid-cols-4 lg:gap-x-8 lg:grid-cols-5 pt-4">
//         {products.map((product) => (
//           <Link
//             key={product._id}
//             href={`/product/${product._id}`}
//             className="group text-sm"
//           >
//             {product.productType === "Physical Product" ? (
//               <>
//                 <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
//                   <Image
//                     placeholder="blur"
//                     blurDataURL={`data:image/svg+xml;base64,${toBase64(
//                       shimmer(300, 150)
//                     )}`}
//                     src={product.images[0]}
//                     alt={product.name}
//                     width={300}
//                     height={150}
//                     className="h-full w-full object-cover object-center"
//                     quality={90}
//                   />
//                 </div>

//                 <h3
//                   className="mt-1 font-medium"
//                   style={{
//                     display: "-webkit-box",
//                     WebkitBoxOrient: "vertical",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     WebkitLineClamp: 1, // Limits the text to 3 lines
//                     maxHeight: "1.5em", // Adjust this based on the number of lines and line height
//                     lineHeight: "1.5em", // Adjust based on font size for accurate height control
//                   }}
//                 >
//                   {product.name}
//                 </h3>
//                 {product.price !== null ? (
//                   <p className="mt-1 font-medium">
//                     &#8358; {addCommasToNumber(product.price as number)}{" "}
//                   </p>
//                 ) : (
//                   <p className="mt-1 font-medium">
//                     &#8358; {addCommasToNumber(product.sizes![0].price)}{" "}
//                   </p>
//                 )}
//               </>
//             ) : (
//               <>
//                 <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
//                   <Image
//                     placeholder="blur"
//                     blurDataURL={`data:image/svg+xml;base64,${toBase64(
//                       shimmer(300, 150)
//                     )}`}
//                     src={product.coverIMG[0]}
//                     alt={product.title}
//                     width={300}
//                     height={150}
//                     className="h-full w-full object-cover object-center"
//                     quality={90}
//                   />
//                 </div>

//                 <h3
//                   className="mt-1 font-medium"
//                   style={{
//                     display: "-webkit-box",
//                     WebkitBoxOrient: "vertical",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     WebkitLineClamp: 1, // Limits the text to 3 lines
//                     maxHeight: "1.5em", // Adjust this based on the number of lines and line height
//                     lineHeight: "1.5em", // Adjust based on font size for accurate height control
//                   }}
//                 >
//                   {product.title}
//                 </h3>
//                 <p className="mt-1 font-medium">
//                   &#8358; {addCommasToNumber(product.price as number)}{" "}
//                 </p>
//               </>
//             )}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }
