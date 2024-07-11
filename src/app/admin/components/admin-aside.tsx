"use client";

import { usePathname } from "next/navigation";
import {
  FileEdit,
  HelpCircleIcon,
  SettingsIcon,
  ShoppingCart,
  TrendingUp,
  UserCheck2Icon,
} from "lucide-react";
import Link from "next/link";

function AdminAside() {
  const pathname = usePathname();
  console.log("pathname", pathname);
  return (
    <section className="custom-scrollbar leftsidebar rounded-md">
      <h1 className="text-center pb-3.5 px-3 border-b font-bold text-black dark:text-slate-200">
        Admin Dashboard
      </h1>
      <div className="flex w-full flex-1 flex-col gap-3 px-3 relative text-black dark:text-white">
        <ul className="flex flex-col gap-1 text-black dark:text-white">
          <Link
            href={"/admin/verify-products"}
            className={`show-dropdown-menu1 cursor-pointer ${
              pathname.includes("product")
                ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
            } rounded py-2 px-3 mt-5`}
          >
            <p className="flex items-center gap-2">
              <UserCheck2Icon className="" /> Verify Product
            </p>
          </Link>

          <Link
            href={`/admin/verify-seller`}
            className={`show-dropdown-menu1 cursor-pointer ${
              pathname.includes("seller")
                ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
            } rounded py-2 px-3`}
          >
            <p className="flex items-center gap-2">
              <FileEdit className="" /> Verify Seller
            </p>
          </Link>

          <Link
            href={`/admin/order-details`}
            className={`show-dropdown-menu1 cursor-pointer ${
              pathname.includes("order")
                ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
            } rounded py-2 px-3`}
          >
            <p className="flex items-center gap-2">
              <ShoppingCart className="" /> Order details
            </p>
          </Link>

          <Link
            href={`/admin/dispute-resolution`}
            className={`show-dropdown-menu1 cursor-pointer ${
              pathname.includes("dispute")
                ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
            } rounded py-2 px-3`}
          >
            <p className="flex items-center gap-2">
              <ShoppingCart className="" /> Dispute & Resolution
            </p>
          </Link>

          <Link
            href={`/admin/settlement`}
            className={`show-dropdown-menu1 cursor-pointer ${
              pathname.includes("settlement")
                ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
            } rounded py-2 px-3`}
          >
            <p className="flex items-center gap-2">
              <SettingsIcon className="" /> Finance and Settlement
            </p>
          </Link>
        </ul>
      </div>
    </section>
  );
}

export default AdminAside;
