import { Suspense } from "react";
import OrderDetails from "../../component/user-order-details";


export default function Page({ params }: { params: { orderID: string } }) {
  return (
    <Suspense fallback={`Loading...`}>
      <OrderDetails params={params}/>
    </Suspense>
  );
}