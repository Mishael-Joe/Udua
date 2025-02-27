// components/deals/EmptyDealState.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const EmptyDealState = () => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto max-w-md">
        <svg
          className="mx-auto h-24 w-24 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
        <h3 className="mt-4 text-xl font-medium text-gray-900">
          No deals found
        </h3>
        <p className="mt-2 text-gray-500">
          You haven't created any deals yet. Start creating deals to see
          analytics.
        </p>
        <div className="mt-6">
          <Link href="/deals/create">
            <Button>Create First Deal</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
