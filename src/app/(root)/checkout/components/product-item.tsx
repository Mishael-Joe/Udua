import Image from "next/image";
import { currencyOperations, formatNaira } from "@/lib/utils";

interface ProductItemProps {
  item: any;
}

export default function ProductItem({ item }: ProductItemProps) {
  const product = item.product;
  const price = item.price || item.selectedSize?.price || product.price;

  // Determine the image source based on product type
  let imageSrc = "/placeholder.svg";

  if (
    product.productType === "physicalproducts" ||
    item.productType === "physicalproducts"
  ) {
    imageSrc = product.images?.[0] || "/placeholder.svg";
  } else if (
    product.productType === "digitalproducts" ||
    item.productType === "digitalproducts"
  ) {
    imageSrc = Array.isArray(product.coverIMG)
      ? product.coverIMG[0]
      : product.coverIMG || "/placeholder.svg";
  }

  // Determine product name based on product type
  const productName = product.name || product.title || "Product";

  // Determine category
  const category = Array.isArray(product.category)
    ? product.category[0]
    : product.category || "";

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={productName}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{productName}</h4>

        {item.selectedSize && (
          <p className="text-sm text-muted-foreground">
            Size: {item.selectedSize.size}
          </p>
        )}

        {category && (
          <p className="text-sm text-muted-foreground">
            {category.replace(/_/g, " ")}
          </p>
        )}

        {(item.productType === "digitalproducts" ||
          product.productType === "digitalproducts") && (
          <p className="text-sm text-primary">Digital Product</p>
        )}
      </div>

      <div className="text-right">
        <p className="font-medium">{formatNaira(price)}</p>
        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
        <p className="font-medium text-sm">
          {formatNaira(currencyOperations.multiply(price, item.quantity))}
        </p>
      </div>
    </div>
  );
}
