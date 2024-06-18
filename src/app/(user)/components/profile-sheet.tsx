"use client";

import React, { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  FileEdit,
  HelpCircleIcon,
  SettingsIcon,
  ShoppingCart,
  TrendingUp,
  UserCheck2Icon,
} from "lucide-react";
import Link from "next/link";
import { User } from "@/types";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

type user = {
  user: User;
};

function ProfileSheets({ user }: user) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [tab, setTab] = useState<string>(searchParams.get("tab") || "profile");

  const handleChange = (value: string) => {
    setTab(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("tab", value);
    } else {
      params.delete("tab");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Fragment>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <section className="custom-scrollbar sticky left-0 top-0 z-20 flex h-96 w-full flex-col justify-between pb-5 pt-5 max-md:hidde rounded-md">
              <h1 className="text-center pb-3.5 px-1 border-b font-bold text-black dark:text-slate-200">
                My Account
              </h1>
              <div className="flex w-full flex-1 flex-col gap-3 px-0 relative text-black dark:text-white">
                <ul className="flex flex-col gap-1 text-black dark:text-white">
                  <li
                    className={`show-dropdown-menu1 cursor-pointer ${
                      tab === "profile"
                        ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                        : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
                    } rounded py-2 px-3 mt-5`}
                    onClick={() => handleChange("profile")}
                  >
                    <p className="flex items-center gap-2">
                      <UserCheck2Icon className="" /> Profile
                    </p>
                  </li>

                  <li
                    onClick={() => handleChange("wishlist")}
                    className={`show-dropdown-menu1 cursor-pointer ${
                      tab === "wishlist"
                        ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                        : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
                    } rounded py-2 px-3`}
                  >
                    <p className="flex items-center gap-2">
                      <FileEdit className="" /> Wishlist
                    </p>
                  </li>

                  <li
                    onClick={() => handleChange("order-history")}
                    className={`show-dropdown-menu1 cursor-pointer ${
                      tab === "order-history"
                        ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                        : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
                    } rounded py-2 px-3`}
                  >
                    <p className="flex items-center gap-2">
                      <ShoppingCart className="" /> Order History
                    </p>
                  </li>

                  <li
                    onClick={() => handleChange("account-settings")}
                    className={`show-dropdown-menu1 cursor-pointer ${
                      tab === "account-settings"
                        ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                        : "text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white"
                    } rounded py-2 px-3`}
                  >
                    <p className="flex items-center gap-2">
                      <SettingsIcon className="" /> Account Settings
                    </p>
                  </li>

                  {/* <li
                    onClick={() => handleChange("supports")}
                    className={`show-dropdown-menu1 cursor-pointer ${
                      tab === "supports"
                        ? "bg-slate-600/30 text-black dark:text-slate-200 font-semibold"
                        : "text-black/70 dark:text-slate-200/70 hover:text-black/95"
                    } rounded py-2 px-3`}
                  >
                    <p className="flex items-center gap-2">
                      <HelpCircleIcon className="" /> Support and Help
                    </p>
                  </li> */}

                  {user.isSeller === true && (
                    <li
                      className={`show-dropdown-menu1 cursor-pointer rounded py-2 px-3`}
                    >
                      <p>
                        <Link
                          // href={`/dash-board/${slug}?tab=matrics`}
                          href={`/dash-board?tab=matrics`}
                          className="flex items-center gap-2 hover:underline"
                        >
                          <TrendingUp />
                          seller Profile
                        </Link>
                      </p>
                    </li>
                  )}
                </ul>
              </div>
            </section>
          </nav>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default ProfileSheets;
