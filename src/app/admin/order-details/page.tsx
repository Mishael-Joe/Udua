import { Suspense } from "react";
import AdminOrderDetails from "../components/admin-order-details";

export default async function Page() {
  return (
    <div className="py-4">
      <Suspense fallback={"Admin dashboard"}>
        <AdminOrderDetails />
      </Suspense>
    </div>
  );
}
