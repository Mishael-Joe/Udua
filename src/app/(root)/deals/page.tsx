import DealCard from "@/components/deals/deal-card";
import { Suspense } from "react";
import DealsSectionSkeleton from "@/components/deals/deals-section-skeleton";
import { Deal } from "@/types";

export const metadata = {
  title: "Deals & Promotions | Udua",
  description:
    "Discover our latest deals, discounts, and special promotions on a wide range of products.",
};

async function getActiveDeals(limit = 50) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/deals?limit=${limit}`,
      { next: { revalidate: 300 } } // Revalidate every 5 minutes
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch deals: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching deals:", error);
    return { success: false, error: "Failed to load deals" };
  }
}

export default async function DealsPage() {
  const { success, deals, error } = (await getActiveDeals(50)) as {
    success: boolean;
    deals: Deal[];
    error: any;
  }; // Get more deals for the dedicated page

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen max-w-7xl">
      <h1 className="text-3xl font-bold mb-2">Deals & Promotions</h1>
      <p className="text-muted-foreground mb-8">
        Discover our latest offers and save big on your favorite products
      </p>

      {error && (
        <div className="p-4 border border-destructive text-destructive rounded-md">
          Error loading deals: {error}
        </div>
      )}

      {success && deals && deals.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No Active Deals</h2>
          <p className="text-muted-foreground">
            There are no active deals at the moment. Please check back later!
          </p>
        </div>
      )}

      <Suspense fallback={<DealsSectionSkeleton count={12} />}>
        {success && deals && deals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {deals.map((deal) => (
              <DealCard key={deal._id} deal={deal} />
            ))}
          </div>
        )}
      </Suspense>
    </div>
  );
}
