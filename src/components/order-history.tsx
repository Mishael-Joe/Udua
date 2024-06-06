"use client";

import Link from "next/link";
import { Plus, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function OrderHistory() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Order History</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed shadow-sm">
        <div className="mx-auto flex  w-full flex-col items-center justify-center text-center">
          {/* <XCircle className="h-10 w-10 text-muted-foreground" /> */}
          <h3 className="mt-4 text-lg font-semibold w-full">
            We noticed that you haven't made a purchase with us yet.
          </h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground w-full">
            We have a wide range of amazing products that we think you'll love!{" "}
            <br />
            Take a moment to explore our collection and find something special
            just for you.
          </p>
          <Link href="/">
            <Button size="sm" className="relative">
              {/* <Plus className="mr-2 h-4 w-4" /> */}
              View Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
