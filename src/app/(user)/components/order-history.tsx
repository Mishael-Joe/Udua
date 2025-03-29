"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { formatNaira } from "@/lib/utils";
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
                <CardTitle className="text-xl sm:text-2xl font-bold">
                  Order History
                </CardTitle>
                <Badge className="bg-primary/10 text-primary text-sm sm:text-base">
                  {orders.length} Orders
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {orders.length > 0 ? (
                <div className="grid gap-4 sm:gap-6">
                  {orders.map((order) => {
                    // ... (keep existing product image logic)
                    const mainProduct = order.subOrders[0]?.products[0];
                    const productImage = mainProduct?.digitalProducts
                      ? (mainProduct.digitalProducts as DigitalProduct)
                          .coverIMG[0]
                      : (mainProduct?.physicalProducts as Product)?.images[0];

                    return (
                      <Card key={order._id} className="p-4 relative group">
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                          {productImage && (
                            <div className="relative w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden border">
                              <Image
                                src={productImage}
                                alt="Product image"
                                fill
                                className="object-cover"
                                placeholder="blur"
                                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                  shimmer(96, 96)
                                )}`}
                                sizes="(max-width: 640px) 100vw, 96px"
                              />
                            </div>
                          )}

                          <div className="flex-1 space-y-2 w-full">
                            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                              <time
                                dateTime={new Date(
                                  order.createdAt
                                ).toISOString()}
                                className="text-sm font-medium"
                              >
                                {new Date(order.createdAt).toLocaleDateString()}
                              </time>
                              <div className="flex gap-2">
                                <Badge
                                  variant="outline"
                                  className="capitalize text-xs sm:text-sm"
                                >
                                  {order.status}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="capitalize text-xs sm:text-sm"
                                >
                                  {/* @ts-ignore */}
                                  {order.overallDeliveryStatus}
                                </Badge>
                              </div>
                            </div>

                            <p className="text-base sm:text-lg font-semibold">
                              {formatNaira(order.totalAmount)}
                            </p>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 sm:top-4 sm:right-4"
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
                // ... (keep existing empty state)
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

  // return (
  //   <div className="max-w-7xl mx-auto px-4 md:px-3 py-8">
  //     <div className="grid md:grid-cols-[280px_1fr] gap-6">
  //       <aside className="bg-card rounded-lg shadow-sm hidden md:inline-block">
  //         <Aside1 />
  //       </aside>

  //       <main className="space-y-6">
  //         <Card className="bg-card rounded-lg shadow-sm">
  //           <CardHeader>
  //             <div className="flex items-center justify-between">
  //               <CardTitle className="text-2xl font-bold">
  //                 Order History
  //               </CardTitle>
  //               <Badge className="bg-primary/10 text-primary">
  //                 {orders.length} Orders
  //               </Badge>
  //             </div>
  //           </CardHeader>
  //           <CardContent className="space-y-6">
  //             {orders.length > 0 ? (
  //               <div className="grid gap-6">
  //                 {orders.map((order) => {
  //                   const mainProduct = order.subOrders[0]?.products[0];
  //                   const productImage = mainProduct?.digitalProducts
  //                     ? (mainProduct.digitalProducts as DigitalProduct)
  //                         .coverIMG[0]
  //                     : (mainProduct?.physicalProducts as Product)?.images[0];

  //                   return (
  //                     <Card key={order._id} className="p-4 relative group">
  //                       <div className="flex items-start gap-4">
  //                         {productImage && (
  //                           <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
  //                             <Image
  //                               src={productImage}
  //                               alt="Product image"
  //                               fill
  //                               className="object-cover"
  //                               placeholder="blur"
  //                               blurDataURL={`data:image/svg+xml;base64,${toBase64(
  //                                 shimmer(96, 96)
  //                               )}`}
  //                             />
  //                           </div>
  //                         )}

  //                         <div className="flex-1 space-y-2">
  //                           <div className="flex items-center gap-4">
  //                             <time
  //                               dateTime={new Date(
  //                                 order.createdAt
  //                               ).toISOString()}
  //                               className="text-sm font-medium"
  //                             >
  //                               {new Date(order.createdAt).toLocaleDateString()}
  //                             </time>
  //                             <Badge variant="outline" className="capitalize">
  //                               {order.status}
  //                             </Badge>
  //                             <Badge variant="outline" className="capitalize">
  //                               {/* @ts-ignore */}
  //                               {order.overallDeliveryStatus}
  //                             </Badge>
  //                           </div>

  //                           <p className="text-lg font-semibold">
  //                             {formatNaira(order.totalAmount)}
  //                           </p>
  //                         </div>

  //                         <DropdownMenu>
  //                           <DropdownMenuTrigger asChild>
  //                             <Button
  //                               variant="ghost"
  //                               size="icon"
  //                               className="absolute top-4 right-4"
  //                             >
  //                               <MoreHorizontal className="h-4 w-4" />
  //                             </Button>
  //                           </DropdownMenuTrigger>
  //                           <DropdownMenuContent align="end">
  //                             <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //                             <DropdownMenuItem asChild>
  //                               <Link href={`/order/${order._id}`}>
  //                                 View Details
  //                               </Link>
  //                             </DropdownMenuItem>
  //                           </DropdownMenuContent>
  //                         </DropdownMenu>
  //                       </div>
  //                     </Card>
  //                   );
  //                 })}
  //               </div>
  //             ) : (
  //               <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed shadow-sm h-[300px]">
  //                 <div className="flex flex-col items-center gap-1 text-center p-8">
  //                   <XCircle className="h-10 w-10 text-muted-foreground" />
  //                   <h3 className="mt-4 text-lg font-semibold">
  //                     No orders found
  //                   </h3>
  //                   <p className="mb-4 mt-2 text-sm text-muted-foreground">
  //                     Your recent orders will appear here
  //                   </p>
  //                   <Link href="/">
  //                     <Button size="sm">Browse Products</Button>
  //                   </Link>
  //                 </div>
  //               </div>
  //             )}
  //           </CardContent>
  //         </Card>
  //       </main>
  //     </div>
  //   </div>
  // );
}
