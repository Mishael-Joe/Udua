import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";
import UserSheets from "./user-sheet";
import { Icons } from "@/components/icons";
import Link from "next/link";
import Image from "next/image";

export function UserHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between space-x-4 px-6 sm:space-x-0">
        <div className="flex gap-3 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={"/udua-blue.svg"} width={100} height={100} alt="UDUA" />
            {/* <Icons.logo className="h-7 w-7" />
        <span className="sm:inline-block sm:text-xl font-bold">
          {siteConfig.name}
        </span> */}
          </Link>
        </div>

        <div className="flex items-center space-x-1">
          {/* <ThemeToggle /> */}

          <UserSheets />
        </div>
      </div>
    </header>
  );
}
