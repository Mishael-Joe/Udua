"use client";

import React, { Suspense } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import StoreAside from "./store-aside";

export function StoreHeader({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={`Loading...`}>
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between space-x-4 px-6 sm:space-x-0">
          {/* <Sheet>
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
              <StoreAside params={params} />
            </SheetContent>
          </Sheet> */}
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Icons.logo className="h-7 w-7" />
              {/* <Icons.logo className="h-7 w-7 sm:inline-block hidden" /> */}
              <span className=" sm:text-xl font-bold">{siteConfig.name}</span>
            </Link>
          </div>
          {/* <div className="flex gap-x-4">
            <ThemeToggle />
          </div> */}
        </div>
      </header>
    </Suspense>
  );
}
