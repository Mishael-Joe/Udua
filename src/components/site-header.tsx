"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import UserAvater from "./userAvater";
import { useStateContext } from "@/context/stateContext";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { totalQuantity } = useStateContext();

  const defaultSearchQuery = searchParams.get("search") ?? "";

  if (pathname.startsWith("/studio")) return null;

  const displaySearchInput = pathname.endsWith("/");

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get("search");
    router.push(`/?search=${searchQuery}`);
    router.refresh();
    // console.log(searchQuery);
  };
  // console.log('displaySearchInput',displaySearchInput);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between space-x-4 px-6 sm:space-x-0">
        <MainNav />

        {displaySearchInput && (
          <form
            onKeyUp={handleSubmit}
            className="hidden items-center lg:inline-flex"
          >
            <Input
              id="search"
              name="search"
              type="search"
              autoComplete="off"
              placeholder="Search products..."
              className="h-9 lg:w-[300px]"
              defaultValue={defaultSearchQuery}
            />
          </form>
        )}

        <div className="flex items-center space-x-1">
          <Link href="/cart">
            <Button size="sm" variant="ghost">
              <ShoppingBag className="h-5 w-5" />

              <span className="ml-2 text-sm font-bold">{totalQuantity}</span>

              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          <ThemeToggle />

          <UserAvater />
        </div>
      </div>
    </header>
  );
}
