import { Suspense } from "react";
import StoreProfile from "../component/store-profile";

function Page({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={`My Dashboard`}>
      <StoreProfile params={params}/>
    </Suspense>
  );
}

export default Page;