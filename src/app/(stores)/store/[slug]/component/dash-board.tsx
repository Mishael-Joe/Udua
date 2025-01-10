"use client";

import { CreditCard, Loader } from "lucide-react";
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
import { Order } from "@/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { addCommasToNumber } from "@/lib/utils";

export default function SellerDashboard() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post<{ orders: Order[] }>(
          "/api/seller/orders"
        );
        // console.log("sellerdata", response);
        // console.log("sellerdata.data.orders", response.data.orders);
        setOrders(response.data.orders);
      } catch (error: any) {
        console.error("Failed to fetch user data", error.message);
      }
    };

    fetchUserData();
  }, []);
  // const orders: Order[] = await fetchOrders(params.slug);

  if (orders === null) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin" /> Loading...
        </p>
      </div>
    );
  }

  // Calculate total revenue and total sales
  if (orders !== null) {
    // Calculate total revenue and total sales
    const totalRevenue = orders.reduce(
      (total, order) => total + order.totalAmount,
      0
    );
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
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              {/* {/* <DollarSign className="h-4 w-4 text-muted-foreground" />  */}
              &#8358;
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                &#8358;{addCommasToNumber(totalRevenue)}
              </div>
              {/* <p className="text-xs text-muted-foreground">
                          +20.1% from last month
                        </p>  */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalSales}</div>
              {/* <p className="text-xs text-muted-foreground">
                          +19% from last month
                        </p>  */}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <Table>
                <TableCaption>A list of your recent orders.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Order ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders!.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order._id}</TableCell>
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
                        &#8358;{addCommasToNumber(order.totalAmount)}
                      </TableCell>
                      <TableCell>{order.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell className="text-right">
                      &#8358;{addCommasToNumber(totalRevenue)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  } else {
    return (
      <main className="flex flex-col">
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8"></div>
      </main>
    );
  }
}
