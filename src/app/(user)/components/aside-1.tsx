"use client";

import {
  FileEdit,
  HelpCircleIcon,
  LogOut,
  SettingsIcon,
  ShoppingCart,
  UserCheck2Icon,
} from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "@react-hook/media-query";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Aside1() {
  const router = useRouter();
  const pathname = usePathname();
  // console.log("pathname", pathname);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const signOut = async () => {
    try {
      const response = await axios.get("/api/auth/signOut");
      if (response.status === 200) {
        router.refresh();
      }
    } catch (error) {
      return error;
    }
  };

  if (!isDesktop) {
    return (
      <section className="h-full py-5">
        <h1 className="text-center pb-3.5 px-3 border-b font-bold text-black dark:text-slate-200">
          My Account
        </h1>
        <div className="flex h-full w-full flex-col justify-between gap-3 px-3 text-black dark:text-white">
          <ul className="flex flex-col gap-1 text-black dark:text-white">
            <Link
              href={"/profile"}
              className={`show-dropdown-menu1 cursor-pointer ${
                pathname.includes("profile")
                  ? "bg-udua-orange-primary/20 text-udua-orange-primary dark:text-slate-200 font-semibold"
                  : "text-black/70 dark:text-slate-200/70 hover:text-udua-orange-primary/95 dark:hover:text-white"
              } rounded py-2 px-3 mt-5`}
            >
              <p className="flex items-center gap-2">
                <UserCheck2Icon className="" /> Profile
              </p>
            </Link>

            <Link
              href={`/wishlist`}
              className={`show-dropdown-menu1 cursor-pointer ${
                pathname.includes("wishlist")
                  ? "bg-udua-orange-primary/20 text-udua-orange-primary dark:text-slate-200 font-semibold"
                  : "text-black/70 dark:text-slate-200/70 hover:text-udua-orange-primary/95 dark:hover:text-white"
              } rounded py-2 px-3`}
            >
              <p className="flex items-center gap-2">
                <FileEdit className="" /> Wishlist
              </p>
            </Link>

            <Link
              href={`/order-history`}
              className={`show-dropdown-menu1 cursor-pointer ${
                pathname.includes("order-history") || pathname.includes("order")
                  ? "bg-udua-orange-primary/20 text-udua-orange-primary dark:text-slate-200 font-semibold"
                  : "text-black/70 dark:text-slate-200/70 hover:text-udua-orange-primary/95 dark:hover:text-white"
              } rounded py-2 px-3`}
            >
              <p className="flex items-center gap-2">
                <ShoppingCart className="" /> Order History
              </p>
            </Link>

            <Link
              href={`/account-settings`}
              className={`show-dropdown-menu1 cursor-pointer ${
                pathname.includes("account-settings")
                  ? "bg-udua-orange-primary/20 text-udua-orange-primary dark:text-slate-200 font-semibold"
                  : "text-black/70 dark:text-slate-200/70 hover:text-udua-orange-primary/95 dark:hover:text-white"
              } rounded py-2 px-3`}
            >
              <p className="flex items-center gap-2">
                <SettingsIcon className="" /> Account Settings
              </p>
            </Link>

            <Link
              href={`/support`}
              className={`show-dropdown-menu1 cursor-pointer ${
                pathname.includes("support")
                  ? "bg-udua-orange-primary/20 text-udua-orange-primary dark:text-slate-200 font-semibold"
                  : "text-black/70 dark:text-slate-200/70 hover:text-udua-orange-primary/95 dark:hover:text-white"
              } rounded py-2 px-3`}
            >
              <p className="flex items-center gap-2">
                <HelpCircleIcon className="" /> Support and Help
              </p>
            </Link>
          </ul>

          <div className="flex flex-col gap-4 justify-between items-center h-full">
            <div className="">
              <Card>
                <CardHeader>
                  <CardTitle>Create a store</CardTitle>
                  <CardDescription>
                    {/* Let's help you promote your brand on our platform. */}
                    We are here to assist you in promoting your brand
                    effectively on our platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={"/seller-hub"}>
                    <Button size="sm" className="w-full bg-udua-orange-primary/30 text-udua-orange-primary hover:bg-udua-orange-primary/40 font-semibold">
                      Create Store
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={signOut}
              className="hover:bg-udua-orange-primary/30 bg-udua-orange-primary/20 text-udua-orange-primary flex text-lg font-semibold justify-between items-center w-full p-2 rounded px-4"
            >
              <span>Sign out</span> <LogOut />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="custom-scrollbar leftsidebar rounded-md min-h-screen">
      <h1 className="text-center pb-3.5 px-3 border-b font-bold text-black dark:text-slate-200">
        My Account
      </h1>
      <div className="flex w-full flex-1 flex-col justify-between gap-3 px-3 relative text-black dark:text-white">
        <ul className="flex flex-col gap-1 text-black dark:text-white">
          <Link
            href={"/profile"}
            className={`show-dropdown-menu1 cursor-pointer ${
              pathname.includes("profile")
                ? "bg-udua-orange-primary/20 text-udua-orange-primary dark:text-slate-200 font-semibold"
                : "text-black/70 dark:text-slate-200/70 hover:text-udua-orange-primary/95 dark:hover:text-white"
            } rounded py-2 px-3 mt-5`}
          >
            <p className="flex items-center gap-2">
              <UserCheck2Icon className="" /> Profile
            </p>
          </Link>

          <Link
            href={`/wishlist`}
            className={`show-dropdown-menu1 cursor-pointer ${
              pathname.includes("wishlist")
                ? "bg-udua-orange-primary/20 text-udua-orange-primary dark:text-slate-200 font-semibold"
                : "text-black/70 dark:text-slate-200/70 hover:text-udua-orange-primary/95 dark:hover:text-white"
            } rounded py-2 px-3`}
          >
            <p className="flex items-center gap-2">
              <FileEdit className="" /> Wishlist
            </p>
          </Link>

          <Link
            href={`/order-history`}
            className={`show-dropdown-menu1 cursor-pointer ${
              pathname.includes("order-history") || pathname.includes("order")
                ? "bg-udua-orange-primary/20 text-udua-orange-primary dark:text-slate-200 font-semibold"
                : "text-black/70 dark:text-slate-200/70 hover:text-udua-orange-primary/95 dark:hover:text-white"
            } rounded py-2 px-3`}
          >
            <p className="flex items-center gap-2">
              <ShoppingCart className="" /> Order History
            </p>
          </Link>

          <Link
            href={`/account-settings`}
            className={`show-dropdown-menu1 cursor-pointer ${
              pathname.includes("account-settings")
                ? "bg-udua-orange-primary/20 text-udua-orange-primary dark:text-slate-200 font-semibold"
                : "text-black/70 dark:text-slate-200/70 hover:text-udua-orange-primary/95 dark:hover:text-white"
            } rounded py-2 px-3`}
          >
            <p className="flex items-center gap-2">
              <SettingsIcon className="" /> Account Settings
            </p>
          </Link>

          <Link
            href={`/support`}
            className={`show-dropdown-menu1 cursor-pointer ${
              pathname.includes("support")
                ? "bg-udua-orange-primary/20 text-udua-orange-primary dark:text-slate-200 font-semibold"
                : "text-black/70 dark:text-slate-200/70 hover:text-udua-orange-primary/95 dark:hover:text-white"
            } rounded py-2 px-3`}
          >
            <p className="flex items-center gap-2">
              <HelpCircleIcon className="" /> Support and Help
            </p>
          </Link>
        </ul>

        <div className="flex flex-col gap-4 justify-between items-center">
          <div className="mt-auto">
            <Card>
              <CardHeader>
                <CardTitle>Create a store</CardTitle>
                <CardDescription>
                  {/* Let's help you promote your brand on our platform. */}
                  We are here to assist you in promoting your brand effectively
                  on our platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={"/seller-hub"}>
                  <Button size="sm" className="w-full bg-udua-orange-primary/30 text-udua-orange-primary hover:bg-udua-orange-primary/40 font-semibold">
                    Create Store
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={signOut}
            className="hover:bg-udua-orange-primary/30 bg-udua-orange-primary/20 text-udua-orange-primary flex text-lg font-semibold justify-between items-center w-full p-2 rounded px-4"
          >
            <span>Sign out</span> <LogOut />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Aside1;
