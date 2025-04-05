"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BellIcon, XCircle, Zap, Percent, Tag } from "lucide-react";
import { shimmer, toBase64 } from "@/lib/image";
import { formatNaira } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ForProductGrid } from "@/types";

interface DealInfo {
  _id: string;
  dealType:
    | "percentage"
    | "fixed"
    | "free_shipping"
    | "flash_sale"
    | "buy_x_get_y";
  value: number;
}

/**
 * ProductGrid Component - Displays a grid of products with optimized rendering
 *
 * Key Features:
 * - Accessible product cards with semantic HTML
 * - Optimized image loading and placeholders
 * - Price formatting and error handling
 * - Responsive grid layout
 * - SEO-friendly product links
 * - Deal information and discounted prices
 */
export function ProductGrid({ products }: ForProductGrid) {
  const [productDeals, setProductDeals] = useState<
    Record<string, DealInfo | null>
  >({});

  // Fetch deals for all products
  useEffect(() => {
    const fetchDealsForProducts = async () => {
      const dealPromises = products.map(async (product) => {
        try {
          const response = await fetch(`/api/products/${product._id}/deals`);
          const data = await response.json();

          if (data.success && data.hasDeals) {
            return { productId: product._id, deal: data.deal };
          }
          return { productId: product._id, deal: null };
        } catch (error) {
          console.error(
            `Error fetching deal for product ${product._id}:`,
            error
          );
          return { productId: product._id, deal: null };
        }
      });

      const results = await Promise.all(dealPromises);

      const dealsMap = results.reduce((acc, { productId, deal }) => {
        acc[productId] = deal;
        return acc;
      }, {} as Record<string, DealInfo | null>);

      setProductDeals(dealsMap);
    };

    fetchDealsForProducts();
  }, [products]);

  // Calculate discounted price
  const calculateDiscountedPrice = (
    originalPrice: number,
    deal: DealInfo | null
  ) => {
    if (!deal) return originalPrice;

    if (deal.dealType === "percentage" || deal.dealType === "flash_sale") {
      return originalPrice - originalPrice * (deal.value / 100);
    } else if (deal.dealType === "fixed") {
      return Math.max(0, originalPrice - deal.value);
    }

    return originalPrice;
  };

  // Get deal badge
  const getDealBadge = (deal: DealInfo | null) => {
    if (!deal) return null;

    let icon = null;
    let text = "";

    switch (deal.dealType) {
      case "percentage":
        icon = <Percent className="h-3 w-3" />;
        text = `${deal.value}% OFF`;
        break;
      case "fixed":
        icon = <Tag className="h-3 w-3" />;
        text = `${formatNaira(deal.value)} OFF`;
        break;
      case "flash_sale":
        icon = <Zap className="h-3 w-3" />;
        text = `${deal.value}% OFF`;
        break;
      default:
        return null;
    }

    return (
      <Badge
        variant="destructive"
        className="absolute top-2 left-2 z-10 flex items-center gap-1"
      >
        {icon}
        {text}
      </Badge>
    );
  };

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
          const isPhysicalProduct = product.productType === "physicalproducts";
          const productUrl = `/product/${product._id}`;
          const basePrice = isPhysicalProduct
            ? product.price ?? product.sizes?.[0]?.price
            : product.price;

          const deal = productDeals[product._id] || null;
          const discountedPrice = calculateDiscountedPrice(basePrice, deal);
          const hasDeal = deal !== null;

          return (
            <article
              key={product._id}
              className="group text-sm relative"
              aria-labelledby={`product-${product._id}-title`}
            >
              <Link
                href={productUrl}
                className="block"
                prefetch={false} // Optimize navigation performance
              >
                {/* Product Image Container */}
                <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
                  {getDealBadge(deal)}
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

                {basePrice !== null && (
                  <div className="mt-1 flex items-center gap-2">
                    <p
                      className={`font-bold ${
                        hasDeal ? "text-udua-orange-primary" : ""
                      }`}
                      aria-label="Product price"
                    >
                      {formatNaira(discountedPrice)}
                    </p>
                    {hasDeal && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatNaira(basePrice)}
                      </p>
                    )}
                  </div>
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
// import { formatNaira } from "@/lib/utils";
// import type { ForProductGrid } from "@/types";

// /**
//  * ProductGrid Component - Displays a grid of products with optimized rendering
//  *
//  * Key Features:
//  * - Accessible product cards with semantic HTML
//  * - Optimized image loading and placeholders
//  * - Price formatting and error handling
//  * - Responsive grid layout
//  * - SEO-friendly product links
//  */
// export function ProductGrid({ products }: ForProductGrid) {
//   // Early return for empty state
//   if (products.length === 0) {
//     return (
//       <div
//         className="mx-auto grid h-96 w-full place-items-center rounded-md border-2 border-dashed bg-gray-50 py-10 text-center dark:bg-gray-900"
//         role="alert"
//         aria-live="polite"
//       >
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
//       {/* Accessible Announcement Banner */}
//       <div
//         className="w-full py-2 border border-udua-orange-primary rounded text-xs flex gap-2 items-center px-4"
//         role="region"
//         aria-label="Quality assurance announcement"
//       >
//         <BellIcon
//           width={15}
//           height={15}
//           className="text-udua-orange-primary"
//           aria-hidden="true"
//         />
//         <div className="scrolling-container" aria-live="polite">
//           <p className="scrolling-text text-udua-orange-primary">
//             All products on Udua are verified to meet high-quality standards,
//             ensuring reliability and customer satisfaction.
//           </p>
//         </div>
//       </div>

//       {/* Optimized Product Grid */}
//       <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-3 md:grid-cols-4 lg:gap-x-8 lg:grid-cols-5 pt-4">
//         {products.map((product) => {
//           const isPhysicalProduct = product.productType === "physicalproducts";
//           const productUrl = `/product/${product._id}`;
//           const price = isPhysicalProduct
//             ? product.price ?? product.sizes?.[0]?.price
//             : product.price;

//           return (
//             <article
//               key={product._id}
//               className="group text-sm"
//               aria-labelledby={`product-${product._id}-title`}
//             >
//               <Link
//                 href={productUrl}
//                 className="block"
//                 prefetch={false} // Optimize navigation performance
//               >
//                 {/* Product Image Container */}
//                 <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
//                   <Image
//                     placeholder="blur"
//                     blurDataURL={`data:image/svg+xml;base64,${toBase64(
//                       shimmer(300, 150)
//                     )}`}
//                     src={
//                       isPhysicalProduct
//                         ? product.images[0]
//                         : product.coverIMG[0]
//                     }
//                     alt={isPhysicalProduct ? product.name : product.title}
//                     width={300}
//                     height={150}
//                     className="h-full w-full object-cover object-center"
//                     quality={85} // Reduced for better performance
//                     sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
//                     loading="lazy"
//                   />
//                 </div>

//                 {/* Product Details */}
//                 <h3
//                   id={`product-${product._id}-title`}
//                   className="mt-1 font-medium line-clamp-1"
//                 >
//                   {isPhysicalProduct ? product.name : product.title}
//                 </h3>
//                 {price !== null && (
//                   <p className="mt-1 font-bold" aria-label="Product price">
//                     {formatNaira(price)}
//                   </p>
//                 )}
//               </Link>
//             </article>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
