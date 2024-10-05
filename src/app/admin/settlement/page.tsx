import { Suspense } from "react";
import AdminSettlement from "../components/admin-settlement";

export default async function Page() {
  return (
    <div className="py-4">
      <Suspense fallback={"Admin dashboard"}>
        <AdminSettlement />
      </Suspense>
    </div>
  );
}
