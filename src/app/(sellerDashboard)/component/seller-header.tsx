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
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";

export function SellerHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between space-x-4 px-6 sm:space-x-0">
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
            <nav className="grid gap-2 text-lg font-medium">
              {/* <p className="flex items-center gap-2 text-lg font-semibold">
                <Package2Icon className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </p> */}
              <Link
                href="#"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                <HomeIcon className="h-5 w-5" />
                Dashboard
              </Link>
              {/* <Link
                href="#"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                Orders
                
              </Link> */}
              <Link
                href="#"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                <Package className="h-5 w-5" />
                Products
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
