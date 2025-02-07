import { Suspense } from "react";
import Security from "../component/security";

async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return (
    <Suspense fallback={`Loading...`}>
      <Security params={params}/>
    </Suspense>
  );
}

export default Page;