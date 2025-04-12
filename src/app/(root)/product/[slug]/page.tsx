/**
 * Product Detail Page
 *
 * This page displays comprehensive information about a single product.
 * It fetches product data based on the URL slug and renders different sections
 * including product gallery, information, specifications, and reviews.
 *
 * Features:
 * - SEO optimization with structured data and metadata
 * - Responsive layout for all device sizes
 * - Conditional rendering based on product type (physical vs digital)
 * - Skeleton loading states during data fetching
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductDetailSkeleton } from "@/components/skeletons/product-page-skeleton";

// Data fetching
import { fetchProductData } from "@/lib/actions/product.action";
import { formatNaira } from "@/lib/utils";
import { ProductDetailPage } from "@/components/product-detail-page";
import ProductNotFoundPage from "@/components/product-not-found";

// Types
interface Props {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate metadata for the product page
 * This improves SEO by providing accurate page titles, descriptions, and OpenGraph images
 */
export async function generateMetadata(props: Props) {
  const params = await props.params;
  const product = await fetchProductData(params.slug);

  if (!product?.productData) {
    return {
      title: "Product Not Found | Udua Store",
      description: "The requested product could not be found.",
    };
  }

  const productName = product.productData.name || product.productData.title;
  const productImage =
    product.productData.images?.[0] || product.productData.coverIMG?.[0];
  const productDescription =
    product.productData.description?.substring(0, 160) ||
    "Discover high-quality products on Udua";

  return {
    title: `${productName} | Udua Store`,
    description: productDescription,
    openGraph: {
      title: productName,
      description: productDescription,
      images: [productImage],
      type: "website",
    },
    alternates: {
      canonical: `/product/${params.slug}`,
    },
  };
}

/**
 * Product Detail Page Component
 */
export default async function ProductPage(props: Props) {
  const params = await props.params;

  // Fetch product data with error handling
  let product = null;
  try {
    product = await fetchProductData(params.slug);
  } catch (error) {
    console.error("Product fetch error:", error);
    return notFound();
  }

  /**
   * Render error state if product not found
   * Handle case where product data is missing
   */

  if (!product?.productData) {
    return <ProductNotFoundPage />;
  }

  const isPhysicalProduct =
    product.productData.productType === "physicalproducts";

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": isPhysicalProduct ? "Product" : "Book",
            name: product.productData.name || product.productData.title,
            image: product.productData.images || product.productData.coverIMG,
            description: product.productData.description,
            offers: {
              "@type": "Offer",
              priceCurrency: "NGN",
              price: formatNaira(product.productData.price),
              availability: "https://schema.org/InStock",
            },
            ...(isPhysicalProduct
              ? {}
              : {
                  author: product.productData.author,
                  publisher: product.productData.publisher,
                  isbn: product.productData.isbn,
                }),
          })}
        </script>

        <ProductDetailPage
          item={product.productData}
          isLikedProduct={product.isLikedProduct}
        />
      </main>
    </Suspense>
  );
}
