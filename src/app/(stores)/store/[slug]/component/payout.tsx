"use client";

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
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateCommission, security } from "@/constant/constant";
import { Order } from "@/types";
import axios from "axios";
import {
  ArrowUpRightFromSquare,
  Loader,
  MoreHorizontalIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addCommasToNumber } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Payout({ params }: { params: { slug: string } }) {
  // console.log('params', params.slug)
  const [fulfiliedOrders, setfulfiliedOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post<{ fulfiliedOrders: Order[] }>(
          "/api/store/fulfilied-orders"
        );
        // console.log("sellerdata", response);
        // console.log("sellerdata.data.orders", response.data.orders);
        setfulfiliedOrders(response.data.fulfiliedOrders);
      } catch (error: any) {
        console.error("Failed to fetch user data", error.message);
      }
    };

    fetchUserData();
  }, []);

  if (fulfiliedOrders === null) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin" /> Loading...
        </p>
      </div>
    );
  }

  const totalAvailablePayout = fulfiliedOrders.reduce((total, order) => {
    // Sum the prices of all products within each order
    const orderTotal = order.products.reduce((productTotal, productOrder) => {
      return (
        productTotal + calculateCommission(productOrder.price).settleAmount
      );
    }, 0);

    // Add the order's total to the overall total
    return total + orderTotal;
  }, 0);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="w-full">
        <h1 className="text-2xl font-semibold pb-3">Balance Overview</h1>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {security.map((item, i) => {
            if (item.link) {
              return (
                <Link href={item.link} key={i} className="h-full">
                  <Card key={i} className="h-full">
                    <CardHeader>
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>{item.title}</CardTitle>
                        <ArrowUpRightFromSquare />
                      </div>
                      <CardDescription>{item.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            } else if (item.title === "Available Payout") {
              return (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle>{item.title}</CardTitle>
                      <p>&#8358;</p>
                    </div>
                    <CardDescription>{item.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      &#8358; {addCommasToNumber(totalAvailablePayout)}
                    </div>
                  </CardContent>
                </Card>
              );
            } else {
              return (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle>{item.title}</CardTitle>
                      <p>&#8358;</p>
                    </div>
                    <CardDescription>{item.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      &#8358; {item.content}
                    </div>
                  </CardContent>
                </Card>
              );
            }
          })}
        </div>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Fulfilied Orders</CardTitle>
            <CardDescription>Sales available for payout</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8">
            <Table>
              <TableCaption>A list of your available payout.</TableCaption>
              <TableHeader>
                <TableRow className=" text-[12.8px]">
                  <TableHead>Order Status</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity Bought</TableHead>
                  <TableHead>Product Price</TableHead>
                  <TableHead>Payout Amount</TableHead>
                  {/* <TableHead>Payment Status</TableHead> */}
                  <TableHead>Orderd Date</TableHead>
                  <TableHead>More</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fulfiliedOrders!.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium text-green-500">
                      {order.deliveryStatus}
                    </TableCell>

                    <TableCell>
                      {order.products !== null &&
                        order.products.map((productOrder) => (
                          <div
                            key={
                              productOrder.product !== null
                                ? productOrder.product._id
                                : 1
                            }
                          >
                            {productOrder.product !== null
                              ? productOrder.product.productName
                              : "You've deleted this product."}
                          </div>
                        ))}
                    </TableCell>

                    <TableCell>
                      {order.products !== null &&
                        order.products.map((productOrder) => (
                          <div
                            key={
                              productOrder.product !== null
                                ? productOrder.product._id
                                : 1
                            }
                          >
                            {productOrder.quantity}
                          </div>
                        ))}
                    </TableCell>

                    <TableCell>
                      {order.products !== null &&
                        order.products.map((productOrder) => (
                          <div
                            key={
                              productOrder.product !== null
                                ? productOrder.product._id
                                : 1
                            }
                          >
                            &#8358;{addCommasToNumber(productOrder.price)}
                          </div>
                        ))}
                    </TableCell>

                    <TableCell className="text-right">
                      {order.products !== null &&
                        order.products.map((productOrder) => (
                          <div
                            key={
                              productOrder.product !== null
                                ? productOrder.product._id
                                : 1
                            }
                          >
                            &#8358;
                            {addCommasToNumber(
                              calculateCommission(productOrder.price)
                                .settleAmount
                            )}
                          </div>
                        ))}
                    </TableCell>

                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
                          <Link
                            href={`/store/${params.slug}/order-details/${order._id}`}
                          >
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
}
