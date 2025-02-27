"use client";

import React, { Suspense } from "react";
import { useMediaQuery } from "@react-hook/media-query";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FileBoxIcon,
  HandshakeIcon,
  HomeIcon,
  Package,
  ShieldAlertIcon,
  WalletIcon,
} from "lucide-react";

function StoreAside({ params }: { params: { slug: string } }) {
  const pathname = usePathname();
  // console.log("pathname", pathname);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  // console.log('slug', params?.slug)

  if (!isDesktop) {
    return (
      <Suspense fallback={`loading`}>
        <div className="flex h-16 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex justify-center font-semibold">
            {/* <HomeIcon className="h-6 w-6" /> */}
            My Store
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 gap-2 font-medium lg:px-4">
            <Link
              href={`/store/${params.slug}/my-store`}
              className={`show-dropdown-menu1 cursor-pointer ${
                pathname.includes("my")
                  ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                  : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
              } rounded py-2 px-3 mt-5`}
            >
              <p className="flex gap-3 items-center font-semibold">
                <HomeIcon className="h-5 w-5" />
                Home
              </p>
            </Link>

            <Link
              href={`/store/${params.slug}/dash-board`}
              className={`show-dropdown-menu1 cursor-pointer ${
                pathname.includes("board")
                  ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                  : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
              } rounded py-2 px-3`}
            >
              <p className="flex gap-3 items-center font-semibold">
                <FileBoxIcon className="h-5 w-5" />
                Orders
              </p>
            </Link>

            <Link
              href={`/store/${params.slug}/inventory`}
              className={`show-dropdown-menu1 cursor-pointer ${
                pathname.includes("inventory")
                  ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                  : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
              } rounded py-2 px-3`}
            >
              <p className="flex gap-3 items-center font-semibold">
                <Package className="h-5 w-5" />
                Inventory{" "}
              </p>
            </Link>

            <Link
              href={`/store/${params.slug}/deals`}
              className={`show-dropdown-menu1 cursor-pointer ${
                pathname.includes("deals")
                  ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                  : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
              } rounded py-2 px-3`}
            >
              <p className="flex gap-3 items-center font-semibold">
                <HandshakeIcon className="h-5 w-5" />
                Deals{" "}
              </p>
            </Link>

            <Link
              href={`/store/${params.slug}/payout`}
              className={`show-dropdown-menu1 cursor-pointer ${
                pathname.includes("payout")
                  ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                  : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
              } rounded py-2 px-3`}
            >
              <p className="flex gap-3 items-center font-semibold">
                <WalletIcon className="h-5 w-5" />
                Payout{" "}
              </p>
            </Link>

            <Link
              href={`/store/${params.slug}/security`}
              className={`show-dropdown-menu1 cursor-pointer ${
                pathname.includes("security")
                  ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                  : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
              } rounded py-2 px-3`}
            >
              <p className="flex gap-3 items-center font-semibold">
                <ShieldAlertIcon className="h-5 w-5" />
                Security{" "}
              </p>
            </Link>
          </nav>
        </div>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={`loading`}>
      <div className="flex h-16 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex justify-center font-semibold">
          {/* <HomeIcon className="h-6 w-6" /> */}
          My Store
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 gap-2 font-medium lg:px-4">
          <Link
            href={`/store/${params.slug}/my-store`}
            className={`show-dropdown-menu1 cursor-pointer ${
              pathname.includes("my")
                ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
            } rounded py-2 px-3 mt-5`}
          >
            <p className="flex gap-3 items-center font-semibold">
              <HomeIcon className="h-5 w-5" />
              Home
            </p>
          </Link>

          <Link
            href={`/store/${params.slug}/dash-board`}
            className={`show-dropdown-menu1 cursor-pointer ${
              pathname.includes("board")
                ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
            } rounded py-2 px-3`}
          >
            <p className="flex gap-3 items-center font-semibold">
              <FileBoxIcon className="h-5 w-5" />
              Orders
            </p>
          </Link>

          <Link
            href={`/store/${params.slug}/inventory`}
            className={`show-dropdown-menu1 cursor-pointer ${
              pathname.includes("inventory")
                ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
            } rounded py-2 px-3`}
          >
            <p className="flex gap-3 items-center font-semibold">
              <Package className="h-5 w-5" />
              Inventory{" "}
            </p>
          </Link>

          <Link
            href={`/store/${params.slug}/deals`}
            className={`show-dropdown-menu1 cursor-pointer ${
              pathname.includes("deals") || pathname.includes("create-deal")
                ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
            } rounded py-2 px-3`}
          >
            <p className="flex gap-3 items-center font-semibold">
              <HandshakeIcon className="h-5 w-5" />
              Deals{" "}
            </p>
          </Link>

          <Link
            href={`/store/${params.slug}/payout`}
            className={`show-dropdown-menu1 cursor-pointer ${
              pathname.includes("payout")
                ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
            } rounded py-2 px-3`}
          >
            <p className="flex gap-3 items-center font-semibold">
              <WalletIcon className="h-5 w-5" />
              Payout{" "}
            </p>
          </Link>

          <Link
            href={`/store/${params.slug}/security`}
            className={`show-dropdown-menu1 cursor-pointer ${
              pathname.includes("security")
                ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
            } rounded py-2 px-3`}
          >
            <p className="flex gap-3 items-center font-semibold">
              <ShieldAlertIcon className="h-5 w-5" />
              Security{" "}
            </p>
          </Link>
        </nav>
      </div>
    </Suspense>
  );
}

export default StoreAside;
