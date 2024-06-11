"use client";

import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SellerAside from "../component/seller-aside";
// import { fetchOrders } from "@/lib/actions/user.actions";
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

export default function Page() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post<{ orders: Order[] }>(
          "/api/seller/orders"
        );
        console.log("sellerdata", response);
        console.log("sellerdata.data", response.data);
        setOrders(response.data.orders);
      } catch (error: any) {
        console.error("Failed to fetch user data", error.message);
      }
    };

    fetchUserData();
  }, []);
  // const orders: Order[] = await fetchOrders(params.slug);

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
      <div className="grid min-h-screen max-w-6xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/10 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <SellerAside />
          </div>
        </div>
        <div className="flex flex-col">
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
                    ${totalRevenue.toFixed(2)}
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
                        <TableHead className="text-right">
                          Total Amount
                        </TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders!.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">
                            {order._id}
                          </TableCell>
                          <TableCell>
                            {order.products.map((productOrder) => (
                              <div key={productOrder.product._id}>
                                {productOrder.product.productName}
                              </div>
                            ))}
                          </TableCell>
                          <TableCell>
                            {order.products.map((productOrder) => (
                              <div key={productOrder.product._id}>
                                {productOrder.quantity}
                              </div>
                            ))}
                          </TableCell>
                          <TableCell>
                            {order.products.map((productOrder) => (
                              <div key={productOrder.product._id}>
                                ${productOrder.price}
                              </div>
                            ))}
                          </TableCell>
                          <TableCell className="text-right">
                            ${order.totalAmount}
                          </TableCell>
                          <TableCell>{order.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={4}>Total</TableCell>
                        <TableCell className="text-right">
                          ${totalRevenue.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  } else {
    return (
      <div className="grid min-h-screen max-w-6xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/10 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <SellerAside />
          </div>
        </div>
        <div className="flex flex-col">
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8"></main>
        </div>
      </div>
    );
  }
}
