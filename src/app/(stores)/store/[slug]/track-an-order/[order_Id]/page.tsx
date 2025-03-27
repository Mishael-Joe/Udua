import { Suspense } from "react";
import TrackingPage from "../../component/tracking/tracking-page";

export default async function Page(props: {
  params: Promise<{ order_Id: string }>;
}) {
  const params = await props.params;
  return (
    <Suspense fallback={`Loading...`}>
      <TrackingPage params={params} />
    </Suspense>
  );
}
