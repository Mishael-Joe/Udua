import UploadDeal from "../component/create-deal";
import { Suspense } from "react";

async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return (
    <Suspense fallback={`Loading...`}>
      <UploadDeal params={params} />
    </Suspense>
  );
}

export default Page;
