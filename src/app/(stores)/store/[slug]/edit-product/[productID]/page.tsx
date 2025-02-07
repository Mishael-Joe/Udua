import EditProduct from "../../component/edit-product";
import { Suspense } from "react";

export default async function Page(props: { params: Promise<{ productID: string }> }) {
  const params = await props.params;
  return (
    <Suspense fallback={`My Dashboard`}>
      <EditProduct params={params}/>
    </Suspense>
  );
}
