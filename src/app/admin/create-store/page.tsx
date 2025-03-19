import { Suspense } from "react";
import { AdminCreateStore } from "../components/create-store";

export default async function Page() {
  return (
    <div className="py-4">
      <Suspense fallback={"Admin dashboard"}>
        <AdminCreateStore />
      </Suspense>
    </div>
  );
}
