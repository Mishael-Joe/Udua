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
import { Loader, Star } from "lucide-react";
import Image from "next/image";

export default function StoreProfile({ params }: { params: { slug: string } }) {
  // console.log('params', params.slug)
  return (
    <section className="sm:max-w-5xl mx-auto my-3 px-6 xl:px-0">
      <div className="p-4 border border-gray-700 h-72 w-full rounded-md bg-muted/50">
        <div className="flex h-2/3">
          <div className="bg-lime-60 basis-1/5 w-3/12 flex flex-col justify-center">
            <Image
              className="h-36 w-36 mx-auto rounded-full object-fill border"
              src={"/unsplash.jpg"}
              height={150}
              width={150}
              alt=""
            />
          </div>

          <div className="bg-red-60 basis-4/5 w-full flex flex-col justify-center">
            <div className="flex flex-col gap-4 justify-center">
              <p className=" text-2xl font-semibold">MISH STORE</p>
              <p className="text-ellipsis truncate max-w-screen-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Temporibus adipisci eum aspernatur dolorem nemo fugiat natus
                vero voluptates, sequi beatae hic perferendis harum repudiandae,
                exercitationem inventore itaque accusamus eligendi blanditiis.
              </p>
            </div>
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
        <Tabs defaultValue="products" className="sm:max-w-4xl mx-auto">
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
