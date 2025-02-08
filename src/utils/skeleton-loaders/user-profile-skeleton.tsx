export const SkeletonLoader = () => {
  return (
    <div className="max-w-7xl mx-auto md:px-4 gap-4 animate-pulse">
      <div className="grid min-h-screen md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Sidebar Skeleton */}
        <div className="hidden bg-muted/10 md:block">
          <div className="h-full p-4 bg-gray-200/50 dark:bg-gray-700"></div>
        </div>

        {/* Main Content Skeleton */}
        <div className="p-4 bg-muted/10 md:border rounded w-full overflow-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center pb-4">
            <div className="h-8 bg-gray-200/50 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200/50 dark:bg-gray-700 rounded w-20"></div>
          </div>

          {/* Profile Sections */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-3 border rounded space-y-4">
              <div className="h-6 bg-gray-200/50 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200/50 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200/50 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>

            <div className="p-3 border rounded space-y-4">
              <div className="h-6 bg-gray-200/50 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="space-y-2">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200/50 dark:bg-gray-700 rounded w-full"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Store Section Skeleton */}
          <div className="w-full border rounded-md p-3 mt-4 space-y-4">
            <div className="h-6 bg-gray-200/50 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200/50 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200/50 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-8 bg-gray-200/50 dark:bg-gray-700 rounded w-32 ml-auto"></div>
            </div>
          </div>

          {/* Recent Products Skeleton */}
          <div className="border p-4 rounded-md shadow-2xl mt-6 bg-udua-orange-primary/20">
            <div className="h-8 bg-gray-200/50 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="flex gap-4 overflow-auto pb-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-40 md:w-52 space-y-2">
                  <div className="aspect-square bg-gray-200/50 dark:bg-gray-700 rounded-lg"></div>
                  <div className="h-4 bg-gray-200/50 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200/50 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
