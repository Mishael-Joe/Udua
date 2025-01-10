"use client";

import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post<{ products: Product[] }>(
          "/api/store/products"
        );
        setStoreProducts(response.data.products);
      } catch (error: any) {
        console.error("Failed to fetch Store Products", error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleDelete = async (productId: string) => {
    setIsLoading(true);
    try {
      const response = await axios.delete("/api/store/delete-product", {
        data: { productId },
      });

      if (response.status === 200) {
        toast({
          title: `Success`,
          description: `You have Successfully deleted this product.`,
        });
        setStoreProducts(
          storeProducts.filter((product) => product._id !== productId)
        );
      }
    } catch (error: any) {
      console.error("Failed to delete product", error.message);
      toast({
        title: `Error`,
        variant: `destructive`,
        description: `An error occured while deleting this product.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProductVisibility = async (productId: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/store/toggle-product-visibility",
        {
          data: { productId },
        }
      );

      if (response.status === 200) {
        toast({
          title: `Success`,
          description: `Product visibility Updated Successfully.`,
        });
      }
    } catch (error: any) {
      console.error("Failed to update Product visibility.", error.message);
      toast({
        title: `Error`,
        variant: `destructive`,
        description: `An error occured while updating Product visibility..`,
      });
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  const totalProducts = storeProducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalProducts);

  return (
    <main className="flex flex-col">
      <div className="grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="flex items-center py-6">
          <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
          <div className="ml-auto flex items-center gap-2">
            <Link href={`/store/${params.slug}/upload-product`}>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Product
                </span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your products.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Price
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Quantity
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Created At
                    </TableHead>
                    <TableHead>More</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storeProducts.slice(startIndex, endIndex).map((product) => (
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
                      <TableCell className="font-medium"
                      style={{
                        marginTop: "1.5em",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 2, // Limits the text to 3 lines
                        maxHeight: "2.5em", // Adjust this based on the number of lines and line height
                        lineHeight: "1.5em", // Adjust based on font size for accurate height control
                      }}
                      >
                        {product.productName}
                      </TableCell>
                      <TableCell>
                        {product.isVerifiedProduct === true ? (
                          <Badge
                            variant="outline"
                            className="text-green-500 border-none"
                          >
                            Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-yellow-500 border-none"
                          >
                            unverified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {product.isVisible === true ? (
                          <Badge
                            variant="outline"
                            className="text-green-500 border-none"
                          >
                            Visible
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-yellow-500 border-none"
                          >
                            Hidden
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {product.productPrice}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {product.productQuantity}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        2023-07-12 10:42 AM
                      </TableCell>
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
                            <Link
                              href={`/store/${params.slug}/edit-product/${product._id}`}
                            >
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                            </Link>
                            {/* <DropdownMenuItem
                              onClick={() =>
                                handleDelete(product._id as string)
                              }
                            >
                              {isLoading ? (
                                <p className="flex flex-row items-center gap-4">
                                  <Loader
                                    className=" animate-spin"
                                    width={25}
                                    height={25}
                                  />{" "}
                                </p>
                              ) : (
                                "Delete"
                              )}
                            </DropdownMenuItem> */}
                            <DropdownMenuItem
                              onClick={() =>
                                toggleProductVisibility(product._id as string)
                              }
                            >
                              {isLoading ? (
                                <p className="flex flex-row items-center gap-4">
                                  <Loader
                                    className=" animate-spin"
                                    width={25}
                                    height={25}
                                  />{" "}
                                </p>
                              ) : (
                                "Toggle Visibility"
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
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>{startIndex + 1}</strong> to{" "}
                <strong>{endIndex}</strong> of <strong>{totalProducts}</strong>{" "}
                products
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
