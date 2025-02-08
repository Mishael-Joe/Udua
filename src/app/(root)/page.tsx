/**
 * Home Page - E-Commerce Landing Page
 *
 * Key Features:
 * - Full-width product grid layout
 * - Enhanced visual hierarchy
 * - Optimized spacing and responsiveness
 * - SEO-optimized structure
 */

import { Suspense } from "react";
import { fetchProductsAndEBooks } from "@/lib/actions/product.action";
import SkeletonLoader from "@/lib/loaders/skeletonLoader";
import { ProductGrid } from "@/components/product-grid";
import type { CombinedProduct } from "@/types";

// Revalidate page every hour for fresh content
export const revalidate = 3600;

type Props = {
  searchParams: Promise<{
    categories?: string[] | string;
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    inStock?: boolean;
    minRating?: number;
    dateFrom?: string | Date;
    dateTo?: string | Date;
  }>;
};

export default async function Home(props: Props) {
  const searchParams = await props.searchParams;
  const {
    categories,
    page,
    limit,
    minPrice,
    maxPrice,
    search,
    sortBy,
    sortOrder,
    inStock,
    minRating,
    dateFrom,
    dateTo,
  } = searchParams;
  // Convert categories string to an array of strings
  const categoriesArray = categories ? (categories as string).split(" ") : [];
  // console.log(`categoriesArray`, categoriesArray);

  // @ts-ignore
  const products: CombinedProduct[] = await fetchProductsAndEBooks(
    categoriesArray,
    page,
    limit,
    minPrice,
    maxPrice,
    search,
    sortBy,
    sortOrder,
    inStock,
    minRating
    // dateFrom,
    // dateTo
  );
  return (
    <main className="min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
      {/* Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product._id}`,
            name: product.name || product.title,
            image: product.images?.[0] || product.coverIMG?.[0],
          })),
        })}
      </script>

      {/* Promotional Video Section */}
      <section aria-label="Current promotions" className="mb-12">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            aria-label="Quality assurance video"
            title="Udua Quality Promise"
            poster="/video-poster.jpg"
          >
            <source src="/T&Cs Apply.mp4" type="video/mp4" />
            <source src="/T&Cs Apply.webm" type="video/webm" />
            <track
              kind="captions"
              srcLang="en"
              src="/captions.vtt"
              label="English captions"
            />
            <p className="sr-only">
              All Udua products undergo rigorous quality checks to ensure
              customer satisfaction.
            </p>
          </video>
        </div>
      </section>

      {/* Main Product Grid Area */}
      <section aria-labelledby="products-heading" className="pb-16">
        <h1 id="products-heading" className="sr-only">
          Udua Product Collection
        </h1>

        <div className="border-t border-gray-200 pt-8">
          <Suspense fallback={<SkeletonLoader />}>
            <ProductGrid products={products} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

// import HeroBanners from "@/components/banners";
// import LeftSidebar from "@/components/left-sidebar";
// import { ProductGrid } from "@/components/product-grid";
// import { fetchProductsAndEBooks } from "@/lib/actions/product.action";
// import SkeletonLoader from "@/lib/loaders/skeletonLoader";
// import { CombinedProduct, Product } from "@/types";
// import Image from "next/image";
// import { Suspense } from "react";

// type Props = {
//   searchParams: {
//     categories?: string[] | string;
//     page?: number;
//     limit?: number;
//     minPrice?: number;
//     maxPrice?: number;
//     search?: string;
//     sortBy?: string;
//     sortOrder?: "asc" | "desc";
//     inStock?: boolean;
//     minRating?: number;
//     dateFrom?: string | Date;
//     dateTo?: string | Date;
//   };
// };

// export default async function Home({ searchParams }: Props) {
//   const {
//     categories,
//     page,
//     limit,
//     minPrice,
//     maxPrice,
//     search,
//     sortBy,
//     sortOrder,
//     inStock,
//     minRating,
//     dateFrom,
//     dateTo,
//   } = searchParams;
//   // Convert categories string to an array of strings
//   const categoriesArray = categories ? (categories as string).split(" ") : [];
//   // console.log(`categoriesArray`, categoriesArray);

//   // @ts-ignore
// const products: CombinedProduct[] = await fetchProductsAndEBooks(
//   categoriesArray,
//   page,
//   limit,
//   minPrice,
//   maxPrice,
//   search,
//   sortBy,
//   sortOrder,
//   inStock,
//   minRating
//   // dateFrom,
//   // dateTo
// );

//   // console.log("combinedResults", products)

//   return (
//     // grid gap-4 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]
//     <main className="min-h-screen mx-auto max-w-[78rem] px-2.5 md:px-4 pt-4">
//       <div className="">
//         {/* <HeroBanners /> */}
//         <div className="">
//           <video
//             autoPlay
//             loop
//             muted
//             width="800"
//             height="300"
//             src="/T&Cs Apply.mp4"
//             className=" aspect-video"
//           ></video>
//         </div>
//         {/* <div className=" hidden lg:block basis-1/3">
//           <div className="grid gap-4">
//             <div>
//               <Image
//                 src={`/cloths.jpg`}
//                 width={270}
//                 height={250}
//                 alt=""
//                 className=" aspect-auto"
//               />
//             </div>
//             <div>
//               <Image
//                 src={`/cloths.jpg`}
//                 width={270}
//                 height={250}
//                 alt=""
//                 className=" aspect-auto"
//               />
//             </div>
//           </div>
//           <h1 className=" font-semibold text-xl">Shop deals in fashion</h1>
//         </div> */}
//       </div>

//       <div className="py-4">
//         <Suspense fallback={<SkeletonLoader />}>
//           <ProductGrid products={products} />
//         </Suspense>
//       </div>
//     </main>
//   );
// }

// ngrok http 3000
