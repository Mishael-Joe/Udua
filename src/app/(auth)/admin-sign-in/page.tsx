"use client";

import { Suspense } from "react";
import AdminSignIn from "../component/admin-sign-in";

function Page() {
  return (
    <Suspense fallback={`Sign In`}>
      <AdminSignIn />
    </Suspense>
  );
}

export default Page;