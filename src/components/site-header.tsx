import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import SearchBar from "./search-bar";
import CartCount from "./cart-count";
import { Suspense } from "react";
import { cookies } from "next/headers";
import UserAvatar from "../app/(user)/components/userAvater";
import Sheets from "./sheet";
import Categories from "./left-sidebar";

export function SiteHeader() {
  const cookieStore = cookies();
  const name: string | undefined = cookieStore.get("userName")?.value;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between space-x-4 px-2.5 sm:space-x-0">
        <Suspense fallback={`search bar`}>
          <div className="flex items-center justify-center gap-3">
            <div className="md:hidden">
              <Sheets />
            </div>

            <div className="hidden items-center md:inline-flex">
              <MainNav />
            </div>
          </div>
        </Suspense>

        <Suspense fallback={`search bar`}>
          <div className="hidden items-center md:inline-flex">
            <SearchBar />
          </div>
        </Suspense>

        <div className="flex items-center space-x-1">
          <div className="hidden md:inline-flex">
            <Categories />
          </div>
          <CartCount />

          {/* <ThemeToggle /> */}

          <UserAvatar name={name} />
        </div>
      </div>
      <Suspense fallback={`search bar`}>
        <div className="mx-auto mb-2 max-w-6xl justify-between space-x-4 px-2.5 items-center md:hidden">
          <SearchBar />
        </div>
      </Suspense>
    </header>
  );
}
