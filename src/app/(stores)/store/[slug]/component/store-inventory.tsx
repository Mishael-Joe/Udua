"use client";

// Core Imports
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Custom Hooks and Utilities
import { useToast } from "@/components/ui/use-toast";
import { addCommasToNumber, formatDate } from "@/lib/utils"; // Assume formatDate is implemented

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader, MoreHorizontal, PlusCircle } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
import { Product } from "@/types";

export default function StoreInventory({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  /**
   * Fetches store products from API with error handling
   */
  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const { data } = await axios.post<{ products: Product[] }>(
          "/api/store/products",
          { signal: controller.signal }
        );
        setStoreProducts(data.products);
        console.log(" data.products", data.products);
      } catch (error: any) {
        if (!axios.isCancel(error)) {
          console.error("Failed to fetch products", error.message);
          toast({
            title: "Error",
            variant: "destructive",
            description: "Failed to load products. Please try again later.",
          });
        }
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [toast]);

  /**
   * Handles product deletion with confirmation dialog
   */
  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product permanently?"))
      return;

    setIsLoading(true);
    try {
      await axios.delete("/api/store/delete-product", { data: { productId } });
      setStoreProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
      toast({ title: "Success", description: "Product deleted successfully" });
    } catch (error: any) {
      console.error("Deletion failed:", error.message);
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error.response?.data?.message || "Failed to delete product",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggles product visibility state
   */
  const toggleProductVisibility = async (productId: string) => {
    setIsLoading(true);
    try {
      await axios.post("/api/store/toggle-product-visibility", { productId });
      setStoreProducts((prev) =>
        prev.map((product) =>
          product._id === productId
            ? { ...product, isVisible: !product.isVisible }
            : product
        )
      );
      toast({
        title: "Success",
        description: "Visibility updated successfully",
      });
    } catch (error: any) {
      console.error("Visibility toggle failed:", error.message);
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error.response?.data?.message || "Failed to update visibility",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination calculations
  const totalProducts = storeProducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalProducts);

  return (
    <main className="flex flex-col">
      {/* Page Header with Semantic HTML */}
      <header className="grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="flex items-center py-6">
          <h1 className="text-lg font-semibold md:text-2xl">
            Inventory Management
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href={`/store/${params.slug}/upload-product`}
              passHref
              legacyBehavior
            >
              <Button asChild size="sm" className="h-8 gap-1">
                <a>
                  <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add New Product
                  </span>
                </a>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Product Table Section */}
      <section
        aria-labelledby="products-table-heading"
        className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1"
      >
        <Card role="region" aria-labelledby="products-table-title">
          <CardHeader>
            <CardTitle id="products-table-title">Product Inventory</CardTitle>
            <CardDescription>
              Manage and organize your store's products
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table aria-label="Products list">
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell" scope="col">
                    <span className="sr-only">Product Image</span>
                  </TableHead>
                  <TableHead scope="col">Product Name</TableHead>
                  <TableHead scope="col">Verification Status</TableHead>
                  <TableHead scope="col">Visibility</TableHead>
                  <TableHead className="hidden lg:table-cell" scope="col">
                    Price
                  </TableHead>
                  <TableHead className="hidden lg:table-cell" scope="col">
                    Stock
                  </TableHead>
                  {/* <TableHead className="hidden lg:table-cell" scope="col">
                    Created Date
                  </TableHead> */}
                  <TableHead scope="col">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {storeProducts.slice(startIndex, endIndex).map((product) => (
                  <TableRow key={product._id} aria-rowindex={startIndex + 1}>
                    {/* Product Image with Lazy Loading */}
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={`${product.name} product preview`}
                        className="aspect-square rounded-md object-cover"
                        height={64}
                        width={64}
                        src={product.images[0] || "/placeholder-product.jpg"}
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
                      />
                    </TableCell>

                    {/* Product Name with Truncation */}
                    <TableCell
                      className="font-medium line-clamp-2"
                      style={{ lineHeight: "1.5em" }}
                    >
                      {product.name}
                    </TableCell>

                    {/* Verification Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          product.isVerifiedProduct
                            ? "text-green-500"
                            : "text-yellow-500"
                        }
                        aria-live="polite"
                      >
                        {product.isVerifiedProduct
                          ? "Verified"
                          : "Pending Verification"}
                      </Badge>
                    </TableCell>

                    {/* Visibility Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          product.isVisible
                            ? "text-green-500"
                            : "text-yellow-500"
                        }
                        aria-live="polite"
                      >
                        {product.isVisible ? "Visible" : "Hidden"}
                      </Badge>
                    </TableCell>

                    {/* Price Information */}
                    <TableCell className="hidden lg:table-cell">
                      &#8358;{" "}
                      {addCommasToNumber(
                        product.price ?? product.sizes?.[0]?.price ?? 0
                      )}
                    </TableCell>

                    {/* Stock Quantity */}
                    <TableCell className="hidden lg:table-cell">
                      {product.productQuantity ??
                        product.sizes?.[0]?.quantity ??
                        0}
                    </TableCell>

                    {/* Formatted Creation Date */}
                    {/* <TableCell className="hidden lg:table-cell">
                      {formatDate(product.createdAt)}
                    </TableCell> */}

                    {/* Action Dropdown */}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-label="Product actions menu"
                            size="icon"
                            variant="ghost"
                            disabled={isLoading}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Product Actions</DropdownMenuLabel>
                          <Link
                            href={`/store/${params.slug}/edit-product/${product._id}`}
                            passHref
                            legacyBehavior
                          >
                            <DropdownMenuItem asChild>
                              <a>Edit Product Details</a>
                            </DropdownMenuItem>
                          </Link>

                          <DropdownMenuItem
                            onSelect={() =>
                              toggleProductVisibility(product._id!)
                            }
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span className="flex items-center gap-2">
                                <Loader
                                  className="animate-spin"
                                  aria-hidden="true"
                                />
                                Updating...
                              </span>
                            ) : (
                              `Mark ${product.isVisible ? "Hidden" : "Visible"}`
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>

          {/* Pagination Footer */}
          <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <strong>
                {startIndex + 1}-{endIndex}
              </strong>{" "}
              of <strong>{totalProducts}</strong> products
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}

// "use client";

// import { Button } from "@/components/ui/button";
// import { Loader, MoreHorizontal, PlusCircle } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
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
// import Image from "next/image";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Product } from "@/types";
// import Link from "next/link";
// import { useToast } from "@/components/ui/use-toast";
// import { useRouter } from "next/navigation";
// import { addCommasToNumber } from "@/lib/utils";

// export default function StoreInventory({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);
//   const [storeProducts, setStoreProducts] = useState<Product[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.post<{ products: Product[] }>(
//           "/api/store/products"
//         );
//         setStoreProducts(response.data.products);
//       } catch (error: any) {
//         console.error("Failed to fetch Store Products", error.message);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleDelete = async (productId: string) => {
//     setIsLoading(true);
//     try {
//       const response = await axios.delete("/api/store/delete-product", {
//         data: { productId },
//       });

//       if (response.status === 200) {
//         toast({
//           title: `Success`,
//           description: `You have Successfully deleted this product.`,
//         });
//         setStoreProducts(
//           storeProducts.filter((product) => product._id !== productId)
//         );
//       }
//     } catch (error: any) {
//       console.error("Failed to delete product", error.message);
//       toast({
//         title: `Error`,
//         variant: `destructive`,
//         description: `An error occured while deleting this product.`,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleProductVisibility = async (productId: string) => {
//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         "/api/store/toggle-product-visibility",
//         {
//           data: { productId },
//         }
//       );

//       if (response.status === 200) {
//         toast({
//           title: `Success`,
//           description: `Product visibility Updated Successfully.`,
//         });
//       }
//     } catch (error: any) {
//       console.error("Failed to update Product visibility.", error.message);
//       toast({
//         title: `Error`,
//         variant: `destructive`,
//         description: `An error occured while updating Product visibility..`,
//       });
//     } finally {
//       setIsLoading(false);
//       router.refresh();
//     }
//   };

//   const totalProducts = storeProducts.length;
//   const totalPages = Math.ceil(totalProducts / pageSize);
//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = Math.min(startIndex + pageSize, totalProducts);

//   return (
//     <main className="flex flex-col">
//       <div className="grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
//         <div className="flex items-center py-6">
//           <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
//           <div className="ml-auto flex items-center gap-2">
//             <Link href={`/store/${params.slug}/upload-product`}>
//               <Button size="sm" className="h-8 gap-1">
//                 <PlusCircle className="h-3.5 w-3.5" />
//                 <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
//                   Add Product
//                 </span>
//               </Button>
//             </Link>
//           </div>
//         </div>
//         <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
//           <Card>
//             <CardHeader>
//               <CardTitle>Products</CardTitle>
//               <CardDescription>Manage your products.</CardDescription>
//             </CardHeader>
//             <CardContent className="grid gap-8">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="hidden w-[100px] sm:table-cell">
//                       <span className="sr-only">Image</span>
//                     </TableHead>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Visibility</TableHead>
//                     <TableHead className="hidden lg:table-cell">
//                       Price
//                     </TableHead>
//                     <TableHead className="hidden lg:table-cell">
//                       Quantity
//                     </TableHead>
//                     <TableHead className="hidden lg:table-cell">
//                       Created At
//                     </TableHead>
//                     <TableHead>More</TableHead>
//                     <TableHead>
//                       <span className="sr-only">Actions</span>
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {storeProducts.slice(startIndex, endIndex).map((product) => (
//                     <TableRow key={product._id}>
//                       <TableCell className="hidden sm:table-cell">
//                         <Image
//                           alt="Product image"
//                           className="aspect-square rounded-md object-cover"
//                           height="64"
//                           src={product.images[0]}
//                           loading="lazy"
//                           width="64"
//                         />
//                       </TableCell>
//                       <TableCell
//                         className="font-medium"
//                         style={{
//                           marginTop: "1.5em",
//                           display: "-webkit-box",
//                           WebkitBoxOrient: "vertical",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           WebkitLineClamp: 2, // Limits the text to 3 lines
//                           maxHeight: "2.5em", // Adjust this based on the number of lines and line height
//                           lineHeight: "1.5em", // Adjust based on font size for accurate height control
//                         }}
//                       >
//                         {product.name}
//                       </TableCell>
//                       <TableCell>
//                         {product.isVerifiedProduct === true ? (
//                           <Badge
//                             variant="outline"
//                             className="text-green-500 border-none"
//                           >
//                             Verified
//                           </Badge>
//                         ) : (
//                           <Badge
//                             variant="outline"
//                             className="text-yellow-500 border-none"
//                           >
//                             unverified
//                           </Badge>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         {product.isVisible === true ? (
//                           <Badge
//                             variant="outline"
//                             className="text-green-500 border-none"
//                           >
//                             Visible
//                           </Badge>
//                         ) : (
//                           <Badge
//                             variant="outline"
//                             className="text-yellow-500 border-none"
//                           >
//                             Hidden
//                           </Badge>
//                         )}
//                       </TableCell>
//                       <TableCell className="hidden lg:table-cell">
//                         {product.price !== null ? (
//                           <p>
//                             &#8358; {addCommasToNumber(product.price as number)}{" "}
//                           </p>
//                         ) : (
//                           <p>
//                             &#8358; {addCommasToNumber(product.sizes![0].price)}{" "}
//                           </p>
//                         )}
//                       </TableCell>
//                       <TableCell className="hidden lg:table-cell">
//                         {product.price !== null ? (
//                           <p>{product.productQuantity}</p>
//                         ) : (
//                           <p>{product.sizes![0].quantity}</p>
//                         )}
//                       </TableCell>
//                       <TableCell className="hidden lg:table-cell">
//                         2023-07-12 10:42 AM
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
//                             <Link
//                               href={`/store/${params.slug}/edit-product/${product._id}`}
//                             >
//                               <DropdownMenuItem>Edit</DropdownMenuItem>
//                             </Link>
//                             {/* <DropdownMenuItem
//                               onClick={() =>
//                                 handleDelete(product._id as string)
//                               }
//                             >
//                               {isLoading ? (
//                                 <p className="flex flex-row items-center gap-4">
//                                   <Loader
//                                     className=" animate-spin"
//                                     width={25}
//                                     height={25}
//                                   />{" "}
//                                 </p>
//                               ) : (
//                                 "Delete"
//                               )}
//                             </DropdownMenuItem> */}
//                             <DropdownMenuItem
//                               onClick={() =>
//                                 toggleProductVisibility(product._id as string)
//                               }
//                             >
//                               {isLoading ? (
//                                 <p className="flex flex-row items-center gap-4">
//                                   <Loader
//                                     className=" animate-spin"
//                                     width={25}
//                                     height={25}
//                                   />{" "}
//                                 </p>
//                               ) : (
//                                 "Toggle Visibility"
//                               )}
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//             <CardFooter>
//               <div className="text-xs text-muted-foreground">
//                 Showing <strong>{startIndex + 1}</strong> to{" "}
//                 <strong>{endIndex}</strong> of <strong>{totalProducts}</strong>{" "}
//                 products
//               </div>
//             </CardFooter>
//           </Card>
//         </div>
//       </div>
//     </main>
//   );
// }
