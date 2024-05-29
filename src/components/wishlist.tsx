"use client";

import Link from "next/link";
import { Plus, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function WishlistEmpty() {
  return (
    <div className="flex h-[450px] w-1/2 shrink-0 items-center justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-gray-800">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <XCircle className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No products added</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Add products to your wishlist.
        </p>
        <Link href="/">
          <Button size="sm" className="relative">
            <Plus className="mr-2 h-4 w-4" />
            Add Products
          </Button>
        </Link>
      </div>
    </div>
  );
}
