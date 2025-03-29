"use client";

// Core Imports
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Custom Hooks and Utilities
import { useToast } from "@/components/ui/use-toast";
import { formatNaira, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MoreHorizontal,
  PlusCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
} from "lucide-react";
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

/**
 * StoreInventory component manages and displays product inventory for a store
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.params - Route parameters
 * @param {string} props.params.slug - Store identifier
 */
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
   * @async
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
      } catch (error: any) {
        if (!axios.isCancel(error)) {
          console.error("Product fetch error:", error.message);
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
  }, []);

  /**
   * Handles product deletion with confirmation
   * @async
   * @param {string} productId - ID of the product to delete
   */
  const handleDelete = async (productId: string) => {
    if (!confirm("Permanently delete this product?")) return;

    setIsLoading(true);
    try {
      await axios.delete("/api/store/delete-product", { data: { productId } });
      setStoreProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
      toast({ title: "Success", description: "Product deleted successfully" });
    } catch (error: any) {
      console.error("Deletion error:", error.message);
      toast({
        title: "Error",
        variant: "destructive",
        description: error.response?.data?.message || "Deletion failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggles product visibility state
   * @async
   * @param {string} productId - ID of the product to toggle
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
      toast({ title: "Success", description: "Visibility updated" });
    } catch (error: any) {
      console.error("Visibility toggle error:", error.message);
      toast({
        title: "Error",
        variant: "destructive",
        description: error.response?.data?.message || "Update failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination calculations
  const totalProducts = storeProducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize);
  const currentProducts = storeProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <main className="flex flex-col gap-4 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage {storeProducts.length} products in your store
          </p>
        </div>
        <Button asChild className="bg-blue-500 hover:bg-udua-blue-primary">
          <Link href={`/store/${params.slug}/upload-product`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Inventory Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            Active products in your store catalog
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Preview</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentProducts.map((product) => (
                <TableRow key={product._id} className="hover:bg-muted/50">
                  {/* Product Image */}
                  <TableCell>
                    <div className="relative aspect-square w-16 overflow-hidden rounded-md">
                      <Image
                        fill
                        alt={product.name}
                        src={product.images[0] || "/placeholder-product.jpg"}
                        className="object-cover"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
                      />
                    </div>
                  </TableCell>

                  {/* Product Details */}
                  <TableCell className="font-medium max-w-[300px] line-clamp-2">
                    {product.name}
                  </TableCell>

                  {/* Verification Status */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {product.isVerifiedProduct ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-yellow-600" />
                      )}
                      <span>
                        {product.isVerifiedProduct ? "Verified" : "Pending"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Stock Quantity */}
                  <TableCell className="text-right">
                    {product.productQuantity ??
                      product.sizes?.[0]?.quantity ??
                      0}
                  </TableCell>

                  {/* Product Price */}
                  <TableCell className="text-right">
                    {formatNaira(
                      product.price ?? product.sizes?.[0]?.price ?? 0
                    )}
                  </TableCell>

                  {/* Action Menu */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Product Actions</DropdownMenuLabel>

                        <Link
                          href={`/store/${params.slug}/edit-product/${product._id}`}
                        >
                          <DropdownMenuItem className="cursor-pointer">
                            Edit Details
                          </DropdownMenuItem>
                        </Link>

                        <DropdownMenuItem
                          onSelect={() => toggleProductVisibility(product._id!)}
                          disabled={isLoading}
                        >
                          {product.isVisible ? (
                            <EyeOff className="mr-2 h-4 w-4" />
                          ) : (
                            <Eye className="mr-2 h-4 w-4" />
                          )}
                          Mark {product.isVisible ? "Hidden" : "Visible"}
                        </DropdownMenuItem>

                        {/* <DropdownMenuItem
                          className="text-destructive"
                          onSelect={() => handleDelete(product._id!)}
                          disabled={isLoading}
                        >
                          Delete Product
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination Footer */}
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
