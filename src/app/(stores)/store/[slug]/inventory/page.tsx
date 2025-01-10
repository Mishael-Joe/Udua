import { Suspense } from "react";
import StoreInventory from "../component/store-inventory";

function Page({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={`My Products`}>
      <StoreInventory params={params}/>
    </Suspense>
  );
}

export default Page;
