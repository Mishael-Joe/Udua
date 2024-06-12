"use client";

import { Suspense, useState, useEffect } from "react";
import { signOut } from "@/utils";
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

interface UserAvatarProps {
  name?: string;
}

function UserAvatar({ name }: UserAvatarProps) {
  const [userName, setUserName] = useState<string | undefined>(name);

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
            <DropdownMenuItem>
              <Link href={`/sign-in`}>Sign In</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Suspense>
  );
}

export default UserAvatar;
