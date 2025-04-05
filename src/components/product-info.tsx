"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import {
  Plus,
  Minus,
  ShoppingBagIcon,
  Percent,
  Zap,
  Tag,
  Clock,
} from "lucide-react";
import { usePathname } from "next/navigation";
import DOMPurify from "dompurify";

import { formatNaira } from "@/lib/utils";
import { useStateContext } from "@/context/stateContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ShareButton from "../utils/shareBTN";
import type { ForProductInfo } from "@/types";
import { FootWearSizeGuide } from "./shoe-size-guide";
import CountdownTimer from "./deals/countdown-timer";

interface DealInfo {
  _id: string;
  name: string;
  dealType:
    | "percentage"
    | "fixed"
    | "free_shipping"
    | "flash_sale"
    | "buy_x_get_y";
  value: number;
  endDate: string | Date;
}

export function ProductInfo({ product }: ForProductInfo) {
  const pathname = usePathname();
  const { addToCart, quantity, incrementQuantity, decrementQuantity } =
    useStateContext();

  const [dealInfo, setDealInfo] = useState<DealInfo | null>(null);
  const [isLoadingDeal, setIsLoadingDeal] = useState(true);

  const currentUrl = useMemo(
    () => `${window.location.protocol}//${window.location.host}${pathname}`,
    [pathname]
  );

  const [selectedSize, setSelectedSize] = useState(() => {
    if (product.productType !== "physicalproducts") return null;
    if (product.sizes === undefined || product.sizes === null) {
      return null;
    }
    return product.sizes[0];
  });

  const [selectedColor, setSelectedColor] = useState(() => {
    if (product.productType !== "physicalproducts") return null;
    if (product.colors === undefined || product.colors === null) {
      return null;
    }
    return product.colors[0];
  });

  const sanitizedContent = useMemo(
    () => DOMPurify.sanitize(product.description),
    [product.description]
  );

  const isPhysicalProduct = product.productType === "physicalproducts";

  // Fetch deal information for this product
  useEffect(() => {
    const fetchDealInfo = async () => {
      try {
        setIsLoadingDeal(true);
        const response = await fetch(`/api/products/${product._id}/deals`);
        const data = await response.json();

        if (data.success && data.hasDeals) {
          setDealInfo(data.deal);
        } else {
          setDealInfo(null);
        }
      } catch (error) {
        console.error("Error fetching deal info:", error);
        setDealInfo(null);
      } finally {
        setIsLoadingDeal(false);
      }
    };

    fetchDealInfo();
  }, [product._id]);

  // Calculate discounted price
  const calculateDiscountedPrice = useCallback(
    (originalPrice: number) => {
      if (!dealInfo) return originalPrice;

      if (
        dealInfo.dealType === "percentage" ||
        dealInfo.dealType === "flash_sale"
      ) {
        return originalPrice - originalPrice * (dealInfo.value / 100);
      } else if (dealInfo.dealType === "fixed") {
        return Math.max(0, originalPrice - dealInfo.value);
      }

      return originalPrice;
    },
    [dealInfo]
  );

  // Unified add to cart handler
  const handleAddToCart = useCallback(() => {
    const storeID = product.storeID;
    addToCart(
      product,
      storeID,
      quantity,
      isPhysicalProduct ? selectedSize : null,
      isPhysicalProduct ? selectedColor : null
    );
  }, [
    product,
    quantity,
    selectedSize,
    selectedColor,
    isPhysicalProduct,
    addToCart,
  ]);

  // Reusable quantity controls
  const QuantityControls = useMemo(
    () => (
      <div className="flex gap-4 pb-4">
        <Button
          aria-label="Decrease quantity"
          onClick={decrementQuantity}
          size="icon"
          className="hover:bg-udua-orange-primary bg-udua-orange-primary/80"
        >
          <Minus className="h-5 w-5" />
        </Button>
        <Button
          disabled
          aria-label="Current quantity"
          size="icon"
          className="hover:bg-slate-100 bg-slate-100 text-udua-orange-primary font-bold"
        >
          {quantity}
        </Button>
        <Button
          aria-label="Increase quantity"
          onClick={incrementQuantity}
          size="icon"
          className="hover:bg-udua-orange-primary bg-udua-orange-primary/80"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    ),
    [quantity, decrementQuantity, incrementQuantity]
  );

  // Get deal badge icon
  const getDealIcon = useCallback(() => {
    if (!dealInfo) return null;

    switch (dealInfo.dealType) {
      case "percentage":
        return <Percent className="h-4 w-4" />;
      case "fixed":
        return <Tag className="h-4 w-4" />;
      case "flash_sale":
        return <Zap className="h-4 w-4" />;
      default:
        return null;
    }
  }, [dealInfo]);

  // Get deal badge text
  const getDealText = useCallback(() => {
    if (!dealInfo) return "";

    switch (dealInfo.dealType) {
      case "percentage":
        return `${dealInfo.value}% OFF`;
      case "fixed":
        return `${formatNaira(dealInfo.value)} OFF`;
      case "flash_sale":
        return `FLASH SALE: ${dealInfo.value}% OFF`;
      default:
        return "";
    }
  }, [dealInfo]);

  // Price display component
  const PriceDisplay = useMemo(() => {
    const basePrice = isPhysicalProduct
      ? selectedSize?.price ?? product.price
      : product.price;

    if (dealInfo) {
      const discountedPrice = calculateDiscountedPrice(basePrice);

      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <p className="text-lg sm:text-2xl tracking-tight font-semibold text-udua-orange-primary">
              {formatNaira(discountedPrice)}
            </p>
            <p className="text-sm sm:text-lg tracking-tight line-through text-muted-foreground">
              {formatNaira(basePrice)}
            </p>
          </div>
          <div className="mt-1">
            <Badge className="flex items-center gap-1 bg-red-600">
              {getDealIcon()}
              {getDealText()}
            </Badge>
          </div>
          {dealInfo.dealType === "flash_sale" && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <CountdownTimer endDate={new Date(dealInfo.endDate)} />
            </div>
          )}
        </div>
      );
    }

    return (
      <p className="text-lg sm:text-2xl tracking-tight font-semibold">
        {formatNaira(basePrice)}
      </p>
    );
  }, [
    isPhysicalProduct,
    product.price,
    selectedSize?.price,
    dealInfo,
    calculateDiscountedPrice,
    getDealIcon,
    getDealText,
  ]);

  return (
    <div className="mt-5 px-4 sm:px-0 lg:mt-0 lg:sticky md:top-20">
      <h1 className="text-lg sm:text-2xl font-bold tracking-tight">
        {isPhysicalProduct ? product.name : product.title}
      </h1>

      <div className="sm:mt-3">
        <h2 className="sr-only">Product information</h2>
        {isLoadingDeal ? (
          <div className="h-8 w-32 bg-muted animate-pulse rounded"></div>
        ) : (
          PriceDisplay
        )}
      </div>

      <form className="mt-3">
        <Button
          type="button"
          aria-label="Add to cart"
          className="w-full flex gap-4 justify-center items-center bg-udua-orange-primary/80 py-6 text-base font-medium text-white hover:bg-udua-orange-primary"
          onClick={handleAddToCart}
        >
          <ShoppingBagIcon className="h-5 w-5" />
          Add to cart
        </Button>
      </form>

      <div className="mt-4">
        <div className="flex justify-between w-full">
          {isPhysicalProduct && QuantityControls}
          <ShareButton slug={currentUrl} />
        </div>

        {isPhysicalProduct && (
          <>
            {selectedSize && (
              <div className="flex gap-x-3 items-center justify-between text-udua-orange-primary cursor-pointer">
                <div className="flex gap-x-3 items-center">
                  <p>
                    Size: <strong>{selectedSize.size}</strong>
                  </p>
                  <p className="text-xs text-udua-orange-primary">
                    ONLY <strong>{selectedSize.quantity}</strong> LEFT
                  </p>
                </div>

                <div>
                  {Number(selectedSize.size) && <FootWearSizeGuide />}
                  {/* {typeof selectedSize.size === "string" && (
                    <ClothingSizeGuide />
                  )} */}
                </div>
              </div>
            )}

            {product.sizes?.map((size) => (
              <Button
                key={size.size}
                onClick={() => setSelectedSize(size)}
                className={`mr-2 mt-4 ${
                  selectedSize?.size === size.size
                    ? "bg-udua-orange-primary/90 hover:bg-udua-orange-primary"
                    : "bg-udua-orange-primary/55 hover:bg-udua-orange-primary"
                }`}
                disabled={size.quantity === 0}
              >
                {size.size}
              </Button>
            ))}

            {selectedColor && (
              <p className="pt-2">
                Color: <strong>{selectedColor}</strong>
              </p>
            )}

            {product.colors?.map((color) => (
              <Button
                key={color}
                onClick={() => setSelectedColor(color)}
                variant={selectedColor === color ? "outline" : "default"}
                className="mr-2 mt-4"
              >
                {color}
              </Button>
            ))}
          </>
        )}
      </div>

      <div className="mt-6 hidde md:block">
        <h3 className="sr-only">Description</h3>
        <div
          // className="line-clamp-3"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {!isPhysicalProduct && (
          <blockquote className="mt-2 text-gray-600 italic border-l-4 pl-4 border-udua-orange-primary rounded">
            After your purchase, please check your email for the download link.
            The link will be valid for 5 minutes.
          </blockquote>
        )}
      </div>
    </div>
  );
}

