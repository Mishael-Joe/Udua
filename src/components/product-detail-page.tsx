/**
 * Product Detail Page
 *
 * This page displays comprehensive information about a product including:
 * - Product images with gallery view
 * - Product name, price, and description
 * - Size selection (if applicable)
 * - Quantity selector
 * - Add to cart functionality
 * - Deal information (if applicable)
 * - Related products
 *
 * The component handles both physical and digital products with graceful
 * fallbacks for missing data.
 *
 * @component ProductDetailPage
 */

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  ArrowLeft,
  Tag,
  Clock,
  Truck,
  Loader,
  ArrowRight,
  Store,
} from "lucide-react";

import { cn, formatNaira, getTimeRemaining } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CombinedProduct } from "@/types";
import { useStateContext } from "@/context/stateContext";
import ShareButtonForProducts from "@/utils/share-btn-products";
import { ProductDetailsComponent } from "./product-specification";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { RelatedProducts } from "./related-products";
import { FootWearSizeGuide } from "./shoe-size-guide";
import { ClothingSizeGuide } from "./Clothing-size-guide";

/**
 * Main Product Detail Page Component
 */
export function ProductDetailPage({
  item,
  isLikedProduct,
}: {
  item: CombinedProduct;
  isLikedProduct: boolean;
}) {
  // State for product data and UI
  const [product, setProduct] = useState<CombinedProduct>(item);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [like, setLike] = useState(isLikedProduct);
  const [addingToCart, setAddingToCart] = useState(false);

  //
  const pathname = usePathname();
  const { addToCart, quantity, incrementQuantity, decrementQuantity } =
    useStateContext();

  const currentUrl = useMemo(
    () => `${window.location.protocol}//${window.location.host}${pathname}`,
    [pathname]
  );

  const { toast } = useToast();
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<
    CombinedProduct["size"] | null
  >(() => {
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

  // Reusable quantity controls
  const QuantityControls = useMemo(
    () => (
      <div className="flex gap-4 pb-4">
        <Button
          aria-label="Decrease quantity"
          onClick={decrementQuantity}
          size="sm"
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
          size="sm"
          className="hover:bg-udua-orange-primary bg-udua-orange-primary/80"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    ),
    [quantity, decrementQuantity, incrementQuantity]
  );

  /**
   * Handle adding product to cart
   */
  const isPhysicalProduct = item.productType === "physicalproducts";
  const handleAddToCart = useCallback(async () => {
    setAddingToCart(true);
    if (!product) return;

    // For physical products, ensure a size is selected if sizes exist
    if (
      product.productType === "physicalproducts" &&
      product.sizes?.length &&
      !selectedSize
    ) {
      toast({
        variant: "destructive",
        title: "Please select a size",
        description:
          "You must select a size before adding this item to your cart",
      });
      return;
    }
    const storeID = product.storeID;
    const res = await addToCart(
      product,
      storeID,
      quantity,
      isPhysicalProduct && selectedSize ? selectedSize : null,
      isPhysicalProduct && selectedColor ? selectedColor : null
    );

    if (res) {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
        action: (
          <Link href="/cart">
            <Button variant="link" className="gap-x-2 whitespace-nowrap">
              <span>Open cart</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        ),
      });
    }

    setAddingToCart(false);
  }, [
    product,
    quantity,
    selectedSize,
    selectedColor,
    isPhysicalProduct,
    addToCart,
  ]);

  /**
   * Calculate the current price based on selected size and active deals
   */
  const calculatePrice = () => {
    if (!product) return 0;

    // Base price is either the selected size price or the product's base price
    const basePrice = selectedSize ? selectedSize.price : product.price;

    // Apply discount if there's an active deal
    if (product.activeDeal) {
      const discountAmount = Math.round(
        basePrice * (product.activeDeal.value / 100)
      );
      return basePrice - discountAmount;
    }

    return basePrice;
  };

  const handleWishlistAction = async (actionType: "add" | "remove") => {
    setIsLoading(true);
    if (actionType === "add") {
      try {
        const response = await fetch("/api/wishlist/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product._id,
            productType: product.productType,
          }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error);
        setLike(!like);

        // Handle successful response
        toast({ title: "Success", description: data.message });
      } catch (error) {
        console.error("Wishlist error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await fetch("/api/wishlist/remove", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product._id,
            productType: product.productType,
          }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error);
        setLike(false);
        toast({ title: "Success", description: data.message });
      } catch (error) {
        console.error("Removal failed:", error);
        // Show error toast
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Initialize GLightbox on component mount
  useEffect(() => {
    const lightbox = GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
    });

    return () => {
      lightbox.destroy();
    };
  }, []);

  const images =
    item.productType === "physicalproducts" ? item.images : item.coverIMG;

  // Calculate current price and savings
  const currentPrice = calculatePrice();
  const originalPrice = selectedSize ? selectedSize.price : product.price;
  const savings = originalPrice - currentPrice;
  const discountPercentage = product.activeDeal?.value || 0;

  // Determine if product is in stock
  const isInStock =
    product.productType === "digitalproducts" ||
    (selectedSize
      ? selectedSize.quantity > 0
      : product.productQuantity && Number(product.productQuantity) > 0);

  return (
    <div className="">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6 hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/`}>
                {product.category &&
                product.productType === "physicalproducts" ? (
                  <>{product.category[0].replace(/_/g, " ") || "Category"}</>
                ) : (
                  <>{product.category.replace(/_/g, " ") || "Category"}</>
                )}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {product.productType === "physicalproducts" && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back Button (Mobile) */}
      {/* <Button
        variant="ghost"
        size="sm"
        className="mb-4 md:hidden"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button> */}

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4 relative">
          {item.productType === "physicalproducts" && (
            <Link
              href={`/brand/${product.storeID}`}
              className="absolute z-10 top-4 right-4 md:top-6 md:right-6"
            >
              <Store className="w-8 h-8 p-1 rounded-full text-black bg-white/80 z-20" />
            </Link>
          )}
          {/* Main Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
            <Link
              href={images[selectedImage]}
              className="glightbox block h-full w-full"
              aria-label="Enlarge image"
            >
              <Image
                src={
                  product.images?.[selectedImage] ||
                  product.coverIMG?.[0] ||
                  "/placeholder.svg?height=600&width=600"
                }
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </Link>

            {/* Deal Badge */}
            {product.activeDeal && (
              <Badge className="absolute top-4 left-4 bg-red-600 hover:bg-red-700 text-white">
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {(product.images || (product.coverIMG && product.coverIMG)) && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(product.images || product.coverIMG || []).map((img, index) => (
                <Button
                  key={index}
                  className={cn(
                    "relative h-20 w-20 rounded-md overflow-hidden border-2 transition-all",
                    selectedImage === index
                      ? "border-udua-orange-primary"
                      : "border-muted hover:border-gray-300"
                  )}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={img || "/placeholder.svg?height=80&width=80"}
                    alt={`${product.name} - view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Product Title and Brand */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {product.name || product.title}
            </h1>
            {product.category && product.productType === "physicalproducts" ? (
              <p className="text-muted-foreground">
                Category: {product.category[0].replace(/_/g, " ")}
              </p>
            ) : (
              <p className="text-muted-foreground">
                Category: {product.category.replace(/_/g, " ")}
              </p>
            )}
          </div>

          {/* Ratings */}
          {/* {product.ratings && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.ratings!.average)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.ratings.average} ({product.ratings.count} reviews)
              </span>
            </div>
          )} */}

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {formatNaira(currentPrice)}
              </span>

              {/* Show original price if there's a discount */}
              {savings > 0 && (
                <span className="text-muted-foreground line-through">
                  {formatNaira(originalPrice)}
                </span>
              )}
            </div>

            {/* Show savings */}
            {savings > 0 && (
              <div className="flex items-center gap-2 text-green-600">
                <Tag className="h-4 w-4" />
                <span className="text-sm font-medium">
                  You save {formatNaira(savings)} ({discountPercentage}%)
                </span>
              </div>
            )}

            {/* Deal countdown if applicable */}
            {product.activeDeal?.endsAt && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded-md">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {product.activeDeal.name} ends in{" "}
                  {getTimeRemaining(product.activeDeal.endsAt)}
                </span>
              </div>
            )}
          </div>

          {/* Stock Status */}
          {product.productType === "physicalproducts" && (
            <div className="flex items-center gap-2">
              <Badge
                variant={isInStock ? "outline" : "destructive"}
                className="capitalize"
              >
                {isInStock ? "In Stock" : "Out of Stock"}
              </Badge>

              {/* Show quantity for physical products */}
              {product.productType === "physicalproducts" && selectedSize ? (
                <span className="text-sm text-muted-foreground">
                  {selectedSize.quantity} available
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {product.productQuantity} available
                </span>
              )}
            </div>
          )}

          {/* Size Selection for Physical Products */}
          {product.productType === "physicalproducts" &&
            product.sizes &&
            product.sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Select Size</span>
                  {typeof Number(selectedSize?.size) === "number" ? (
                    <FootWearSizeGuide />
                  ) : (
                    <ClothingSizeGuide />
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size._id}
                      className={cn(
                        "px-3 py-1 border shadow-xs rounded-md text-sm text-udua-deep-gray-primary transition-all",
                        selectedSize?._id === size._id
                          ? "border-udua-orange-primary bg-primary/10 hover:bg-primary/10"
                          : "border-gray-200 hover:border-gray-300 bg-transparent hover:bg-primary/10",
                        size.quantity === 0 && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => size.quantity > 0 && setSelectedSize(size)}
                      disabled={size.quantity === 0}
                    >
                      {size.size}
                      {size.price !== selectedSize?.price &&
                        (() => {
                          // Calculate the difference between the prices.
                          const priceDiff =
                            size.price - (selectedSize?.price || 0);
                          // Check if the difference is negative
                          const isNegative = priceDiff < 0;
                          const formattedPriceDiff = isNegative
                            ? formatNaira(priceDiff)
                            : `+${formatNaira(priceDiff)}`;
                          return (
                            <span className="ml-1 text-xs text-muted-foreground">
                              {formattedPriceDiff}
                            </span>
                          );
                        })()}
                    </Button>
                  ))}
                </div>
              </div>
            )}

          {/* Quantity Selector for Physical Products */}
          {product.productType === "physicalproducts" && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Quantity</p>
              {QuantityControls}
            </div>
          )}

          {/* File Information for Digital Products */}
          {product.productType === "digitalproducts" && (
            <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium">Digital Product Information</h3>
              <div className="space-y-2 text-sm">
                {product.fileType && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">File Type</span>
                    <span>
                      {product.fileType
                        .replace(/\//g, " ")
                        .split(" ")[1]
                        ?.toLocaleUpperCase()}
                    </span>
                  </div>
                )}
                {product.fileSize && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">File Size</span>
                    <span>{product.fileSize} MB</span>
                  </div>
                )}

                <blockquote className="mt-6 text-gray-600 italic border-l-4 pl-4 border-udua-orange-primary rounded">
                  After your purchase, please check your email for the download
                  link. The link will be valid for 5 minutes.
                </blockquote>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="fle flex-col sm:fle-row gap-3 grid sm:grid-cols-3 lg:grid-cols-3">
            <Button
              className="flex-1 bg-orange-400 hover:bg-udua-orange-primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={addingToCart || !isInStock}
            >
              {addingToCart ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="sm:w-auto"
              aria-label={like ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => handleWishlistAction(like ? "remove" : "add")}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-8 h-8 animate-spin text-white bg-black/20 rounded-full" />
                  {like ? `Removing...` : `Adding...`}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Heart
                    fill={like ? "currentColor" : "none"}
                    className={`w-8 h-8 ${
                      like ? "text-red-500" : "text-black bg-white/80"
                    }`}
                    height={24}
                    width={24}
                  />

                  <span className="sm:hidden lg:inline">
                    {like ? `Remove From Wishlist` : `Add to Wishlist`}
                  </span>
                </div>
              )}
            </Button>

            <ShareButtonForProducts slug={currentUrl} />
          </div>

          {/* Shipping Information for Physical Products */}
          {product.productType === "physicalproducts" && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
              <Truck className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                Free shipping on orders over {formatNaira(5000000)}. Estimated
                delivery: 3-5 business days.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Tabs */}
      <ProductDetailsComponent
        description={item.description}
        specifications={item.specifications}
        item={item}
      />

      {/* Related Products Section */}
      <RelatedProducts
        productId={item._id}
        productType={item.productType}
        category={item.category}
      />
    </div>
  );
}
