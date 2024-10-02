"use client";

import { Suspense } from "react";
import StoreSignIn from "../component/store-sign-in";

function Page() {
  return (
    <Suspense fallback={`Sign In`}>
      <StoreSignIn />
    </Suspense>
  );
}

export default Page;