"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateCommission, security } from "@/constant/constant";
import { Order } from "@/types";
import {
  ArrowUpRightFromSquare,
  Loader,
  MoreHorizontalIcon,
} from "lucide-react";
import { addCommasToNumber } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SecurityCardProps {
  item: (typeof security)[number];
  slug: string;
  totalAvailablePayout?: number;
}

const SecurityCard = ({
  item,
  slug,
  totalAvailablePayout,
}: SecurityCardProps) => {
  if (item.link) {
    return (
      <Link href={`/store/${slug}/payout-history`} className="h-full">
        <Card className="h-full hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between pb-2">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <ArrowUpRightFromSquare className="w-5 h-5" />
            </div>
            <CardDescription>{item.desc}</CardDescription>
          </CardHeader>
        </Card>
      </Link>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between pb-2">
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <span className="text-lg">&#8358;</span>
        </div>
        <CardDescription>{item.desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          &#8358;{" "}
          {item.title === "Available Payout"
            ? addCommasToNumber(totalAvailablePayout || 0)
            : item.content}
        </div>
      </CardContent>
    </Card>
  );
};

export default function Payout({ params }: { params: { slug: string } }) {
  const [fulfilledOrders, setFulfilledOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFulfilledOrders = async () => {
      try {
        const { data } = await axios.post<{ fulfiliedOrders: Order[] }>(
          "/api/store/fulfilied-orders"
        );
        setFulfilledOrders(data.fulfiliedOrders);
      } catch (error) {
        console.error("Failed to fetch fulfilled orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFulfilledOrders();
  }, []);

  const totalAvailablePayout = fulfilledOrders.reduce((total, order) => {
    return (
      total +
      order.products.reduce(
        (sum, product) => sum + calculateCommission(product.price).settleAmount,
        0
      )
    );
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader className="animate-spin w-8 h-8" />
        <p className="text-gray-600">Loading payout data...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-6 p-4 md:p-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Balance Overview</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {security.map((item, i) => (
            <SecurityCard
              key={i}
              item={item}
              slug={params.slug}
              totalAvailablePayout={totalAvailablePayout}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Fulfilled Orders</CardTitle>
            <CardDescription>Sales available for payout</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of your available payouts</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Payout</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fulfilledOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium text-green-600">
                      {order.deliveryStatus}
                    </TableCell>

                    <TableCell>
                      {order.products.map((productOrder) => (
                        <div key={productOrder.product?._id}>
                          {productOrder.product?.name || "Deleted Product"}
                        </div>
                      ))}
                    </TableCell>

                    <TableCell>
                      {order.products.map((productOrder) => (
                        <div key={productOrder.product?._id}>
                          {productOrder.quantity}
                        </div>
                      ))}
                    </TableCell>

                    <TableCell>
                      {order.products.map((productOrder) => (
                        <div key={productOrder.product?._id}>
                          &#8358;{addCommasToNumber(productOrder.price)}
                        </div>
                      ))}
                    </TableCell>

                    <TableCell>
                      {order.products.map((productOrder) => (
                        <div key={productOrder.product?._id}>
                          &#8358;
                          {addCommasToNumber(
                            calculateCommission(productOrder.price).settleAmount
                          )}
                        </div>
                      ))}
                    </TableCell>

                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Order actions"
                          >
                            <MoreHorizontalIcon className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <Link
                            href={`/store/${params.slug}/order-details/${order._id}`}
                            legacyBehavior
                          >
                            <DropdownMenuItem asChild>
                              <a className="cursor-pointer">View Details</a>
                            </DropdownMenuItem>
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
