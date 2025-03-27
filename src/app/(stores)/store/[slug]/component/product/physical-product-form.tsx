"use client";

import type React from "react";

import { type ChangeEvent, useEffect, useState } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProduct } from "@/lib/actions/product.action";
import type { Product } from "@/types";
import { uploadImagesToCloudinary } from "@/lib/utils";
import Image from "next/image";
import { ToastAction } from "@/components/ui/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Loader2, Upload, XIcon } from "lucide-react";
import {
  productCategories,
  quillFormats,
  quillModules,
  subCategories,
} from "@/constant/constant";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

type Products = Omit<Product, "images" | "path" | "price"> & {
  price: string;
  images: File[];
  path?: string;
  storePassword: string;
};

type PhysicalProductFormProps = {
  storeId: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  router: AppRouterInstance;
  toast: any;
};

const PhysicalProductForm = ({
  storeId,
  isLoading,
  setIsLoading,
  router,
  toast,
}: PhysicalProductFormProps) => {
  const [physicalProduct, setPhysicalProduct] = useState<Products>({
    name: "",
    price: "",
    sizes: [],
    productQuantity: "",
    images: [],
    description: "",
    specifications: "",
    category: "",
    subCategory: "",
    storeID: storeId,
    storePassword: "",
    productType: "physicalproducts",
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Define valid size options based on category or subcategory
  const sizeOptions =
    physicalProduct.subCategory === "Footwear"
      ? [
          "39",
          "39.5",
          "40",
          "40.5",
          "41",
          "41.5",
          "42",
          "42.5",
          "43",
          "43.5",
          "44",
          "44.5",
          "45",
          "45.5",
          "46",
          "46.5",
          "47",
          "47.5",
          "48",
        ]
      : ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  // Allowed file types
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  const maxFileSizePerImage = 5242880; // 5MB per image

  useEffect(() => {
    return () => {
      // Cleanup object URLs when the component unmounts
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    e.preventDefault();

    const { name, value, type, files } = e.target as HTMLInputElement;

    setPhysicalProduct((prev) => {
      if (type === "file" && files) {
        const fileArray = Array.from(files);
        const urls = fileArray.map((file) => URL.createObjectURL(file));
        setImagePreviews(urls); // Create and store image URLs
        return {
          ...prev,
          [name]: Array.from(files),
        };
      } else if (name === "category") {
        return {
          ...prev,
          [name]: value.replace(/ /g, "_"), // Replace spaces with underscores
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
      setPhysicalProduct((prev) => ({
        ...prev,
        productSubCategory: "",
      }));
    }
  };

  // Handle size and size-specific price input
  const handleSizePriceChange = (
    index: number,
    field: "size" | "price" | "quantity",
    value: string
  ) => {
    setPhysicalProduct((prev) => {
      const updatedSizes = [...prev.sizes!];
      updatedSizes[index] = {
        ...updatedSizes[index],
        [field]:
          field === "price" || field === "quantity" ? Number(value) : value,
      };

      return {
        ...prev,
        sizes: updatedSizes,
      };
    });
  };

  // Add a new size input row
  const addSize = () => {
    setPhysicalProduct((prev) => ({
      ...prev,
      price: "",
      productQuantity: "",
      sizes: [...(prev.sizes || []), { size: "", price: 0, quantity: 0 }],
    }));
  };

  // Remove a size input row
  const removeSize = (index: number) => {
    setPhysicalProduct((prev) => ({
      ...prev,
      sizes: prev.sizes!.filter((_, i) => i !== index),
    }));
  };

  const handleProductDescriptionChange = (newContent: string) => {
    setPhysicalProduct((prev) => ({
      ...prev,
      description: newContent,
    }));
  };

  const handleProductSpecificationChange = (newContent: string) => {
    setPhysicalProduct((prev) => ({
      ...prev,
      specifications: newContent,
    }));
  };

  const validateForm = (): boolean => {
    // Validate product images
    if (physicalProduct.images.length === 0) {
      toast({
        title: `Submission Error`,
        description: `You must select at least one product image.`,
      });
      return false;
    } else if (physicalProduct.images.length > 3) {
      toast({
        title: `Submission Error`,
        description: `You can only upload up to three product images.`,
      });
      return false;
    }

    // Check file types and sizes
    const maxTotalFileSize = 15728640; // 15MB total
    let totalSize = 0;
    for (const image of physicalProduct.images) {
      if (
        !allowedFileTypes.includes(image.type) ||
        image.size > maxFileSizePerImage
      ) {
        toast({
          title: `Submission Error`,
          description: `One or more images have an invalid file type or exceed the allowed size. Accepted formats are JPEG, PNG, and WebP with a maximum size of 5MB per image.`,
        });
        return false;
      }
      totalSize += image.size;
    }

    if (totalSize > maxTotalFileSize) {
      toast({
        title: `Submission Error`,
        description: `The total file size of all images should not exceed 15MB.`,
      });
      return false;
    }

    // Validate product name
    if (physicalProduct.name === "" || physicalProduct.name.length < 5) {
      toast({
        title: `Submission Error`,
        description: `Please provide a valid product name with at least 5 characters.`,
      });
      return false;
    }

    // Validate product price
    if (
      (physicalProduct.category !== "Fashion" &&
        physicalProduct.category !== "Clothing" &&
        (physicalProduct.price === "" ||
          isNaN(Number(physicalProduct.price)) ||
          Number(physicalProduct.price) <= 0)) ||
      ((physicalProduct.category === "Fashion" ||
        physicalProduct.category === "Clothing") &&
        (!physicalProduct.sizes || physicalProduct.sizes.length === 0))
    ) {
      toast({
        title: `Submission Error`,
        description: `Please provide a valid product price or specify product sizes with valid prices.`,
      });
      return false;
    }

    // Validate size-based prices, quantities, and selected size for Fashion and Clothing
    if (
      (physicalProduct.category === "Fashion" ||
        physicalProduct.category === "Clothing") &&
      physicalProduct.sizes
    ) {
      for (const sizeObj of physicalProduct.sizes) {
        // Validate the size selection
        if (!sizeObj.size || !sizeOptions.includes(sizeObj.size)) {
          toast({
            title: `Submission Error`,
            description: `Please select a valid size for each product variant.`,
          });
          return false;
        }

        // Validate the price for each size
        if (sizeObj.price <= 0) {
          toast({
            title: `Submission Error`,
            description: `Each product size must have a valid price greater than 0.`,
          });
          return false;
        }

        // Validate the quantity for each size
        if (sizeObj.quantity <= 0) {
          toast({
            title: `Submission Error`,
            description: `Each product size must have a valid quantity greater than 0.`,
          });
          return false;
        }
      }
    }

    // Validate product quantity
    if (
      (physicalProduct.category !== "Fashion" &&
        physicalProduct.category !== "Clothing" &&
        (physicalProduct.productQuantity === "" ||
          isNaN(Number(physicalProduct.productQuantity)) ||
          Number(physicalProduct.productQuantity) <= 0)) ||
      ((physicalProduct.category === "Fashion" ||
        physicalProduct.category === "Clothing") &&
        (!physicalProduct.sizes || physicalProduct.sizes.length === 0))
    ) {
      toast({
        title: `Submission Error`,
        description: `Please provide a valid product quantity or specify product sizes with valid quantities.`,
      });
      return false;
    }

    // Validate product description
    if (
      physicalProduct.description === "" ||
      physicalProduct.description.length < 10
    ) {
      toast({
        title: `Submission Error`,
        description: `Please provide a detailed product description with at least 10 characters.`,
      });
      return false;
    }

    // Validate product specification
    if (
      physicalProduct.specifications === "" ||
      physicalProduct.specifications.length < 10
    ) {
      toast({
        title: `Submission Error`,
        description: `Please provide a product specification with at least 10 characters.`,
      });
      return false;
    }

    // Validate product category
    if (physicalProduct.category === "") {
      toast({
        title: `Submission Error`,
        description: `Please select a product category.`,
      });
      return false;
    }

    // Validate store password
    if (physicalProduct.storePassword === "") {
      toast({
        title: `Submission Error`,
        description: `Please enter the store password.`,
      });
      return false;
    }

    return true;
  };

  const handlePhysicalProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Upload images to Cloudinary
      const urls = await uploadImagesToCloudinary(physicalProduct.images);
      setImageUrls(urls);

      // Submit product
      await createProduct({
        productType: physicalProduct.productType,
        name: physicalProduct.name,
        price: physicalProduct.price,
        sizes: physicalProduct.sizes,
        productQuantity: physicalProduct.productQuantity,
        images: urls,
        description: physicalProduct.description,
        specifications: physicalProduct.specifications,
        category: physicalProduct.category,
        subCategory: physicalProduct.subCategory,
        path: window.location.pathname,
        storeID: physicalProduct.storeID,
        storePassword: physicalProduct.storePassword,
      });

      toast({
        title: "Product Created",
        description: "Your physical product has been successfully created.",
        action: (
          <ToastAction altText="View Products">View Products</ToastAction>
        ),
      });

      router.back();
    } catch (error) {
      console.error("Error submitting product:", error);
      toast({
        title: `Submission Error`,
        description: `An unexpected error occurred while submitting the product. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 pt-3"
      onSubmit={handlePhysicalProductSubmit}
      aria-label="Create Physical Product Form"
    >
      <div className="flex items-center gap-4 text-ellipsis">
        <h1 className="shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 text-ellipsis">
          Add Physical Product
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button
            type="submit"
            className="hover:bg-udua-orange-primary bg-udua-orange-primary/80"
            aria-label="Upload Product"
          >
            <span>
              {isLoading ? (
                <p className="flex flex-row items-center justify-between w-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </p>
              ) : (
                <p className="flex flex-row items-center justify-between w-full">
                  <span>Upload</span>
                  <ChevronRight className="mr-2 h-4 w-4" />
                </p>
              )}
            </span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          {/* Product Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                Vividly describe your product. We will have to verify this
                product once it's been uploaded.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label
                    htmlFor="product-name"
                    className="text-base-semibold text-light-2"
                  >
                    Product Name
                  </Label>
                  <Input
                    id="product-name"
                    name="name"
                    value={physicalProduct.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-white placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                    type="text"
                    placeholder="Product Name"
                    aria-label="Product Name"
                    aria-required="true"
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-2 items-start">
                  <div className="grid gap-3">
                    <Label
                      htmlFor="product-description"
                      className="text-base-semibold text-light-2"
                    >
                      Product Description
                    </Label>
                    <QuillEditor
                      id="product-description"
                      value={physicalProduct.description}
                      onChange={handleProductDescriptionChange}
                      modules={quillModules}
                      formats={quillFormats}
                      className="h-fit bg-inherit overflow-x-auto"
                      aria-label="Product Description"
                      aria-required="true"
                    />
                  </div>

                  <div className="grid gap-3 w-full">
                    <Label
                      htmlFor="product-specifications"
                      className="text-base-semibold text-light-2"
                    >
                      Product Specification
                    </Label>
                    <QuillEditor
                      id="product-specifications"
                      value={physicalProduct.specifications}
                      onChange={handleProductSpecificationChange}
                      modules={quillModules}
                      formats={quillFormats}
                      className="h-fit bg-inherit overflow-x-auto"
                      aria-label="Product Specifications"
                      aria-required="true"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock Card */}
          <Card>
            <CardHeader>
              <CardTitle>Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label
                    htmlFor="product-price"
                    className="text-base-semibold text-light-2"
                  >
                    Product Price
                  </Label>
                  <Input
                    id="product-price"
                    name="price"
                    value={physicalProduct.price}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 dark:text-white bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                    type="text"
                    placeholder="Product Price"
                    aria-label="Product Price"
                    aria-required="true"
                    disabled={physicalProduct.sizes!.length > 0}
                  />
                </div>
                <div className="grid gap-3">
                  <Label
                    htmlFor="product-quantity"
                    className="text-base-semibold text-light-2"
                  >
                    Product Quantity
                  </Label>
                  <Input
                    id="product-quantity"
                    name="productQuantity"
                    value={physicalProduct.productQuantity}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 dark:text-white bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                    type="text"
                    placeholder="Product Quantity"
                    aria-label="Product Quantity"
                    aria-required="true"
                    disabled={physicalProduct.sizes!.length > 0}
                  />
                </div>
                {(physicalProduct.category === "Clothing" ||
                  physicalProduct.category === "Fashion") && (
                  <p className="text-xs text-udua-orange-primary">
                    Products under 'Fashion', 'Clothing', and 'Footwear' have
                    size-based Prices & Quantity.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category Selection */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="product-category">Select Category</Label>
                    <select
                      id="product-category"
                      aria-label="Select category"
                      name="category"
                      value={physicalProduct.category.replace(/_/g, " ")}
                      onChange={handleChange}
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400"
                      aria-required="true"
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

            {physicalProduct.category && (
              <Card>
                <CardHeader>
                  <CardTitle>Product Sub-Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="product-subcategory">
                        Select Sub-Category
                      </Label>
                      <select
                        id="product-subcategory"
                        aria-label="Select sub-category"
                        name="subCategory"
                        value={physicalProduct.subCategory}
                        onChange={handleChange}
                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400"
                      >
                        <option value="" disabled>
                          Select a Sub-Category
                        </option>
                        {subCategories[physicalProduct.category]?.map(
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
          {/* Size Options for Fashion/Clothing */}
          {(physicalProduct.category === "Clothing" ||
            physicalProduct.category === "Fashion") && (
            <Card>
              <CardHeader>
                <CardTitle>Product Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  {physicalProduct.sizes?.map((sizeObj, index) => {
                    // Get already selected sizes to disable them
                    const selectedSizes = physicalProduct.sizes!.map(
                      (size) => size.size
                    );

                    return (
                      <div key={index} className="flex gap-2 items-center mt-2">
                        <div className="w-full">
                          <Label
                            htmlFor={`size-${index}`}
                            className="pl-2 pb-0.5"
                          >
                            Size
                          </Label>
                          <select
                            id={`size-${index}`}
                            value={sizeObj.size}
                            onChange={(e) =>
                              handleSizePriceChange(
                                index,
                                "size",
                                e.target.value
                              )
                            }
                            className="w-full border p-2 rounded"
                            aria-label={`Size option ${index + 1}`}
                          >
                            <option value="" disabled>
                              Select Size
                            </option>
                            {sizeOptions.map((sizeOption) => (
                              <option
                                key={sizeOption}
                                value={sizeOption}
                                disabled={
                                  sizeObj.size !== sizeOption &&
                                  selectedSizes.includes(sizeOption)
                                }
                              >
                                {sizeOption}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="w-full">
                          <Label
                            htmlFor={`price-${index}`}
                            className="pl-2 pb-0.5"
                          >
                            Price
                          </Label>
                          <Input
                            id={`price-${index}`}
                            value={sizeObj.price}
                            type="number"
                            min={0}
                            onChange={(e) =>
                              handleSizePriceChange(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                            placeholder="Price"
                            className="w-full"
                            aria-label={`Price for size ${
                              sizeObj.size || index + 1
                            }`}
                          />
                        </div>

                        <div className="w-full">
                          <Label
                            htmlFor={`quantity-${index}`}
                            className="pl-2 pb-0.5"
                          >
                            Quantity
                          </Label>
                          <Input
                            id={`quantity-${index}`}
                            value={sizeObj.quantity}
                            type="number"
                            min={0}
                            onChange={(e) =>
                              handleSizePriceChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            placeholder="Quantity"
                            className="w-full"
                            aria-label={`Quantity for size ${
                              sizeObj.size || index + 1
                            }`}
                          />
                        </div>

                        <Button
                          type="button"
                          onClick={() => removeSize(index)}
                          className="bg-transparent hover:bg-transparent hover:text-udua-orange-primary text-udua-orange-primary/80"
                          aria-label={`Remove size ${
                            sizeObj.size || index + 1
                          }`}
                        >
                          <XIcon width={15} height={15} />
                        </Button>
                      </div>
                    );
                  })}

                  <Button
                    type="button"
                    onClick={addSize}
                    className="mt-3 hover:bg-udua-orange-primary bg-udua-orange-primary/80"
                    aria-label="Add another size option"
                  >
                    Add Size
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product Images */}
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
              <div className="grid gap-2 pb-6 sm:grid-cols-2">
                <button
                  type="button"
                  className="flex aspect-square relative w-full items-center justify-center rounded-md"
                  aria-label="Upload product images"
                >
                  <Upload className="h-10 z-10 w-10 text-muted-foreground" />
                  <span className="sr-only">Upload</span>
                  <Input
                    id="product-images"
                    name="images"
                    onChange={handleChange}
                    className="block absolute h-full w-full border-dashed px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                    type="file"
                    multiple
                    accept="image/*"
                    placeholder="Product Image"
                    aria-label="Product Images (up to 3)"
                    aria-required="true"
                  />
                </button>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  {/* Display selected images */}
                  {imagePreviews && (
                    <>
                      {imagePreviews.map((src, index) => (
                        <div key={index} className="relative">
                          <Image
                            className="aspect-square rounded-md object-cover"
                            height="200"
                            src={src || "/placeholder.svg"}
                            alt={`Product preview ${index + 1}`}
                            width="200"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
              <div className="grid gap-3 border-t-2 pt-3">
                <Label
                  htmlFor="store-password"
                  className="text-base-semibold text-light-2"
                >
                  Store Password
                </Label>
                <Input
                  id="store-password"
                  name="storePassword"
                  value={physicalProduct.storePassword}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-white placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                  type="password"
                  placeholder="Your Store Password"
                  aria-label="Your Store Password"
                  aria-required="true"
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-center gap-2 md:hidden w-full">
            <Button
              type="submit"
              className="w-full hover:bg-udua-orange-primary bg-udua-orange-primary/80"
              aria-label="Upload Product (Mobile)"
            >
              <span>
                {isLoading ? (
                  <p className="flex flex-row items-center justify-between w-full">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </p>
                ) : (
                  <p className="flex flex-row items-center justify-between w-full">
                    <span>Upload</span>
                    <ChevronRight className="mr-2 h-4 w-4" />
                  </p>
                )}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PhysicalProductForm;
