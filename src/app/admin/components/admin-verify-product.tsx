"use client";

import { CreditCard, Loader, MoreHorizontalIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product as Products } from "@/types";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { withAdminAuth } from "./auth/with-admin-auth";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { formatNaira } from "@/lib/utils";

type UnverifiedProducts = Products & {
  createdAt: Date;
};

function UnverifiedProducts() {
  const [allUnverifiedProduct, setAllUnverifiedProduct] = useState<
    UnverifiedProducts[] | null
  >([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post<{
          UnverifiedProducts: UnverifiedProducts[];
        }>("/api/admin/fetch-unverified-products");
        // console.log("response.data.UnverifiedProducts", response.data.UnverifiedProducts);
        setAllUnverifiedProduct(response.data.UnverifiedProducts);
      } catch (error: any) {
        console.error("Failed to fetch user data", error.message);
      }
    };

    fetchUserData();
  }, []);

  if (allUnverifiedProduct === null) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin" /> Loading...
        </p>
      </div>
    );
  }

  // Calculate total revenue and total sales
  if (allUnverifiedProduct !== null) {
    return (
      <main className="flex flex-col gap-4 py-4 md:py-0 px-6 md:gap-8">
        <h1 className="text-2xl font-semibold ">
          Products submitted for verification
        </h1>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sum of all unverified products
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                + {allUnverifiedProduct.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Unverified Products</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <Table>
                <TableCaption>
                  This tabel shows all products that are yet to be verified.
                </TableCaption>
                <TableHeader>
                  <TableRow className=" text-[12.8px]">
                    <TableHead className="hidden lg:flex items-center justify-center ">
                      Image
                    </TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Product Price</TableHead>
                    <TableHead>More</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUnverifiedProduct!.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="hidden lg:inline">
                        <Image
                          src={product.images[0]}
                          className=" rounded-md object-fill h-20 w-20"
                          width={100}
                          height={100}
                          alt={product.name}
                        />
                      </TableCell>

                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>

                      <TableCell className="font-medium">
                        {product._id}
                      </TableCell>

                      <TableCell className="font-medium">
                        {product.productType === "physicalproducts" ? (
                          <p>{formatNaira(product.price!)}</p>
                        ) : (
                          <p>Size Base</p>
                        )}
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontalIcon className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Link href={`/admin/pro/${product._id}`}>
                              <DropdownMenuItem>More</DropdownMenuItem>
                            </Link>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  } else {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8"></main>
    );
  }
}

export const AllUnverifiedProduct = withAdminAuth(UnverifiedProducts, {
  requiredPermissions: [PERMISSIONS.VERIFY_PRODUCT],
});
