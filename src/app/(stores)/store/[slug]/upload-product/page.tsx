import UploadProduct from "../component/upload-product";
import { Suspense } from "react";

async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return (
    <Suspense fallback={`Loading...`}>
      <UploadProduct params={params}/>
    </Suspense>
  );
}

export default Page;
