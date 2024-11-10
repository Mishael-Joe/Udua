"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStateContext } from "@/context/stateContext";

function CartCount() {
  const { totalQuantity } = useStateContext();
  return (
    <Link href="/cart">
      <Button
        size="sm"
        variant="ghost"
        className="dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
      >
        <ShoppingBag className="h-5 w-5" />

        <span className="ml-2 text-sm font-bold">{totalQuantity}</span>

        <span className="sr-only">Cart</span>
      </Button>
    </Link>
  );
}

export default CartCount;
