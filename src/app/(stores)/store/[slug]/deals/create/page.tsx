import CreateDealForm from "@/components/deals/create-deal-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function CreateDealPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const storeId = params.slug;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href={`/store/${storeId}/deals`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Deals
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Create New Deal</h1>

      <CreateDealForm storeID={storeId} />
    </div>
  );
}
