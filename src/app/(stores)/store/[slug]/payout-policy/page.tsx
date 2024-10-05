import { Suspense } from "react";
import PayoutPolicy from "../component/payout-policy";

function Page({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={`Loading...`}>
      <PayoutPolicy />
    </Suspense>
  );
}

export default Page;