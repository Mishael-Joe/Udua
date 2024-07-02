"use client";

import React, { ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Upload,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { fetchProductData } from "@/lib/actions/product.action";
import axios from "axios";
import SellerAside from "./seller-aside";

type Products = Omit<
  Product,
  "accountId" | "productImage" | "path" | "productPrice"
> & {
  productPrice: string;
  productImage: ""[];
};

export default function EditProduct({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Products>({
    productName: "",
    productPrice: "",
    productSizes: [],
    productQuantity: "",
    productImage: [""],
    productDescription: "",
    productSpecification: "",
    productCategory: "",
    productSubCategory: "",
  });

  const possibleSizes = [
    "X-Small",
    "Small",
    "Medium",
    "Large",
    "X-Large",
    "One Size",
  ];

  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // This will store the image URLs
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Store Cloudinary URLs
  // const [product, setProduct] = useState<Product | {}>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post("/api/seller/fetchProduct", {
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

  const productCategories = [
    "Electronics",
    "Clothing",
    "Books",
    "Furniture",
    "Toys",
    "Groceries",
    "School Supplies",
    "Body Care Products",
    "Fashion",
    "Phone Accessories",
  ];

  const subCategories: { [key: string]: string[] } = {
    "School Supplies": [
      "Writing Instruments",
      "Paper Products",
      "Organizational Supplies",
      "Art and Craft Supplies",
      "Technology and Gadgets",
      "Classroom Essentials",
    ],
    "Body Care Products": [
      "Skincare",
      "Hair Care",
      "Oral Care",
      "Bath and Shower",
      "Deodorants and Antiperspirants",
      "Fragrances",
      "Shaving and Hair Removal",
      "Hand and Foot Care",
    ],
    Fashion: [
      "Clothing",
      "Footwear",
      "Accessories",
      "Undergarments",
      "Seasonal Wear",
      "Fashion Jewelry",
    ],
    "Phone Accessories": [
      "Protective Gear",
      "Charging Solutions",
      "Audio Accessories",
      "Mounts and Holders",
      "Connectivity",
      "Storage and Memory",
      "Photography Enhancements",
      "Wearables",
    ],
    Electronics: [
      "Mobile Phones",
      "Computers",
      "Tablets",
      "Televisions",
      "Cameras",
      "Audio Devices",
      "Wearable Technology",
      "Gaming Consoles",
    ],
    Clothing: [
      "Men's Clothing",
      "Women's Clothing",
      "Kid's Clothing",
      "Activewear",
      "Outerwear",
      "Sleepwear",
      "Formalwear",
    ],
    Books: [
      "Fiction",
      "Non-Fiction",
      "Educational",
      "Children's Books",
      "Comics",
      "Biographies",
      "Self-Help",
    ],
    Furniture: [
      "Living Room",
      "Bedroom",
      "Office",
      "Outdoor",
      "Storage",
      "Decor",
      "Lighting",
    ],
    Toys: [
      "Action Figures",
      "Puzzles",
      "Educational Toys",
      "Dolls",
      "Building Sets",
      "Outdoor Toys",
      "Video Games",
    ],
    Groceries: [
      "Fruits and Vegetables",
      "Dairy Products",
      "Beverages",
      "Snacks",
      "Bakery",
      "Frozen Foods",
      "Meat and Seafood",
    ],
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    e.preventDefault();

    const { name, value, type, files } = e.target as HTMLInputElement;

    setProduct((prev) => {
      if (type === "file" && files) {
        const fileArray = Array.from(files);
        const urls = fileArray.map((file) => URL.createObjectURL(file));
        setImagePreviews(urls); // Create and store image URLs
        return {
          ...prev,
          [name]: Array.from(files), // or files if you want to handle multiple files
        };
      } else {
        return {
          ...prev,
          [name]: value,
        };
      }
    });

    // Reset sub-category if category changes
    if (name === "productCategory") {
      setProduct((prev) => ({
        ...prev,
        productSubCategory: "",
      }));
    }

    // console.log(type === "file" && files ? Array.from(files) : "no file");
    // console.log(product);
  };

  return (
    <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/10 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <SellerAside />
        </div>
      </div>

      <div className="flex flex-col py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Products</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit Product</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4 text-ellipsis">
              <h1 className=" shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 text-ellipsis">
                {product.productName}
              </h1>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                <Button size="sm">Save Product</Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>
                      Make changes to your product here. We will have to verify
                      this product again once changes are made.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          // defaultValue="Gamer Gear Pro Controller"
                          value={product.productName}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          // defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                          value={product.productDescription}
                          className="min-h-32"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="description">Specification</Label>
                        <Textarea
                          id="description"
                          // defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                          value={product.productSpecification}
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
                          // defaultValue="Gamer Gear Pro Controller"
                          value={product.productPrice}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="name">Quantity</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          // defaultValue="Gamer Gear Pro Controller"
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
                          value={product.productCategory}
                          onChange={handleChange}
                          className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
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

                {product.productCategory && (
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
                            value={product.productSubCategory}
                            onChange={handleChange}
                            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                          >
                            <option value="" disabled>
                              Select a Sub-Category
                            </option>
                            {subCategories[product.productCategory]?.map(
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
                          <Badge variant="outline" className="text-green-500 w-fit">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-500 w-fit">
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
                    <CardDescription>
                    <p>
                      Please note: You can change your uploaded image once every
                      month. Make sure to upload the correct image.
                    </p>
                  </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <Image
                        alt="Product image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="300"
                        src={product.productImage[0]}
                        width="300"
                        loading="lazy"
                        quality={80}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        {product.productImage.map((img, i) => (
                          <button key={i}>
                            <Image
                              alt="Product image"
                              className="aspect-square w-full rounded-md object-cover"
                              height="84"
                              src={img}
                              width="84"
                              loading="lazy"
                            />
                          </button>
                        ))}
                        <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Upload</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Delete Product</CardTitle>
                    <CardDescription>
                      This may take sometime before changes are reflected
                      accross the site.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div></div>
                    <Button size="sm" variant="secondary">
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm">Save Product</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
