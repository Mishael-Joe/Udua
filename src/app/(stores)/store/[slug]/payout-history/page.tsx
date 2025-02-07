import { Suspense } from "react";
import PayoutHistory from "../component/payout-history";

function Page() {
  return (
    <Suspense fallback={`Loading...`}>
      <PayoutHistory />
    </Suspense>
  );
}

export default Page;
