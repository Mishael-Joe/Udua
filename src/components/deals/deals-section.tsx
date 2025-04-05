import DealCard from "./deal-card";
import DealCarousel from "./deal-carousel";
import { Suspense } from "react";
import DealsSectionSkeleton from "./deals-section-skeleton";

async function getActiveDeals(limit = 6) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/deals?limit=${limit}`,
      { next: { revalidate: 300 } } // Revalidate every 5 minutes
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch deals: ${response.statusText}`);
    }
    // console.log("Deals response:", response);
    return await response.json();
  } catch (error) {
    console.error("Error fetching deals:", error);
    return { success: false, error: "Failed to load deals" };
  }
}

interface DealsSectionProps {
  limit?: number;
  showCarousel?: boolean;
}

export default async function DealsSection({
  limit = 6,
  showCarousel = true,
}: DealsSectionProps) {
  const { success, deals, error } = await getActiveDeals(limit);

  if (!success || !deals || deals.length === 0) {
    return null; // Don't show the section if no deals are available
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Hot Deals</h2>
            <p className="text-muted-foreground">
              Limited time offers you don't want to miss
            </p>
          </div>
          <a href="/deals" className="text-sm font-medium hover:underline">
            View all deals →
          </a>
        </div>

        <Suspense fallback={<DealsSectionSkeleton count={limit} />}>
          {showCarousel ? (
            <DealCarousel deals={deals} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <DealCard key={deal._id} deal={deal} />
              ))}
            </div>
          )}
        </Suspense>
      </div>
    </section>
  );
}
