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
import { Order } from "@/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { addCommasToNumber } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StoreDashboard({
  params,
}: {
  params: { slug: string };
}) {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.post<{ orders: Order[] }>(
          "/api/store/orders"
        );
        setOrders(data.orders);
        // console.log("data.orders", data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  if (orders === null) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  const totalSales = orders.reduce(
    (count, order) =>
      count +
      order.products.reduce(
        (productCount, productOrder) => productCount + productOrder.quantity,
        0
      ),
    0
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <h1 className="text-2xl font-semibold">Sales Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Orders Pending Fulfillment
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            <Table>
              <TableCaption>
                This table shows all orders with status "Order Placed",
                "Processing", "Shipped", and "Out for Delivery".
              </TableCaption>
              <TableHeader>
                <TableRow className="text-[12.8px]">
                  <TableHead>Order Status</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      {order.deliveryStatus}
                    </TableCell>
                    <TableCell>
                      {order.products.map((productOrder) => {
                        if (productOrder.physicalProducts) {
                          return (
                            <div key={productOrder.physicalProducts._id}>
                              {productOrder.physicalProducts.name ||
                                "Deleted Product"}
                            </div>
                          );
                        }
                        if (productOrder.digitalProducts) {
                          return (
                            <div key={productOrder.digitalProducts._id}>
                              {productOrder.digitalProducts.title ||
                                "Deleted Product"}
                            </div>
                          );
                        }
                      })}
                    </TableCell>
                    <TableCell>
                      {order.products.map((productOrder) => {
                        if (productOrder.physicalProducts) {
                          return (
                            <div key={productOrder.physicalProducts._id}>
                              {productOrder.quantity}
                            </div>
                          );
                        }
                        if (productOrder.digitalProducts) {
                          return (
                            <div key={productOrder.digitalProducts._id}>
                              {productOrder.quantity}
                            </div>
                          );
                        }
                      })}
                    </TableCell>
                    <TableCell>
                      {order.products.map((productOrder) => {
                        if (productOrder.physicalProducts) {
                          return (
                            <div key={productOrder.physicalProducts._id}>
                              &#8358;{addCommasToNumber(productOrder.price)}
                            </div>
                          );
                        }
                        if (productOrder.digitalProducts) {
                          return (
                            <div key={productOrder.digitalProducts._id}>
                              &#8358;{addCommasToNumber(productOrder.price)}
                            </div>
                          );
                        }
                      })}
                    </TableCell>
                    <TableCell>{order.paymentStatus}</TableCell>
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
    </main>
  );
}
