import { Suspense } from "react";
import AdminAside from "../components/admin-aside";
import AdminOrderDetails from "../components/admin-order-details";

export default async function Page() {

  return (
    <main className="grid min-h-screen mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] px-5 md:px-4 gap-4 max-w-7xl">
      <div className="hidden border-r bg-muted/10 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <AdminAside />
        </div>
      </div>

      <div className="py-4">
        <Suspense fallback={'Admin dashboard'}>
            <AdminOrderDetails />
        </Suspense>
      </div>
    </main>
  );
}
