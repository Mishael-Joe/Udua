/**
 * Related Products Component
 *
 * Displays a carousel of products related to the current product.
 * Helps with cross-selling and improving user engagement.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { shimmer, toBase64 } from "@/lib/image";

interface Product {
  _id: string;
  name?: string;
  title?: string;
  price: number;
  images?: string[];
  coverIMG?: string[];
  productType: string;
  slug: string;
}

interface RelatedProductsProps {
  productId: string;
  category: string | string[];
  productType: string;
}

export function RelatedProducts({
  productId,
  category,
  productType,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        // In a real implementation, you would fetch from your API
        // This is a placeholder for demonstration
        const response = await fetch(
          `/api/related-products?id=${productId}&category=${category}&type=${productType}`
        );
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      } finally {
        setLoading(false);
      }
    }

    // Simulate API call with dummy data for demonstration
    setTimeout(() => {
      setProducts([
        {
          _id: "1",
          name: "Related Product 1",
          price: 12500,
          images: ["/placeholder.svg?height=400&width=400"],
          productType: "physicalproducts",
          slug: "related-product-1",
        },
        {
          _id: "2",
          name: "Related Product 2",
          price: 9900,
          images: ["/placeholder.svg?height=400&width=400"],
          productType: "physicalproducts",
          slug: "related-product-2",
        },
        {
          _id: "3",
          name: "Related Product 3",
          price: 15000,
          images: ["/placeholder.svg?height=400&width=400"],
          productType: "physicalproducts",
          slug: "related-product-3",
        },
        {
          _id: "4",
          name: "Related Product 4",
          price: 8500,
          images: ["/placeholder.svg?height=400&width=400"],
          productType: "physicalproducts",
          slug: "related-product-4",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, [productId, category, productType]);

  const visibleProducts = products.slice(currentIndex, currentIndex + 4);
  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex + 4 < products.length;

  const handlePrevious = () => {
    if (canScrollLeft) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (canScrollRight) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border shadow-sm">
            <CardContent className="p-2">
              <Skeleton className="aspect-square w-full rounded-md" />
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4 pt-2 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visibleProducts.map((product) => (
          <Link href={`/product/${product.slug}`} key={product._id}>
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-2">
                <div className="aspect-square relative rounded-md overflow-hidden">
                  <Image
                    src={
                      product.images?.[0] ||
                      product.coverIMG?.[0] ||
                      "/placeholder.svg?height=400&width=400"
                    }
                    alt={product.name || product.title || "Product"}
                    fill
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      shimmer(400, 400)
                    )}`}
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4 pt-2">
                <h3 className="font-medium text-sm line-clamp-2">
                  {product.name || product.title}
                </h3>
                <p className="text-sm font-semibold mt-1">
                  ₦{new Intl.NumberFormat().format(product.price)}
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {(canScrollLeft || canScrollRight) && (
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between pointer-events-none">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full shadow-md pointer-events-auto ${
              !canScrollLeft ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handlePrevious}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full shadow-md pointer-events-auto ${
              !canScrollRight ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleNext}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      )}
    </div>
  );
}
