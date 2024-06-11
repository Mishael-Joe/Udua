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
        const response = await axios.post<{ data: User }>(
          "/api/users/userData"
        );
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
    <section className="grid min-h-screen max-w-6xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ... px-5 md:px-4 gap-4">
      <div className="hidden bg-muted/10 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <Aside slug={userData._id!} />
        </div>
      </div>
      <Suspense fallback={<SkeletonLoader />}>{getTab(data)}</Suspense>
    </section>
  );
};

export default Profile;
