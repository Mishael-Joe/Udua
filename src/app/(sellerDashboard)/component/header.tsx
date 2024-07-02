"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  MenuIcon,
  Package,
  Package2Icon,
  ShoppingCartIcon,
} from "lucide-react";
import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";

export function Header() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<string>(searchParams.get("tab") || "matrics");

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between space-x-4 px-6 sm:space-x-0">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <Link href="/" className="flex items-center space-x-2">
              <Icons.logo className="h-7 w-7" />
              <span className=" sm:text-xl font-bold">{siteConfig.name}</span>
            </Link>
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
                {/* Dashboard */}Orders
              </Link>

              {/* <Link
            href="/orders?tab=orders"
            className={
              tab === "orders"
                ? "flex items-center gap-3 rounded-lg bg-muted-foreground px-3 py-2 text-muted transition-all hover:text-primary"
                : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            }
          >
            <ShoppingCartIcon className="h-4 w-4" />
            Orders
          </Link> */}

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
            {/* <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div> */}
          </SheetContent>
        </Sheet>
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-7 w-7 sm:inline-block hidden" />
            <span className=" sm:text-xl font-bold">{siteConfig.name}</span>
          </Link>
        </div>
        <div className="flex gap-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
