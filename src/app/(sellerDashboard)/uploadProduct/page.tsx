import UploadProduct from "@/components/sellOnAlfaComponents/upload-product";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense fallback={`Loading...`}>
      <UploadProduct />
    </Suspense>
  );
}

export default Page;
