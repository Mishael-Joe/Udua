import BrandProfile from "@/components/brand-profile";
import { Suspense } from "react";

async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return (
    <Suspense fallback={`Loading...`}>
      <BrandProfile params={params} />
    </Suspense>
  );
}

export default Page;