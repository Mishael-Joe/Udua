"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateCommission, security } from "@/constant/constant";
import { Order } from "@/types";
import {
  ArrowUpRightFromSquare,
  Loader,
  MoreHorizontalIcon,
} from "lucide-react";
import { addCommasToNumber } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SecurityCardProps {
  item: (typeof security)[number];
  slug: string;
  totalAvailablePayout?: number;
}

const SecurityCard = ({
  item,
  slug,
  totalAvailablePayout,
}: SecurityCardProps) => {
  if (item.link) {
    return (
      <Link href={`/store/${slug}/payout-history`} className="h-full">
        <Card className="h-full hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between pb-2">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <ArrowUpRightFromSquare className="w-5 h-5" />
            </div>
            <CardDescription>{item.desc}</CardDescription>
          </CardHeader>
        </Card>
      </Link>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between pb-2">
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <span className="text-lg">&#8358;</span>
        </div>
        <CardDescription>{item.desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          &#8358;{" "}
          {item.title === "Available Payout"
            ? addCommasToNumber(totalAvailablePayout || 0)
            : item.content}
        </div>
      </CardContent>
    </Card>
  );
};

export default function Payout({ params }: { params: { slug: string } }) {
  const [fulfilledOrders, setFulfilledOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFulfilledOrders = async () => {
      try {
        const { data } = await axios.post<{ fulfiliedOrders: Order[] }>(
          "/api/store/fulfilied-orders"
        );
        setFulfilledOrders(data.fulfiliedOrders);
      } catch (error) {
        console.error("Failed to fetch fulfilled orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFulfilledOrders();
  }, []);

  const totalAvailablePayout = fulfilledOrders.reduce((total, order) => {
    return (
      total +
      order.products.reduce(
        (sum, product) => sum + calculateCommission(product.price).settleAmount,
        0
      )
    );
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader className="animate-spin w-8 h-8" />
        <p className="text-gray-600">Loading payout data...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-6 p-4 md:p-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Balance Overview</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {security.map((item, i) => (
            <SecurityCard
              key={i}
              item={item}
              slug={params.slug}
              totalAvailablePayout={totalAvailablePayout}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Fulfilled Orders</CardTitle>
            <CardDescription>Sales available for payout</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of your available payouts</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Payout</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fulfilledOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium text-green-600">
                      {order.deliveryStatus}
                    </TableCell>

                    <TableCell>
                      {order.products.map((productOrder) => (
                        <div key={productOrder.product?._id}>
                          {productOrder.product?.name || "Deleted Product"}
                        </div>
                      ))}
                    </TableCell>

                    <TableCell>
                      {order.products.map((productOrder) => (
                        <div key={productOrder.product?._id}>
                          {productOrder.quantity}
                        </div>
                      ))}
                    </TableCell>

                    <TableCell>
                      {order.products.map((productOrder) => (
                        <div key={productOrder.product?._id}>
                          &#8358;{addCommasToNumber(productOrder.price)}
                        </div>
                      ))}
                    </TableCell>

                    <TableCell>
                      {order.products.map((productOrder) => (
                        <div key={productOrder.product?._id}>
                          &#8358;
                          {addCommasToNumber(
                            calculateCommission(productOrder.price).settleAmount
                          )}
                        </div>
                      ))}
                    </TableCell>

                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Order actions"
                          >
                            <MoreHorizontalIcon className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <Link
                            href={`/store/${params.slug}/order-details/${order._id}`}
                            legacyBehavior
                          >
                            <DropdownMenuItem asChild>
                              <a className="cursor-pointer">View Details</a>
                            </DropdownMenuItem>
                          </Link>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

// "use client";

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
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { calculateCommission, security } from "@/constant/constant";
// import { Order } from "@/types";
// import axios from "axios";
// import {
//   ArrowUpRightFromSquare,
//   Loader,
//   MoreHorizontalIcon,
// } from "lucide-react";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { addCommasToNumber } from "@/lib/utils";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";

// export default function Payout({ params }: { params: { slug: string } }) {
//   // console.log('params', params.slug)
//   const [fulfiliedOrders, setfulfiliedOrders] = useState<Order[] | null>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.post<{ fulfiliedOrders: Order[] }>(
//           "/api/store/fulfilied-orders"
//         );
//         // console.log("sellerdata", response);
//         // console.log("sellerdata.data.orders", response.data.orders);
//         setfulfiliedOrders(response.data.fulfiliedOrders);
//       } catch (error: any) {
//         console.error("Failed to fetch user data", error.message);
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (fulfiliedOrders === null) {
//     return (
//       <div className="w-full min-h-screen flex items-center justify-center">
//         <p className="w-full h-full flex items-center justify-center">
//           <Loader className="animate-spin" /> Loading...
//         </p>
//       </div>
//     );
//   }

//   const totalAvailablePayout = fulfiliedOrders.reduce((total, order) => {
//     // Sum the prices of all products within each order
//     const orderTotal = order.products.reduce((productTotal, productOrder) => {
//       return (
//         productTotal + calculateCommission(productOrder.price).settleAmount
//       );
//     }, 0);

//     // Add the order's total to the overall total
//     return total + orderTotal;
//   }, 0);

//   return (
//     <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
//       <div className="w-full">
//         <h1 className="text-2xl font-semibold pb-3">Balance Overview</h1>
//         <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
//           {security.map((item, i) => {
//             if (item.link) {
//               return (
//                 <Link
//                   href={`/store/${params.slug}/payout-history`}
//                   key={i}
//                   className="h-full"
//                 >
//                   <Card key={i} className="h-full">
//                     <CardHeader>
//                       <div className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle>{item.title}</CardTitle>
//                         <ArrowUpRightFromSquare />
//                       </div>
//                       <CardDescription>{item.desc}</CardDescription>
//                     </CardHeader>
//                   </Card>
//                 </Link>
//               );
//             } else if (item.title === "Available Payout") {
//               return (
//                 <Card key={i}>
//                   <CardHeader>
//                     <div className="flex flex-row items-center justify-between space-y-0 pb-2">
//                       <CardTitle>{item.title}</CardTitle>
//                       <p>&#8358;</p>
//                     </div>
//                     <CardDescription>{item.desc}</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold">
//                       &#8358; {addCommasToNumber(totalAvailablePayout)}
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             } else {
//               return (
//                 <Card key={i}>
//                   <CardHeader>
//                     <div className="flex flex-row items-center justify-between space-y-0 pb-2">
//                       <CardTitle>{item.title}</CardTitle>
//                       <p>&#8358;</p>
//                     </div>
//                     <CardDescription>{item.desc}</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold">
//                       &#8358; {item.content}
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             }
//           })}
//         </div>
//       </div>

//       <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
//         <Card>
//           <CardHeader>
//             <CardTitle>Fulfilied Orders</CardTitle>
//             <CardDescription>Sales available for payout</CardDescription>
//           </CardHeader>
//           <CardContent className="grid gap-8">
//             <Table>
//               <TableCaption>A list of your available payout.</TableCaption>
//               <TableHeader>
//                 <TableRow className=" text-[12.8px]">
//                   <TableHead>Order Status</TableHead>
//                   <TableHead>Product Name</TableHead>
//                   <TableHead>Quantity Bought</TableHead>
//                   <TableHead>Product Price</TableHead>
//                   <TableHead>Payout Amount</TableHead>
//                   {/* <TableHead>Payment Status</TableHead> */}
//                   <TableHead>Orderd Date</TableHead>
//                   <TableHead>More</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {fulfiliedOrders!.map((order) => (
//                   <TableRow key={order._id}>
//                     <TableCell className="font-medium text-green-500">
//                       {order.deliveryStatus}
//                     </TableCell>

//                     <TableCell>
//                       {order.products !== null &&
//                         order.products.map((productOrder) => (
//                           <div
//                             key={
//                               productOrder.product !== null
//                                 ? productOrder.product._id
//                                 : 1
//                             }
//                           >
//                             {productOrder.product !== null
//                               ? productOrder.product.name
//                               : "You've deleted this product."}
//                           </div>
//                         ))}
//                     </TableCell>

//                     <TableCell>
//                       {order.products !== null &&
//                         order.products.map((productOrder) => (
//                           <div
//                             key={
//                               productOrder.product !== null
//                                 ? productOrder.product._id
//                                 : 1
//                             }
//                           >
//                             {productOrder.quantity}
//                           </div>
//                         ))}
//                     </TableCell>

//                     <TableCell>
//                       {order.products !== null &&
//                         order.products.map((productOrder) => (
//                           <div
//                             key={
//                               productOrder.product !== null
//                                 ? productOrder.product._id
//                                 : 1
//                             }
//                           >
//                             &#8358;{addCommasToNumber(productOrder.price)}
//                           </div>
//                         ))}
//                     </TableCell>

//                     <TableCell className="text-right">
//                       {order.products !== null &&
//                         order.products.map((productOrder) => (
//                           <div
//                             key={
//                               productOrder.product !== null
//                                 ? productOrder.product._id
//                                 : 1
//                             }
//                           >
//                             &#8358;
//                             {addCommasToNumber(
//                               calculateCommission(productOrder.price)
//                                 .settleAmount
//                             )}
//                           </div>
//                         ))}
//                     </TableCell>

//                     <TableCell>
//                       {new Date(order.createdAt).toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                       })}
//                     </TableCell>

//                     <TableCell>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button
//                             aria-haspopup="true"
//                             size="icon"
//                             variant="ghost"
//                           >
//                             <MoreHorizontalIcon className="h-4 w-4" />
//                             <span className="sr-only">Toggle menu</span>
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                           <Link
//                             href={`/store/${params.slug}/order-details/${order._id}`}
//                           >
//                             <DropdownMenuItem>More</DropdownMenuItem>
//                           </Link>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     </main>
//   );
// }
