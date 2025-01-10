import { Suspense } from "react";
import { OrderHistory } from "../components/order-history";

function Page() {
  return (
    <Suspense fallback={`Order History`}>
      <OrderHistory />
    </Suspense>
  );
}

export default Page;
