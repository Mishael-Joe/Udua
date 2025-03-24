import { Suspense } from "react";
import { VerifyProductPage } from "../../components/admin-verify-pro-slug-page";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  return (
    <div className="py-4">
      <Suspense fallback={"Admin dashboard"}>
        <VerifyProductPage params={params} />
      </Suspense>
    </div>
  );
}
