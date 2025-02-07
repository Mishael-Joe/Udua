export const OderHistorySkeletonLoader = () => {
  return (
    <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] md:px-4 gap-4">
      {/* Sidebar Skeleton */}
      <div className="hidden bg-muted/10 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 p-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-full bg-gray-200 animate-pulse rounded-md"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid gap-4 w-full md:gap-8 py-4 md:py-0">
        <div className="w-full md:border-0 rounded-lg overflow-hidden">
          {/* Card Header Skeleton */}
          <div className="space-y-2 p-6 border-b">
            <div className="h-7 bg-gray-200 animate-pulse w-1/4 rounded-md" />
            <div className="h-4 bg-gray-200 animate-pulse w-1/3 rounded-md" />
          </div>

          {/* Table Skeleton */}
          <div className="p-6 space-y-6">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-6 gap-4 mb-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 animate-pulse rounded-md"
                  style={{ width: i === 0 ? "80px" : "auto" }}
                />
              ))}
            </div>

            {/* Table Rows */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-6 gap-4 items-center p-4 border rounded-lg"
                aria-hidden="true"
              >
                {/* Image Cell */}
                <div className="h-16 w-16 bg-gray-200 animate-pulse rounded-md" />

                {/* Date Cell */}
                <div className="h-4 bg-gray-200 animate-pulse w-3/4 rounded-md" />

                {/* Status Cells */}
                <div className="h-6 bg-gray-200 animate-pulse w-20 rounded-full" />
                <div className="h-6 bg-gray-200 animate-pulse w-24 rounded-full" />

                {/* Amount Cell */}
                <div className="h-4 bg-gray-200 animate-pulse w-1/2 rounded-md" />

                {/* Actions Cell */}
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