// "use client";

// import { useMemo, useCallback, useState } from "react";
// import { Plus, Minus, ShoppingBagIcon } from "lucide-react";
// import { usePathname } from "next/navigation";
// import DOMPurify from "dompurify";

// import { formatNaira } from "@/lib/utils";
// import { useStateContext } from "@/context/stateContext";
// import { Button } from "@/components/ui/button";
// import ShareButton from "../utils/shareBTN";
// import type { ForProductInfo } from "@/types";
// import { ClothingSizeGuide } from "./Clothing-size-guide";
// import { FootWearSizeGuide } from "./shoe-size-guide";

// export function ProductInfo({ product }: ForProductInfo) {
//   const pathname = usePathname();
//   const { addToCart, quantity, incrementQuantity, decrementQuantity } =
//     useStateContext();

//   const currentUrl = useMemo(
//     () => `${window.location.protocol}//${window.location.host}${pathname}`,
//     [pathname]
//   );

//   const [selectedSize, setSelectedSize] = useState(() => {
//     if (product.productType !== "physicalproducts") return null;
//     if (product.sizes === undefined || product.sizes === null) {
//       return null;
//     }
//     return product.sizes[0];
//   });

//   const [selectedColor, setSelectedColor] = useState(() => {
//     if (product.productType !== "physicalproducts") return null;
//     if (product.colors === undefined || product.colors === null) {
//       return null;
//     }
//     return product.colors[0];
//   });

