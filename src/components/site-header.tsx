import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import SearchBar from "./search-bar";
import CartCount from "./cart-count";
import dynamic from "next/dynamic";

const UserAvater = dynamic(() => import("./userAvater"), { ssr: false });

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between space-x-4 px-6 sm:space-x-0">
        <MainNav />

        <SearchBar />

        <div className="flex items-center space-x-1">
          <CartCount />

          <ThemeToggle />

          <UserAvater />
        </div>
      </div>
    </header>
  );
}
