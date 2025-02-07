import { Suspense } from "react";
import StoreProfile from "../component/store-profile";

async function Page() {
  return (
    <Suspense fallback={`My Dashboard`}>
      <StoreProfile />
    </Suspense>
  );
}

export default Page;
