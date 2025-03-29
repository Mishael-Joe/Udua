"use client";

import { CartItems } from "@/components/cart-items";
import { CartSummary } from "@/components/cart-summary";
import React, { useEffect, useCallback, useMemo, useState } from "react";
import axios from "axios";
import { CombinedProduct } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { formatNaira } from "@/lib/utils";
import { shimmer, toBase64 } from "@/lib/image";
import { RecentProductsSection } from "@/components/recently-viewed-products";

// Reusable Product Card Component
const ProductCard = ({ product }: { product: CombinedProduct }) => {
  const isPhysical = product.productType === "physicalproducts";
  const imageUrl = isPhysical ? product.images[0] : product.coverIMG[0];
  const title = isPhysical ? product.name : product.title;
  const price = isPhysical
    ? product.price ?? product.sizes?.[0]?.price
    : product.price;

  // Memoize blur data URL generation
  const blurData = useMemo(
    () => `data:image/svg+xml;base64,${toBase64(shimmer(300, 150))}`,
    []
  );

  return (
    <Link
      href={`/product/${product._id}`}
      className="group text-sm flex flex-col w-40 md:w-52"
      aria-label={`View ${title}`}
    >
      <div className="aspect-square w-40 h-40 md:h-52 relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
        <Image
          placeholder="blur"
          blurDataURL={blurData}
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 40vw, 20vw"
        />
      </div>

      <h3 className="mt-1 font-medium line-clamp-1 w-40 md:w-52">{title}</h3>

      {price && <p className="mt-1 font-medium">{formatNaira(price)}</p>}
    </Link>
  );
};

export default function Page() {
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<
    CombinedProduct[]
  >([]);

  // Memoized product IDs fetcher
  const getProductIds = useCallback((key: string) => {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (error) {
      console.error(`Error parsing ${key}:`, error);
      return [];
    }
  }, []);

  // Fetch recently viewed products
  useEffect(() => {
    const fetchRecentProducts = async () => {
      const recentlyViewed = getProductIds("recentlyViewed");
      if (!recentlyViewed.length) return;

      try {
        const { data } = await axios.post("/api/user/recently-viewed", {
          productIds: recentlyViewed,
        });
        setRecentlyViewedProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching recently viewed:", error);
      }
    };

    fetchRecentProducts();
  }, [getProductIds]);

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          Shopping Cart
        </h1>

        <form className="mt-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section
            aria-labelledby="cart-heading"
            className="lg:col-span-7 lg:sticky lg:top-16"
          >
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            <CartItems />
          </section>

          {/* <section className=" sticky top-16 w-full">
          </section> */}
          <CartSummary />
        </form>

        {/* Recently Viewed Products */}
        {recentlyViewedProducts.length > 0 && (
          <div className="mt-8">
            <RecentProductsSection products={recentlyViewedProducts} />
          </div>
        )}
      </main>
    </div>
  );
}
