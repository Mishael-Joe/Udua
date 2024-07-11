import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Suspense } from "react";
import { cookies } from "next/headers";
import AdminSheets from "./admin-sheets";

export function SiteHeader() {

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between space-x-4 px-6 sm:space-x-0">
        <Suspense fallback={`search bar`}>
          <div className="flex items-center justify-center gap-3">
            <div className="md:hidden">
              <AdminSheets />
            </div>

            <div className="hidden items-center md:inline-flex">
              <MainNav />
            </div>
          </div>
        </Suspense>

        {/* <Suspense fallback={`search bar`}>
          <div className="hidden items-center md:inline-flex">
            <SearchBar />
          </div>
        </Suspense> */}

        <div className="flex items-center space-x-1">

          <ThemeToggle />

        </div>
      </div>
    </header>
  );
}
