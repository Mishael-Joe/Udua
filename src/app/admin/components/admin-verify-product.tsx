"use client";

import { CreditCard, Loader, MoreHorizontalIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product as  Products } from "@/types";
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

type UnverifiedProducts = Products & {
    createdAt: Date
}

export default function AllUnverifiedProduct() {
  const [allUnverifiedProduct, setAllUnverifiedProduct] = useState<UnverifiedProducts[] | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post<{ UnverifiedProducts: UnverifiedProducts[] }>(
          "/api/admin/fetch-unverified-products"
        );
        // console.log("sellerdata", response);
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
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-2xl font-semibold ">Products submitted for verification</h1>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sum of all unverified products
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+ {allUnverifiedProduct.length}</div>
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
                    <TableHead>Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Product Price</TableHead>
                    {/* <TableHead>Payment Status</TableHead> */}
                    {/* <TableHead>Date</TableHead> */}
                    <TableHead>More</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUnverifiedProduct!.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="font-medium">
                        <Image src={product.productImage[0]} className=" rounded-md object-fill h-20 w-20" width={100} height={100} alt={product.productName} />
                      </TableCell>
                      
                      <TableCell className="font-medium">
                        {product.productName}
                      </TableCell>
                      
                      <TableCell className="font-medium">
                        {product._id}
                      </TableCell>
                      
                      <TableCell className="font-medium">
                        {product.productPrice}
                      </TableCell>

                      {/* <TableCell>
                        {new Date(product.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell> */}

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
                            <Link
                              href={`/admin/pro/${product._id}`}
                            >
                              <DropdownMenuItem>More</DropdownMenuItem>
                            </Link>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {/* <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell className="text-right">
                      &#8358;{addCommasToNumber(totalRevenue)}
                    </TableCell>
                  </TableRow>
                </TableFooter> */}
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
