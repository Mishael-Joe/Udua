import { Suspense } from "react";
import ResetStorePassword from "../component/reset-store-password";

function Page() {
  return (
    <Suspense fallback={`ResetStorePassword`}>
      <ResetStorePassword />
    </Suspense>
  );
}

export default Page;