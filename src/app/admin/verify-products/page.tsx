import { Suspense } from "react";
import { AllUnverifiedProduct } from "../components/admin-verify-product";

export default async function Page() {
  return (
    <div className="py-4">
      <Suspense fallback={"Admin dashboard"}>
        <AllUnverifiedProduct />
      </Suspense>
    </div>
  );
}
