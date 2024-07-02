import { Suspense } from "react";
import { Header } from "./header";

export function SellerHeader() {
  return (
    <Suspense fallback={`Loading...`}>
      <Header />
    </Suspense>
  );
}