import { Suspense } from "react";
import Payout from "../component/payout";

function Page({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={`Loading...`}>
      <Payout params={params}/>
    </Suspense>
  );
}

export default Page;