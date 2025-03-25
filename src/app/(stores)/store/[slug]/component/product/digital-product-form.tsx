"use client";

import type React from "react";

import { type ChangeEvent, useEffect, useState } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDigitalProduct } from "@/lib/actions/product.action";
import type { DigitalProduct } from "@/types";
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
import { ChevronRight, Loader2, Upload } from "lucide-react";
import {
  bookCategories,
  quillFormats,
  quillModules,
} from "@/constant/constant";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

type DigitalProducts = Omit<
  DigitalProduct,
  "coverIMG" | "price" | "coverImageKey" | "coverIMG"
> & {
  price: string;
  storePassword: string;
  pdfFile: File[];
  coverIMG: File[];
};

type DigitalProductFormProps = {
  storeId: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  router: AppRouterInstance;
  toast: any;
};

const DigitalProductForm = ({
  storeId,
  isLoading,
  setIsLoading,
  router,
  toast,
}: DigitalProductFormProps) => {
  const [digitalProduct, setDigitalProduct] = useState<DigitalProducts>({
    storeID: storeId,
    title: "",
    author: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    fileType: "",
    fileSize: 0,
    s3Key: "",
    isbn: "",
    publisher: "",
    language: "",
    pdfFile: [],
    coverIMG: [],
    storePassword: "",
    productType: "digitalproducts",
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

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

  const handleDigitalProductChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    e.preventDefault();

    const { name, value, type, files } = e.target as HTMLInputElement;

    if (type === "file" && files) {
      const fileArray = Array.from(files);
      const urls = fileArray.map((file) => URL.createObjectURL(file));

      // Check which file input is being updated (pdfFile or coverIMG)
      if (name === "pdfFile") {
        // Get fileType and fileSize
        const pdfFile = fileArray[0]; // assuming single file upload for PDF
        const fileType = pdfFile.type;
        const fileSize = (pdfFile.size / 1024 / 1024).toFixed(2); // File size in MB
        // Handle PDF file
        setDigitalProduct((prev) => ({
          ...prev,
          [name]: fileArray, // Store the selected PDF file(s)
          fileType: fileType,
          fileSize: Number(fileSize),
        }));
      } else if (name === "coverIMG") {
        // Handle Cover Image
        setImagePreviews(urls); // Preview images for coverIMG only
        setDigitalProduct((prev) => ({
          ...prev,
          [name]: fileArray, // Store the selected image(s)
        }));
      } else if (name === "category") {
        setDigitalProduct((prev) => ({
          ...prev,
          [name]: value.replace(/ /g, "_"), // Replace spaces with underscores
        }));
      }
    } else {
      // Handle other non-file inputs (e.g., text, select, textarea)
      setDigitalProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Reset sub-category if category changes
    if (name === "category") {
      setDigitalProduct((prev) => ({
        ...prev,
        subcategory: "",
      }));
    }
  };

  const handleDescriptionChange = (newContent: string) => {
    setDigitalProduct((prev) => ({
      ...prev,
      description: newContent,
    }));
  };

  const validateForm = (): boolean => {
    // Validate E-book Title
    if (digitalProduct.title === "" || digitalProduct.title.length < 5) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `E-book Title is required (at least 5 characters).`,
      });
      return false;
    }

    // Validate E-book Author
    if (digitalProduct.author === "" || digitalProduct.author.length < 5) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Author's name is required (at least 5 characters).`,
      });
      return false;
    }

    // Validate E-book description
    if (
      digitalProduct.description === "" ||
      digitalProduct.description.length < 60
    ) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please provide a brief summary of this E-book (at least 60 characters).`,
      });
      return false;
    }

    // Validate product category
    if (digitalProduct.category === "") {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please select a category.`,
      });
      return false;
    }

    // Validate product sub-category
    if (digitalProduct.subcategory === "") {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please select sub-category.`,
      });
      return false;
    }

    // Validate product price
    if (
      digitalProduct.price === "" ||
      isNaN(Number(digitalProduct.price)) ||
      Number(digitalProduct.price) <= 0
    ) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please enter a valid price.`,
      });
      return false;
    }

    // Validate E-book language
    if (digitalProduct.language === "" || digitalProduct.language.length < 2) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Language is required.`,
      });
      return false;
    }

    // Validate PDF file
    if (digitalProduct.pdfFile.length === 0) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `No PDF file selected.`,
      });
      return false;
    }

    // Validate product images
    if (digitalProduct.coverIMG.length === 0) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `No cover image selected.`,
      });
      return false;
    } else if (digitalProduct.coverIMG.length > 3) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Images should be at most 3.`,
      });
      return false;
    }

    // Check file types and sizes
    const maxTotalFileSize = 15728640; // 15MB total
    let totalSize = 0;
    for (const image of digitalProduct.coverIMG) {
      if (
        !allowedFileTypes.includes(image.type) ||
        image.size > maxFileSizePerImage
      ) {
        toast({
          variant: "destructive",
          title: `Error`,
          description: `Invalid file type or size. Accepted types are JPEG, PNG, WebP and size up to 5MB.`,
        });
        return false;
      }
      totalSize += image.size;
    }

    if (totalSize > maxTotalFileSize) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Total size of all images should not exceed 15MB.`,
      });
      return false;
    }

    // Validate store password
    if (digitalProduct.storePassword === "") {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please input store password.`,
      });
      return false;
    }

    return true;
  };

  // Function to handle file upload to S3
  async function uploadToS3(e: File[]): Promise<string | null> {
    // Validate file and file type
    if (!e[0] || !(e[0] instanceof File)) {
      console.error("No valid file selected.");
      return null;
    }

    const fileType = encodeURIComponent(e[0].type); // Encodes the file type

    try {
      // Request a signed URL from the backend
      const data = await axios.get(`/api/store/ebooks/media`, {
        params: { fileType },
      });

      const res = data.data.data;
      const { uploadUrl, key } = res;

      if (!uploadUrl || typeof uploadUrl !== "string") {
        console.error("Invalid upload URL:", uploadUrl);
        return null;
      }

      // Upload the file to S3 using the signed URL
      await axios.put(uploadUrl, e[0], {
        headers: {
          "Content-Type": e[0].type, // Ensure the file type is set correctly
        },
      });

      return key;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  }

  const handleDigitalProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Upload PDF to s3 bucket and get the unique key
      const key = await uploadToS3(digitalProduct.pdfFile);
      if (!key) {
        toast({
          variant: "destructive",
          title: `Error`,
          description: `Failed to upload PDF file. Please try again.`,
        });
        setIsLoading(false);
        return;
      }

      // Upload images to Cloudinary
      const urls = await uploadImagesToCloudinary(digitalProduct.coverIMG);
      setImageUrls(urls);

      // Create digital product
      await createDigitalProduct({
        title: digitalProduct.title,
        author: digitalProduct.author,
        description: digitalProduct.description,
        category: digitalProduct.category,
        subcategory: digitalProduct.subcategory,
        price: digitalProduct.price,
        fileType: digitalProduct.fileType,
        fileSize: digitalProduct.fileSize,
        s3Key: key,
        language: digitalProduct.language,
        coverIMG: urls,
        isbn: digitalProduct.isbn,
        publisher: digitalProduct.publisher,
        storeID: digitalProduct.storeID,
        productType: digitalProduct.productType,
        storePassword: digitalProduct.storePassword,
      });

      toast({
        title: "Digital Product Created",
        description: "Your e-book has been successfully uploaded.",
        action: (
          <ToastAction altText="View Products">View Products</ToastAction>
        ),
      });

      router.back();
    } catch (error) {
      console.error("Error submitting product:", error);
      toast({
        variant: "destructive",
        title: `Error`,
        description: `An error occurred while submitting the product. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 pt-3"
      onSubmit={handleDigitalProductSubmit}
      aria-label="Create Digital Product Form"
    >
      <div className="flex items-center gap-4 text-ellipsis">
        <h1 className="shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 text-ellipsis">
          Add Digital Product
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button
            type="submit"
            className="hover:bg-udua-orange-primary bg-udua-orange-primary/80"
            aria-label="Upload Digital Product"
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
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>
                Vividly describe your product. We will have to verify this
                product once it's been uploaded.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label
                    htmlFor="ebook-title"
                    className="text-base-semibold text-light-2"
                  >
                    Title
                  </Label>
                  <Input
                    id="ebook-title"
                    name="title"
                    value={digitalProduct.title}
                    onChange={handleDigitalProductChange}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-white placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                    type="text"
                    placeholder="Book Title"
                    aria-label="Title of the Book"
                    aria-required="true"
                  />
                </div>

                <div className="grid gap-3 w-full">
                  <Label
                    htmlFor="ebook-author"
                    className="text-base-semibold text-light-2"
                  >
                    Author
                  </Label>
                  <Input
                    id="ebook-author"
                    name="author"
                    value={digitalProduct.author}
                    onChange={handleDigitalProductChange}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-white placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                    type="text"
                    placeholder="Book Author"
                    aria-label="Author of the Book"
                    aria-required="true"
                  />
                </div>

                <div className="grid gap-3">
                  <Label
                    htmlFor="ebook-description"
                    className="text-base-semibold text-light-2"
                  >
                    Book Description
                  </Label>
                  <QuillEditor
                    id="ebook-description"
                    value={digitalProduct.description}
                    onChange={handleDescriptionChange}
                    modules={quillModules}
                    formats={quillFormats}
                    className="h-fit bg-inherit overflow-x-auto"
                    aria-label="Book Description"
                    aria-required="true"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price and Publisher */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label
                    htmlFor="ebook-price"
                    className="text-base-semibold text-light-2"
                  >
                    Price
                  </Label>
                  <Input
                    id="ebook-price"
                    name="price"
                    value={digitalProduct.price}
                    onChange={handleDigitalProductChange}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 dark:text-white bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                    type="text"
                    placeholder="Price"
                    aria-label="Price"
                    aria-required="true"
                  />
                </div>

                <div className="grid gap-3">
                  <Label
                    htmlFor="ebook-publisher"
                    className="text-base-semibold text-light-2"
                  >
                    Publisher
                  </Label>
                  <Input
                    id="ebook-publisher"
                    name="publisher"
                    value={digitalProduct.publisher}
                    onChange={handleDigitalProductChange}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 dark:text-white bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                    type="text"
                    placeholder="Publisher"
                    aria-label="Publisher"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Selection */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="ebook-category">Select Category</Label>
                    <select
                      id="ebook-category"
                      aria-label="Select category"
                      name="category"
                      value={digitalProduct.category}
                      onChange={handleDigitalProductChange}
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400"
                      aria-required="true"
                    >
                      <option value="" disabled>
                        Select a Category
                      </option>
                      {bookCategories.map((categoryArr) => (
                        <option
                          key={categoryArr.category}
                          value={categoryArr.category.replace(/ /g, "_")}
                        >
                          {categoryArr.category.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subcategory Selection */}
            {digitalProduct.category && (
              <Card>
                <CardHeader>
                  <CardTitle>Sub-Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="ebook-subcategory">
                        Select Sub-Category
                      </Label>
                      <select
                        id="ebook-subcategory"
                        aria-label="Select sub-category"
                        name="subcategory"
                        value={digitalProduct.subcategory}
                        onChange={handleDigitalProductChange}
                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400"
                        aria-required="true"
                      >
                        <option value="" disabled>
                          Select a Sub-Category
                        </option>
                        {bookCategories
                          .find(
                            (categoryArr) =>
                              categoryArr.category.replace(/ /g, "_") ===
                              digitalProduct.category
                          )
                          ?.subCategories.map((subCategory) => (
                            <option key={subCategory} value={subCategory}>
                              {subCategory}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          {/* Language and ISBN */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-3">
                <Label
                  htmlFor="ebook-language"
                  className="text-base-semibold text-light-2"
                >
                  Language
                </Label>
                <Input
                  id="ebook-language"
                  name="language"
                  value={digitalProduct.language}
                  onChange={handleDigitalProductChange}
                  className="block w-full px-4 py-2 text-gray-700 placeholder-gray-500 dark:text-white bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                  type="text"
                  placeholder="Written in what Language"
                  aria-label="what Language"
                  aria-required="true"
                />
              </div>
              <div className="grid gap-3 pt-4">
                <Label
                  htmlFor="ebook-isbn"
                  className="text-base-semibold text-light-2"
                >
                  ISBN
                </Label>
                <Input
                  id="ebook-isbn"
                  name="isbn"
                  value={digitalProduct.isbn}
                  onChange={handleDigitalProductChange}
                  className="block w-full px-4 py-2 text-gray-700 placeholder-gray-500 dark:text-white bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                  type="text"
                  placeholder="ISBN"
                  aria-label="ISBN"
                />
              </div>
            </CardContent>
          </Card>

          {/* PDF File Upload */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Select PDF File</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 pb-6">
                <button
                  type="button"
                  className="flex py-8 relative w-full items-center justify-center rounded-md"
                  aria-label="Upload PDF file"
                >
                  <Upload className="h-10 z-10 w-10 text-muted-foreground" />
                  <span className="sr-only">Upload PDF</span>
                  <Input
                    id="pdf-file"
                    name="pdfFile"
                    onChange={handleDigitalProductChange}
                    className="block absolute h-32 w-full border-dashed px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                    type="file"
                    accept="application/pdf"
                    placeholder="Select PDF File"
                    aria-label="Select PDF File"
                    aria-required="true"
                  />
                </button>
                {digitalProduct.pdfFile.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {digitalProduct.pdfFile[0].name} (
                    {digitalProduct.fileSize.toFixed(2)} MB)
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cover Image Upload */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
              <CardDescription>
                <p>
                  Please note: You can change your uploaded image once every
                  month. Make sure to upload the correct image.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 pb-6">
                <button
                  type="button"
                  className="flex aspect-square relative w-full items-center justify-center rounded-md"
                  aria-label="Upload cover image"
                >
                  <Upload className="h-10 z-10 w-10 text-muted-foreground" />
                  <span className="sr-only">Upload</span>
                  <Input
                    id="cover-image"
                    name="coverIMG"
                    onChange={handleDigitalProductChange}
                    className="block absolute h-full w-full border-dashed px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                    type="file"
                    accept="image/*"
                    placeholder="Cover Image"
                    aria-label="Book cover Image"
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
                            className="aspect-square w-full rounded-md object-cover"
                            height="200"
                            src={src || "/placeholder.svg"}
                            alt={`Cover image preview ${index + 1}`}
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
                  htmlFor="digital-store-password"
                  className="text-base-semibold text-light-2"
                >
                  Store Password
                </Label>
                <Input
                  id="digital-store-password"
                  name="storePassword"
                  value={digitalProduct.storePassword}
                  onChange={handleDigitalProductChange}
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
              aria-label="Upload Digital Product (Mobile)"
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

export default DigitalProductForm;
