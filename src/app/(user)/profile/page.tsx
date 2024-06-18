import Profile from "@/app/(user)/components/user-profile";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense fallback={`Profile`}>
      <Profile />
    </Suspense>
  );
}

export default Page;
