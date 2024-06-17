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
import { Button } from "./ui/button";
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
      const response = await axios.get("/api/users/signOut");
      if (response.status === 200) {
        router.refresh();
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
            userName
          ) : (
            <Avatar>
              <AvatarFallback>
                <User2Icon />
              </AvatarFallback>
            </Avatar>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {userName ? (
            <>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <Link href={`/profile?tab=profile`}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <Link href={`/profile?tab=wishlist`}>
                <DropdownMenuItem>Wishlist</DropdownMenuItem>
              </Link>
              <Link href={`/profile?tab=order-history`}>
                <DropdownMenuItem>Orders</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                <Button onClick={signOut} className="w-full">
                  Sign out
                </Button>
              </DropdownMenuLabel>
            </>
          ) : (
            <Link href={`/sign-in`}>
              <DropdownMenuItem>Sign In</DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Suspense>
  );
}

export default UserAvatar;
