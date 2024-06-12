import SellerOrders from "@/components/sellOnAlfaComponents/seller-orders";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense fallback={`Loading...`}>
      <SellerOrders />
    </Suspense>
  );
}

export default Page;
