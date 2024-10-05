import { Suspense } from "react";
import AdminVerifySeller from "../components/admin-verify-seller";

export default async function Page() {
  return (
    <div className="py-4">
      <Suspense fallback={"Admin dashboard"}>
        <AdminVerifySeller />
      </Suspense>
    </div>
  );
}
