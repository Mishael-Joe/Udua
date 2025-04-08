import { Suspense } from "react";
import { notFound } from "next/navigation";
// import { getDealById } from "@/lib/actions/deal.actions";
import DealAnalyticsDashboard from "@/components/deals/analytics/deal-analytics-dashboard";
import DealAnalyticsLoading from "@/components/deals/analytics/deal-analytics-loading";

export const metadata = {
  title: "Deal Analytics | Udua",
  description: "Track the performance of your promotional deals and discounts",
};

async function getDealById(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/deals/${id}`,
      { next: { revalidate: 300 } } // Revalidate every 5 minutes
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: "Deal not found" };
      }
      throw new Error(`Failed to fetch deal: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching deal:", error);
    return { success: false, error: "Failed to load deal" };
  }
}

export default async function DealAnalyticsPage({
  params,
}: {
  params: { id: string };
}) {
  const { success, deal, error } = await getDealById(params.id);

  if (!success || !deal) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <Suspense fallback={<DealAnalyticsLoading />}>
        <DealAnalyticsDashboard deal={deal} />
      </Suspense>
    </div>
  );
}
