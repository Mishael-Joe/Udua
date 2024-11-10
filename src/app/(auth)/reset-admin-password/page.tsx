import { Suspense } from "react";
import ResetAdminPassword from "../component/reset-admin-password";

function Page() {
  return (
    <Suspense fallback={`ResetStorePassword`}>
      <ResetAdminPassword />
    </Suspense>
  );
}

export default Page;