//   const sanitizedContent = useMemo(
//     () => DOMPurify.sanitize(product.description),
//     [product.description]
//   );

//   const isPhysicalProduct = product.productType === "physicalproducts";

//   // Unified add to cart handler
//   const handleAddToCart = useCallback(() => {
//     const storeID = product.storeID;
//     // console.log("storeID", storeID);
//     addToCart(
//       product,
//       storeID,
//       quantity,
//       isPhysicalProduct ? selectedSize : null,
//       isPhysicalProduct ? selectedColor : null
//     );
//   }, [
//     product,
//     quantity,
//     selectedSize,
//     selectedColor,
//     isPhysicalProduct,
//     addToCart,
//   ]);

//   // Reusable quantity controls
//   const QuantityControls = useMemo(
//     () => (
//       <div className="flex gap-4 pb-4">
//         <Button
//           aria-label="Decrease quantity"
//           onClick={decrementQuantity}
//           size="icon"
//           className="hover:bg-udua-orange-primary bg-udua-orange-primary/80"
//         >
//           <Minus className="h-5 w-5" />
//         </Button>
//         <Button
//           disabled
//           aria-label="Current quantity"
//           size="icon"
//           className="hover:bg-slate-100 bg-slate-100 text-udua-orange-primary font-bold"
//         >
//           {quantity}
//         </Button>
//         <Button
//           aria-label="Increase quantity"
//           onClick={incrementQuantity}
//           size="icon"
//           className="hover:bg-udua-orange-primary bg-udua-orange-primary/80"
//         >
//           <Plus className="h-5 w-5" />
//         </Button>
//       </div>
//     ),
//     [quantity, decrementQuantity, incrementQuantity]
//   );

