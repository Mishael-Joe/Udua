"use client";

import { useEffect, useState } from "react";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { addCommasToNumber } from "@/lib/utils";
import dynamic from "next/dynamic";
import { OderHistorySkeletonLoader } from "@/utils/skeleton-loaders/oderHistory-skeleton";

// TypeScript interfaces for better type safety
interface Product {
  _id: string;
  name: string;
  images: string[];
}

interface Order {
  _id: string;
  createdAt: string;
  status: string;
  deliveryStatus: string;
  totalAmount: number;
  products: Array<{
    product: Product;
    quantity: number;
  }>;
}

// Lazy load non-critical components
const Aside1 = dynamic(() => import("./aside-1"), {
  ssr: false,
});

/**
 * OrderHistory component displays a user's order history with essential order details.
 * Features responsive design, lazy loading, and accessibility optimizations.
 *
 * @returns {JSX.Element} - Order history interface with dynamic loading states
 */
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
      <div className="grid min-h-screen max-w-7xl mx-auto md:px-4 gap-4">
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Error Loading Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] md:px-4 gap-4">
      {/* Accessible sidebar with aria-label */}
      <aside
        aria-label="Account navigation"
        className="hidden bg-muted/10 md:block"
      >
        <div className="flex h-full max-h-screen flex-col gap-2">
          <Aside1 />
        </div>
      </aside>

      <main className="grid gap-4 w-full md:gap-8 py-4 md:py-0">
        <Card
          className="w-full md:border-0"
          role="region"
          aria-labelledby="orderHistoryHeading"
        >
          <CardHeader>
            <CardTitle id="orderHistoryHeading">Order History</CardTitle>
            <CardDescription>
              Manage your orders and view their details
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8">
            {orders.length > 0 ? (
              <Table aria-label="Order history">
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">Image</TableHead>
                    <TableHead scope="col">Order Date</TableHead>
                    <TableHead scope="col">Payment Status</TableHead>
                    <TableHead scope="col">Delivery Status</TableHead>
                    <TableHead scope="col">Total Amount</TableHead>
                    <TableHead scope="col">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        {order.products[0]?.product.images[0] && (
                          <Image
                            alt={`Product preview for ${order.products[0].product.name}`}
                            className="aspect-square rounded-md object-cover"
                            height={64}
                            width={64}
                            src={order.products[0].product.images[0]}
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <time
                          dateTime={new Date(order.createdAt).toISOString()}
                        >
                          {new Date(order.createdAt).toLocaleDateString()}
                        </time>
                      </TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>{order.deliveryStatus}</TableCell>
                      <TableCell aria-label="Total amount">
                        &#8358;{addCommasToNumber(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-label="Order actions menu"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/order/${order._id}`}
                                prefetch={false}
                              >
                                View Details
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// Empty State Component
const EmptyState = () => (
  <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
    <div className="flex items-center">
      <h2 className="text-lg font-semibold md:text-2xl">Order History</h2>
    </div>
    <div
      className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed shadow-sm p-2"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex w-full flex-col items-center justify-center text-center">
        <h3 className="mt-4 text-lg font-semibold">
          No Purchase History Found
        </h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Explore our collection to discover products you'll love
        </p>
        <Link href="/" passHref legacyBehavior>
          <Button size="sm" className="relative">
            Browse Products
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

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
// import Aside1 from "./aside-1";

// export function OrderHistory() {
//   const [orders, setOrders] = useState<any>([]);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.post("/api/user/orders");
//         setOrders(response.data.orders);
//         console.log("response.data.orders", response.data.orders);
//         console.log(response.data.orders[0].products[0].product.productImage);
//       } catch (error: any) {
//         console.error("Error fetching orders:", error.message);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (orders.length > 0) {
//     return (
//       <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ... md:px-4 gap-4">
//         <div className="hidden bg-muted/10 md:block">
//           <div className="flex h-full max-h-screen flex-col gap-2">
//             <Aside1 />
//           </div>
//         </div>

//         <div className="grid gap-4 w-full md:gap-8 py-4 md:py-0">
//           <Card className="w-full md:border-0">
//             <CardHeader>
//               <CardTitle>Order History</CardTitle>
//               <CardDescription>
//                 Manage your orders and view their details.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="grid gap-8">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Image</TableHead>
//                     <TableHead>Order Date</TableHead>
//                     <TableHead>Payment Status</TableHead>
//                     <TableHead>Delivery Status</TableHead>
//                     <TableHead>Total Amount</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {orders.map((order: any) => (
//                     <TableRow key={order._id}>
//                       <TableCell className="font-medium">
//                         {order.products !== null &&
//                           order.products[0].product.images[0] !== undefined && (
//                             <Image
//                               alt="Product image"
//                               className="aspect-square rounded-md object-cover"
//                               height="64"
//                               src={order.products[0].product.images[0]}
//                               loading="lazy"
//                               width="64"
//                             />
//                           )}
//                       </TableCell>
//                       <TableCell>
//                         {new Date(order.createdAt).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell>{order.status}</TableCell>
//                       <TableCell>{order.deliveryStatus}</TableCell>
//                       <TableCell>
//                         &#8358;{addCommasToNumber(order.totalAmount)}
//                       </TableCell>
//                       <TableCell>
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button
//                               aria-haspopup="true"
//                               size="icon"
//                               variant="ghost"
//                             >
//                               <MoreHorizontal className="h-4 w-4" />
//                               <span className="sr-only">Toggle menu</span>
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                             <Link href={`/order/${order._id}`}>
//                               <DropdownMenuItem>View Details</DropdownMenuItem>
//                             </Link>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   } else if (orders.length < 1) {
//     return (
//       <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ... md:px-4 gap-4">
//         <div className="hidden bg-muted/10 md:block">
//           <div className="flex h-full max-h-screen flex-col gap-2">
//             <Aside1 />
//           </div>
//         </div>

//         <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//           <div className="flex items-center">
//             <h1 className="text-lg font-semibold md:text-2xl">Order History</h1>
//           </div>
//           <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed shadow-sm p-2">
//             <div className="mx-auto flex  w-full flex-col items-center justify-center text-center">
//               {/* <XCircle className="h-10 w-10 text-muted-foreground" /> */}
//               <h3 className="mt-4 text-lg font-semibold w-full">
//                 We noticed that you haven't made a purchase with us yet.
//               </h3>
//               <p className="mb-4 mt-2 text-sm text-muted-foreground w-full">
//                 We have a wide range of amazing products that we think you'll
//                 love! <br />
//                 Take a moment to explore our collection and find something
//                 special just for you.
//               </p>
//               <Link href="/">
//                 <Button size="sm" className="relative">
//                   {/* <Plus className="mr-2 h-4 w-4" /> */}
//                   View Products
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
