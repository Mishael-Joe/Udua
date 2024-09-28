"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { addCommasToNumber } from "@/lib/utils";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Aside1 from "@/app/(user)/components/aside-1";
import { Loader } from "lucide-react";

export default function Page({ params }: { params: { slug: string } }) {
  const [orderDetails, setOrderDetails] = useState<any>();
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.post("/api/user/orderDetails", {
          orderID: params.slug,
        });
        setOrderDetails(response.data.orderDetail);
        // console.log(`response.data`, response.data.orderDetail);
      } catch (error: any) {
        console.error("Failed to fetch seller Products", error.message);
      }
    };

    fetchOrderData();
  }, []);

  if (orderDetails === null || orderDetails === undefined) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin" /> Loading...
        </p>
      </div>
    );
  }

  if (orderDetails !== undefined) {
    return (
      <section>
        <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-muted/10 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <Aside1 />
            </div>
          </div>

          <main className="flex flex-col gap-4 p-4 md:py-4">
            <div className="flex flex-row justify-between items-center">
              <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="#">Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="#">Orders</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Order Details</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <h1 className=" font-semibold text-xl">Order Details</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order ID: {orderDetails._id}</CardTitle>
                <CardDescription>
                  Here's a summary for this order.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <h2>Order ID: {orderDetails._id}</h2>
                  <p>
                    Order Date:{" "}
                    {new Date(orderDetails.createdAt).toLocaleString()}
                  </p>
                  <p>Status: {orderDetails.status}</p>
                  <p>
                    Total Amount: &#8358;
                    {addCommasToNumber(orderDetails.totalAmount)}
                  </p>
                  <p>Shipping Address: {orderDetails.shippingAddress}</p>
                  <p>Shipping Method: {orderDetails.shippingMethod}</p>
                  {/* <p>Tracking Number: {orderDetails.trackingNumber}</p> */}
                  <p>Payment Method: {orderDetails.paymentMethod}</p>
                  <p>Payment Status: {orderDetails.paymentStatus}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Product{orderDetails.products.length > 1 && "s"} Purchased
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:gap-x-8">
                  {orderDetails.products.map((product: any) => (
                    <div
                      className="flex flex-col sm:flex-row gap-4 text-sm w-full"
                      key={product.productName}
                    >
                      <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
                        {product.product !== null ||
                          (product.product !== null && (
                            <Image
                              src={product.product.productImage[0]}
                              alt={product.productName}
                              width={300}
                              height={150}
                              className="h-full w-full object-cover object-center"
                              quality={90}
                            />
                          ))}
                      </div>

                      <div>
                        <h3 className="mt-4 font-medium">
                          Product Name:
                          {product.product &&
                            product.product.productName}
                        </h3>
                        <p className="mt-2 font-medium">
                          Quantity: {product.quantity && product.quantity}
                        </p>
                        {product.price && (
                          <p className="mt-2 font-medium">
                            Price: &#8358; {addCommasToNumber(product.price)}{" "}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </section>
    );
  }
}
