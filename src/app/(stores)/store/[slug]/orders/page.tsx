import { Suspense } from "react";
import StoreOrders from "../component/store-orders";

function Page() {
  return (
    <Suspense fallback={`Loading...`}>
      <StoreOrders />
    </Suspense>
  );
}

export default Page;
