import React from "react";

const OrderDetailsSkeleton = () => {
  return (
    <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] animate-pulse">
      {/* Sidebar Skeleton */}
      <aside className="hidden md:block border-r bg-muted/10 p-4">
        <div className="space-y-4">
          {/* Simulate sidebar items */}
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-8 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-28 bg-gray-200 rounded" />
          <div className="h-8 w-20 bg-gray-200 rounded" />
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex flex-col gap-4 p-4 md:py-4">
        {/* Header Skeleton */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="hidden md:block">
            {/* Breadcrumb simulation */}
            <div className="flex space-x-2">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          </div>
          {/* Page title */}
          <div className="h-6 w-40 bg-gray-200 rounded" />
        </header>

        {/* Order Summary Skeleton */}
        <div className="p-4 border rounded-md bg-white shadow">
          <div className="mb-2">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-3 w-40 bg-gray-200 rounded mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-28 bg-gray-200 rounded mt-1" />
            </div>
            <div>
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-28 bg-gray-200 rounded mt-1" />
            </div>
            <div className="col-span-2">
              <div className="h-3 w-full bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* Products List Skeleton */}
        <div className="p-4 border rounded-md bg-white shadow">
          {/* Header for products card */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
          {/* Loop for each product item; here we simulate 3 items */}
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="grid sm:grid-cols-2 gap-4">
                {/* Image placeholder */}
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                  <div className="aspect-square bg-gray-200" />
                </div>
                {/* Product details placeholder */}
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-8 w-32 bg-gray-200 rounded mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetailsSkeleton;
