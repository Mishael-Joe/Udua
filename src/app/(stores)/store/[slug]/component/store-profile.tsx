"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Package, Share2 } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import StoreDescription from "./store-description";
import { ProductGrid } from "@/components/product-grid";
import { Store } from "@/types";
import DOMPurify from "dompurify";
import { toast } from "@/components/ui/use-toast";

export default function StoreProfile({ id }: { id: string }) {
  const [store, setStore] = useState<Store | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  // console.log("id", id);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.post<{ store: Store }>(
          `/api/store/fetch-store-data/${id}`
        );
        setStore(response.data.store);
      } catch (error) {
        console.error("Failed to fetch store data:", error);
      }
    };

    fetchStoreData();
  }, []);

  const handleShareStore = () => {
    if (!store?.uniqueId) return;

    const storeUrl = `${window.location.origin}/brand/${store._id}`;
    navigator.clipboard.writeText(storeUrl);
    setIsCopied(true);
    toast({
      title: "Link copied!",
      description: "Store link has been copied to clipboard",
    });

    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!store) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-6 w-[200px]" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Tabs defaultValue="products">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">
              <Skeleton className="h-6 w-24" />
            </TabsTrigger>
            <TabsTrigger value="description">
              <Skeleton className="h-6 w-24" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    );
  }

  const { name, description, products, uniqueId, followers } = store;
  const sanitizedDescription = DOMPurify.sanitize(description);

  return (
    <main className="container mx-auto px-4 md:px-8 py-6">
      {/* Store Header */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="relative h-48 bg-muted/50 rounded-t-lg">
            <div className="absolute -bottom-8 left-0 right-0 sm:left-6 px-4 flex flex-col sm:flex-row items-start sm:items-end gap-4">
              {/* Store Info Container */}
              <div className="bg-background p-4 rounded-lg shadow-lg w-full max-w-full sm:flex-1 sm:max-w-fit sm:min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h1 className="text-2xl sm:text-3xl font-bold truncate break-words">
                    {name}
                  </h1>
                  <Badge variant="outline" className="text-xs sm:text-sm w-fit">
                    ID: {uniqueId}
                  </Badge>
                </div>

                {/* Stats Container */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-4">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="text-sm sm:text-base font-medium">
                      {followers?.length.toLocaleString()} Follower
                      {(followers.length > 1 || followers.length === 0) && "s"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="text-sm sm:text-base font-medium">
                      {products?.length.toLocaleString()} Products
                    </span>
                  </div>
                </div>
              </div>

              {/* Share Button */}
              <Button
                variant="outline"
                onClick={handleShareStore}
                className="sm:mb-4 gap-2 w-full sm:w-auto"
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">
                  {isCopied ? "Copied!" : "Share Store"}
                </span>
              </Button>
            </div>
          </div>

          <div className="pt-20 px-6 pb-6">
            {description && (
              <div
                className="prose dark:prose-invert max-w-4xl"
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Store Content Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products" className="flex gap-2">
            <Package className="h-4 w-4" /> Products
          </TabsTrigger>
          <TabsTrigger value="description" className="flex gap-2">
            <Users className="h-4 w-4" /> About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Product Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductGrid products={products || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="description" className="mt-6">
          <StoreDescription store={store} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
