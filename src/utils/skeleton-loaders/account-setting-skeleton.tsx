export const AccountSettingSkeletonLoader = () => {
  return (
    <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] md:px-4 gap-4">
      {/* Sidebar Skeleton */}
      <aside className="hidden md:block">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-10 w-full bg-gray-300 rounded"></div>
          <div className="h-10 w-full bg-gray-300 rounded"></div>
          <div className="h-10 w-full bg-gray-300 rounded"></div>
          <div className="h-10 w-full bg-gray-300 rounded"></div>
        </div>
      </aside>
      {/* Main Content Skeleton */}
      <main className="flex-1 space-y-6">
        {/* Page Header */}
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-gray-300 rounded"></div>
        </div>
        {/* Grid Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Details Skeleton */}
          <div className="border rounded p-4 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-300 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
            </div>
          </div>
          {/* Shipping Address Skeleton */}
          <div className="border rounded p-4 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-300 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
        {/* Additional Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Change Password Skeleton */}
          <div className="border rounded p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          {/* Delete Account Skeleton */}
          <div className="border rounded p-4 animate-pulse border-red-300">
            <div className="flex items-center justify-between">
              <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            </div>
            <div className="mt-2">
              <div className="h-4 w-full bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
        {/* Verification Reminder Skeleton */}
        <div className="border rounded p-4 animate-pulse">
          <div className="h-6 w-1/3 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
        </div>
      </main>
    </div>
  );
};
