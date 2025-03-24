"use client";

import axios from "axios";
import { type ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  addCommasToNumber,
  formatCurrency,
  getStatusClassName,
} from "@/lib/utils";

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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import type { DigitalProduct, Order, Product, Settlement } from "@/types";
import { Button } from "@/components/ui/button";
import PayoutDialog from "./payout-dialog-component";
import { calculateCommission } from "@/constant/constant";
import { Badge } from "@/components/ui/badge";

/**
 * Available order status options for updating delivery status
 * These represent the stages an order can progress through before delivery
 */
const orderStatus = ["Processing", "Shipped", "Out for Delivery"];

/**
 * OrderDetails Component
 *
 * Displays comprehensive information about a specific order including:
 * - Order metadata (ID, date, status)
 * - Payment information
 * - Shipping details
 * - Products purchased
 * - Delivery status management
 * - Payout information for sellers
 *
 * @param params - Object containing the orderID from the route parameters
 */
export default function OrderDetails({
  params,
}: {
  params: { orderID: string; slug: string };
}) {
  const { toast } = useToast();

  // State for managing the delivery status update
  const [deliveryStatus, setDeliverStatus] = useState({
    status: "",
  });

  // Track the payout status for delivered orders
  const [payoutStatus, setPayoutStatus] = useState<
    Settlement["payoutStatus"] | null
  >(null);

  // Main order data
  const [orderDetails, setOrderDetails] = useState<Order>();

  // UI state management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /**
   * Fetch order details from the API
   * Includes error handling and timeout logic for better UX
   */
  const fetchOrderData = async () => {
    try {
      const response = await axios.post("/api/store/order-details", {
        orderID: params.orderID,
      });
      setOrderDetails(response.data.orderDetail);
      // console.log(`response.data.oederDetail`, response.data.orderDetail);
      setLoading(false); // Stop loading when data is fetched
    } catch (error: any) {
      setError(true);
      setLoading(false);
      console.error("Failed to fetch seller Products", error.message);
    }
  };
  useEffect(() => {
    // Fetch data when component mounts
    fetchOrderData();

    // Set a timeout to show error message if data isn't fetched within 10 seconds
    // This improves UX by not leaving users in an indefinite loading state
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError(true);
        setLoading(false);
      }
    }, 10000); // 10 seconds timeout

    // Cleanup the timeout when the component unmounts or fetch is successful
    return () => clearTimeout(timeoutId);
  }, [loading]);

  /**
   * Fetch settlement/payout status for this order
   * This is separate from the main order details to handle different data concerns
   */
  useEffect(() => {
    const fetchSettlementStatus = async () => {
      if (orderDetails === undefined) return;
      try {
        const response = await axios.post<{ settlement: Settlement }>(
          "/api/store/fetch-settlement-status",
          {
            mainOrderID:
              orderDetails !== undefined ? orderDetails._id : params.orderID,
            subOrderID:
              orderDetails !== undefined && orderDetails.subOrders[0]._id, // order id for this particular store. Each store in the substore arr has a unique order id
          }
        );
        if (response.status === 200) {
          setPayoutStatus(response.data.settlement.payoutStatus);
        }
      } catch (error: any) {
        console.error("Failed to fetch seller Products", error.message);
      }
    };

    fetchSettlementStatus();
  }, [orderDetails]);

  /**
   * Handle delivery status dropdown change
   * Updates local state when seller selects a new delivery status
   */
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const { name, value } = e.target;

    setDeliverStatus((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  /**
   * Submit the updated delivery status to the API
   * Includes validation and user feedback via toast notifications
   */
  const handleSubmit = async () => {
    // Validate that a status is selected before submission
    if (deliveryStatus.status === "") {
      toast({
        variant: `destructive`,
        title: `Error`,
        description: `Please select an option`,
      });
      return;
    }

    // const body = {
    //   mainOrderID:
    //     orderDetails !== undefined ? orderDetails._id : params.orderID,
    //   subOrderID: orderDetails !== undefined && orderDetails.subOrders[0]._id, // order id for this particular store. Each store in the substore arr has a unique order id
    //   updatedDeliveryStatus: deliveryStatus.status,
    // };

    try {
      const response = await axios.post(
        "/api/store/update-order-delivery-status",
        {
          mainOrderID:
            orderDetails !== undefined ? orderDetails._id : params.orderID,
          subOrderID:
            orderDetails !== undefined && orderDetails.subOrders[0]._id, // order id for this particular store. Each store in the substore arr has a unique order id
          updatedDeliveryStatus: deliveryStatus.status,
        }
      );

      if (response.status === 200) {
        // Refresh the page to show updated data
        fetchOrderData();
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
    }
  };

  // Loading state UI
  if (loading && !error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin" /> Loading...
        </p>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-center text-red-600">
          An error occurred. Please check your internet connection.
        </p>
      </div>
    );
  }

  // Fallback loading state if order details are null/undefined
  if (orderDetails === null || orderDetails === undefined) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin" /> Loading...
        </p>
      </div>
    );
  }

  /**
   * Calculate the total payout amount available to the seller
   * Uses the commission calculation utility to determine the settlement amount
   * after platform fees are deducted
   */
  const totalAvailablePayout = orderDetails.subOrders[0].products.reduce(
    (total, order) => {
      // Sum the prices of all products in order
      return total + calculateCommission(order.price).settleAmount;
    },
    0
  );

  if (orderDetails !== undefined) {
    return (
      <main className="flex flex-col gap-4 p-4 md:py-4">
        {/* Breadcrumb navigation and page title */}
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

        {/* Order summary card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-2xl">
              Order ID: {orderDetails._id}
            </CardTitle>
            <CardDescription>
              Here's the summary for this order.
            </CardDescription>
          </CardHeader>
          <CardContent className="sm:grid grid-cols-2 gap-4">
            {/* Order metadata section */}
            <div>
              <h1 className="mb-2 font-semibold text-xl">Order Details</h1>

              <p>
                Order Date: {new Date(orderDetails.createdAt).toLocaleString()}
              </p>
              <p>Order Status: {orderDetails.status}</p>
              <p>
                Total Amount: &#8358;
                {addCommasToNumber(orderDetails.totalAmount)}
              </p>
            </div>

            {/* Payment information section */}
            <div>
              <h1 className="mb-2 font-semibold text-xl mt-2 sm:mt-0">
                Payment Information
              </h1>

              <p>
                Customer Payment Method:{" "}
                {orderDetails.paymentMethod?.toUpperCase()}
              </p>
              <p>
                Customer Payment Status:{" "}
                {orderDetails.paymentStatus?.toUpperCase()}
              </p>

              {/* Payout information - only shown for delivered orders */}
              {orderDetails.subOrders[0].deliveryStatus === "Delivered" && (
                <p>
                  Payout Amount: &#8358;{" "}
                  {addCommasToNumber(totalAvailablePayout)}
                </p>
              )}
            </div>

            {/* Shipping information section */}
            <div className="col-span-2">
              <h1 className="mb-2 font-semibold text-xl mt-2 sm:mt-0">
                Shipping Information
              </h1>

              <p>Shipping Address: {orderDetails.shippingAddress}</p>
              <p className="text-sm">
                Shipping Method:{" "}
                {orderDetails.subOrders[0].shippingMethod?.name}
              </p>
              <p className="text-sm">
                Shipping Price:{" "}
                {formatCurrency(
                  orderDetails.subOrders[0].shippingMethod?.price!
                )}
              </p>
              <p className="text-sm">
                Estimated Delivery Days:{" "}
                {
                  orderDetails.subOrders[0].shippingMethod
                    ?.estimatedDeliveryDays
                }
              </p>
              <p>Postal Code: {orderDetails.postalCode}</p>
              {/* <p>Tracking Number: {orderDetails._id}</p> */}
            </div>
          </CardContent>

          {/* Payout action section - conditional rendering based on delivery and payout status */}
          <CardFooter className="float-right">
            {orderDetails.subOrders[0].deliveryStatus === "Delivered" && (
              <>
                {payoutStatus === null ? (
                  <PayoutDialog
                    payableAmount={totalAvailablePayout}
                    mainOrderID={orderDetails._id}
                    subOrderID={orderDetails.subOrders[0]._id}
                  />
                ) : payoutStatus === "Requested" ? (
                  <p>Payout Requested</p>
                ) : payoutStatus === "Paid" ? (
                  <p>Payout Paid</p>
                ) : (
                  <p>Unknown Payout Status. Please, contact Udua</p>
                )}
              </>
            )}
          </CardFooter>
        </Card>

        {/* Products purchased card */}
        <Card>
          <CardHeader>
            <div className="flex gap-3 w-full justify-between">
              <CardTitle className="text-lg sm:text-2xl">
                Product{orderDetails.subOrders[0].products.length > 1 && "s"}{" "}
                Purchased
              </CardTitle>

              {/* Delivery status management section */}
              <CardDescription className="flex flex-col gap-2 items-end">
                {orderDetails.stores.length === 1 ? (
                  <>
                    <p>
                      Order Status:{" "}
                      <Badge
                        className={getStatusClassName(
                          orderDetails.subOrders[0].deliveryStatus
                        )}
                      >
                        {orderDetails.subOrders[0].deliveryStatus}
                      </Badge>
                    </p>
                    {/* Only show status update controls for orders that are not in a final state */}
                    {orderDetails.subOrders[0].deliveryStatus !== "Delivered" &&
                      orderDetails.subOrders[0].deliveryStatus !== "Canceled" &&
                      orderDetails.subOrders[0].deliveryStatus !== "Returned" &&
                      orderDetails.subOrders[0].deliveryStatus !==
                        "Failed Delivery" &&
                      orderDetails.subOrders[0].deliveryStatus !==
                        "Refunded" && (
                        <>
                          <select
                            aria-label="Select Delivery Status"
                            name="status"
                            value={deliveryStatus.status}
                            onChange={handleChange}
                            className="block w-full px-2 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
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
                            className="bg-udua-orange-primary/85 hover:bg-udua-orange-primary text-xs w-fit"
                            onClick={handleSubmit}
                          >
                            Update
                          </Button>
                        </>
                      )}
                  </>
                ) : (
                  <Button
                    variant={"link"}
                    className="underline hover:text-udua-orange-primary text-sm w-fit"
                  >
                    <Link
                      href={`/store/${params.slug}/track-an-order/${params.orderID}`}
                    >
                      Track Order
                    </Link>
                  </Button>
                )}
              </CardDescription>
            </div>
          </CardHeader>

          {/* Product grid - displays all products in the order */}
          <CardContent className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-3.5 w-full justify-between">
            {orderDetails.subOrders[0].products.map((product) => {
              // Handle physical products
              if (product.physicalProducts) {
                return (
                  <div
                    className="gri sm:grid-cols-2 gap-4 text-sm w-full relative"
                    key={(product.physicalProducts as Product).name}
                  >
                    {/* Product image */}
                    <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
                      {product.physicalProducts !== null &&
                        (product.physicalProducts as Product).images !==
                          null && (
                          <Image
                            src={
                              (product.physicalProducts as Product).images[0] ||
                              "/placeholder.svg"
                            }
                            alt={(product.physicalProducts as Product).name}
                            width={300}
                            height={150}
                            className="h-full w-full object-cover object-center"
                            quality={90}
                          />
                        )}
                    </div>

                    {/* Product details */}
                    <div className="">
                      <h3 className="mt-4 font-medium truncate">
                        {product.physicalProducts &&
                          ` ${(product.physicalProducts as Product).name}`}
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
                );
              }

              // Handle digital products
              if (product.digitalProducts) {
                return (
                  <div
                    className="gri sm:grid-cols-2 gap-4 text-sm w-full relative"
                    key={(product.digitalProducts as DigitalProduct).title}
                  >
                    {/* Product image */}
                    <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
                      {product.physicalProducts !== null &&
                        (product.digitalProducts as DigitalProduct).coverIMG !==
                          null && (
                          <Image
                            src={
                              (product.digitalProducts as DigitalProduct)
                                .coverIMG[0] || "/placeholder.svg"
                            }
                            alt={
                              (product.digitalProducts as DigitalProduct).title
                            }
                            width={300}
                            height={150}
                            className="h-full w-full object-cover object-center"
                            quality={90}
                          />
                        )}
                    </div>

                    {/* Product details */}
                    <div className="">
                      <h3 className="mt-4 font-medium truncate">
                        {product.digitalProducts &&
                          ` ${
                            (product.digitalProducts as DigitalProduct).title
                          }`}
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
                );
              }
            })}
          </CardContent>
        </Card>
      </main>
    );
  }
}
