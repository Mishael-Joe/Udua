import { Suspense } from "react";
import AdminCompleteThePayOutPage from "../components/complete-the-payout";

export default async function Page() {
  return (
    <div className="py-4">
      <Suspense fallback={"Admin Complete The PayOut Page"}>
        <AdminCompleteThePayOutPage />
      </Suspense>
    </div>
  );
}
