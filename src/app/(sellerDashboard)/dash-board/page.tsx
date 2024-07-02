import SellerDashboard from "@/app/(sellerDashboard)/component/dash-board";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense fallback={`My Dashboard`}>
      <SellerDashboard />
    </Suspense>
  );
}

export default Page;
