import SellerDashboard from "@/components/sellOnAlfaComponents/dash-board";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense fallback={`My Dashboard`}>
      <SellerDashboard />
    </Suspense>
  );
}

export default Page;
