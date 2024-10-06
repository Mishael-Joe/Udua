"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import axios from "axios";
import { useEffect, useState } from "react";
import { Loader, Star, StoreIcon } from "lucide-react";
import Image from "next/image";
import { Store } from "@/types";
import BrandDescription from "./brand-description";
import { ProductGrid } from "./product-grid";

export default function BrandProfile({ params }: { params: { slug: string } }) {
  const [store, setStore] = useState<Store | null>(null);

  const body = {
    storeID: params.slug
  }
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.post<{ store: Store }>(
          "/api/brand",
          body
        );
        // console.log("storedata", response.data);
        setStore(response.data.store);
      } catch (error: any) {
        console.error("Failed to fetch store data", error.message);
      }
    };

    fetchStoreData();
  }, []);

  if (store === null) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin" /> Loading...
        </p>
      </div>
    );
  }

  return (
    <section className=" max-w-5xl mx-auto my-3 px-6 xl:px-0">
      <div className="p-4 border border-gray-700 h-72 w-full rounded-md bg-muted/50">
        <div className="flex h-2/3 w-[100%] items-center">
          <div className="bg-lime-60 basis-2/5 sm:basis-1/5 w-3/12 sm:flex flex-col justify-center  hidden">
            <StoreIcon
              className="h-16 w-16 sm:h-[100px] sm:w-[100px] mx-auto"
              height={50}
              width={50}
            />
          </div>

          <div className="flex flex-col gap-4 w-full sm:pl-5 lg:pl-0">
            <p className=" text-2xl font-semibold">{store?.name}</p>
            <p
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                WebkitLineClamp: 3, // Limits the text to 3 lines
                maxHeight: "4.5em", // Adjust this based on the number of lines and line height
                lineHeight: "1.5em", // Adjust based on font size for accurate height control
              }}
            >
              {store?.description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 h-1/3 w-full">
          <Star />
          <Star />
          <Star />
          <Star />
          <Star />
        </div>
      </div>

      <div className="pt-4 w-full h-fit">
        <Tabs defaultValue="products" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 text-xl font-bold">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Products on this store</CardTitle>
              </CardHeader>

              <CardContent>
               <ProductGrid products={store?.products !== null ? store.products : []} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="description">
            <BrandDescription store={store} />
          </TabsContent>
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>
                  What people are saying about this store.
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
