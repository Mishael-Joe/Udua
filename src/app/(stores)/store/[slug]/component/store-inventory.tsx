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

export default function StoreInventory({ params }: { params: { slug: string } }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post<{ products: Product[] }>(
          "/api/store/products"
        );
        setSellerProducts(response.data.products);
      } catch (error: any) {
        console.error("Failed to fetch seller Products", error.message);
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
        setSellerProducts(
          sellerProducts.filter((product) => product._id !== productId)
        );
      }
    } catch (error: any) {
      console.error("Failed to delete product", error.message);
      toast({
        title: `Success`,
        variant: `destructive`,
        description: `An error occured while deleting this product.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalProducts = sellerProducts.length;
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
                <CardDescription>
                  Manage your products and view their sales performance.
                </CardDescription>
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
                    {sellerProducts
                      .slice(startIndex, endIndex)
                      .map((product) => (
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
                              <Badge
                                variant="outline"
                                className="text-green-500"
                              >
                                Verified
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-yellow-500"
                              >
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
                                <Link href={`/store/${params.slug}/edit-product/${product._id}`}>
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem
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
                  <strong>{endIndex}</strong> of{" "}
                  <strong>{totalProducts}</strong> products
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
  );
}
