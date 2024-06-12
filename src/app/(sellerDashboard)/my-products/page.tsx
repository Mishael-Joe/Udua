import SellerProducts from "@/components/sellOnAlfaComponents/seller-product";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense fallback={`My Products`}>
      <SellerProducts />
    </Suspense>
  );
}

export default Page;
