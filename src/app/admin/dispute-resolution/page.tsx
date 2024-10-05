import { Suspense } from "react";
import AdminDispute from "../components/admin-dispute";

export default async function Page() {
  return (
    <div className="py-4">
      <Suspense fallback={"Admin dashboard"}>
        <AdminDispute />
      </Suspense>
    </div>
  );
}
