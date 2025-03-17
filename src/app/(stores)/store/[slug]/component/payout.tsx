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
import { Order, Settlement } from "@/types";
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
  const [pendingSettlements, setPendingSettlements] = useState<Settlement[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFulfilledOrders = async () => {
      try {
        const { data } = await axios.post<{ fulfilledOrders: Order[] }>(
          "/api/store/fulfilied-orders"
        );
        // console.log("data.fulfiliedOrders", data.fulfilledOrders);
        setFulfilledOrders(data.fulfilledOrders);
      } catch (error) {
        console.error("Failed to fetch fulfilled orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFulfilledOrders();
  }, []);

  useEffect(() => {
    const fetchPendingSettlements = async () => {
      try {
        const { data } = await axios.post<{ pendingSettlements: Settlement[] }>(
          "/api/store/settlement/fetch-settlement"
        );
        // console.log("data.pendingSettlement", data.pendingSettlements);
        setPendingSettlements(data.pendingSettlements);
      } catch (error) {
        console.error("Failed to fetch fulfilled orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingSettlements();
  }, []);

  const totalAvailablePayout = fulfilledOrders.reduce((total, order) => {
    return (
      total +
      order.subOrders[0].products.reduce(
        (sum, product) => sum + calculateCommission(product.price).settleAmount,
        0
      )
    );
  }, 0);

  // const totalAvailablePayout = fulfilledOrders.reduce((total, order) => {
  //   return (
  //     total +
  //     order.products.reduce(
  //       (sum, product) => sum + calculateCommission(product.price).settleAmount,
  //       0
  //     )
  //   );
  // }, 0);

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
                  <TableHead>Order ID</TableHead>
                  {/* <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead> */}
                  <TableHead>Payout</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fulfilledOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium text-green-600">
                      {order.subOrders[0].deliveryStatus}
                    </TableCell>

                    <TableCell>
                      {order._id}
                      {/* {order.products.map((productOrder) => (
                        <div key={productOrder.product?._id}>
                          {productOrder.product?.name || "Deleted Product"}
                        </div>
                      ))} */}
                    </TableCell>

                    <TableCell>
                      &#8358;
                      {addCommasToNumber(
                        order.subOrders[0].products.reduce(
                          (sum, product) =>
                            sum +
                            calculateCommission(product.price).settleAmount *
                              product.quantity,
                          0
                        )
                      )}
                      {/* {order.products.map((productOrder) => (
                        <div key={productOrder.product?._id}>
                          &#8358;
                          {addCommasToNumber(
                            calculateCommission(productOrder.price).settleAmount
                          )}
                        </div>
                      ))} */}
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

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Orders Awaiting Settlement</CardTitle>
            <CardDescription>
              Orders that settlement has been requested for and is pending
              completion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                A list of your orders that are in the process of being settled.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Settlement Status</TableHead>

                  <TableHead>Order ID</TableHead>
                  {/* <TableHead>Quantity</TableHead>
                   */}
                  <TableHead>Payout</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSettlements.map((settlement) => (
                  <TableRow key={settlement._id}>
                    <TableCell className="font-medium text-udua-orange-primary">
                      {settlement.payoutStatus}
                    </TableCell>

                    <TableCell>{settlement.mainOrderID}</TableCell>

                    <TableCell>
                      &#8358;
                      {addCommasToNumber(settlement.settlementAmount)}
                    </TableCell>

                    <TableCell>
                      {new Date(settlement.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
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
                            href={`/store/${params.slug}/order-details/${settlement.mainOrderID}`}
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
