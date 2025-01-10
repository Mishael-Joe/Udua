import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import Image from "next/image";

export function MainNav() {
  return (
    <div className="flex gap-3 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
      <Image src={'/udua-blue.svg'} width={100} height={100} alt="UDUA"/>
        {/* <Icons.logo className="h-7 w-7" />
        <span className="sm:inline-block hidden sm:text-xl font-bold">
          {siteConfig.name}
        </span> */}
      </Link>
    </div>
  );
}
