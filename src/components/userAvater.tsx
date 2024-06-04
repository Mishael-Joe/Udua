"use client";

import { Fragment } from "react";
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
  const userData = localStorage.getItem("userData");
  const parsedUserData = JSON.parse(userData || "{}");

  if (parsedUserData !== "") {
    const userFirstName = parsedUserData.firstName;

    return (
      <Fragment>
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
      </Fragment>
    );
  }

  if (parsedUserData === "") {
    return (
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
    );
  }
}

export default UserAvater;
