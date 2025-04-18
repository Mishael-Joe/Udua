/**
 * Product Page Skeleton
 *
 * Displays a loading skeleton for the product page while data is being fetched.
 * Mimics the layout of the actual product page to reduce layout shift when content loads.
 */

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

/**
 * Product Detail Skeleton Component for loading state
 */
export const ProductDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <Skeleton className="h-6 w-64 mb-6" />

    <div className="grid md:grid-cols-2 gap-8 mb-12">
      {/* Image Skeleton */}
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-20 rounded-md" />
          ))}
        </div>
      </div>

      {/* Details Skeleton */}
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <Skeleton className="h-5 w-32" />

        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>

        <Skeleton className="h-6 w-20" />

        <div className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-16 rounded-md" />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-12 mx-2" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-12 flex-1 rounded-md" />
          <Skeleton className="h-12 w-12 rounded-md" />
          <Skeleton className="h-12 w-12 rounded-md" />
        </div>
      </div>
    </div>

    <Skeleton className="h-12 w-full mb-4" />
    <Skeleton className="h-40 w-full mb-12" />

    <Skeleton className="h-8 w-48 mb-4" />
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      ))}
    </div>
  </div>
);

export function ProductPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumbs skeleton */}
        <div className="mb-6 flex items-center space-x-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Product main section skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
          {/* Gallery skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
            </div>
          </div>

          {/* Product info skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <Skeleton className="h-12 w-full rounded-md" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>

        {/* Specifications skeleton */}
        <div className="mt-16">
          <Separator className="mb-8" />
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>

        {/* Reviews skeleton */}
        <div className="mt-16">
          <Separator className="mb-8" />
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
