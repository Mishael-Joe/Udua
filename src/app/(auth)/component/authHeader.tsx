import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";

export function AuthHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between space-x-4 px-6 sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-7 w-7" />
            <span className="sm:inline-block hidden sm:text-xl font-bold">
              {siteConfig.name}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
