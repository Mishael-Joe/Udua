import { Suspense } from "react";
import ShippingMethodForm from "../component/add-shipping-method";

async function Page() {
  return (
    <Suspense fallback={`Loading...`}>
      <ShippingMethodForm />
    </Suspense>
  );
}

export default Page;
