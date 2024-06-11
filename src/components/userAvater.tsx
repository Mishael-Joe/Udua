"use client";

import { Suspense } from "react";
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

function UserAvater() {
  if (typeof Storage !== "undefined") {
    // Code for localStorage/sessionStorage.
    const userData = localStorage.getItem("userData");
    const parsedUserData = JSON.parse(userData || "{}");
    console.log(parsedUserData);

    if (parsedUserData !== "") {
      const userFirstName = parsedUserData.firstName;

      return (
        <Suspense fallback={<User2Icon />}>
          <DropdownMenu>
            <DropdownMenuTrigger>{userFirstName}</DropdownMenuTrigger>
            <DropdownMenuContent>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </Suspense>
      );
    }

    if (parsedUserData === "") {
      return (
        <Suspense fallback={<User2Icon />}>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback>
                  <User2Icon />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href={`/sign-in`}>Sign In</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Suspense>
      );
    }
  }
}

export default UserAvater;
