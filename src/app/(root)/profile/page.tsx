"use client";

import Aside from "@/components/aside";
import UserProfile from "@/components/userProfile";
import SkeletonLoader from "@/lib/loaders/skeletonLoader";
import { User } from "@/types";
import axios from "axios";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";
import { WishlistEmpty } from "@/components/wishlist";
import { OrderHistory } from "@/components/order-history";
import AccountSettings from "@/components/account-settings";

const Profile = () => {
  const searchParams = useSearchParams();
  const data = searchParams.get("tab") || "profile";
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<{ data: User }>("/api/users/userData");
        console.log("userdata", response);
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
        return <WishlistEmpty />;
      case "supports":
        return "Support and Help Component";
      default:
        return <UserProfile user={userData!} />;
    }
  }

  return (
    <section className="min-h-screen px-5 md:px-4 py-4 flex flex-row gap-4 max-w-[75rem] mx-auto">
      <aside className="w-1/4 max-md:hidden">
        <Aside />
      </aside>

      <Suspense fallback={<SkeletonLoader />}>{getTab(data)}</Suspense>
    </section>
  );
};

export default Profile;
