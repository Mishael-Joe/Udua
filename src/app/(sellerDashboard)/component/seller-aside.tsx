"use client";

import React, { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { HomeIcon, Package, Package2, ShoppingCartIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function SellerAside() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [tab, setTab] = useState<string>(searchParams.get("tab") || "profile");

  const handleChange = (value: string) => {
    setTab(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("tab", value);
    } else {
      params.delete("tab");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
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
            // onClick={() => handleChange("wishlist")}
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
            {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
              6
            </Badge> */}
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
    </>
  );
}

export default SellerAside;
