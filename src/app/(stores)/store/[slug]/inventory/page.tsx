import { Suspense } from "react";
import StoreInventory from "../component/store-inventory";

async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return (
    <Suspense fallback={`My Products`}>
      <StoreInventory params={params}/>
    </Suspense>
  );
}

export default Page;
