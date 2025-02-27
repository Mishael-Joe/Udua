"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useEffect, useState } from "react";
import { Loader, StoreIcon } from "lucide-react";
import StoreDescription from "./store-description";
import { Store } from "@/types";
import { ProductGrid } from "@/components/product-grid";

export default function StoreProfile() {
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        // Pass the slug to the API in case it is needed for fetching store data.
        const response = await axios.post<{ store: Store }>(
          "/api/store/fetch-store-data"
        );
        setStore(response.data.store);
      } catch (error: any) {
        console.error("Failed to fetch store data:", error.message);
      }
    };

    fetchStoreData();
  }, []);

  // Display a centered loader while waiting for store data.
  if (!store) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  // Destructure the store data for easy access.
  const { name, description, products } = store;

  return (
    <main className="overflow-hidden">
      <section className="p-4 md:p-8 ">
        {/* Store Header */}
        <div className="p-4 border border-gray-700 h-72 w-full rounded-md bg-muted/50">
          <div className="flex h-2/3 w-full items-center">
            {/* Store icon displayed only on larger screens */}
            <div className="hidden sm:flex basis-1/5 w-1/4 justify-center">
              <StoreIcon className="h-16 w-16 sm:h-24 sm:w-24" />
            </div>
            <div className="flex flex-col gap-4 w-full sm:pl-5 lg:pl-0">
              <p className="text-2xl font-semibold">{name}</p>
              {/* Using Tailwind's line-clamp utility for a 3-line ellipsis */}
              <p className="line-clamp-3 text-gray-700">{description}</p>
            </div>
          </div>
        </div>

        {/* Store Tabs */}
        <div className="pt-4 w-full">
          <Tabs defaultValue="products" className="sm:max-w-4xl mx-auto w-full">
            <TabsList className="grid w-full grid-cols-2 text-xl font-bold">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Products on this store</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductGrid products={products || []} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="description">
              <StoreDescription store={store} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
