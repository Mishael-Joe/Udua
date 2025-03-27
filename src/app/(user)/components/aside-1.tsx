"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "@react-hook/media-query";
import {
  FileEdit,
  HelpCircleIcon,
  LogOut,
  SettingsIcon,
  ShoppingCart,
  UserCheck2Icon,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathMatch: string | string[];
}

const NavLink = ({ href, icon, label, pathMatch }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = Array.isArray(pathMatch)
    ? pathMatch.some((path) => pathname.includes(path))
    : pathname.includes(pathMatch);

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded py-2 px-3 transition-colors ${
        isActive
          ? "bg-orange-100 text-udua-orange-primary font-semibold" // Orange for active state
          : "text-gray-700 dark:text-gray-300 hover:text-udua-orange-primary dark:hover:text-white" // Gray for inactive state
      }`}
    >
      {icon}
      {label}
    </Link>
  );
};

const StoreCard = () => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle className="text-lg">Partner with {siteConfig.name}</CardTitle>
      <CardDescription>
        We are here to assist you in promoting your brand effectively on our
        platform.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Link href="/partner-with-udua">
        <Button
          size="sm"
          className="w-full bg-udua-orange-primary hover:bg-orange-400 text-white font-semibold" // Blue for primary CTA
        >
          Partner
        </Button>
      </Link>
    </CardContent>
  </Card>
);

export default function Aside1() {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const containerClasses = `flex flex-col gap-3 px-3 text-gray-800 dark:text-gray-200 ${
    isDesktop
      ? "custom-scrollbar leftsidebar rounded-md min-h-screen"
      : "h-full py-5"
  }`;

  const signOut = async () => {
    try {
      const response = await axios.get("/api/auth/signOut");
      if (response.status === 200) {
        router.refresh();
      }
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <section className={containerClasses}>
      <h1 className="text-center pb-3.5 px-3 border-b font-bold text-gray-900 dark:text-gray-100">
        My Account
      </h1>

      <div className="flex flex-1 flex-col justify-between">
        <ul className="flex flex-col gap-1">
          <NavLink
            href="/profile"
            icon={<UserCheck2Icon aria-hidden="true" />}
            label="Profile"
            pathMatch="profile"
          />
          <NavLink
            href="/wishlist"
            icon={<FileEdit aria-hidden="true" />}
            label="Wishlist"
            pathMatch="wishlist"
          />
          <NavLink
            href="/order-history"
            icon={<ShoppingCart aria-hidden="true" />}
            label="Order History"
            pathMatch={["order-history", "order"]}
          />
          <NavLink
            href="/account-settings"
            icon={<SettingsIcon aria-hidden="true" />}
            label="Account Settings"
            pathMatch="account-settings"
          />
          <NavLink
            href="/support"
            icon={<HelpCircleIcon aria-hidden="true" />}
            label="Support and Help"
            pathMatch="support"
          />
        </ul>

        <div className="flex flex-col gap-4 mt-auto">
          <StoreCard />

          {/* <Button
            onClick={signOut}
            className="bg-orange-500 text-white hover:bg-orange-600 flex justify-between items-center text-lg font-semibold p-2 px-4" // Orange for secondary CTA
            aria-label="Sign out"
          >
            <span>Sign out</span>
            <LogOut aria-hidden="true" />
          </Button> */}
        </div>
      </div>
    </section>
  );
}
