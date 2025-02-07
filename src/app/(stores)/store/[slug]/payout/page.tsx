import { Suspense } from "react";
import Payout from "../component/payout";

async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return (
    <Suspense fallback={`Loading...`}>
      <Payout params={params}/>
    </Suspense>
  );
}

export default Page;