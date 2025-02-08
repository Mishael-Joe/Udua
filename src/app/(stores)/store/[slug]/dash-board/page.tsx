"use client";

import { Suspense, use } from "react";
import StoreDashboard from "../component/store-dash-board";

function Page(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  return (
    <Suspense fallback={`My store Dashboard`}>
      <StoreDashboard params={params}/>
    </Suspense>
  );
}

export default Page;
