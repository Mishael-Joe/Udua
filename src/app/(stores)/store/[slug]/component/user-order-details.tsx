"use client";

import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { Order } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const orderStatus = ["Processing", "Shipped", "Out for Delivery"];

export default function OrderDetails({
  params,
}: {
  params: { orderID: string };
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [deliveryStatus, setDeliverStatus] = useState({
    status: "",
  });
  const [orderDetails, setOrderDetails] = useState<Order>();
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.post("/api/user/orderDetails", {
          orderID: params.orderID,
        });
        setOrderDetails(response.data.orderDetail);
        // console.log(`response.data.oederDetail`, response.data.orderDetail);
      } catch (error: any) {
        console.error("Failed to fetch seller Products", error.message);
      }
    };

    fetchOrderData();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const { name, value } = e.target;

    setDeliverStatus((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    // console.log(product);
  };

  const handleSubmit = async () => {
    if (deliveryStatus.status === "") {
      toast({
        variant: `destructive`,
        title: `Error`,
        description: `Please select an option`,
      });
      return;
    }
    const body = {
      orderID: orderDetails !== undefined ? orderDetails._id : params.orderID,
      updatedDeliveryStatus: deliveryStatus.status,
    };
    try {
      const response = await axios.post(
        "/api/store/update-order-delivery-status",
        {
          body,
        }
      );

      if (response.status === 200) {
        toast({
          title: `Success`,
          description: `You have Successfully updated this product order status to ${deliveryStatus.status}.`,
        });
      } else {
        toast({
          variant: `destructive`,
          title: `Error`,
          description: `Failed to update this product order status.`,
        });
      }
      // console.log(`response.data.oederDetail`, response.data.orderDetail);
    } catch (error: any) {
      console.error(
        "`Failed to update this product order status",
        error.message
      );
      toast({
        variant: `destructive`,
        title: `Error`,
        description: `Failed to update this product order status.`,
      });
    } finally {
      router.refresh();
    }
  };

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
      <main className="flex flex-col gap-4 p-4 md:py-4">
        <div className="flex flex-row justify-between items-center">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">My Store</Link>
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
              Here's the summary for this order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <h2>Order ID: {orderDetails._id}</h2>
              <p>
                Order Date: {new Date(orderDetails.createdAt).toLocaleString()}
              </p>
              <p>Status: {orderDetails.status}</p>
              {/* <p>
                Total Amount: &#8358;
                {addCommasToNumber(orderDetails.totalAmount)}
              </p>
              <p>Shipping Address: {orderDetails.shippingAddress}</p>
              <p>Shipping Method: {orderDetails.shippingMethod}</p>
              <p>Tracking Number: {orderDetails.trackingNumber}</p> */}
              <p>Payment Method: {orderDetails.paymentMethod}</p>
              <p>Payment Status: {orderDetails.paymentStatus}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex gap-3 w-full justify-between">
              <CardTitle>
                Product{orderDetails.products.length > 1 && "s"} Purchased
              </CardTitle>

              <CardDescription className="flex flex-col gap-2 items-end">
                Delivery Status: {orderDetails.deliveryStatus}
                {orderDetails.deliveryStatus !== "Delivered" &&
                  orderDetails.deliveryStatus !== "Canceled" &&
                  orderDetails.deliveryStatus !== "Returned" &&
                  orderDetails.deliveryStatus !== "Failed Delivery" &&
                  orderDetails.deliveryStatus !== "Refunded" && (
                    <>
                      <select
                        aria-label="Select Delivery Status"
                        name="status"
                        value={deliveryStatus.status}
                        onChange={handleChange}
                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                      >
                        <option value="" disabled>
                          Mark as
                        </option>
                        {orderStatus.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <Button
                        className="bg-purple-500 hover:bg-purple-600 text-xs w-fit"
                        onClick={handleSubmit}
                      >
                        Update
                      </Button>
                    </>
                  )}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {orderDetails.products.map((product) => (
              <div
                className="grid sm:grid-cols-2 gap-4 text-sm w-full relative"
                key={product.product.productName}
              >
                <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
                  {product.product !== null && product.product !== null && (
                    <Image
                      src={product.product.productImage[0]}
                      alt={product.product.productName}
                      width={300}
                      height={150}
                      className="h-full w-full object-cover object-center"
                      quality={90}
                    />
                  )}
                </div>

                <div className="">
                  <h3 className="mt-4 font-medium">
                    Product Name:
                    {product.product && product.product.productName}
                  </h3>
                  <p className="mt-2 font-medium">
                    Quantity Bought: {product.quantity && product.quantity}
                  </p>
                  {product.price && (
                    <p className="mt-2 font-medium">
                      At Price: &#8358; {addCommasToNumber(product.price)}{" "}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    );
  }
}
