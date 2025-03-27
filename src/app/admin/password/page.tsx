import { Suspense } from "react";
import { UpdateAdminPassword } from "../components/admin-manage-password";

export default function AdminPassword() {
  return (
    <div className="py-4">
      <Suspense fallback={"Admin dashboard"}>
        <UpdateAdminPassword />
      </Suspense>
    </div>
  );
}
