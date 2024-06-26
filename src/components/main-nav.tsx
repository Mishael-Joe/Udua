import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";

export function MainNav() {
  return (
    <div className="flex gap-3 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="h-7 w-7" />
        <span className="sm:inline-block hidden sm:text-xl font-bold">
          {siteConfig.name}
        </span>
      </Link>
    </div>
  );
}
