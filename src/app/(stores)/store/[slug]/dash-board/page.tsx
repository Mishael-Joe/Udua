"use client";

import { Suspense } from "react";
import StoreDashboard from "../component/store-dash-board";

function Page({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={`My store Dashboard`}>
      <StoreDashboard />
    </Suspense>
  );
}

export default Page;
