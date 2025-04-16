"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { getCookie } from "cookies-next";
import axios from "axios";

interface UserAvatarProps {
  name?: string;
}

function UserAvatar({ name }: UserAvatarProps) {
  const router = useRouter();
  const [userName, setUserName] = useState<string | undefined>(name);

  const signOut = async () => {
    try {
      const response = await axios.get("/api/auth/signOut");
      if (response.status === 200) {
        router.push("/sign-in");
      }
      // console.log(`response`, response);

      // return response;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    if (!userName) {
      const cookieName = getCookie("name")?.toString();
      setUserName(cookieName || "");
    }
  }, [userName]);

  return (
    <Suspense fallback={<User2Icon />}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {userName ? (
            <span className="hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out">
              {userName}
            </span>
          ) : (
            <User2Icon className="hover:bg-transparent! hover:text-udua-orange-primary! delay-75! transition-all! ease-in-out!" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {userName ? (
            <>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className=" border" />
              <Link href={`/profile`}>
                <DropdownMenuItem className=" cursor-pointer hover:bg-transparent! hover:text-udua-orange-primary! delay-75! transition-all! ease-in-out! hover:font-semibold">
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link href={`/wishlist`}>
                <DropdownMenuItem className=" cursor-pointer hover:bg-transparent! hover:text-udua-orange-primary! delay-75! transition-all! ease-in-out! hover:font-semibold">
                  Wishlist
                </DropdownMenuItem>
              </Link>
              <Link href={`/order-history`}>
                <DropdownMenuItem className=" cursor-pointer hover:bg-transparent! hover:text-udua-orange-primary! delay-75! transition-all! ease-in-out! hover:font-semibold">
                  Orders
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator className=" border" />
              <DropdownMenuLabel>
                <Button
                  onClick={signOut}
                  variant={`ghost`}
                  className="w-full dark:hover:bg-transparent dark:hover:text-udua-orange-primary font-semibold hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out h-5"
                >
                  Sign out
                </Button>
              </DropdownMenuLabel>
            </>
          ) : (
            <Link href={`/sign-in`}>
              <DropdownMenuLabel>
                <Button
                  onClick={signOut}
                  variant={`ghost`}
                  className="w-full dark:hover:bg-transparent dark:hover:text-udua-orange-primary font-semibold hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out h-5"
                >
                  Sign In
                </Button>
              </DropdownMenuLabel>
            </Link>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Suspense>
  );
}

export default UserAvatar;
