"use client";

import Link from "next/link";
import { Plus, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function WishlistEmpty() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Wishlist</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
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
    </div>
  );
}
