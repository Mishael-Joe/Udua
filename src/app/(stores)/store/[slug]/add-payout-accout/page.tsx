import { Suspense } from "react";
import UdatePayoutForm from "../component/update-payout";

function Page() {
  return (
    <Suspense fallback={`Loading...`}>
      <UdatePayoutForm />
    </Suspense>
  );
}

export default Page;
