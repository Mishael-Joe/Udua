import UploadProduct from "../component/upload-product";
import { Suspense } from "react";

function Page({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={`Loading...`}>
      <UploadProduct params={params}/>
    </Suspense>
  );
}

export default Page;
