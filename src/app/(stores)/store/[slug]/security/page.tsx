import { Suspense } from "react";
import Security from "../component/security";

function Page({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={`Loading...`}>
      <Security params={params}/>
    </Suspense>
  );
}

export default Page;