"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DealAnalyticsChart } from "./deals/DealAnalyticsChart";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

interface DealAnalyticsData {
  title: string;
  redemptionCount: number;
  revenueGenerated: number;
}

function Deals({ params }: { params: { slug: string } }) {
  const { toast } = useToast();
  const [data, setData] = useState<DealAnalyticsData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/store/deals/analytics");
        // console.log("response", response);
        const formattedData = response.data.data.map((deal: any) => ({
          title: deal.title,
          redemptionCount: deal.redemptionCount,
          revenueGenerated: deal.revenueGenerated,
        }));
        // console.log("formattedData", formattedData);
        setData(formattedData);
      } catch (error) {
        toast({
          title: "Error fetching analytics",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  return (
    <main className="flex flex-col">
      {/* Page Header with Semantic HTML */}
      <header className="grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="flex items-center py-6">
          <h1 className="text-lg font-semibold md:text-2xl">Deals</h1>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href={`/store/${params.slug}/create-deal`}
              passHref
              legacyBehavior
            >
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Create a Deal
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Product Table Section */}
      {/* <section
        aria-labelledby="products-table-heading"
        className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1"
      ></section> */}
      <div className="px-6">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
        <div className="bg-white p-4 rounded-lg shadow pl-0">
          <DealAnalyticsChart data={data} />
        </div>
      </div>
    </main>
  );
}

export default Deals;
