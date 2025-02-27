import { Suspense } from "react";
import Deals from "../component/deals";

async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;

  return (
    <Suspense fallback={`My Products`}>
      <Deals params={params} />
    </Suspense>
  );
}

export default Page;
