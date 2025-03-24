import { Suspense } from "react";
import { AdminUnVerifyProduct } from "../components/admin-unverify-product";

export default async function Page() {
  return (
    <div className="py-4">
      <Suspense fallback={"Admin dashboard"}>
        <AdminUnVerifyProduct />
      </Suspense>
    </div>
  );
}
