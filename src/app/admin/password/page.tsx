import { Suspense } from "react";
import ResetAdminPassword from "../components/admin-manage-password";

export default async function Page() {
  return (
    <div className="py-4">
      <Suspense fallback={"Admin dashboard"}>
        <ResetAdminPassword />
      </Suspense>
    </div>
  );
}
