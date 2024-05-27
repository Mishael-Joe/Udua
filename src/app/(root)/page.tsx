import LeftSidebar from "@/components/LeftSidebar";
import { ProductGrid } from "@/components/product-grid";
import { fetchProducts } from "@/lib/actions/product.action";
import SkeletonLoader from "@/lib/loaders/skeletonLoader";
import { Product } from "@/types";
import { Suspense } from "react";

export default async function Home() {
  // const products: Product[] = await fetchProducts();
  // console.log(products);
  const handleCategoryData = (categoryData: string) => {
    // setData(categoryData);
  };
  return (
    <main className="min-h-screen px-5 md:px-4 py-4 flex flex-row gap-4 max-w-[75rem] mx-auto">
      <aside className="w-1/4 max-md:hidden">
        <LeftSidebar onCategoryData={handleCategoryData} />
        {/* <DropdownMenu /> */}
      </aside>

      <Suspense fallback={<SkeletonLoader />}>
        {/* <ProductGrid products={products} /> */}
      </Suspense>
    </main>
  );
}
