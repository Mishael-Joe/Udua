"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { addCommasToNumber } from "@/lib/utils";
import Aside1 from "./aside-1";

export function OrderHistory() {
  const [orders, setOrders] = useState<any>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post("/api/user/orders");
        setOrders(response.data.orders);
        console.log("response.data.orders", response.data.orders);
        console.log(response.data.orders[0].products[0].product.productImage);
      } catch (error: any) {
        console.error("Error fetching orders:", error.message);
      }
    };

    fetchOrders();
  }, []);

  if (orders.length > 0) {
    return (
      <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ... md:px-4 gap-4">
        <div className="hidden bg-muted/10 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <Aside1 />
          </div>
        </div>

        <div className="grid gap-4 w-full md:gap-8 py-4 md:py-0">
          <Card className="w-full md:border-0">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                Manage your orders and view their details.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Delivery Status</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        {order.products !== null &&
                          order.products[0].product.productImage[0] !==
                            undefined && (
                            <Image
                              alt="Product image"
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src={order.products[0].product.productImage[0]}
                              loading="lazy"
                              width="64"
                            />
                          )}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {order.status}
                      </TableCell>
                      <TableCell>
                        {order.deliveryStatus}
                      </TableCell>
                      <TableCell>
                        &#8358;{addCommasToNumber(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Link href={`/order/${order._id}`}>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
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
      </div>
    );
  } else if (orders.length < 1) {
    return (
      <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ... md:px-4 gap-4">
        <div className="hidden bg-muted/10 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <Aside1 />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Order History</h1>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed shadow-sm p-2">
            <div className="mx-auto flex  w-full flex-col items-center justify-center text-center">
              {/* <XCircle className="h-10 w-10 text-muted-foreground" /> */}
              <h3 className="mt-4 text-lg font-semibold w-full">
                We noticed that you haven't made a purchase with us yet.
              </h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground w-full">
                We have a wide range of amazing products that we think you'll
                love! <br />
                Take a moment to explore our collection and find something
                special just for you.
              </p>
              <Link href="/">
                <Button size="sm" className="relative">
                  {/* <Plus className="mr-2 h-4 w-4" /> */}
                  View Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
