import { shimmer, toBase64 } from "@/lib/image";
import { formatNaira } from "@/lib/utils";
import { CombinedProduct } from "@/types";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

interface RecentProductsProps {
  products: CombinedProduct[];
}

interface ProductCardProps {
  product: CombinedProduct;
}
export const RecentProductsSection = ({ products }: RecentProductsProps) => (
  <section className="bg-card rounded-lg p-6 shadow-sm">
    <div className="flex items-center gap-4 mb-6">
      <Eye className="w-6 h-6 text-primary" />
      <h2 className="text-xl font-bold">Recently Viewed</h2>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  </section>
);

const ProductCard = ({ product }: ProductCardProps) => {
  const isPhysical = product.productType === "physicalproducts";
  const imageUrl = isPhysical ? product.images[0] : product.coverIMG[0];
  const title = isPhysical ? product.name : product.title;
  const price = isPhysical
    ? product.price ?? product.sizes?.[0]?.price
    : product.price;
  const blurData = useMemo(
    () => `data:image/svg+xml;base64,${toBase64(shimmer(300, 150))}`,
    []
  );

  return (
    <Link
      href={`/product/${product._id}`}
      className="group relative bg-background rounded-lg border p-3 hover:shadow-md transition-shadow"
    >
      <div className="aspect-square relative overflow-hidden rounded-md bg-muted">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
          placeholder="blur"
          blurDataURL={blurData}
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-medium line-clamp-2 text-sm">{title}</h3>
        {price && <p className="text-sm font-semibold">{formatNaira(price)}</p>}
      </div>
    </Link>
  );
};
