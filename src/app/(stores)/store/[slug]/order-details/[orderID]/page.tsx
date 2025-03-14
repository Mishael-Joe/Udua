import { Suspense } from "react";
import OrderDetails from "../../component/user-order-details";

export default async function Page(props: {
  params: Promise<{ orderID: string; slug: string }>;
}) {
  const params = await props.params;
  return (
    <Suspense fallback={`Loading...`}>
      <OrderDetails params={params} />
    </Suspense>
  );
}
