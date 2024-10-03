"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import axios from "axios";
import { useEffect, useState } from "react";
import { Star, StoreIcon } from "lucide-react";
import Image from "next/image";

export default function Page() {
  return (
    <section className=" max-w-7xl mx-auto my-3 px-6 xl:px-0">
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
              {/* <p className=" text-2xl font-semibold">{store?.name}</p> */}
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
                {/* {store?.description} */}
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
            </Card>
          </TabsContent>
          <TabsContent value="description">
            <Card>
              <CardHeader>
                <CardTitle>Store Description</CardTitle>
                <CardDescription>
                  What this store is all about.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="space-y-1">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Possimus officiis repellendus laborum, dolorum labore cumque
                  iste impedit pariatur, maxime deleniti nesciunt provident?
                  Sequi deserunt harum nam voluptatem sint ullam doloremque!
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 items-start">
                <span>More Info</span>

                <div className="flex flex-col gap-3">
                <p>Store url: </p>
                <p>Location: </p>
                <p>Joined date: </p>
                </div>
              </CardFooter>
            </Card>
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
