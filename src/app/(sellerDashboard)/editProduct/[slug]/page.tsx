import EditProduct from "../../component/edit-product";
import { Suspense } from "react";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={`My Dashboard`}>
      <EditProduct params={params}/>
    </Suspense>
  );
}
