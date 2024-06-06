import LeftSidebar from "@/components/LeftSidebar";
import { ProductGrid } from "@/components/product-grid";
import { fetchProducts } from "@/lib/actions/product.action";
import SkeletonLoader from "@/lib/loaders/skeletonLoader";
import { Product } from "@/types";
import { Suspense } from "react";

type Props = {
  searchParams: {
    categories?: string[] | string;
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    inStock?: boolean;
    minRating?: number;
    dateFrom?: string | Date;
    dateTo?: string | Date;
  };
};

export default async function Home({ searchParams }: Props) {
  const { categories } = searchParams;
  // Convert categories string to an array of strings
  const categoriesArray = categories ? (categories as string).split(" ") : [];
  // console.log(`categoriesArray`, categoriesArray);
  // const products: Product[] = await fetchProducts();
  const products: Product[] = await fetchProducts(categoriesArray);
  // console.log(products);

  return (
    <main className="grid min-h-screen mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ... px-5 md:px-4 fle flex-row gap-4 max-w-[75rem]">
      <div className="hidden border-r bg-muted/10 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <LeftSidebar />
        </div>
      </div>

      <div className="py-4">
        <Suspense fallback={<SkeletonLoader />}>
          <ProductGrid products={products} />
        </Suspense>
      </div>
    </main>
  );
}

// ngrok http 3000
