"use client";

import { Suspense } from "react";
import SignIn from "../component/sign-in";

function Page() {
  return (
    <Suspense fallback={`Sign In`}>
      <SignIn />
    </Suspense>
  );
}

export default Page;