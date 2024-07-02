import {
  FileEdit,
  HelpCircleIcon,
  SettingsIcon,
  ShoppingCart,
  TrendingUp,
  UserCheck2Icon,
} from "lucide-react";
import Link from "next/link";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

function ProfileSheets1() {
  return (
    <Fragment>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <section className="custom-scrollbar flex h-96 w-full flex-col justify-between pb-5 pt-5 max-md:hidde rounded-md">
              <h1 className="text-center pb-3.5 px-3 border-b font-bold text-black dark:text-slate-200">
                My Account
              </h1>
              <div className="flex w-full flex-1 flex-col gap-3 px-3 relative text-black dark:text-white">
                <ul className="flex flex-col gap-1 text-black dark:text-white">
                  <Link
                    href={"/profile?tab=profile"}
                    className={`show-dropdown-menu1 cursor-pointer text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white rounded py-2 px-3 mt-5`}
                  >
                    <p className="flex items-center gap-2">
                      <UserCheck2Icon className="" /> Profile
                    </p>
                  </Link>

                  <Link
                    href={`/profile?tab=wishlist`}
                    className={`show-dropdown-menu1 cursor-pointer text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white rounded py-2 px-3`}
                  >
                    <p className="flex items-center gap-2">
                      <FileEdit className="" /> Wishlist
                    </p>
                  </Link>

                  <Link
                    href={`/profile?tab=order-history`}
                    className={`show-dropdown-menu1 cursor-pointer bg-slate-600/30 text-black dark:text-slate-200 font-semibold rounded py-2 px-3`}
                  >
                    <p className="flex items-center gap-2">
                      <ShoppingCart className="" /> Order History
                    </p>
                  </Link>

                  <Link
                    href={`/profile?tab=account-settings`}
                    className={`show-dropdown-menu1 cursor-pointer text-black/70 dark:text-slate-200/70 hover:text-black/95 dark:hover:text-white rounded py-2 px-3`}
                  >
                    <p className="flex items-center gap-2">
                      <SettingsIcon className="" /> Account Settings
                    </p>
                  </Link>

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
                </ul>
              </div>
            </section>
          </nav>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default ProfileSheets1;
