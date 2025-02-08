"use client";

import React, { ChangeEvent, use } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import axios from "axios";
import { productCategories, subCategories } from "@/constant/constant";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type Products = Omit<Product, "storeID" | "images" | "path" | "price"> & {
  price: string;
  images: ""[];
};

export default function EditProduct(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const { toast } = useToast();
  //   console.log('params', params)
  const [product, setProduct] = useState<Products>({
    name: "",
    price: "",
    sizes: [],
    productQuantity: "",
    images: [""],
    description: "",
    specifications: "",
    category: "",
    subCategory: "",
    productType: "Physical Product",
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // This will store the image URLs

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post("/api/store/fetch-product", {
          productID: params.slug,
        });
        setProduct(response.data.product);
        // console.log(`response.data`, response.data.product);
      } catch (error: any) {
        console.error("Failed to fetch seller Products", error.message);
      }
    };

    fetchUserData();
  }, []);
  // console.log(`Product`, product);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/admin/verify-product", {
        productID: params.slug,
      });
      if (response.status === 200) {
        toast({
          variant: "default",
          title: `Error`,
          description: `Product verified.`,
        });
        router.refresh();
      }
    } catch (error: any) {
      console.error("Failed to fetch seller Products", error.message);
      toast({
        variant: "default",
        title: `Error`,
        description: `Product verified.`,
      });
    }
  };

  return (
    <main className="flex flex-col py-4">
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4 text-ellipsis">
            <h1 className=" shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 text-ellipsis">
              {product.name}
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button size="sm" onClick={handleSubmit}>
                Verify Product
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        value={product.name}
                        disabled
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        disabled
                        value={product.description}
                        className="min-h-32"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Specification</Label>
                      <Textarea
                        id="description"
                        disabled
                        value={product.specifications}
                        className="min-h-32"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Price</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        disabled
                        value={product.price}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="name">Quantity</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        disabled
                        value={product.productQuantity}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 ">
                      <div className="grid gap-3">
                        <select
                          aria-label="Select category"
                          name="productCategory"
                          value={product.category}
                          className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                          disabled
                        >
                          <option value="" disabled>
                            Select a Category
                          </option>
                          {productCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {product.category && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Sub-Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 ">
                        <div className="grid gap-3">
                          <select
                            aria-label="Select sub-category"
                            name="productSubCategory"
                            value={product.subCategory}
                            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                            disabled
                          >
                            <option value="" disabled>
                              Select a Sub-Category
                            </option>
                            {subCategories[product.category]?.map(
                              (subCategory) => (
                                <option key={subCategory} value={subCategory}>
                                  {subCategory}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="status">Status</Label>
                      {product.isVerifiedProduct === true ? (
                        <Badge
                          variant="outline"
                          className="text-green-500 w-fit"
                        >
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-yellow-500 w-fit"
                        >
                          unverified
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-1 gap-2">
                      {product.images.map((img, i) => (
                        <button key={i}>
                          <Image
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="200"
                            src={img}
                            width="200"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button size="sm" onClick={handleSubmit}>
              Verify Product
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
