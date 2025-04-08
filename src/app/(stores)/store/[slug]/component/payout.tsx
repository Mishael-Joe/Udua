"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { security } from "@/constant/constant";
import { Order, Settlement } from "@/types";
import {
  ArrowUpRightFromSquare,
  Loader2,
  MoreHorizontalIcon,
  Wallet,
  Clock,
  ShieldCheck,
} from "lucide-react";
import {
  calculateCommission,
  currencyOperations,
  formatNaira,
} from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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
  const getIcon = () => {
    switch (item.title) {
      case "Available Payout":
        return <Wallet className="h-6 w-6 text-green-600" />;
      case "Security":
        return <ShieldCheck className="h-6 w-6 text-blue-600" />;
      case "Pending Settlement":
        return <Clock className="h-6 w-6 text-orange-600" />;
      default:
        return <Wallet className="h-6 w-6" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{item.title}</CardTitle>
          {getIcon()}
        </div>
        <CardDescription className="pt-2">{item.desc}</CardDescription>
      </CardHeader>
      {item.link ? (
        <CardFooter className="mt-auto">
          <Link href={`/store/${slug}/payout-history`} className="w-full">
            <Button variant="outline" className="w-full flex justify-between">
              View History
              <ArrowUpRightFromSquare className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      ) : (
        <CardContent>
          <div className="text-3xl font-bold">
            {formatNaira(totalAvailablePayout || 0)}
          </div>
        </CardContent>
      )}
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
        (sum, product) =>
          currencyOperations.add(
            sum,
            calculateCommission(product.priceAtOrder).settleAmount
          ),
        0
      )
    );
  }, 0);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-[180px] rounded-xl" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Payout Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
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

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Fulfilled Orders</CardTitle>
                <CardDescription>Sales available for payout</CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {fulfilledOrders.length} Orders
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fulfilledOrders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-muted/50">
                    <TableCell>
                      <Badge className="bg-green-500">
                        {order.subOrders[0].deliveryStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {order._id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      {formatNaira(
                        order.subOrders[0].products.reduce(
                          (sum, product) =>
                            sum +
                            calculateCommission(product.priceAtOrder)
                              .settleAmount *
                              product.quantity,
                          0
                        )
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                          <Link
                            href={`/store/${params.slug}/order-details/${order._id}`}
                          >
                            <DropdownMenuItem className="cursor-pointer">
                              View Details
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

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pending Settlements</CardTitle>
                <CardDescription>Awaiting payment processing</CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {pendingSettlements.length} Requests
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSettlements.map((settlement) => (
                  <TableRow key={settlement._id} className="hover:bg-muted/50">
                    <TableCell>
                      <Badge className="bg-yellow-500">
                        {settlement.payoutStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{settlement.mainOrderID.slice(-8)}</TableCell>
                    <TableCell>
                      {formatNaira(settlement.settlementAmount)}
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
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>
                            Settlement Actions
                          </DropdownMenuLabel>
                          <Link
                            href={`/store/${params.slug}/order-details/${settlement.mainOrderID}`}
                          >
                            <DropdownMenuItem className="cursor-pointer">
                              View Details
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
