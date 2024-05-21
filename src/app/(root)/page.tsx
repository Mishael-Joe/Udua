import LeftSidebar from "@/components/LeftSidebar";
import SkeletonLoader from "@/lib/loaders/skeletonLoader";
import { Suspense } from "react";
import { wait } from "wait";

const HomePage = async () => {
  await wait(1000);

  return <div className="w-full bg-purple-600">Home</div>;
};

export default async function Home() {
  return (
    <main className="min-h-screen px-5 md:px-4 py-4 flex flex-row gap-4 max-w-[75rem] mx-auto">
      <aside className="w-1/4 max-md:hidden">
        <LeftSidebar />
      </aside>

      <Suspense fallback={<SkeletonLoader />}>
        <HomePage />
      </Suspense>
    </main>
  );
}
