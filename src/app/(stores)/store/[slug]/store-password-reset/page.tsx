import { Suspense } from "react";
import ResetStorePassword from "../component/reset-store-password";

function Page({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={`Loading...`}>
      <ResetStorePassword />
    </Suspense>
  );
}

export default Page;