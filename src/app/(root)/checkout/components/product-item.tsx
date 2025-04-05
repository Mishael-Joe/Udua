import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { currencyOperations, formatNaira } from "@/lib/utils";
import { Percent, Tag, Zap } from "lucide-react";
import type { CartProduct } from "../page";

interface ProductItemProps {
  item: CartProduct;
}

/**
 * Product Item Component
 * Displays a single product in the checkout with:
 * - Product image
 * - Product name
 * - Selected size (if applicable)
 * - Price information (including deal discounts)
 * - Quantity
 * - Total price
 */
export default function ProductItem({ item }: ProductItemProps) {
  const product = item.product;
  const isPhysical = item.productType === "physicalproducts";
  const hasDeal = item.dealInfo && item.priceAtAdd < item.originalPrice;

  // Determine the image source based on product type
  const imageSrc = isPhysical
    ? product.images?.[0] || "/placeholder.svg"
    : Array.isArray(product.coverIMG)
    ? product.coverIMG[0]
    : product.coverIMG || "/placeholder.svg";

  // Determine product name based on product type
  const productName = isPhysical ? product.name : product.title || "Product";

  // Determine category
  const category = Array.isArray(product.category)
    ? product.category[0]
    : product.category || "";

  // Format category for display
  const formattedCategory = category.replace(/_/g, " ");

  // Calculate item total
  const itemTotal = currencyOperations.multiply(item.priceAtAdd, item.quantity);

  // Get deal badge
  const getDealBadge = () => {
    if (!hasDeal) return null;

    const dealInfo = item.dealInfo!;
    let icon = null;

    switch (dealInfo.dealType) {
      case "percentage":
        icon = <Percent className="h-3 w-3" />;
        break;
      case "fixed":
        icon = <Tag className="h-3 w-3" />;
        break;
      case "flash_sale":
        icon = <Zap className="h-3 w-3" />;
        break;
      default:
        icon = null;
    }

    return (
      <Badge variant="destructive" className="flex items-center gap-1 text-xs">
        {icon}
        {dealInfo.name}
      </Badge>
    );
  };

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

        {formattedCategory && (
          <p className="text-sm text-muted-foreground">{formattedCategory}</p>
        )}

        {!isPhysical && <p className="text-sm text-primary">Digital Product</p>}

        {hasDeal && getDealBadge()}
      </div>

      <div className="text-right">
        <div className="flex flex-col items-end">
          <p
            className={`font-medium ${
              hasDeal ? "text-udua-orange-primary" : ""
            }`}
          >
            {formatNaira(item.priceAtAdd)}
          </p>

          {hasDeal && (
            <p className="text-xs text-muted-foreground line-through">
              {formatNaira(item.originalPrice)}
            </p>
          )}
        </div>

        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
        <p className="font-medium text-sm">{formatNaira(itemTotal)}</p>
      </div>
    </div>
  );
}

// import Image from "next/image";
// import { currencyOperations, formatNaira } from "@/lib/utils";

// interface ProductItemProps {
//   item: any;
// }

// export default function ProductItem({ item }: ProductItemProps) {
//   const product = item.product;
//   const price = item.price || item.selectedSize?.price || product.price;

//   // Determine the image source based on product type
//   let imageSrc = "/placeholder.svg";

//   if (
//     product.productType === "physicalproducts" ||
//     item.productType === "physicalproducts"
//   ) {
//     imageSrc = product.images?.[0] || "/placeholder.svg";
//   } else if (
//     product.productType === "digitalproducts" ||
//     item.productType === "digitalproducts"
//   ) {
//     imageSrc = Array.isArray(product.coverIMG)
//       ? product.coverIMG[0]
//       : product.coverIMG || "/placeholder.svg";
//   }

//   // Determine product name based on product type
//   const productName = product.name || product.title || "Product";

//   // Determine category
//   const category = Array.isArray(product.category)
//     ? product.category[0]
//     : product.category || "";

//   return (
//     <div className="flex items-center gap-4">
//       <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted">
//         <Image
//           src={imageSrc || "/placeholder.svg"}
//           alt={productName}
//           fill
//           className="object-cover"
//           sizes="80px"
//         />
//       </div>

//       <div className="flex-1 min-w-0">
//         <h4 className="font-medium truncate">{productName}</h4>

//         {item.selectedSize && (
//           <p className="text-sm text-muted-foreground">
//             Size: {item.selectedSize.size}
//           </p>
//         )}

//         {category && (
//           <p className="text-sm text-muted-foreground">
//             {category.replace(/_/g, " ")}
//           </p>
//         )}

//         {(item.productType === "digitalproducts" ||
//           product.productType === "digitalproducts") && (
//           <p className="text-sm text-primary">Digital Product</p>
//         )}
//       </div>

//       <div className="text-right">
//         <p className="font-medium">{formatNaira(price)}</p>
//         <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
//         <p className="font-medium text-sm">
//           {formatNaira(currencyOperations.multiply(price, item.quantity))}
//         </p>
//       </div>
//     </div>
//   );
// }
