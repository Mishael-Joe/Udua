import { ProductGallery } from "@/components/product-gallery";
import { ProductInfo } from "@/components/product-info";
import { fetchProductData } from "@/lib/actions/product.action";
import { notFound } from "next/navigation";
import { ProductSpecification } from "@/components/product-specification";
import ProductReviewComponent from "@/components/product-review";
import { Suspense } from "react";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const product = await fetchProductData(params.slug);

  return {
    title: `${
      product?.productData.name || product?.productData.title
    } | Udua Store`,
    description:
      product?.productData.description?.substring(0, 160) ||
      "Discover high-quality products on Udua",
    openGraph: {
      images: [
        product?.productData.images?.[0] || product?.productData.coverIMG?.[0],
      ],
    },
    alternates: {
      canonical: `/product/${params.slug}`,
    },
  };
}

export default async function Page(props: Props) {
  const params = await props.params;
  let product = null;

  try {
    product = await fetchProductData(params.slug);
  } catch (error) {
    console.error("Product fetch error:", error);
    return notFound();
  }

  if (!product?.productData) {
    return notFound();
  }

  const isPhysicalProduct =
    product.productData.productType === "Physical Product";

  return (
    <main className="mx-auto max-w-7xl sm:px-6 lg:px-8">
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
          },
        })}
      </script>

      <article className="mx-auto max-w-3xl lg:max-w-none">
        {/* Product Main Section */}
        <section
          aria-labelledby="product-heading"
          className="pb-5 sm:pb-10 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12 mx-4 my-4"
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
          <section
            aria-labelledby="specifications-heading"
            className="mt-12 border-t border-gray-200 pt-8"
          >
            <h2 id="specifications-heading" className="sr-only">
              Product Specifications
            </h2>
            <ProductSpecification product={product.productData} />
          </section>
        )}

        {/* Reviews */}
        {isPhysicalProduct && (
          <section
            aria-labelledby="reviews-heading"
            className="mt-12 border-t border-gray-200 pt-8"
          >
            <h2 id="reviews-heading" className="sr-only">
              Product Reviews
            </h2>
            <Suspense
              fallback={<div className="animate-pulse h-96 bg-gray-100" />}
            >
              <ProductReviewComponent product={product.productData} />
            </Suspense>
          </section>
        )}
      </article>
    </main>
  );
}

// import { ProductGallery } from "@/components/product-gallery";
// import { ProductInfo } from "@/components/product-info";
// import ProductReviewComponent from "@/components/product-review";
// import { ProductSpecification } from "@/components/product-specification";
// import { fetchProductData } from "@/lib/actions/product.action";

// interface Props {
//   params: {
//     slug: string;
//   };
// }

// export default async function Page({ params }: Props) {
//   const product = await fetchProductData(params.slug);
//   // console.log("params._id", params.slug);
//   // console.log("Product", product);

//   return (
//     <main className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//       {product.productData.productType === "Physical Product" ? (
//         <div className="mx-auto max-w-3xl lg:max-w-none">
//           {/* Product */}
//           <div className=" pb-5 sm:pb-10 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
//             {/* Product gallery */}
//             <ProductGallery
//               product={product.productData}
//               isLikedProduct={product.isLikedProduct}
//             />
//             {/* Product info */}
//             <ProductInfo product={product.productData} />
//           </div>

//           {/* Product Specification */}
//           <ProductSpecification product={product.productData} />

//           {/* Product Specification */}
//           <ProductReviewComponent product={product.productData} />
//         </div>
//       ) : (
//         <div className="mx-auto max-w-3xl md:max-w-none">
//           {/* Product */}
//           <div className="pb-20 md:grid md:grid-cols-2 md:gap-x-6 md:items-start lg:gap-x-12">
//             {/* Product gallery */}
//             <ProductGallery
//               product={product.productData}
//               isLikedProduct={product.isLikedProduct}
//             />
//             {/* Product info */}
//             <ProductInfo product={product.productData} />
//           </div>

//           {/* Product Specification */}
//           {/* <ProductReviewComponent product={product.productData} /> */}
//         </div>
//       )}
//     </main>
//   );
// }
