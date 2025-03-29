/**
 * Order Details Page
 *
 * This page displays comprehensive information about a user's order including:
 * - Order summary (date, status, total amount)
 * - Payment information
 * - Shipping details
 * - Products purchased grouped by store
 * - Delivery status for each store's order
 * - Functionality to mark orders as delivered
 * - Product review submission
 *
 * @component OrderDetailsPage
 */

"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardEditIcon, Loader, Star, Store } from "lucide-react";
import type { DigitalProduct, Order, Product, ProductOrder } from "@/types";
import { formatNaira, getStatusClassName } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Aside1 from "@/app/(user)/components/aside-1";
import OrderDetailsSkeleton from "@/utils/skeleton-loaders/order-details-skeleton";

interface PageParams {
  slug: string;
}

export default function OrderDetailsPage(props: {
  params: Promise<PageParams>;
}) {
  const params = use(props.params);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Review state
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedSubOrderId, setSelectedSubOrderId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  /**
   * Fetches order details from the API
   */
  const fetchOrderData = async () => {
    try {
      const { data } = await axios.post("/api/user/orderDetails", {
        orderID: params.slug,
      });
      setOrderDetails(data.orderDetail);
    } catch (error) {
      handleError(error, "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchOrderData();
    return () => controller.abort();
  }, [params.slug]);

  /**
   * Handles API errors with consistent error messaging
   * @param error - The error object
   * @param context - Context message for the error
   */
  const handleError = (error: unknown, context: string) => {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.error || context
      : context;

    toast({
      variant: "destructive",
      title: "Error",
      description: message,
    });
  };

  /**
   * Updates the delivery status of a sub-order to "Delivered"
   * @param subOrderId - The ID of the sub-order to update
   */
  const updateDeliveryStatus = async (subOrderId: string) => {
    if (!orderDetails) return;

    try {
      setSubmitting(true);
      await axios.post("/api/store/update-order-delivery-status", {
        mainOrderID: orderDetails._id,
        subOrderID: subOrderId,
        updatedDeliveryStatus: "Delivered",
      });

      toast({
        title: "Success",
        description: "Order status updated to Delivered",
      });
      fetchOrderData();
      router.refresh();
    } catch (error) {
      handleError(error, "Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Submits a product review to the API
   */
  const submitReview = async () => {
    if (!review.trim() || !rating) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide both a rating and review",
      });
      return;
    }

    try {
      setSubmitting(true);
      await axios.post("/api/store/product-store-reviews", {
        rating,
        writeUp: review,
        orderID: orderDetails?._id,
        productID: selectedProductId,
      });

      toast({
        title: "Success",
        description: "Review submitted successfully",
      });

      // Reset form and close dialog
      setRating(0);
      setReview("");
      setDialogOpen(false);

      // Refresh data to reflect changes
      fetchOrderData();
    } catch (error) {
      handleError(error, "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Initializes the review dialog with product information
   * @param productId - The ID of the product being reviewed
   * @param subOrderId - The ID of the sub-order containing the product
   */
  const handleReviewInit = (productId: string, subOrderId: string) => {
    setSelectedProductId(productId);
    setSelectedSubOrderId(subOrderId);
    setRating(0);
    setReview("");
    setDialogOpen(true);
  };

  if (loading) {
    return <OrderDetailsSkeleton />;
  }

  if (!orderDetails) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p>Order details not found</p>
      </div>
    );
  }

  // Count total products across all subOrders
  const totalProducts = orderDetails.subOrders.reduce(
    (total, subOrder) => total + subOrder.products.length,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-3 py-8">
      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        <aside className="bg-card rounded-lg shadow-sm hidden md:inline-block">
          <div className="flex h-full flex-col gap-2">
            <Aside1 />
          </div>
        </aside>

        <main className="space-y-6">
          {/* Header Section */}
          <div className="bg-card rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Order Details
                <Badge
                  variant="outline"
                  className="text-sm hidden sm:inline-block"
                >
                  ID: {orderDetails?._id}
                </Badge>
              </h1>
              <Breadcrumb className="hidden md:flex">
                {/* ... existing breadcrumb content ... */}
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/order-history">Orders</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Order Details</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Order Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">Order Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <DetailItem
                    label="Order Date"
                    value={new Date(orderDetails.createdAt).toLocaleString()}
                  />
                  <DetailItem label="Status" value={orderDetails.status} />
                  <DetailItem
                    label="Total Amount"
                    value={formatNaira(orderDetails.totalAmount)}
                  />
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">Delivery Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <DetailItem
                    label="Shipping Address"
                    value={orderDetails.shippingAddress!}
                  />
                  <DetailItem
                    label="Postal Code"
                    value={orderDetails.postalCode}
                  />
                  <DetailItem
                    label="Stores"
                    value={orderDetails.stores.length.toString()}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stores Accordion */}
          <Card className="bg-card rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                {totalProducts} Items from {orderDetails.stores.length} Stores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {orderDetails.subOrders.map((subOrder, index) => (
                  <AccordionItem
                    key={subOrder._id || index}
                    value={`store-${index}`}
                    className="border rounded-lg"
                  >
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-4">
                          <Store className="w-5 h-5 text-primary" />
                          <span className="font-medium">Store {index + 1}</span>
                        </div>
                        <Badge
                          className={getStatusClassName(
                            subOrder.deliveryStatus
                          )}
                        >
                          {subOrder.deliveryStatus}
                        </Badge>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pt-4">
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <DetailItem
                            label="Shipping Method"
                            value={subOrder.shippingMethod?.name!}
                          />
                          <DetailItem
                            label="Tracking Number"
                            value={subOrder.trackingNumber!}
                          />
                          <DetailItem
                            label="Estimated Delivery"
                            value={
                              subOrder.deliveryDate
                                ? new Date(
                                    subOrder.deliveryDate
                                  ).toLocaleDateString()
                                : "N/A"
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <DetailItem
                            label="Shipping Cost"
                            value={formatNaira(subOrder.shippingMethod?.price!)}
                          />
                          <DetailItem
                            label="Delivery Days"
                            // @ts-ignore
                            value={
                              subOrder.shippingMethod?.estimatedDeliveryDays!
                            }
                          />
                          {subOrder.deliveryStatus === "Out for Delivery" && (
                            <Button
                              onClick={() =>
                                updateDeliveryStatus(subOrder._id || "")
                              }
                              disabled={submitting}
                              className="w-full md:w-auto"
                            >
                              {submitting ? (
                                <Loader className="animate-spin mr-2" />
                              ) : (
                                "Mark as Delivered"
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Products Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {subOrder.products.map((product, productIndex) => (
                          <ProductItem
                            key={`${
                              product.physicalProducts ||
                              product.digitalProducts ||
                              productIndex
                            }`}
                            product={product}
                            onReviewInit={(id) =>
                              handleReviewInit(id, subOrder._id || "")
                            }
                            deliveryStatus={subOrder.deliveryStatus}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Review Dialog - unchanged */}
          <ReviewDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            rating={rating}
            setRating={setRating}
            review={review}
            setReview={setReview}
            onSubmit={submitReview}
            submitting={submitting}
          />
        </main>
      </div>
    </div>
  );
}

// New DetailItem component
const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2 border-b">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value || "N/A"}</span>
  </div>
);

/**
 * Order Summary Component
 *
 * Displays a summary of the order including order details,
 * payment information, and shipping information.
 *
 * @component OrderSummary
 * @param {Object} props - Component props
 * @param {Order} props.order - The order data to display
 */
const OrderSummary = ({ order }: { order: Order }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Order Summary</CardTitle>
      <CardDescription>ID: {order._id}</CardDescription>
    </CardHeader>
    <CardContent className="sm:grid grid-cols-2 gap-4 text-sm">
      {/* Order metadata section */}
      <div>
        <h1 className="mb-2 font-semibold text-xl">Order Details</h1>

        <p>Order Date: {new Date(order.createdAt).toLocaleString()}</p>
        <p>Order Status: {order.status}</p>
        <p>
          Total Amount: &#8358;
          {formatNaira(order.totalAmount)}
        </p>
      </div>

      {/* Payment information section */}
      <div>
        <h1 className="mb-2 font-semibold text-xl mt-2 sm:mt-0">
          Payment Information
        </h1>

        <p>Payment Method: {order.paymentMethod?.toUpperCase()}</p>
        <p>Payment Status: {order.paymentStatus?.toUpperCase()}</p>
      </div>

      {/* Shipping information section */}
      <div className="col-span-2">
        <h1 className="mb-2 font-semibold text-xl mt-2 sm:mt-0">
          Shipping Information
        </h1>

        <p>Shipping Address: {order.shippingAddress}</p>
        <p>Postal Code: {order.postalCode}</p>
        <p>Stores: {order.stores.length}</p>
      </div>
    </CardContent>
  </Card>
);

/**
 * Product Item Component
 *
 * Displays a single product from an order with its image, details,
 * and a button to review the product if it has been delivered.
 *
 * @component ProductItem
 * @param {Object} props - Component props
 * @param {ProductOrder} props.product - The product data to display
 * @param {Function} props.onReviewInit - Callback when review button is clicked
 * @param {string} props.deliveryStatus - The delivery status of the product
 */
const ProductItem = ({
  product,
  onReviewInit,
  deliveryStatus,
}: {
  product: ProductOrder;
  onReviewInit: (id: string) => void;
  deliveryStatus?: string;
}) => {
  if (product.physicalProducts) {
    return (
      <div className="relative group">
        <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200 transition-all duration-200 group-hover:border-udua-orange-primary/70">
          <Image
            src={
              (product.physicalProducts as Product).images?.[0] ||
              "/placeholder.svg" ||
              "/placeholder.svg"
            }
            alt={(product.physicalProducts as Product).name || "Product"}
            fill
            className="object-cover"
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
          />
        </div>

        <div className="space-y-0.5 mt-2 grid grid-cols-1">
          <h3 className="font-medium truncate">
            {(product.physicalProducts as Product).name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Quantity: {product.quantity}
          </p>
          <p className="text-sm font-medium">{formatNaira(product.price)}</p>

          {deliveryStatus === "Delivered" && (
            <Button
              className="mt-2 bg-udua-orange-primary/85 hover:bg-udua-orange-primary w-full text-sm flex items-center gap-2"
              onClick={() =>
                onReviewInit((product.physicalProducts as Product)._id!)
              }
              aria-label="Review product"
              size="sm"
            >
              <ClipboardEditIcon className="h-4 w-4" />
              Write Review
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (product.digitalProducts) {
    return (
      <div className="relative group">
        <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200 transition-all duration-200 group-hover:border-udua-orange-primary/70">
          {product.digitalProducts !== null &&
            (product.digitalProducts as DigitalProduct).coverIMG !== null && (
              <Image
                src={
                  (product.digitalProducts as DigitalProduct).coverIMG[0] ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt={
                  (product.digitalProducts as DigitalProduct).title ||
                  "Digital Product"
                }
                fill
                className="object-cover"
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
              />
            )}
        </div>

        <div className="mt-2 grid grid-cols-1">
          <h3 className="font-medium truncate">
            {product.digitalProducts &&
              `${(product.digitalProducts as DigitalProduct).title}`}
          </h3>
          <p className="text-sm text-muted-foreground">
            Quantity: {product.quantity}
          </p>
          {product.price && (
            <p className="text-sm font-medium">{formatNaira(product.price)}</p>
          )}

          {deliveryStatus === "Delivered" && (
            <Button
              className="mt-2 bg-udua-orange-primary/85 hover:bg-udua-orange-primary w-full text-sm flex items-center gap-2"
              onClick={() =>
                onReviewInit((product.digitalProducts as DigitalProduct)._id!)
              }
              aria-label="Review product"
              size="sm"
            >
              <ClipboardEditIcon className="h-4 w-4" />
              Write Review
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

/**
 * Review Dialog Component
 *
 * A modal dialog for submitting product reviews with star rating
 * and text feedback.
 *
 * @component ReviewDialog
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.setOpen - Function to set the open state
 * @param {number} props.rating - The current rating value
 * @param {Function} props.setRating - Function to set the rating
 * @param {string} props.review - The review text
 * @param {Function} props.setReview - Function to set the review text
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {boolean} props.submitting - Whether the form is currently submitting
 */
const ReviewDialog = ({
  open,
  setOpen,
  rating,
  setRating,
  review,
  setReview,
  onSubmit,
  submitting,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  rating: number;
  setRating: (rating: number) => void;
  review: string;
  setReview: (review: string) => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Product Review</DialogTitle>
          <DialogDescription>
            Share your experience with this product to help other shoppers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => {
                const value = i + 1;
                return (
                  <button
                    key={value}
                    onClick={() => setRating(value)}
                    className="focus:outline-none transition-transform hover:scale-110"
                    aria-label={`Rate ${value} stars`}
                    type="button"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        value <= rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="review" className="text-sm font-medium">
              Your Review
            </label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What did you like or dislike? How was your experience with this product?"
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Your review helps other shoppers make informed decisions
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-udua-orange-primary hover:bg-udua-orange-primary/90"
            onClick={onSubmit}
            disabled={submitting || !rating || !review.trim()}
          >
            {submitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
