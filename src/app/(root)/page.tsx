/**
 * Home Page - E-Commerce Landing Page
 *
 * Key Features:
 * - Full-width product grid layout
 * - Enhanced visual hierarchy
 * - Optimized spacing and responsiveness
 * - SEO-optimized structure
 */

/*
 *  All monetary values are stored in kobo so as to avoid Floating-Point Errors in JavaScript.
 */
import { Suspense } from "react";
import { fetchProductsAndEBooks } from "@/lib/actions/product.action";
import SkeletonLoader from "@/lib/loaders/skeletonLoader";
import { ProductGrid } from "@/components/product-grid";
import type { CombinedProduct } from "@/types";
import HeadBanner from "@/components/banner";
import ProductFilters from "@/components/product-filters";
import DealsSection from "@/components/deals/deals-section";

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
    page = 1,
    limit = 12,
    minPrice,
    maxPrice,
    search,
    sortBy,
    sortOrder = "desc",
    inStock,
    minRating,
    dateFrom,
    dateTo,
  } = searchParams;

  // Convert categories to an array if it's a string
  const categoriesArray =
    typeof categories === "string"
      ? categories.split(" ")
      : Array.isArray(categories)
      ? categories
      : [];

  // Fetch products with filters
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
    // dateTo,
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
      <section aria-label="Current promotions" className="mb-6">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
          <HeadBanner />
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

      {/* Deals Section */}
      {/* <Suspense
        fallback={
          <div className="h-96 bg-muted animate-pulse rounded-lg mb-8"></div>
        }
      >
        <DealsSection showCarousel={true} />
      </Suspense> */}
      {/* This feature is under construction and it is comming soon. #-DEALS */}

      {/* Main Product Grid Area */}
      <section aria-labelledby="products-heading" className="pb-16">
        <h1 id="products-heading" className="sr-only">
          Udua Product Collection
        </h1>

        {/* Product Filters */}
        {(search ||
          categories ||
          minRating ||
          inStock ||
          minPrice ||
          maxPrice) && <ProductFilters products={products} />}

        {/* Product Grid */}
        {!(
          search ||
          categories ||
          minRating ||
          inStock ||
          minPrice ||
          maxPrice
        ) && (
          <div className="border-t border-udua-deep-gray-primary/20 pt-6">
            <Suspense fallback={<SkeletonLoader />}>
              <ProductGrid products={products} />
            </Suspense>
          </div>
        )}
      </section>
    </main>
  );
}

// ngrok http 3000
// rabbitmq-server.bat
