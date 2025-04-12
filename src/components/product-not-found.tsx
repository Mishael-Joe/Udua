"use client";

import Link from "next/link";
import { Button } from "./ui/button";

function ProductNotFoundPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The product you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild className="bg-udua-orange-primary">
        <Link href="/products">Browse Products</Link>
      </Button>
    </div>
  );
}

export default ProductNotFoundPage;
