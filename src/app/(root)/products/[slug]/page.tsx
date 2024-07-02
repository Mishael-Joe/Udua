import { ProductGallery } from "@/components/product-gallery";
import { ProductInfo } from "@/components/product-info";
import { ProductSpecification } from "@/components/product-specification";
import { fetchProductData } from "@/lib/actions/product.action";

interface Props {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: Props) {
  const product = await fetchProductData(params.slug);
  // console.log("params._id", params.slug);
  // console.log("Product", product);

  return (
    <main className="mx-auto max-w-6xl sm:px-6 sm:pt-16 lg:px-8">
      <div className="mx-auto max-w-3xl lg:max-w-none">
        {/* Product */}
        <div className="pb-20 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
          {/* Product gallery */}
          <ProductGallery product={product.productData} 
            isLikedProduct={product.isLikedProduct}  />
          {/* Product info */}
          <ProductInfo product={product.productData} />
        </div>

        {/* Product Specification */}
        <ProductSpecification product={product.productData} />
      </div>
    </main>
  );
}
