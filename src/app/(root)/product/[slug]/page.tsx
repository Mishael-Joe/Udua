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
import { Separator } from "@/components/ui/separator";

// Component imports
import { ProductGallery } from "@/components/product-gallery";
import { ProductInfo } from "@/components/product-info";
import { ProductSpecification } from "@/components/product-specification";
import ProductReviewComponent from "@/components/product-review";
import { ProductPageSkeleton } from "@/components/skeletons/product-page-skeleton";

// Data fetching
import { fetchProductData } from "@/lib/actions/product.action";

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

  // Handle case where product data is missing
  if (!product?.productData) {
    return notFound();
  }

  const isPhysicalProduct =
    product.productData.productType === "physicalproducts";

  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
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
              price: product.productData.price,
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

        <article className="mx-auto max-w-6xl">
          {/* Breadcrumbs */}
          {/* <nav className="mb-6 text-sm text-muted-foreground">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li>/</li>
              <li>
                <a
                  href={isPhysicalProduct ? "/shop" : "/ebooks"}
                  className="hover:text-foreground transition-colors"
                >
                  {isPhysicalProduct ? "Shop" : "E-Books"}
                </a>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium truncate max-w-[200px]">
                {product.productData.name || product.productData.title}
              </li>
            </ol>
          </nav> */}

          {/* Product Main Section */}
          <section
            aria-labelledby="product-heading"
            className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8"
          >
            <h1 id="product-heading" className="sr-only">
              {product.productData.name || product.productData.title}
            </h1>

            <ProductGallery
              product={product.productData}
              isLikedProduct={product.isLikedProduct}
            />

            <ProductInfo product={product.productData} />
          </section>

          {/* Specifications */}
          {isPhysicalProduct && (
            <section aria-labelledby="specifications-heading" className="mt-16">
              <Separator className="mb-8" />
              <h2
                id="specifications-heading"
                className="text-2xl font-bold mb-6"
              >
                Product Details
              </h2>
              <ProductSpecification product={product.productData} />
            </section>
          )}

          {/* Reviews */}
          {isPhysicalProduct && (
            <section aria-labelledby="reviews-heading" className="mt-16">
              <Separator className="mb-8" />
              <h2 id="reviews-heading" className="text-2xl font-bold mb-6">
                Customer Reviews
              </h2>
              <Suspense
                fallback={
                  <div className="rounded-lg border border-border p-8">
                    <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6"></div>
                    <div className="space-y-4">
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                      <div className="h-4 bg-muted rounded animate-pulse w-4/6"></div>
                    </div>
                  </div>
                }
              >
                <ProductReviewComponent product={product.productData} />
              </Suspense>
            </section>
          )}
        </article>
      </main>
    </Suspense>
  );
}

// import { ProductGallery } from "@/components/product-gallery";
// import { ProductInfo } from "@/components/product-info";
// import { fetchProductData } from "@/lib/actions/product.action";
// import { notFound } from "next/navigation";
// import { ProductSpecification } from "@/components/product-specification";
// import ProductReviewComponent from "@/components/product-review";
// import { Suspense } from "react";

// interface Props {
//   params: Promise<{
//     slug: string;
//   }>;
// }

// export async function generateMetadata(props: Props) {
//   const params = await props.params;
//   const product = await fetchProductData(params.slug);

//   return {
//     title: `${
//       product?.productData.name || product?.productData.title
//     } | Udua Store`,
//     description:
//       product?.productData.description?.substring(0, 160) ||
//       "Discover high-quality products on Udua",
//     openGraph: {
//       images: [
//         product?.productData.images?.[0] || product?.productData.coverIMG?.[0],
//       ],
//     },
//     alternates: {
//       canonical: `/product/${params.slug}`,
//     },
//   };
// }

// export default async function Page(props: Props) {
//   const params = await props.params;
//   let product = null;

//   try {
//     product = await fetchProductData(params.slug);
//   } catch (error) {
//     console.error("Product fetch error:", error);
//     return notFound();
//   }

//   if (!product?.productData) {
//     return notFound();
//   }

//   const isPhysicalProduct =
//     product.productData.productType === "physicalproducts";

//   return (
//     <main className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//       {/* Structured Data for SEO */}
//       <script type="application/ld+json">
//         {JSON.stringify({
//           "@context": "https://schema.org",
//           "@type": isPhysicalProduct ? "Product" : "Book",
//           name: product.productData.name || product.productData.title,
//           image: product.productData.images || product.productData.coverIMG,
//           description: product.productData.description,
//           offers: {
//             "@type": "Offer",
//             priceCurrency: "NGN",
//             price: product.productData.price,
//           },
//         })}
//       </script>

//       <article className="mx-auto max-w-3xl lg:max-w-none">
//         {/* Product Main Section */}
//         <section
//           aria-labelledby="product-heading"
//           className="pb-5 sm:pb-10 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12 mx-4 my-4"
//         >
//           <h1 id="product-heading" className="sr-only">
//             {product.productData.name || product.productData.title}
//           </h1>

//           <ProductGallery
//             product={product.productData}
//             isLikedProduct={product.isLikedProduct}
//           />

//           <ProductInfo product={product.productData} />
//         </section>

//         {/* Specifications */}
//         {isPhysicalProduct && (
//           <section
//             aria-labelledby="specifications-heading"
//             className="mt-12 border-t border-gray-200 pt-8"
//           >
//             <h2 id="specifications-heading" className="sr-only">
//               Product Specifications
//             </h2>
//             <ProductSpecification product={product.productData} />
//           </section>
//         )}

//         {/* Reviews */}
//         {isPhysicalProduct && (
//           <section
//             aria-labelledby="reviews-heading"
//             className="mt-12 border-t border-gray-200 pt-8"
//           >
//             <h2 id="reviews-heading" className="sr-only">
//               Product Reviews
//             </h2>
//             <Suspense
//               fallback={<div className="animate-pulse h-96 bg-gray-100" />}
//             >
//               <ProductReviewComponent product={product.productData} />
//             </Suspense>
//           </section>
//         )}
//       </article>
//     </main>
//   );
// }
