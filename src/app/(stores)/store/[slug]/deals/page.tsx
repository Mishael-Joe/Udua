import { Suspense } from "react";
import { DealsPage } from "../component/deals";

async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;

  return (
    <Suspense fallback={`My Products`}>
      <DealsPage params={params} />
    </Suspense>
  );
}

export default Page;
