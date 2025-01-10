import BrandProfile from "@/components/brand-profile";
import { Suspense } from "react";

function Page({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={`Loading...`}>
      <BrandProfile params={params} />
    </Suspense>
  );
}

export default Page;