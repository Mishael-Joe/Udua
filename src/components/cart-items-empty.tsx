"use client";

import Link from "next/link";
import { Plus, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

// const product = [
//   {
//     images: [
//       "https://res.cloudinary.com/dhngvbjtz/image/upload/v1728083446/qfewevb0j8yfakrjxgsv.jpg",
//     ],
//     name: "Roberto Cavalli Oil Perfume",
//     price: 5500,
//     productQuantity: 12,
//     productType: "Physical Product",
//     quantity: 1,
//     storeID: "66fbae5615b9fec5eac1b9bb",
//     _id: "670075f70d87b0b2b62ad1aa",
//   },
//   {
//     author: "James Clear",
//     coverIMG: [
//       "https://res.cloudinary.com/dhngvbjtz/image/upload/v1734244448/gjzx5wxant0aii1hqvhi.png",
//     ],
//     language: "English",
//     price: 4500,
//     productType: "Digital Product",
//     publisher: "",
//     quantity: 1,
//     title: "Atomic Habits: Tiny Changes, Remarkable Results by James Clear",
//     _id: "675e786172b144a2ec0fce92",
//   },
// ];
export function CartItemsEmpty() {
  return (
    <div className="flex h-[300px] shrink-0 items-center justify-center rounded-md border-2 border-dashed border-gra-300 border-udua-orange-primary/40 dark:border-gray-800">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <XCircle className="h-10 w-10 text-udua-orange-primary/70" />
        <h3 className="mt-4 text-lg font-semibold">No products added</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Add products to your cart.
        </p>
        <Link href="/">
          <Button
            size="sm"
            className="relative bg-udua-orange-primary/85 hover:bg-udua-orange-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Products
          </Button>
        </Link>
      </div>
    </div>
  );
}
