"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardEditIcon, Loader, Star } from "lucide-react";
import { Order } from "@/types";
import { addCommasToNumber } from "@/lib/utils";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchOrderData = async () => {
      try {
        const { data } = await axios.post(
          "/api/user/orderDetails",
          { orderID: params.slug },
          { signal: controller.signal }
        );
        console.log(`data`, data);
        setOrderDetails(data.orderDetail);
      } catch (error) {
        handleError(error, "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
    return () => controller.abort();
  }, [params.slug]);

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

  const updateDeliveryStatus = async () => {
    if (!orderDetails) return;

    try {
      setSubmitting(true);
      await axios.post("/api/store/update-order-delivery-status", {
        orderID: orderDetails._id,
        updatedDeliveryStatus: "Delivered",
      });

      toast({
        title: "Success",
        description: "Order status updated to Delivered",
      });
      router.refresh();
    } catch (error) {
      handleError(error, "Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  const submitReview = async () => {
    if (!review.trim() || !rating) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please complete all required fields",
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
    } catch (error) {
      handleError(error, "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-muted/10 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <Aside1 />
        </div>
      </aside>

      <main className="flex flex-col gap-4 p-4 md:py-4">
        <header className="flex justify-between items-center">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/orders">Orders</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Order Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-xl font-semibold">Order Details</h1>
        </header>

        <OrderSummary order={orderDetails} />

        <Card>
          <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle>
              {orderDetails.products.length} Product
              {orderDetails.products.length > 1 ? "s" : ""}
            </CardTitle>
            <DeliveryStatus
              status={orderDetails.deliveryStatus}
              onUpdate={updateDeliveryStatus}
              submitting={submitting}
            />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-3.5 w-full justify-between">
            {orderDetails.products.map((product) => {
              if (product.physicalProducts) {
                return (
                  <ProductItem
                    key={product.physicalProducts._id}
                    product={product}
                    onReviewInit={setSelectedProductId}
                    deliveryStatus={orderDetails.deliveryStatus}
                  />
                );
              } else if (product.digitalProducts) {
                return (
                  <ProductItem
                    key={product.digitalProducts._id}
                    product={product}
                    onReviewInit={setSelectedProductId}
                  />
                );
              }
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

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
          {addCommasToNumber(order.totalAmount)}
        </p>
      </div>

      {/* Payment information section */}
      <div>
        <h1 className="mb-2 font-semibold text-xl mt-2 sm:mt-0">
          Payment Information
        </h1>

        <p>Payment Method: {order.paymentMethod.toUpperCase()}</p>
        <p>Payment Status: {order.paymentStatus.toUpperCase()}</p>
      </div>

      {/* Shipping information section */}
      <div className="col-span-2">
        <h1 className="mb-2 font-semibold text-xl mt-2 sm:mt-0">
          Shipping Information
        </h1>

        <p>Shipping Address: {order.shippingAddress}</p>
        <p>Shipping Method: {order.shippingMethod}</p>
        <p>Postal Code: {order.postalCode}</p>
        {/* <p>Tracking Number: {order._id}</p> */}
      </div>
    </CardContent>
  </Card>
);

const ProductItem = ({
  product,
  onReviewInit,
  deliveryStatus,
}: {
  product: Order["products"][number]; // Type annotation indicating 'product' is a single item from the 'products' array in an 'Order'
  onReviewInit: (id: string) => void;
  deliveryStatus?: Order["deliveryStatus"];
}) => {
  if (product.physicalProducts) {
    return (
      <div className="relative">
        <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200">
          <Image
            src={product.physicalProducts.images[0]}
            alt={product.physicalProducts.name}
            fill
            className="object-cover"
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
          />
        </div>

        <div className="space-y-0.5 mt-1 grid grid-cols-1">
          <h3 className="font-medium truncate">
            {product.physicalProducts.name}
          </h3>
          <p>Quantity: {product.quantity}</p>
          <p>Price: ₦{addCommasToNumber(product.price)}</p>

          {deliveryStatus === "Delivered" && (
            <ReviewDialog
              productId={product.physicalProducts._id!}
              onInit={onReviewInit}
            />
          )}
        </div>
      </div>
    );
  }

  if (product.digitalProducts) {
    return (
      <div className="relative">
        <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200">
          {product.digitalProducts !== null &&
            product.digitalProducts.coverIMG !== null && (
              <Image
                src={product.digitalProducts.coverIMG[0] || "/placeholder.svg"}
                alt={product.digitalProducts.title}
                fill
                className="object-cover"
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
              />
            )}
        </div>

        <div className="mt-1 grid grid-cols-1">
          <h3 className="font-medium truncate">
            {product.digitalProducts && `${product.digitalProducts.title}`}
          </h3>
          <p className="font-medium">
            Quantity {product.quantity && product.quantity}
          </p>
          {product.price && (
            <p className="font-medium">
              &#8358; {addCommasToNumber(product.price)}{" "}
            </p>
          )}

          <ReviewDialog
            productId={product.digitalProducts._id!}
            onInit={onReviewInit}
          />
        </div>
      </div>
    );
  }
};

const ReviewDialog = ({
  productId,
  onInit,
}: {
  productId: string;
  onInit: (id: string) => void;
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild className="absolute right-2 top-1">
        <Button
          className="bg-udua-orange-primary/85 hover:bg-udua-orange-primary"
          onClick={() => onInit(productId)}
          aria-label="Review product"
          size={"icon"}
        >
          <ClipboardEditIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Product Review</DialogTitle>
          <DialogDescription>
            Share your experience with this product
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => {
              const value = i + 1;
              return (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className="focus:outline-none"
                  aria-label={`Rate ${value} stars`}
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

          <Textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your thoughts..."
            className="min-h-[120px]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DeliveryStatus = ({
  status,
  onUpdate,
  submitting,
}: {
  status: string;
  onUpdate: () => void;
  submitting: boolean;
}) => (
  <div className="flex flex-col items-end gap-2">
    <span className="text-sm">Status: {status}</span>
    {status === "Out for Delivery" && (
      <Button
        onClick={onUpdate}
        disabled={submitting}
        className="bg-udua-orange-primary/85 hover:bg-udua-orange-primary text-sm"
      >
        {submitting ? (
          <Loader className="animate-spin mr-2" />
        ) : (
          "Mark as Delivered"
        )}
      </Button>
    )}
  </div>
);

// "use client";

// import axios from "axios";
// import { useEffect, useState } from "react";
// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { addCommasToNumber } from "@/lib/utils";

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
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { useToast } from "@/components/ui/use-toast";
// import { useRouter } from "next/navigation";
// import Aside1 from "@/app/(user)/components/aside-1";
// import { ClipboardEditIcon, Loader, Star } from "lucide-react";
// import { Order } from "@/types";
// import { Button } from "@/components/ui/button";
// import Rating from "@/lib/helpers/rating";
// import { Textarea } from "@/components/ui/textarea";

// export default function Page({ params }: { params: { slug: string } }) {
//   const [orderDetails, setOrderDetails] = useState<Order>();
//   const router = useRouter();
//   const { toast } = useToast();
//   const [deliveryStatus, setDeliverStatus] = useState({
//     status: "Delivered",
//   });
//   const [rating, setRating] = useState<number | null>(null);
//   const [hover, setHover] = useState<number | null>(null);
//   const [reviewWriteUp, setReviewWriteUp] = useState("");
//   const [productID, setProductID] = useState<string | undefined>("");

//   useEffect(() => {
//     const fetchOrderData = async () => {
//       try {
//         const response = await axios.post("/api/user/orderDetails", {
//           orderID: params.slug,
//         });
//         setOrderDetails(response.data.orderDetail);
//         // console.log(`response.data.oederDetail`, response.data.orderDetail);
//       } catch (error: any) {
//         console.error("Failed to fetch seller Products", error.message);
//       }
//     };

//     fetchOrderData();
//   }, []);

//   const handleSubmit = async () => {
//     if (deliveryStatus.status === "") {
//       toast({
//         variant: `destructive`,
//         title: `Error`,
//         description: `Please select an option`,
//       });
//       return;
//     }
//     const body = {
//       orderID: orderDetails !== undefined ? orderDetails._id : params.slug,
//       updatedDeliveryStatus: deliveryStatus.status,
//     };
//     try {
//       const response = await axios.post(
//         "/api/store/update-order-delivery-status",
//         {
//           body,
//         }
//       );

//       if (response.status === 200) {
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
//       // console.log(`response.data.oederDetail`, response.data.orderDetail);
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
//     } finally {
//       router.refresh();
//     }
//   };

//   const handleSubmitReview = async (type: string) => {
//     console.log(`productID`, productID);
//     if (reviewWriteUp === "") {
//       toast({
//         variant: `destructive`,
//         title: `Error`,
//         description: `Text box cannot be empty`,
//       });
//       return;
//     } else if (rating === null) {
//       toast({
//         variant: `destructive`,
//         title: `Error`,
//         description: `Please choose a Rate or Star`,
//       });
//       return;
//     } else if (productID === undefined || productID === "") {
//       toast({
//         variant: `destructive`,
//         title: `Error`,
//         description: `An error occured. Please refresh the page.`,
//       });
//       return;
//     }

//     const body = {
//       rating: rating,
//       writeUp: reviewWriteUp,
//       orderID: orderDetails?._id,
//       productID: productID,
//     };

//     if (type === "ProductReview") {
//       try {
//         const response = await axios.post("/api/store/product-store-reviews", {
//           body,
//         });

//         if (response.status === 200) {
//           toast({
//             variant: `default`,
//             title: `Success`,
//             description: `You have successfully review this product.`,
//           });
//         } else {
//           toast({
//             variant: `destructive`,
//             title: `Error`,
//             description: `An error occured while submitting your review.`,
//           });
//         }
//       } catch (error: any) {
//         if (error.code === `ERR_BAD_REQUEST`) {
//           // console.log(`response`, error);
//           toast({
//             variant: `destructive`,
//             title: `Error`,
//             description: `${error.response.data.error}`,
//           });
//           return;
//         }
//         console.error(`An error occured while submitting your review.`, error);
//         toast({
//           variant: `destructive`,
//           title: `Error`,
//           description: `An error occured while submitting your review.`,
//         });
//       }
//     }
//   };

//   if (orderDetails === null || orderDetails === undefined) {
//     return (
//       <div className="w-full min-h-screen flex items-center justify-center">
//         <p className="w-full h-full flex items-center justify-center">
//           <Loader className="animate-spin" /> Loading...
//         </p>
//       </div>
//     );
//   }

//   if (orderDetails !== undefined) {
//     return (
//       <section>
//         <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
//           <div className="hidden border-r bg-muted/10 md:block">
//             <div className="flex h-full max-h-screen flex-col gap-2">
//               <Aside1 />
//             </div>
//           </div>

//           <main className="flex flex-col gap-4 p-4 md:py-4">
//             <div className="flex flex-row justify-between items-center">
//               <Breadcrumb className="hidden md:flex">
//                 <BreadcrumbList>
//                   <BreadcrumbItem>
//                     <BreadcrumbLink asChild>
//                       <Link href="#">Dashboard</Link>
//                     </BreadcrumbLink>
//                   </BreadcrumbItem>
//                   <BreadcrumbSeparator />
//                   <BreadcrumbItem>
//                     <BreadcrumbLink asChild>
//                       <Link href="#">Orders</Link>
//                     </BreadcrumbLink>
//                   </BreadcrumbItem>
//                   <BreadcrumbSeparator />
//                   <BreadcrumbItem>
//                     <BreadcrumbPage>Order Details</BreadcrumbPage>
//                   </BreadcrumbItem>
//                 </BreadcrumbList>
//               </Breadcrumb>

//               <h1 className=" font-semibold text-xl">Order Details</h1>
//             </div>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-sm sm:text-2xl">
//                   Order ID: {orderDetails._id}
//                 </CardTitle>
//                 <CardDescription>
//                   Here's the summary for this order.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div>
//                   <h2>Order ID: {orderDetails._id}</h2>
//                   <p>
//                     Order Date:{" "}
//                     {new Date(orderDetails.createdAt).toLocaleString()}
//                   </p>
//                   <p>Status: {orderDetails.status}</p>
//                   <p>
//                     Total Amount: &#8358;
//                     {addCommasToNumber(orderDetails.totalAmount)}
//                   </p>
//                   <p>Shipping Address: {orderDetails.shippingAddress}</p>
//                   <p>Shipping Method: {orderDetails.shippingMethod}</p>
//                   {/* <p>Tracking Number: {orderDetails.trackingNumber}</p> */}
//                   <p>Payment Method: {orderDetails.paymentMethod}</p>
//                   <p>Payment Status: {orderDetails.paymentStatus}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <div className="flex gap-3 w-full justify-between">
//                   <CardTitle>
//                     Product{orderDetails.products.length > 1 && "s"} Purchased
//                   </CardTitle>

//                   <CardDescription className="flex flex-col gap-2 items-end">
//                     Delivery Status: {orderDetails.deliveryStatus}
//                     {orderDetails.deliveryStatus === "Out for Delivery" && (
//                       <Button
//                         className="bg-purple-500 hover:bg-purple-600 text-xs w-fit"
//                         onClick={handleSubmit}
//                       >
//                         Mark as Delivered
//                       </Button>
//                     )}
//                   </CardDescription>
//                 </div>
//               </CardHeader>

//               <CardContent>
//                 {orderDetails.products.map((product) => (
//                   <div
//                     className="grid sm:grid-cols-2 gap-4 text-sm w-full relative"
//                     key={product.product.name}
//                   >
//                     {orderDetails.deliveryStatus === "Delivered" && (
//                       <Dialog>
//                         <DialogTrigger
//                           asChild
//                           className="absolute flex gap-2 text-xs right-2 top-1 sm:bottom-2 sm:left-1 w-fit"
//                         >
//                           <Button
//                             className="bg-purple-500 hover:bg-purple-600"
//                             onClick={() => setProductID(product.product._id)}
//                           >
//                             <ClipboardEditIcon /> <span>Review Product</span>
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-lg">
//                           <DialogHeader>
//                             <DialogTitle>Rate this product</DialogTitle>
//                             <DialogDescription>
//                               Share your feedback on this product. Click
//                               "Submit" when you're ready to submit.
//                             </DialogDescription>
//                             <div className="flex flex-col gap-2 items-center justify-center w-full h-fit py-5">
//                               <div className="flex items-center justify-center gap-2 w-full">
//                                 {Array.from({ length: 5 }, (_, i) => {
//                                   const currentRating = i + 1;
//                                   return (
//                                     <label key={i}>
//                                       <Star
//                                         width={25}
//                                         height={25}
//                                         className={`cursor-pointer ${
//                                           currentRating <=
//                                           (hover ?? rating ?? 0)
//                                             ? `text-yellow-500 fill-yellow-500`
//                                             : `dark:text-white dark:fill-white fill-gray-500 text-gray-500`
//                                         }`}
//                                         onMouseEnter={() =>
//                                           setHover(currentRating)
//                                         }
//                                         onMouseLeave={() => setHover(null)}
//                                       />
//                                       <input
//                                         type="radio"
//                                         name="rating"
//                                         value={currentRating}
//                                         onClick={() => setRating(currentRating)}
//                                         className="hidden"
//                                       />
//                                     </label>
//                                   );
//                                 })}
//                               </div>

//                               <div className="w-full p-4">
//                                 <Textarea
//                                   className="block w-full  mt-5 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
//                                   onChange={(e) =>
//                                     setReviewWriteUp(e.target.value)
//                                   }
//                                 />
//                               </div>
//                             </div>

//                             <Button
//                               onClick={() =>
//                                 handleSubmitReview("ProductReview")
//                               }
//                             >
//                               Submit
//                             </Button>
//                           </DialogHeader>
//                         </DialogContent>
//                       </Dialog>
//                     )}
//                     <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
//                       {product.product !== null && product.product !== null && (
//                         <Image
//                           src={product.product.images[0]}
//                           alt={product.product.name}
//                           width={300}
//                           height={150}
//                           className="h-full w-full object-cover object-center"
//                           quality={90}
//                         />
//                       )}
//                     </div>

//                     <div className="">
//                       <h3 className="mt-4 font-medium">
//                         Product Name:
//                         {product.product && product.product.name}
//                       </h3>
//                       <p className="mt-2 font-medium">
//                         Quantity Bought: {product.quantity && product.quantity}
//                       </p>
//                       {product.price && (
//                         <p className="mt-2 font-medium">
//                           At Price: &#8358; {addCommasToNumber(product.price)}{" "}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           </main>
//         </div>
//       </section>
//     );
//   }
// }
