import { Suspense } from "react";
import PayoutHistory from "../component/payout-history";

async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return (
    <Suspense fallback={`Loading...`}>
      <PayoutHistory params={params} />
    </Suspense>
  );
}

export default Page;