//   // Price display component
//   const PriceDisplay = useMemo(() => {
//     const price = isPhysicalProduct
//       ? selectedSize?.price ?? product.price
//       : product.price;

//     return (
//       <p className="text-lg sm:text-2xl tracking-tight font-semibold">
//         {formatNaira(price)}
//       </p>
//     );
//   }, [isPhysicalProduct, product.price, selectedSize?.price]);

//   return (
//     <div className="mt-5 px-4 sm:px-0 lg:mt-0 lg:sticky md:top-20">
//       <h1 className="text-lg sm:text-2xl font-bold tracking-tight">
//         {isPhysicalProduct ? product.name : product.title}
//       </h1>

//       <div className="sm:mt-3">
//         <h2 className="sr-only">Product information</h2>
//         {PriceDisplay}
//       </div>

//       <form className="mt-3">
//         <Button
//           type="button"
//           aria-label="Add to cart"
//           className="w-full flex gap-4 justify-center items-center bg-udua-orange-primary/80 py-6 text-base font-medium text-white hover:bg-udua-orange-primary"
//           onClick={handleAddToCart}
//         >
//           <ShoppingBagIcon className="h-5 w-5" />
//           Add to cart
//         </Button>
//       </form>

//       <div className="mt-4">
//         <div className="flex justify-between w-full">
//           {isPhysicalProduct && QuantityControls}
//           <ShareButton slug={currentUrl} />
//         </div>

//         {isPhysicalProduct && (
//           <>
//             {selectedSize && (
//               <div className="flex gap-x-3 items-center justify-between text-udua-orange-primary cursor-pointer">
//                 <div className="flex gap-x-3 items-center">
//                   <p>
//                     Size: <strong>{selectedSize.size}</strong>
//                   </p>
//                   <p className="text-xs text-udua-orange-primary">
//                     ONLY <strong>{selectedSize.quantity}</strong> LEFT
//                   </p>
//                 </div>

//                 <div>
//                   {Number(selectedSize.size) && <FootWearSizeGuide />}
//                   {/* {typeof selectedSize.size === "string" && (
//                     <ClothingSizeGuide />
//                   )} */}
//                 </div>
//               </div>
//             )}

//             {product.sizes?.map((size) => (
//               <Button
//                 key={size.size}
//                 onClick={() => setSelectedSize(size)}
//                 className={`mr-2 mt-4 ${
//                   selectedSize?.size === size.size
//                     ? "bg-udua-orange-primary/90 hover:bg-udua-orange-primary"
//                     : "bg-udua-orange-primary/55 hover:bg-udua-orange-primary"
//                 }`}
//                 disabled={size.quantity === 0}
//               >
//                 {size.size}
//               </Button>
//             ))}

//             {selectedColor && (
//               <p className="pt-2">
//                 Color: <strong>{selectedColor}</strong>
//               </p>
//             )}

//             {product.colors?.map((color) => (
//               <Button
//                 key={color}
//                 onClick={() => setSelectedColor(color)}
//                 variant={selectedColor === color ? "outline" : "default"}
//                 className="mr-2 mt-4"
//               >
//                 {color}
//               </Button>
//             ))}
//           </>
//         )}
//       </div>

//       <div className="mt-6 hidde md:block">
//         <h3 className="sr-only">Description</h3>
//         <div
//           // className="line-clamp-3"
//           dangerouslySetInnerHTML={{ __html: sanitizedContent }}
//         />

//         {!isPhysicalProduct && (
//           <blockquote className="mt-2 text-gray-600 italic border-l-4 pl-4 border-udua-orange-primary rounded">
//             After your purchase, please check your email for the download link.
//             The link will be valid for 5 minutes.
//           </blockquote>
//         )}
//       </div>
//     </div>
//   );
// }
