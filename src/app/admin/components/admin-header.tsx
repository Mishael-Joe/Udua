import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Suspense } from "react";
import AdminSheets from "./admin-sheets";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between space-x-4 px-6 sm:space-x-0">
        <MainNav />

        <div className="flex items-center space-x-1">
          <ThemeToggle />

          <AdminSheets />
        </div>
      </div>
    </header>
  );
}
