import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import SearchBar from "./search-bar";
import CartCount from "./cart-count";
import { Suspense } from "react";
import { cookies } from "next/headers";
import UserAvatar from "./userAvater";

export function SiteHeader() {
  const cookieStore = cookies();
  const name: string | undefined = cookieStore.get("name")?.value;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between space-x-4 px-6 sm:space-x-0">
        <MainNav />

        <Suspense fallback={`search bar`}>
          <SearchBar />
        </Suspense>

        <div className="flex items-center space-x-1">
          <CartCount />

          <ThemeToggle />

          <UserAvatar name={name} />
        </div>
      </div>
    </header>
  );
}
