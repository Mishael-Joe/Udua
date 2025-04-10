import CountdownTimer from "@/components/deals/countdown-timer";
import { currencyOperations, formatNaira } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Gift, Percent, ShoppingBag, Truck, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, BarChart2 } from "lucide-react";
import { Deal } from "@/types";

async function getDealById(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/deals/${id}`,
      { next: { revalidate: 300 } } // Revalidate every 5 minutes
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: "Deal not found" };
      }
      throw new Error(`Failed to fetch deal: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching deal:", error);
    return { success: false, error: "Failed to load deal" };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { success, deal } = await getDealById(id);

  if (!success || !deal) {
    return {
      title: "Deal Not Found | Udua",
      description: "The requested deal could not be found.",
    };
  }

  return {
    title: `${deal.name} | Udua Deals`,
    description: deal.description || `Save with our ${deal.name} promotion!`,
  };
}

export default async function DealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { success, deal, error } = (await getDealById(id)) as {
    success: boolean;
    deal: Deal;
    error: any;
  };

  if (!success || !deal) {
    notFound();
  }

  const isFlashSale = deal.dealType === "flash_sale";
  const endDate = new Date(deal.endDate);

  // Calculate discounted price
  const calculateDiscountedPrice = (originalPrice: number) => {
    if (deal.dealType === "percentage" || deal.dealType === "flash_sale") {
      return originalPrice - originalPrice * (deal.value / 100);
    } else if (deal.dealType === "fixed") {
      return Math.max(0, originalPrice - deal.value);
    }
    return originalPrice;
  };

  // Get price range for size-based products
  const getPriceRange = (
    sizes: { size: string; price: number; quantity: number }[]
  ) => {
    if (!sizes || sizes.length === 0) return { min: 0, max: 0 };

    const prices = sizes.map((size) => size.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  const getDealIcon = () => {
    switch (deal.dealType) {
      case "percentage":
        return <Percent className="h-6 w-6" />;
      case "fixed":
        return <ShoppingBag className="h-6 w-6" />;
      case "free_shipping":
        return <Truck className="h-6 w-6" />;
      case "flash_sale":
        return <Zap className="h-6 w-6 text-amber-500" />;
      case "buy_x_get_y":
        return <Gift className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const getDealValue = () => {
    switch (deal.dealType) {
      case "percentage":
        return `${deal.value}% OFF`;
      case "fixed":
        return `${formatNaira(deal.value)} OFF`;
      case "free_shipping":
        return "FREE SHIPPING";
      case "flash_sale":
        return `${deal.value}% OFF - LIMITED TIME`;
      case "buy_x_get_y":
        return `BUY ${deal.buyQuantity} GET ${deal.getQuantity}`;
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" asChild>
          <Link href="/store/deals">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Deals
          </Link>
        </Button>

        <Button asChild className="hover:bg-udua-blue-primary bg-blue-500">
          <Link href={`/store/${id}/deals/${deal._id}/analytics`}>
            <BarChart2 className="mr-2 h-4 w-4" />
            View Analytics
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Deal Info */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {getDealIcon()}
              <h1 className="text-2xl font-bold">{deal.name}</h1>
            </div>

            {deal.description && (
              <p className="text-muted-foreground mb-4">{deal.description}</p>
            )}

            <Badge className="mb-4 text-base px-3 py-1 hover:bg-udua-blue-primary bg-blue-500">
              {getDealValue()}
            </Badge>

            {isFlashSale && (
              <div className="mb-4 p-3 bg-muted rounded-md">
                <CountdownTimer endDate={endDate} className="text-base" />
              </div>
            )}

            {deal.minCartValue && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Minimum order value: {formatNaira(deal.minCartValue)}
                </p>
              </div>
            )}

            {!deal.autoApply && deal.code && (
              <div className="mb-4">
                <p className="text-sm mb-1">Use code at checkout:</p>
                <div className="bg-muted p-3 rounded-md text-center font-mono font-bold">
                  {deal.code}
                </div>
              </div>
            )}

            <Separator className="my-4" />

            <div className="text-sm text-muted-foreground">
              <p>Valid from: {new Date(deal.startDate).toLocaleDateString()}</p>
              <p>Valid until: {new Date(deal.endDate).toLocaleDateString()}</p>
            </div>
          </Card>
        </div>

        {/* Products */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Products in this Deal</h2>

          {!deal.products || deal.products.length === 0 ? (
            <p className="text-muted-foreground">
              No products available for this deal.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {deal.products.map((product) => {
                const productName = product.name || product.title || "Product";
                const productImage =
                  product.images?.[0] || product.coverIMG || "/placeholder.svg";

                // Handle pricing based on whether it's size-based or not
                const hasSizes = product.sizes && product.sizes.length > 0;
                let priceDisplay = "";
                let originalPriceDisplay = "";
                let savingsDisplay = "";

                if (hasSizes) {
                  // Size-based pricing
                  const priceRange = getPriceRange(product.sizes!);
                  const discountedMin = calculateDiscountedPrice(
                    priceRange.min
                  );
                  const discountedMax = calculateDiscountedPrice(
                    priceRange.max
                  );

                  if (priceRange.min === priceRange.max) {
                    priceDisplay = formatNaira(discountedMin);
                    originalPriceDisplay = formatNaira(priceRange.min);
                    savingsDisplay = formatNaira(
                      priceRange.min - discountedMin
                    );
                  } else {
                    priceDisplay = formatNaira(discountedMin);
                    originalPriceDisplay = formatNaira(priceRange.min);
                    savingsDisplay = `Up to ${formatNaira(
                      currencyOperations.subtract(priceRange.max, discountedMax)
                    )}`;
                    // priceDisplay = `${formatNaira(
                    //   discountedMin
                    // )} - ${formatNaira(discountedMax)}`;
                    // originalPriceDisplay = `${formatNaira(
                    //   priceRange.min
                    // )} - ${formatNaira(priceRange.max)}`;
                    // savingsDisplay = `Up to ${formatNaira(
                    //   priceRange.max - discountedMax
                    // )}`;
                  }
                } else {
                  // Single price
                  const originalPrice = product.price || 0;
                  const discountedPrice =
                    calculateDiscountedPrice(originalPrice);
                  priceDisplay = formatNaira(discountedPrice);
                  originalPriceDisplay = formatNaira(originalPrice);
                  savingsDisplay = formatNaira(
                    currencyOperations.subtract(originalPrice, discountedPrice)
                  );
                }

                return (
                  <Card key={product._id} className="overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={productImage || "/placeholder.svg"}
                        alt={productName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive">{getDealValue()}</Badge>
                      </div>
                    </div>

                    <div className="p-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {productName}
                        </h3>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-lg font-bold">
                            {priceDisplay}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {originalPriceDisplay}
                          </span>
                          <Badge variant="outline" className="ml-auto">
                            Save {savingsDisplay}
                          </Badge>
                        </div>

                        {hasSizes && (
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground mb-2">
                              Available sizes:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {product.sizes!.map((size, index) => (
                                <div
                                  key={index}
                                  className="text-xs bg-muted px-2 py-1 rounded"
                                >
                                  {size.size}:{" "}
                                  {formatNaira(
                                    calculateDiscountedPrice(size.price)
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <Button
                        asChild
                        className="w-full hover:bg-udua-blue-primary bg-blue-500"
                      >
                        <Link href={`/product/${product._id}`}>
                          View Product
                        </Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
