"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { HomeIcon, Package, Package2, ShoppingCartIcon } from "lucide-react";

function SellerAside() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<string>(searchParams.get("tab") || "profile");

  return (
    <Suspense fallback={`loading`}>
      <div className="flex h-16 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span className="">Acme Inc</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <Link
            href="/dash-board?tab=matrics"
            className={
              tab === "matrics"
                ? "flex items-center gap-3 rounded-lg bg-muted-foreground px-3 py-2 text-muted transition-all hover:text-primary"
                : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            }
          >
            <HomeIcon className="h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href="/orders?tab=orders"
            className={
              tab === "orders"
                ? "flex items-center gap-3 rounded-lg bg-muted-foreground px-3 py-2 text-muted transition-all hover:text-primary"
                : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            }
          >
            <ShoppingCartIcon className="h-4 w-4" />
            Orders
          </Link>

          <Link
            href="/my-products?tab=products"
            className={
              tab === "products"
                ? "flex items-center gap-3 rounded-lg bg-muted-foreground px-3 py-2 text-muted transition-all hover:text-primary"
                : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            }
          >
            <Package className="h-4 w-4" />
            Products{" "}
          </Link>
        </nav>
      </div>
    </Suspense>
  );
}

export default SellerAside;
