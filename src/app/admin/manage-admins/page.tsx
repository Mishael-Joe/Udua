import { Suspense } from "react";
import ManageAdmins from "../components/manage-admins";

export default async function Page() {
  return (
    <div className="py-4">
      <Suspense fallback={"Admin dashboard"}>
        <ManageAdmins />
      </Suspense>
    </div>
  );
}
