"use client";

import Aside from "@/app/(user)/components/aside";
import UserProfile from "@/app/(user)/components/userProfile";
import SkeletonLoader from "@/lib/loaders/skeletonLoader";
import { User } from "@/types";
import axios from "axios";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";
import { Wishlist } from "@/app/(user)/components/wishlist";
import { OrderHistory } from "./order-history";
import AccountSettings from "@/components/account-settings";
import CartCount from "../../../components/cart-count";
import { ThemeToggle } from "../../../components/theme-toggle";
import ProfileSheets from "@/app/(user)/components/profile-sheet";
import { Icons } from "../../../components/icons";
import { siteConfig } from "@/config/site";
import Link from "next/link";

const Profile = () => {
  const searchParams = useSearchParams();
  const data = searchParams.get("tab") || "profile";
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post<{ data: User }>(
          "/api/users/userData"
        );
        // console.log("userdata", response);
        setUserData(response.data.data);
      } catch (error: any) {
        console.error("Failed to fetch user data", error.message);
      }
    };

    fetchUserData();
  }, []);

  if (userData === null) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin" /> Loading...
        </p>
      </div>
    );
  }

  function getTab(value: string) {
    switch (value) {
      case "profile":
        return <UserProfile user={userData!} />;
      // return `<UserProfile user={userData} />`;
      case "account-settings":
        // return "Account Settings Component";
        return <AccountSettings user={userData!} />;
      case "order-history":
        return <OrderHistory />;
      case "wishlist":
        return <Wishlist />;
      case "supports":
        return "Support and Help Component";
      default:
        return <UserProfile user={userData!} />;
    }
  }

  return (
    <section className="">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between space-x-4 px-6 sm:space-x-0">
          <Suspense fallback={`search bar`}>
            <div className="flex items-center justify-center gap-3">
              <div className="hidde items-center md:inline-flex">
                <div className="flex gap-3 md:gap-10">
                  <Link href="/" className="flex items-center space-x-2">
                    <Icons.logo className="h-7 w-7" />
                    <span className="sm:inline-block hidde sm:text-xl font-bold">
                      {siteConfig.name}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </Suspense>

          <div className="flex items-center space-x-1">
            <CartCount />

            <ThemeToggle />

            <div className="md:hidden">
              <ProfileSheets user={userData!} />
            </div>
          </div>
        </div>
      </header>

      <div className="grid min-h-screen max-w-6xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ... md:px-4 gap-4">
        <div className="hidden bg-muted/10 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <Aside user={userData!} />
          </div>
        </div>
        <Suspense fallback={<SkeletonLoader />}>{getTab(data)}</Suspense>
      </div>
    </section>
  );
};

export default Profile;
