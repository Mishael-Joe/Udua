"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { addCommasToNumber } from "@/lib/utils";
import dynamic from "next/dynamic";
import { OderHistorySkeletonLoader } from "@/utils/skeleton-loaders/oderHistory-skeleton";
import { DigitalProduct, Order, Product } from "@/types";
import { shimmer, toBase64 } from "@/lib/image";
import { MoreHorizontal, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Aside1 = dynamic(() => import("./aside-1"), { ssr: false });

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOrders = async () => {
      try {
        const { data } = await axios.post("/api/user/orders", {
          signal: controller.signal,
        });
        setOrders(data.orders);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError("Failed to load order history. Please try again later.");
          console.error("Order fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    return () => controller.abort();
  }, []);

  if (loading) return <OderHistorySkeletonLoader />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-3 py-8">
        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          <aside className="bg-card rounded-lg shadow-sm hidden md:inline-block">
            <Aside1 />
          </aside>
          <Card className="bg-card rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-destructive">{error}</h2>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-3 py-8">
      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        <aside className="bg-card rounded-lg shadow-sm hidden md:inline-block">
          <Aside1 />
        </aside>

        <main className="space-y-6">
          <Card className="bg-card rounded-lg shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                  Order History
                </CardTitle>
                <Badge className="bg-primary/10 text-primary">
                  {orders.length} Orders
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {orders.length > 0 ? (
                <div className="grid gap-6">
                  {orders.map((order) => {
                    const mainProduct = order.subOrders[0]?.products[0];
                    const productImage = mainProduct?.digitalProducts
                      ? (mainProduct.digitalProducts as DigitalProduct)
                          .coverIMG[0]
                      : (mainProduct?.physicalProducts as Product)?.images[0];

                    return (
                      <Card key={order._id} className="p-4 relative group">
                        <div className="flex items-start gap-4">
                          {productImage && (
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                              <Image
                                src={productImage}
                                alt="Product image"
                                fill
                                className="object-cover"
                                placeholder="blur"
                                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                  shimmer(96, 96)
                                )}`}
                              />
                            </div>
                          )}

                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-4">
                              <time
                                dateTime={new Date(
                                  order.createdAt
                                ).toISOString()}
                                className="text-sm font-medium"
                              >
                                {new Date(order.createdAt).toLocaleDateString()}
                              </time>
                              <Badge variant="outline" className="capitalize">
                                {order.status}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {/* @ts-ignore */}
                                {order.overallDeliveryStatus}
                              </Badge>
                            </div>

                            <p className="text-lg font-semibold">
                              ₦{addCommasToNumber(order.totalAmount)}
                            </p>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/order/${order._id}`}>
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed shadow-sm h-[300px]">
                  <div className="flex flex-col items-center gap-1 text-center p-8">
                    <XCircle className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">
                      No orders found
                    </h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                      Your recent orders will appear here
                    </p>
                    <Link href="/">
                      <Button size="sm">Browse Products</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import Link from "next/link";
// import { MoreHorizontal } from "lucide-react";
// import Image from "next/image";
// import { addCommasToNumber } from "@/lib/utils";
// import dynamic from "next/dynamic";
// import { OderHistorySkeletonLoader } from "@/utils/skeleton-loaders/oderHistory-skeleton";
// import { DigitalProduct, Order, Product } from "@/types";

// // Lazy load non-critical components
// const Aside1 = dynamic(() => import("./aside-1"), {
//   ssr: false,
// });

// /**
//  * OrderHistory component displays a user's order history with essential order details.
//  * Features responsive design, lazy loading, and accessibility optimizations.
//  *
//  * @returns {JSX.Element} - Order history interface with dynamic loading states
//  */
// export function OrderHistory() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const controller = new AbortController();

//     const fetchOrders = async () => {
//       try {
//         const { data } = await axios.post("/api/user/orders", {
//           signal: controller.signal,
//         });
//         setOrders(data.orders);
//         // console.log("Orders", data.orders);
//       } catch (err) {
//         if (!axios.isCancel(err)) {
//           setError("Failed to load order history. Please try again later.");
//           console.error("Order fetch error:", err);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//     return () => controller.abort();
//   }, []);

//   if (loading) return <OderHistorySkeletonLoader />;

//   if (error) {
//     return (
//       <div className="grid min-h-screen max-w-7xl mx-auto md:px-4 gap-4">
//         <div className="flex items-center justify-center h-full">
//           <Card className="w-full max-w-md">
//             <CardHeader>
//               <CardTitle>Error Loading Orders</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-destructive">{error}</p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] md:px-4 gap-4">
//       {/* Accessible sidebar with aria-label */}
//       <aside
//         aria-label="Account navigation"
//         className="hidden bg-muted/10 md:block"
//       >
//         <div className="flex h-full max-h-screen flex-col gap-2">
//           <Aside1 />
//         </div>
//       </aside>

//       <main className="grid gap-4 w-full md:gap-8 py-4 md:py-0">
//         <Card
//           className="w-full md:border-0"
//           role="region"
//           aria-labelledby="orderHistoryHeading"
//         >
//           <CardHeader>
//             <CardTitle id="orderHistoryHeading">Order History</CardTitle>
//             <CardDescription>
//               Manage your orders and view their details
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="grid gap-8">
//             {orders.length > 0 ? (
//               <Table aria-label="Order history">
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead scope="col">Image</TableHead>
//                     <TableHead scope="col">Order Date</TableHead>
//                     <TableHead scope="col">Payment Status</TableHead>
//                     <TableHead scope="col">Delivery Status</TableHead>
//                     <TableHead scope="col">Total Amount</TableHead>
//                     <TableHead scope="col">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {orders.map((order) => (
//                     <TableRow key={order._id}>
//                       <TableCell>
//                         {order.subOrders[0].products[0].digitalProducts && (
//                           <>
//                             {(
//                               order.subOrders[0].products[0]
//                                 .digitalProducts as DigitalProduct
//                             ).coverIMG[0] && (
//                               <Image
//                                 alt={`Product preview for ${
//                                   (
//                                     order.subOrders[0].products[0]
//                                       .digitalProducts as DigitalProduct
//                                   ).title
//                                 }`}
//                                 className="aspect-square rounded-md object-cover"
//                                 height={64}
//                                 width={64}
//                                 src={
//                                   (
//                                     order.subOrders[0].products[0]
//                                       .digitalProducts as DigitalProduct
//                                   ).coverIMG[0]
//                                 }
//                                 placeholder="blur"
//                                 blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
//                               />
//                             )}
//                           </>
//                         )}
//                         {order.subOrders[0].products[0].physicalProducts && (
//                           <>
//                             {(
//                               order.subOrders[0].products[0]
//                                 .physicalProducts as Product
//                             ).images[0] && (
//                               <Image
//                                 alt={`Product preview for ${
//                                   (
//                                     order.subOrders[0].products[0]
//                                       .physicalProducts as Product
//                                   ).name
//                                 }`}
//                                 className="aspect-square rounded-md object-cover"
//                                 height={64}
//                                 width={64}
//                                 src={
//                                   (
//                                     order.subOrders[0].products[0]
//                                       .physicalProducts as Product
//                                   ).images[0]
//                                 }
//                                 placeholder="blur"
//                                 blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
//                               />
//                             )}
//                           </>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <time
//                           dateTime={new Date(order.createdAt).toISOString()}
//                         >
//                           {new Date(order.createdAt).toLocaleDateString()}
//                         </time>
//                       </TableCell>
//                       <TableCell>{order.status}</TableCell>
//                       {/* @ts-ignore */}
//                       <TableCell>{order.overallDeliveryStatus}</TableCell>
//                       <TableCell aria-label="Total amount">
//                         &#8358;{addCommasToNumber(order.totalAmount)}
//                       </TableCell>
//                       <TableCell>
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button
//                               aria-label="Order actions menu"
//                               size="icon"
//                               variant="ghost"
//                             >
//                               <MoreHorizontal className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
//                             <DropdownMenuItem asChild>
//                               <Link
//                                 href={`/order/${order._id}`}
//                                 prefetch={false}
//                               >
//                                 View Details
//                               </Link>
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             ) : (
//               <EmptyState />
//             )}
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   );
// }

// // Empty State Component
// const EmptyState = () => (
//   <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//     <div className="flex items-center">
//       <h2 className="text-lg font-semibold md:text-2xl">Order History</h2>
//     </div>
//     <div
//       className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed shadow-sm p-2"
//       role="status"
//       aria-live="polite"
//     >
//       <div className="mx-auto flex w-full flex-col items-center justify-center text-center">
//         <h3 className="mt-4 text-lg font-semibold">
//           No Purchase History Found
//         </h3>
//         <p className="mb-4 mt-2 text-sm text-muted-foreground">
//           Explore our collection to discover products you'll love
//         </p>
//         <Link href="/" passHref legacyBehavior>
//           <Button size="sm" className="relative">
//             Browse Products
//           </Button>
//         </Link>
//       </div>
//     </div>
//   </div>
// );
