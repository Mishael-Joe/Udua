"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatNaira, getStatusClassName } from "@/lib/utils";
import { useStoreOrderDetails } from "@/hooks/use-store-order-details";

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
import {
  Clock,
  CreditCard,
  DollarSign,
  Gift,
  Loader,
  MapPin,
  Package,
  Percent,
  ShoppingBag,
  Tag,
  Truck,
  Zap,
  CheckCircle2,
  User,
  Phone,
  Home,
  AlertTriangle,
} from "lucide-react";
import type { DigitalProduct, Product } from "@/types";
import { Button } from "@/components/ui/button";
import { PayoutDialog } from "./payout-dialog-component";
import { calculateCommission } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

/**
 * Available order status options for updating delivery status
 * These represent the stages an order can progress through before delivery
 */
const orderStatus = ["Processing", "Shipped", "Out for Delivery"];

/**
 * OrderDetails Component for Store Owners
 *
 * Displays comprehensive information about a specific order including:
 * - Order metadata (ID, date, status)
 * - Customer information
 * - Payment details
 * - Shipping information
 * - Products purchased with deal information
 * - Delivery status management
 * - Payout information for sellers
 *
 * @param params - Object containing the orderID and store slug from the route parameters
 */
export default function StoreOrderDetails({
  params,
}: {
  params: { orderID: string; slug: string };
}) {
  const { toast } = useToast();
  const { orderDetails, loading, error, refetch } = useStoreOrderDetails(
    params.orderID
  );

  // State for managing the delivery status update
  const [deliveryStatus, setDeliverStatus] = useState({
    status: "",
  });

  // Track the payout status for delivered orders
  const [payoutStatus, setPayoutStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Fetch settlement/payout status for this order
   * This is separate from the main order details to handle different data concerns
   */
  useEffect(() => {
    const fetchSettlementStatus = async () => {
      if (!orderDetails) return;

      try {
        const response = await axios.post(
          "/api/store/fetch-settlement-status",
          {
            mainOrderID: orderDetails._id,
            subOrderID: orderDetails.subOrders[0]._id,
          }
        );

        if (response.status === 200) {
          setPayoutStatus(response.data.settlement?.payoutStatus || null);
        }
      } catch (error) {
        console.error("Failed to fetch settlement status", error);
      }
    };

    if (orderDetails) {
      fetchSettlementStatus();
    }
  }, [orderDetails]);

  /**
   * Handle delivery status dropdown change
   */
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setDeliverStatus({ status: e.target.value });
  };

  /**
   * Submit the updated delivery status to the API
   */
  const handleSubmit = async () => {
    if (deliveryStatus.status === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a delivery status",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        "/api/store/update-order-delivery-status",
        {
          mainOrderID: orderDetails?._id,
          subOrderID: orderDetails?.subOrders[0]._id,
          updatedDeliveryStatus: deliveryStatus.status,
        }
      );

      if (response.status === 200) {
        refetch();
        toast({
          title: "Success",
          description: `Order status updated to ${deliveryStatus.status}`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="h-6 w-6 animate-spin text-primary" />
          <span>Loading order details...</span>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg border border-red-200">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Error Loading Order
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Order details not found</p>
        </div>
      </div>
    );
  }

  // Get the first subOrder which is filtered for this store
  const storeOrder = orderDetails.subOrders[0];

  // Check if any products have deal information
  const hasDeals =
    storeOrder.appliedDeals && storeOrder.appliedDeals.length > 0;

  // Calculate the total payout amount
  const totalAvailablePayout = storeOrder.products.reduce(
    (total, order) =>
      total + calculateCommission(order.priceAtOrder).settleAmount,
    0
  );

  return (
    <main className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header with Breadcrumb */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/store/${params.slug}/my-store`}>Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/store/${params.slug}/dash-board`}>Orders</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Order Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Badge className={getStatusClassName(storeOrder.deliveryStatus)}>
          <div className="flex items-center gap-1.5">
            {storeOrder.deliveryStatus === "Processing" && (
              <Package className="h-3.5 w-3.5" />
            )}
            {storeOrder.deliveryStatus === "Shipped" && (
              <Truck className="h-3.5 w-3.5" />
            )}
            {storeOrder.deliveryStatus === "Out for Delivery" && (
              <Truck className="h-3.5 w-3.5" />
            )}
            {storeOrder.deliveryStatus === "Delivered" && (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}
            {storeOrder.deliveryStatus}
          </div>
        </Badge>
      </div>

      {/* Order Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Order #{orderDetails._id.substring(orderDetails._id.length - 8)}
              </CardTitle>
              <CardDescription>
                Placed on{" "}
                {new Date(orderDetails.createdAt).toLocaleDateString()} at{" "}
                {new Date(orderDetails.createdAt).toLocaleTimeString()}
              </CardDescription>
            </div>

            {hasDeals && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <Percent className="h-3 w-3 mr-1" />
                Special Deals Applied
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Customer Information
            </h3>

            <div className="text-sm space-y-2">
              <p className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {typeof orderDetails.user === "object" &&
                  orderDetails.user !== null
                    ? `${orderDetails.user.firstName} ${orderDetails.user.lastName}`
                    : "Customer"}
                </span>
              </p>

              {typeof orderDetails.user === "object" &&
                orderDetails.user?.email && (
                  <p className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-muted-foreground"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>{orderDetails.user.email}</span>
                  </p>
                )}

              {typeof orderDetails.user === "object" &&
                orderDetails.user?.phoneNumber && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{orderDetails.user.phoneNumber}</span>
                  </p>
                )}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              Shipping Information
            </h3>

            <div className="text-sm space-y-2">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span>
                  {orderDetails.shippingAddress || "No address provided"}
                </span>
              </p>

              <p className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span>Postal Code: {orderDetails.postalCode}</span>
              </p>

              {storeOrder.shippingMethod && (
                <div className="pt-1">
                  <p className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {storeOrder.shippingMethod.name} -{" "}
                      {formatNaira(storeOrder.shippingMethod.price)}
                    </span>
                  </p>

                  {storeOrder.shippingMethod.estimatedDeliveryDays && (
                    <p className="flex items-center gap-2 mt-1 ml-6 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        Estimated delivery:{" "}
                        {storeOrder.shippingMethod.estimatedDeliveryDays}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              Payment Information
            </h3>

            <div className="text-sm space-y-2">
              <p className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>
                  Method: {orderDetails.paymentMethod?.toUpperCase() || "N/A"}
                </span>
              </p>

              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span>
                  Status: {orderDetails.paymentStatus?.toUpperCase() || "N/A"}
                </span>
              </p>

              {/* Only show payout info for delivered orders */}
              {storeOrder.deliveryStatus === "Delivered" && (
                <p className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Payout Amount: {formatNaira(totalAvailablePayout)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Order Items
          </CardTitle>

          {/* Deal Summary if deals are applied */}
          {hasDeals && (
            <CardDescription className="mt-2">
              <div className="flex items-center gap-2 text-green-600">
                <Percent className="h-4 w-4" />
                <span>Special deals have been applied to this order</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {storeOrder.appliedDeals?.map((deal, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                        >
                          {deal.dealType === "percentage" && (
                            <Percent className="h-3 w-3" />
                          )}
                          {deal.dealType === "fixed" && (
                            <Tag className="h-3 w-3" />
                          )}
                          {deal.dealType === "flash_sale" && (
                            <Zap className="h-3 w-3" />
                          )}
                          {deal.dealType === "free_shipping" && (
                            <Truck className="h-3 w-3" />
                          )}
                          {deal.dealType === "buy_x_get_y" && (
                            <Gift className="h-3 w-3" />
                          )}
                          {deal.name}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {deal.dealType === "percentage" &&
                            `${deal.value}% off`}
                          {deal.dealType === "fixed" &&
                            `${formatNaira(deal.value)} off`}
                          {deal.dealType === "flash_sale" &&
                            `${deal.value}% off (Flash Sale)`}
                          {deal.dealType === "free_shipping" && "Free Shipping"}
                          {deal.dealType === "buy_x_get_y" &&
                            "Buy X Get Y Free"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          {/* Original vs Discounted Subtotal if savings exist */}
          {storeOrder.originalSubtotal &&
            storeOrder.originalSubtotal >
              storeOrder.totalAmount -
                (storeOrder.shippingMethod?.price || 0) && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Original Subtotal:
                  </span>
                  <span className="text-sm line-through">
                    {formatNaira(storeOrder.originalSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Discounted Subtotal:
                  </span>
                  <span className="text-sm font-medium">
                    {formatNaira(
                      storeOrder.totalAmount -
                        (storeOrder.shippingMethod?.price || 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center text-green-600">
                  <span className="text-sm font-medium">Customer Saved:</span>
                  <span className="text-sm font-medium">
                    {formatNaira(storeOrder.savings || 0)}
                  </span>
                </div>
              </div>
            )}

          {/* Product List */}
          <div className="space-y-6">
            {storeOrder.products.map((product, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 border-b pb-4 last:border-0 last:pb-0"
              >
                {/* Product Image */}
                <div className="relative w-full sm:w-32 h-32 shrink-0">
                  {product.physicalProducts ? (
                    <Image
                      src={
                        (product.physicalProducts as Product).images?.[0] ||
                        "/placeholder.svg"
                      }
                      alt={
                        (product.physicalProducts as Product).name || "Product"
                      }
                      fill
                      className="object-cover rounded-md border"
                      sizes="(max-width: 640px) 100vw, 128px"
                    />
                  ) : product.digitalProducts ? (
                    <Image
                      src={
                        (product.digitalProducts as DigitalProduct)
                          .coverIMG?.[0] || "/placeholder.svg"
                      }
                      alt={
                        (product.digitalProducts as DigitalProduct).title ||
                        "Digital Product"
                      }
                      fill
                      className="object-cover rounded-md border"
                      sizes="(max-width: 640px) 100vw, 128px"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center rounded-md border">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}

                  {/* Deal indicator if present */}
                  {product.dealInfo && (
                    <div className="absolute top-0 right-0">
                      <Badge
                        variant="destructive"
                        className="flex items-center gap-1 rounded-md rounded-tl-none rounded-br-none"
                      >
                        {product.dealInfo.dealType === "percentage" && (
                          <Percent className="h-3 w-3" />
                        )}
                        {product.dealInfo.dealType === "fixed" && (
                          <Tag className="h-3 w-3" />
                        )}
                        {product.dealInfo.dealType === "flash_sale" && (
                          <Zap className="h-3 w-3" />
                        )}
                        {`${
                          product.dealInfo.dealType === "percentage" ||
                          product.dealInfo.dealType === "flash_sale"
                            ? `${product.dealInfo.value}%`
                            : formatNaira(product.dealInfo.value)
                        }`}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col">
                  <h3 className="font-medium">
                    {product.physicalProducts
                      ? (product.physicalProducts as Product).name
                      : (product.digitalProducts as DigitalProduct)?.title ||
                        "Product"}
                  </h3>

                  <div className="text-sm space-y-1 mt-2">
                    <p className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      <span>Quantity: {product.quantity}</span>
                    </p>

                    {/* Size information if present */}
                    {product.selectedSize && (
                      <p className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-muted-foreground"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 2a1 1 0 011 1v1h3a1 1 0 110 2h-3v3a1 1 0 11-2 0V6H6a1 1 0 110-2h3V3a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Size: {product.selectedSize.size}</span>
                      </p>
                    )}

                    {/* Price information with discount if present */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            product.dealInfo ? "text-green-600 font-medium" : ""
                          }
                        >
                          {formatNaira(product.priceAtOrder)}
                        </span>

                        {product.dealInfo && product.originalPrice && (
                          <span className="text-muted-foreground line-through text-xs">
                            {formatNaira(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Deal information if present */}
                  {product.dealInfo && (
                    <div className="mt-auto pt-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-600 border-green-200"
                      >
                        <Percent className="h-3 w-3 mr-1" />
                        {product.dealInfo.name}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Product Total */}
                <div className="text-right">
                  <p className="font-semibold">
                    {formatNaira(product.priceAtOrder * product.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-stretch gap-4 sm:flex-row sm:justify-between sm:items-center pt-0">
          {/* Order Status Update Controls */}
          {storeOrder.deliveryStatus !== "Delivered" &&
            storeOrder.deliveryStatus !== "Canceled" &&
            storeOrder.deliveryStatus !== "Returned" &&
            storeOrder.deliveryStatus !== "Failed Delivery" &&
            storeOrder.deliveryStatus !== "Refunded" && (
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <select
                  aria-label="Select Delivery Status"
                  name="status"
                  value={deliveryStatus.status}
                  onChange={handleChange}
                  className="block w-full px-2 py-2 text-gray-700 bg-white border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="" disabled>
                    Update Status
                  </option>
                  {orderStatus.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <Button
                  className="bg-orange-400 hover:bg-udua-orange-primary"
                  onClick={handleSubmit}
                  disabled={submitting || !deliveryStatus.status}
                >
                  {submitting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </div>
            )}

          {/* Payout Request Button - only for delivered orders */}
          {storeOrder.deliveryStatus === "Delivered" && (
            <>
              {payoutStatus === null ? (
                <PayoutDialog
                  payableAmount={totalAvailablePayout}
                  mainOrderID={orderDetails._id}
                  subOrderID={storeOrder._id}
                />
              ) : payoutStatus === "Requested" ? (
                <div className="bg-amber-50 text-amber-700 px-3 py-2 rounded-md border border-amber-200 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Payout Requested - Processing
                </div>
              ) : payoutStatus === "Paid" ? (
                <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md border border-green-200 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Payout Completed
                </div>
              ) : (
                <div className="bg-amber-50 text-amber-700 px-3 py-2 rounded-md border border-amber-200 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Unknown Payout Status - Contact Support
                </div>
              )}
            </>
          )}
        </CardFooter>
      </Card>

      {/* Order Totals Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {/* <DollarSign className="h-5 w-5 text-primary" /> */}
            Order Summary
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span>
                {formatNaira(
                  storeOrder.totalAmount -
                    (storeOrder.shippingMethod?.price || 0)
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Shipping</span>
              <span>{formatNaira(storeOrder.shippingMethod?.price || 0)}</span>
            </div>

            {storeOrder.savings && storeOrder.savings > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="text-sm font-medium">Customer Savings</span>
                <span className="font-medium">
                  -{formatNaira(storeOrder.savings)}
                </span>
              </div>
            )}

            <Separator className="my-2" />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatNaira(storeOrder.totalAmount)}</span>
            </div>

            {storeOrder.deliveryStatus === "Delivered" && (
              <div className="flex justify-between text-primary mt-4">
                <span className="text-sm font-medium">
                  Your Payout (After Platform Fee)
                </span>
                <span className="font-medium">
                  {formatNaira(totalAvailablePayout)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

// "use client";

// import axios from "axios";
// import { type ChangeEvent, useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { formatNaira, getStatusClassName } from "@/lib/utils";

// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import { Loader } from "lucide-react";
// import type { DigitalProduct, Order, Product, Settlement } from "@/types";
// import { Button } from "@/components/ui/button";
// import { PayoutDialog } from "./payout-dialog-component";
// import { calculateCommission } from "@/lib/utils";
// import { Badge } from "@/components/ui/badge";

// /**
//  * Available order status options for updating delivery status
//  * These represent the stages an order can progress through before delivery
//  */
// const orderStatus = ["Processing", "Shipped", "Out for Delivery"];

// /**
//  * OrderDetails Component
//  *
//  * Displays comprehensive information about a specific order including:
//  * - Order metadata (ID, date, status)
//  * - Payment information
//  * - Shipping details
//  * - Products purchased
//  * - Delivery status management
//  * - Payout information for sellers
//  *
//  * @param params - Object containing the orderID from the route parameters
//  */
// export default function OrderDetails({
//   params,
// }: {
//   params: { orderID: string; slug: string };
// }) {
//   const { toast } = useToast();

//   // State for managing the delivery status update
//   const [deliveryStatus, setDeliverStatus] = useState({
//     status: "",
//   });

//   // Track the payout status for delivered orders
//   const [payoutStatus, setPayoutStatus] = useState<
//     Settlement["payoutStatus"] | null
//   >(null);

//   // Main order data
//   const [orderDetails, setOrderDetails] = useState<Order>();

//   // UI state management
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   /**
//    * Fetch order details from the API
//    * Includes error handling and timeout logic for better UX
//    */
//   const fetchOrderData = async () => {
//     try {
//       const response = await axios.post("/api/store/order-details", {
//         orderID: params.orderID,
//       });
//       setOrderDetails(response.data.orderDetail);
//       // console.log(`response.data.oederDetail`, response.data.orderDetail);
//       setLoading(false); // Stop loading when data is fetched
//     } catch (error: any) {
//       setError(true);
//       setLoading(false);
//       console.error("Failed to fetch seller Products", error.message);
//     }
//   };
//   useEffect(() => {
//     // Fetch data when component mounts
//     fetchOrderData();

//     // Set a timeout to show error message if data isn't fetched within 10 seconds
//     // This improves UX by not leaving users in an indefinite loading state
//     const timeoutId = setTimeout(() => {
//       if (loading) {
//         setError(true);
//         setLoading(false);
//       }
//     }, 10000); // 10 seconds timeout

//     // Cleanup the timeout when the component unmounts or fetch is successful
//     return () => clearTimeout(timeoutId);
//   }, [loading]);

//   /**
//    * Fetch settlement/payout status for this order
//    * This is separate from the main order details to handle different data concerns
//    */
//   useEffect(() => {
//     const fetchSettlementStatus = async () => {
//       if (orderDetails === undefined) return;
//       try {
//         const response = await axios.post<{ settlement: Settlement }>(
//           "/api/store/fetch-settlement-status",
//           {
//             mainOrderID:
//               orderDetails !== undefined ? orderDetails._id : params.orderID,
//             subOrderID:
//               orderDetails !== undefined && orderDetails.subOrders[0]._id, // order id for this particular store. Each store in the substore arr has a unique order id
//           }
//         );
//         if (response.status === 200) {
//           setPayoutStatus(response.data.settlement.payoutStatus);
//         }
//       } catch (error: any) {
//         console.error("Failed to fetch seller Products", error.message);
//       }
//     };

//     fetchSettlementStatus();
//   }, [orderDetails]);

//   /**
//    * Handle delivery status dropdown change
//    * Updates local state when seller selects a new delivery status
//    */
//   const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     e.preventDefault();

//     const { name, value } = e.target;

//     setDeliverStatus((prev) => {
//       return {
//         ...prev,
//         [name]: value,
//       };
//     });
//   };

//   /**
//    * Submit the updated delivery status to the API
//    * Includes validation and user feedback via toast notifications
//    */
//   const handleSubmit = async () => {
//     // Validate that a status is selected before submission
//     if (deliveryStatus.status === "") {
//       toast({
//         variant: `destructive`,
//         title: `Error`,
//         description: `Please select an option`,
//       });
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "/api/store/update-order-delivery-status",
//         {
//           mainOrderID:
//             orderDetails !== undefined ? orderDetails._id : params.orderID,
//           subOrderID:
//             orderDetails !== undefined && orderDetails.subOrders[0]._id, // order id for this particular store. Each store in the substore arr has a unique order id
//           updatedDeliveryStatus: deliveryStatus.status,
//         }
//       );

//       if (response.status === 200) {
//         // Refresh the page to show updated data
//         fetchOrderData();
//         toast({
//           title: `Success`,
//           description: `You have Successfully updated this product order status to ${deliveryStatus.status}.`,
//         });
//       } else {
//         toast({
//           variant: `destructive`,
//           title: `Error`,
//           description: `Failed to update this product order status.`,
//         });
//       }
//     } catch (error: any) {
//       console.error(
//         "Failed to update this product order status",
//         error.message
//       );
//       toast({
//         variant: `destructive`,
//         title: `Error`,
//         description: `Failed to update this product order status.`,
//       });
//     }
//   };

//   // Loading state UI
//   if (loading && !error) {
//     return (
//       <div className="w-full min-h-screen flex items-center justify-center">
//         <p className="w-full h-full flex items-center justify-center">
//           <Loader className="animate-spin" /> Loading...
//         </p>
//       </div>
//     );
//   }

//   // Error state UI
//   if (error) {
//     return (
//       <div className="w-full min-h-screen flex items-center justify-center">
//         <p className="text-center text-red-600">
//           An error occurred. Please check your internet connection.
//         </p>
//       </div>
//     );
//   }

//   // Fallback loading state if order details are null/undefined
//   if (orderDetails === null || orderDetails === undefined) {
//     return (
//       <div className="w-full min-h-screen flex items-center justify-center">
//         <p className="w-full h-full flex items-center justify-center">
//           <Loader className="animate-spin" /> Loading...
//         </p>
//       </div>
//     );
//   }

//   /**
//    * Calculate the total payout amount available to the seller
//    * Uses the commission calculation utility to determine the settlement amount
//    * after platform fees are deducted
//    */
//   const totalAvailablePayout = orderDetails.subOrders[0].products.reduce(
//     (total, order) => {
//       // Sum the prices of all products in order
//       return total + calculateCommission(order.price).settleAmount;
//     },
//     0
//   );

//   if (orderDetails !== undefined) {
//     return (
//       <main className="flex flex-col gap-4 p-4 md:py-4">
//         {/* Breadcrumb navigation and page title */}
//         <div className="flex flex-row justify-between items-center">
//           <Breadcrumb className="hidden md:flex">
//             <BreadcrumbList>
//               <BreadcrumbItem>
//                 <BreadcrumbLink asChild>
//                   <Link href="#">My Store</Link>
//                 </BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem>
//                 <BreadcrumbLink asChild>
//                   <Link href="#">Orders</Link>
//                 </BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem>
//                 <BreadcrumbPage>Order Details</BreadcrumbPage>
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>

//           <h1 className=" font-semibold text-xl">Order Details</h1>
//         </div>

//         {/* Order summary card */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm sm:text-2xl">
//               Order ID: {orderDetails._id}
//             </CardTitle>
//             <CardDescription>
//               Here's the summary for this order.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="sm:grid grid-cols-2 gap-4">
//             {/* Order metadata section */}
//             <div>
//               <h1 className="mb-2 font-semibold text-xl">Order Details</h1>

//               <p>
//                 Order Date: {new Date(orderDetails.createdAt).toLocaleString()}
//               </p>
//               <p>Order Status: {orderDetails.status}</p>
//               <p>
//                 Total Amount:
//                 {formatNaira(orderDetails.totalAmount)}
//               </p>
//             </div>

//             {/* Payment information section */}
//             <div>
//               <h1 className="mb-2 font-semibold text-xl mt-2 sm:mt-0">
//                 Payment Information
//               </h1>

//               <p>
//                 Customer Payment Method:{" "}
//                 {orderDetails.paymentMethod?.toUpperCase()}
//               </p>
//               <p>
//                 Customer Payment Status:{" "}
//                 {orderDetails.paymentStatus?.toUpperCase()}
//               </p>

//               {/* Payout information - only shown for delivered orders */}
//               {orderDetails.subOrders[0].deliveryStatus === "Delivered" && (
//                 <p>
//                   Payout Amount:
//                   {formatNaira(totalAvailablePayout)}
//                 </p>
//               )}
//             </div>

//             {/* Shipping information section */}
//             <div className="col-span-2">
//               <h1 className="mb-2 font-semibold text-xl mt-2 sm:mt-0">
//                 Shipping Information
//               </h1>

//               <p>Shipping Address: {orderDetails.shippingAddress}</p>
//               <p className="text-sm">
//                 Shipping Method:{" "}
//                 {orderDetails.subOrders[0].shippingMethod?.name}
//               </p>
//               <p className="text-sm">
//                 Shipping Price:{" "}
//                 {formatNaira(orderDetails.subOrders[0].shippingMethod?.price!)}
//               </p>
//               <p className="text-sm">
//                 Estimated Delivery Days:{" "}
//                 {
//                   orderDetails.subOrders[0].shippingMethod
//                     ?.estimatedDeliveryDays
//                 }
//               </p>
//               <p>Postal Code: {orderDetails.postalCode}</p>
//               {/* <p>Tracking Number: {orderDetails._id}</p> */}
//             </div>
//           </CardContent>

//           {/* Payout action section - conditional rendering based on delivery and payout status */}
//           <CardFooter className="float-right">
//             {orderDetails.subOrders[0].deliveryStatus === "Delivered" && (
//               <>
//                 {payoutStatus === null ? (
//                   <PayoutDialog
//                     payableAmount={totalAvailablePayout}
//                     mainOrderID={orderDetails._id}
//                     subOrderID={orderDetails.subOrders[0]._id}
//                   />
//                 ) : payoutStatus === "Requested" ? (
//                   <p>Payout Requested</p>
//                 ) : payoutStatus === "Paid" ? (
//                   <p>Payout Paid</p>
//                 ) : (
//                   <p>Unknown Payout Status. Please, contact Udua</p>
//                 )}
//               </>
//             )}
//           </CardFooter>
//         </Card>

//         {/* Products purchased card */}
//         <Card>
//           <CardHeader>
//             <div className="flex gap-3 w-full justify-between">
//               <CardTitle className="text-lg sm:text-2xl">
//                 Product{orderDetails.subOrders[0].products.length > 1 && "s"}{" "}
//                 Purchased
//               </CardTitle>

//               {/* Delivery status management section */}
//               <CardDescription className="flex flex-col gap-2 items-end">
//                 {orderDetails.stores.length === 1 ? (
//                   <>
//                     <p>
//                       Order Status:{" "}
//                       <Badge
//                         className={getStatusClassName(
//                           orderDetails.subOrders[0].deliveryStatus
//                         )}
//                       >
//                         {orderDetails.subOrders[0].deliveryStatus}
//                       </Badge>
//                     </p>
//                     {/* Only show status update controls for orders that are not in a final state */}
//                     {orderDetails.subOrders[0].deliveryStatus !== "Delivered" &&
//                       orderDetails.subOrders[0].deliveryStatus !== "Canceled" &&
//                       orderDetails.subOrders[0].deliveryStatus !== "Returned" &&
//                       orderDetails.subOrders[0].deliveryStatus !==
//                         "Failed Delivery" &&
//                       orderDetails.subOrders[0].deliveryStatus !==
//                         "Refunded" && (
//                         <>
//                           <select
//                             aria-label="Select Delivery Status"
//                             name="status"
//                             value={deliveryStatus.status}
//                             onChange={handleChange}
//                             className="block w-full px-2 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
//                           >
//                             <option value="" disabled>
//                               Mark as
//                             </option>
//                             {orderStatus.map((status) => (
//                               <option key={status} value={status}>
//                                 {status}
//                               </option>
//                             ))}
//                           </select>
//                           <Button
//                             className="bg-udua-orange-primary/85 hover:bg-udua-orange-primary text-xs w-fit"
//                             onClick={handleSubmit}
//                           >
//                             Update
//                           </Button>
//                         </>
//                       )}
//                   </>
//                 ) : (
//                   <Button
//                     variant={"link"}
//                     className="underline hover:text-udua-orange-primary text-sm w-fit"
//                   >
//                     <Link
//                       href={`/store/${params.slug}/track-an-order/${params.orderID}`}
//                     >
//                       Track Order
//                     </Link>
//                   </Button>
//                 )}
//               </CardDescription>
//             </div>
//           </CardHeader>

//           {/* Product grid - displays all products in the order */}
//           <CardContent className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-3.5 w-full justify-between">
//             {orderDetails.subOrders[0].products.map((product) => {
//               // Handle physical products
//               if (product.physicalProducts) {
//                 return (
//                   <div
//                     className="gri sm:grid-cols-2 gap-4 text-sm w-full relative"
//                     key={(product.physicalProducts as Product).name}
//                   >
//                     {/* Product image */}
//                     <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
//                       {product.physicalProducts !== null &&
//                         (product.physicalProducts as Product).images !==
//                           null && (
//                           <Image
//                             src={
//                               (product.physicalProducts as Product).images[0] ||
//                               "/placeholder.svg"
//                             }
//                             alt={(product.physicalProducts as Product).name}
//                             width={300}
//                             height={150}
//                             className="h-full w-full object-cover object-center"
//                             quality={90}
//                           />
//                         )}
//                     </div>

//                     {/* Product details */}
//                     <div className="">
//                       <h3 className="mt-4 font-medium truncate">
//                         {product.physicalProducts &&
//                           ` ${(product.physicalProducts as Product).name}`}
//                       </h3>
//                       <p className="mt-2 font-medium">
//                         Quantity Bought: {product.quantity && product.quantity}
//                       </p>
//                       {product.price && (
//                         <p className="mt-2 font-medium">
//                           At Price: {formatNaira(product.price)}{" "}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 );
//               }

//               // Handle digital products
//               if (product.digitalProducts) {
//                 return (
//                   <div
//                     className="gri sm:grid-cols-2 gap-4 text-sm w-full relative"
//                     key={(product.digitalProducts as DigitalProduct).title}
//                   >
//                     {/* Product image */}
//                     <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
//                       {product.physicalProducts !== null &&
//                         (product.digitalProducts as DigitalProduct).coverIMG !==
//                           null && (
//                           <Image
//                             src={
//                               (product.digitalProducts as DigitalProduct)
//                                 .coverIMG[0] || "/placeholder.svg"
//                             }
//                             alt={
//                               (product.digitalProducts as DigitalProduct).title
//                             }
//                             width={300}
//                             height={150}
//                             className="h-full w-full object-cover object-center"
//                             quality={90}
//                           />
//                         )}
//                     </div>

//                     {/* Product details */}
//                     <div className="">
//                       <h3 className="mt-4 font-medium truncate">
//                         {product.digitalProducts &&
//                           ` ${
//                             (product.digitalProducts as DigitalProduct).title
//                           }`}
//                       </h3>
//                       <p className="mt-2 font-medium">
//                         Quantity Bought: {product.quantity && product.quantity}
//                       </p>
//                       {product.price && (
//                         <p className="mt-2 font-medium">
//                           At Price: {formatNaira(product.price)}{" "}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 );
//               }
//             })}
//           </CardContent>
//         </Card>
//       </main>
//     );
//   }
// }
