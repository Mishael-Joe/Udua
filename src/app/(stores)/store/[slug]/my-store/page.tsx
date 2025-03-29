import { Suspense } from "react";
import StoreProfile from "../component/store-profile";

async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense fallback={`My Dashboard`}>
      <StoreProfile id={slug} />
    </Suspense>
  );
}

export default Page;
