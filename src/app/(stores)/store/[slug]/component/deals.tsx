import { getStoreDeals } from "@/lib/actions/deal.actions";
import StoreDealCard from "./deals/store-deal-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

export async function DealsPage({ params }: { params: { slug: string } }) {
  const storeId = params.slug;

  const { success, deals, error } = await getStoreDeals(storeId);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Store Deals</h1>
        <Button asChild className="bg-blue-500 hover:bg-udua-blue-primary">
          <Link href={`/store/${storeId}/deals/create`}>
            <Plus className="mr-2 h-4 w-4" />
            Create Deal
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading deals: {error}</p>
          </CardContent>
        </Card>
      )}

      {success && deals!.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Deals Found</CardTitle>
            <CardDescription>
              You haven't created any deals yet. Create your first deal to
              attract more customers!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-blue-500 hover:bg-udua-blue-primary">
              <Link href={`/store/${storeId}/deals/create`}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Deal
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {success && deals!.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals!.map((deal) => (
            <StoreDealCard
              key={deal._id}
              deal={deal}
              params={params}
              // onEdit={(id) => console.log(`Edit deal ${id}`)}
              // onDelete={(id) => console.log(`Delete deal ${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
