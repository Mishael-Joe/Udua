import PaymentSuccess from "@/components/payment-successful";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense fallback={`Payment Successful`}>
      <PaymentSuccess />
    </Suspense>
  );
}

export default Page;
