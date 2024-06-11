"use client";

import { Button } from "@/components/ui/button";
import SellerAside from "../component/seller-aside";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "@/types";
import Link from "next/link";

export default function Page() {
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post<{ products: Product[] }>(
          "/api/seller/products"
        );
        setSellerProducts(response.data.products);
      } catch (error: any) {
        console.error("Failed to fetch seller Products", error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleDelete = async (productId: string) => {
    try {
      await axios.delete("/api/seller/deleteProduct", { data: { productId } });
      setSellerProducts(
        sellerProducts.filter((product) => product._id !== productId)
      );
    } catch (error: any) {
      console.error("Failed to delete product", error.message);
    }
  };

  const totalProducts = sellerProducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalProducts);

  return (
    <div className="grid min-h-screen max-w-6xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/10 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <SellerAside />
        </div>
      </div>
      <div className="flex flex-col">
        <main className="grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex items-center py-6">
            <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
            <div className="ml-auto flex items-center gap-2">
              <Link href={`/uploadProduct`}>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Product
                  </span>
                </Button>
              </Link>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Price
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Quantity
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Created at
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellerProducts.slice(startIndex, endIndex).map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt="Product image"
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={product.productImage[0]}
                          loading="lazy"
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.productName}
                      </TableCell>
                      <TableCell>
                        {product.isVerifiedProduct === true ? (
                          <Badge variant="outline" className="text-green-500">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-500">
                            unverified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {product.productPrice}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {product.productQuantity}
                      </TableCell>
                      {/* <TableCell className="hidden lg:table-cell">
                        2023-07-12 10:42 AM
                      </TableCell> */}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDelete(product._id as string)
                              }
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>{startIndex + 1}</strong> to{" "}
                <strong>{endIndex}</strong> of <strong>{totalProducts}</strong>{" "}
                products
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
}

// export default function Page() {
//   const [sellerProducts, setSellerProducts] = useState<Product[] | null>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.post<{ products: Product[] }>(
//           "/api/seller/products"
//         );
//         console.log("sellerdata", response);
//         console.log("sellerdata.data", response.data);
//         setSellerProducts(response.data.products);
//       } catch (error: any) {
//         console.error("Failed to fetch seller Products", error.message);
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (sellerProducts !== null) {
//     return (
//       <div className="grid min-h-screen max-w-6xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
//         <div className="hidden border-r bg-muted/10 md:block">
//           <div className="flex h-full max-h-screen flex-col gap-2">
//             <SellerAside />
//           </div>
//         </div>
//         <div className="flex flex-col">
//           <main className="grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
//             <div className="flex items-center py-6">
//               <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
//               <div className="ml-auto flex items-center gap-2">
//                 <Button size="sm" className="h-8 gap-1">
//                   <PlusCircle className="h-3.5 w-3.5" />
//                   <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
//                     Add Product
//                   </span>
//                 </Button>
//               </div>
//             </div>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Products</CardTitle>
//                 <CardDescription>
//                   Manage your products and view their sales performance.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="hidden w-[100px] sm:table-cell">
//                         <span className="sr-only">Image</span>
//                       </TableHead>
//                       <TableHead>Name</TableHead>
//                       {/* <TableHead>Status</TableHead> */}
//                       <TableHead className="hidden lg:table-cell">
//                         Price
//                       </TableHead>
//                       <TableHead className="hidden lg:table-cell">
//                         Total Sales
//                       </TableHead>
//                       <TableHead className="hidden lg:table-cell">
//                         Created at
//                       </TableHead>
//                       <TableHead>
//                         <span className="sr-only">Actions</span>
//                       </TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {sellerProducts?.map((product) => (
//                       <TableRow>
//                         <TableCell className="hidden sm:table-cell">
//                           <Image
//                             alt="Product image"
//                             className="aspect-square rounded-md object-cover"
//                             height="64"
//                             src={product.productImage[0]}
//                             loading="lazy"
//                             width="64"
//                           />
//                         </TableCell>
//                         <TableCell className="font-medium">
//                           {product.productName}
//                         </TableCell>
//                         {/* <TableCell>
//                         <Badge variant="outline">Draft</Badge>
//                       </TableCell> */}
//                         <TableCell className="hidden lg:table-cell">
//                           {product.productPrice}
//                         </TableCell>
//                         <TableCell className="hidden lg:table-cell">
//                           {product.productQuantity}
//                         </TableCell>
//                         <TableCell className="hidden lg:table-cell">
//                           2023-07-12 10:42 AM
//                         </TableCell>
//                         <TableCell>
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button
//                                 aria-haspopup="true"
//                                 size="icon"
//                                 variant="ghost"
//                               >
//                                 <MoreHorizontal className="h-4 w-4" />
//                                 <span className="sr-only">Toggle menu</span>
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                               <DropdownMenuItem>Edit</DropdownMenuItem>
//                               <DropdownMenuItem>Delete</DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//               <CardFooter>
//                 <div className="text-xs text-muted-foreground">
//                   Showing <strong>1-10</strong> of <strong>32</strong> products
//                 </div>
//               </CardFooter>
//             </Card>
//           </main>
//           {/* <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//             <div className="flex items-center">
//               <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
//             </div>
//             <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
//               <div className="flex flex-col items-center gap-1 text-center">
//                 <h3 className="text-2xl font-bold tracking-tight">
//                   You have no products
//                 </h3>
//                 <p className="text-sm text-muted-foreground">
//                   You can start selling as soon as you add a product.
//                 </p>
//                 <Button size="sm" className="h-8 gap-1 mt-4">
//                     <PlusCircle className="h-3.5 w-3.5" />
//                     <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
//                       Add Product
//                     </span>
//                   </Button>
//               </div>
//             </div>
//           </main> */}
//         </div>
//       </div>
//     );
//   }
// }
