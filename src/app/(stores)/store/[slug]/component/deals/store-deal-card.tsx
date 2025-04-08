"use client";

import { formatNaira } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Percent, Truck, Zap, Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "@/components/deals/countdown-timer";

interface DealCardProps {
  deal: {
    _id: string;
    name: string;
    dealType:
      | "percentage"
      | "fixed"
      | "free_shipping"
      | "flash_sale"
      | "buy_x_get_y";
    value: number;
    startDate: Date | string;
    endDate: Date | string;
    products?: {
      _id: string;
      name?: string;
      title?: string;
      price: number;
      images?: string[];
      coverIMG?: string;
      productType: string;
      sizes?: {
        size: string;
        price: number;
        quantity: number;
      }[];
    }[];
  };
  params: { slug: string };
}

export default function StoreDealCard({ deal, params }: DealCardProps) {
  // Convert dates to Date objects if they're strings
  const endDate =
    typeof deal.endDate === "string" ? new Date(deal.endDate) : deal.endDate;
  const isFlashSale = deal.dealType === "flash_sale";

  // Get the first product to display (if available)
  const product =
    deal.products && deal.products.length > 0 ? deal.products[0] : null;

  // Calculate discounted price
  const calculateDiscountedPrice = (originalPrice: number) => {
    if (deal.dealType === "percentage" || deal.dealType === "flash_sale") {
      return originalPrice - originalPrice * (deal.value / 100);
    } else if (deal.dealType === "fixed") {
      return Math.max(0, originalPrice - deal.value);
    }
    return originalPrice;
  };

  const getDealIcon = () => {
    switch (deal.dealType) {
      case "percentage":
        return <Percent className="h-5 w-5" />;
      case "fixed":
        return <Badge variant="outline">{formatNaira(deal.value)} OFF</Badge>;
      case "free_shipping":
        return <Truck className="h-5 w-5" />;
      case "flash_sale":
        return <Zap className="h-5 w-5 text-amber-500" />;
      case "buy_x_get_y":
        return <Gift className="h-5 w-5" />;
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
        return `${deal.value}% OFF`;
      case "buy_x_get_y":
        return `BUY X GET Y`;
      default:
        return "";
    }
  };

  // If no product is available, show a simplified card
  if (!product) {
    return (
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="bg-muted h-48 flex items-center justify-center">
            {getDealIcon()}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg">{deal.name}</h3>
            <div className="mt-2">
              <Badge variant="secondary">{getDealValue()}</Badge>
            </div>
            {isFlashSale && (
              <div className="mt-3">
                <CountdownTimer endDate={endDate} />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button asChild className="w-full">
            <Link href={`/store/${params.slug}/deals/${deal._id}`}>
              View Deal
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Get product image
  const productImage =
    product.images?.[0] || product.coverIMG || "/placeholder.svg";
  const productName = product.name || product.title || "Product";
  const originalPrice =
    (product.sizes && product.sizes[0]?.price) || product.price || 0;
  const discountedPrice = calculateDiscountedPrice(originalPrice);

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0 relative">
        {/* Deal badge */}
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="destructive" className="font-semibold">
            {getDealValue()}
          </Badge>
        </div>

        {/* Product image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={productImage || "/placeholder.svg"}
            alt={productName}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{deal.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
            {productName}
          </p>

          {/* Price display */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold">
              {formatNaira(discountedPrice)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              {formatNaira(originalPrice)}
            </span>
          </div>

          {/* Flash sale countdown */}
          {isFlashSale && (
            <div className="mt-3">
              <CountdownTimer endDate={endDate} />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/store/${params.slug}/deals/${deal._id}`}>
            View Deal
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
