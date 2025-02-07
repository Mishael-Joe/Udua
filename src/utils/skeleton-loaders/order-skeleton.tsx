export default function OrderSkeletonLoader() {
  return (
    <div
      className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] md:px-4 gap-4"
      role="status"
      aria-label="Loading order details..."
    >
      {/* Sidebar Skeleton */}
      <div className="hidden border-r bg-muted/10 md:block" aria-hidden="true">
        <div className="flex h-full max-h-screen flex-col gap-2 p-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-full bg-gray-200 animate-pulse rounded-md"
            />
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex flex-col gap-4 p-4 md:py-4">
        {/* Breadcrumb Skeleton */}
        <div className="hidden md:flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
              {i < 2 && (
                <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full" />
              )}
            </div>
          ))}
        </div>

        {/* Page Title Skeleton */}
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />

        {/* Order Summary Card Skeleton */}
        <div className="space-y-4 p-6 border rounded-lg bg-white">
          <div className="h-7 w-64 bg-gray-200 animate-pulse rounded" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 animate-pulse rounded"
                style={{ width: `${70 - i * 5}%` }}
              />
            ))}
          </div>
        </div>

        {/* Products Card Skeleton */}
        <div className="space-y-6 p-6 border rounded-lg bg-white">
          {/* Card Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
              <div className="h-8 w-36 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>

          {/* Product List Skeleton */}
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="grid sm:grid-cols-2 gap-4">
                {/* Image Skeleton */}
                <div className="aspect-square w-full bg-gray-200 animate-pulse rounded-lg" />

                {/* Product Info Skeleton */}
                <div className="space-y-3 relative">
                  <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                  <div className="absolute top-0 right-0 h-8 w-28 bg-gray-200 animate-pulse rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
