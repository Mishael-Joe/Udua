"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { getCookie } from "cookies-next";
import { createProduct } from "@/lib/actions/product.action";
import { Product } from "@/types";
import { uploadImagesToCloudinary } from "@/lib/utils";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Loader2, Upload } from "lucide-react";
import { possibleSizes, productCategories, subCategories } from "@/constant/constant";

type Products = Omit<Product, "productImage" | "path" | "productPrice"> & {
  productPrice: string;
  productImage: File[];
  path?: string;
  productSubCategory: string;
  storePassword: string
  // userID: string | undefined;
};

type storeID = {
  id: string;
};

function CreateProduct({ id }: storeID) {
  const router = useRouter();
  const pathname = usePathname();
  const [userID, setUserID] = useState<string | undefined>(id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // console.log(`slug ID`, id);

  useEffect(() => {
    if (!userID) {
      const cookieName = getCookie("name")?.toString();
      setUserID(cookieName || "");
    }
  }, [userID]);

  const [product, setProduct] = useState<Products>({
    productName: "",
    productPrice: "",
    productSizes: [],
    productQuantity: "",
    productImage: [],
    productDescription: "",
    productSpecification: "",
    productCategory: "",
    productSubCategory: "",
    storeID: id,
    storePassword: ""
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // This will store the image URLs
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Store Cloudinary URLs

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

  const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setProduct((prev) => {
      const sizes = checked
        ? [...prev.productSizes, value] // Add size if checked
        : prev.productSizes.filter((size) => size !== value); // Remove size if unchecked

      return {
        ...prev,
        productSizes: sizes,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log(product);

    // Allowed file types
    const allowedFileTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    const maxFileSizePerImage = 5242880; // 5MB per image
    const maxTotalFileSize = 15728640; // 15MB total (3 images * 5MB each)

    // Validate product images
    if (product.productImage.length === 0) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `No product images selected.`,
      });
      setIsLoading(false);
      return;
    } else if (product.productImage.length > 3) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Product images should be at most 3.`,
      });
      setIsLoading(false);
      return;
    }

    let totalSize = 0;
    for (let image of product.productImage) {
      if (
        !allowedFileTypes.includes(image.type) ||
        image.size > maxFileSizePerImage
      ) {
        toast({
          variant: "destructive",
          title: `Error`,
          description: `Invalid file type or size. Accepted types are JPEG, PNG, WebP and size up to 5MB.`,
        });
        setIsLoading(false);
        return;
      }
      totalSize += image.size;
    }

    if (totalSize > maxTotalFileSize) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Total size of all images should not exceed 15MB.`,
      });
      setIsLoading(false);
      return;
    }

    // Validate product name
    if (product.productName === "" || product.productName.length < 5) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please name your product (at least 5 characters).`,
      });
      setIsLoading(false);
      return;
    }

    // Validate product price
    if (
      product.productPrice === "" ||
      isNaN(Number(product.productPrice)) ||
      Number(product.productPrice) <= 0
    ) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please enter a valid product price.`,
      });
      setIsLoading(false);
      return;
    }

    // Validate product quantity
    if (
      product.productQuantity === "" ||
      isNaN(Number(product.productQuantity)) ||
      Number(product.productQuantity) <= 0
    ) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please enter a valid product quantity.`,
      });
      setIsLoading(false);
      return;
    }

    // Validate product description
    if (
      product.productDescription === "" ||
      product.productDescription.length < 10
    ) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please provide a product description (at least 10 characters).`,
      });
      setIsLoading(false);
      return;
    }

    // Validate product specification
    if (
      product.productSpecification === "" ||
      product.productSpecification.length < 10
    ) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please provide a product specification (at least 10 characters).`,
      });
      setIsLoading(false);
      return;
    }

    // Validate product category
    if (product.productCategory === "") {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please select a product category.`,
      });
      setIsLoading(false);
      return;
    }
    
    // Validate store password
    if (product.storePassword === "") {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please input store password.`,
      });
      setIsLoading(false);
      return;
    }

    // If all validations pass, proceed with form submission
    try {
      // Upload images to Cloudinary
      const urls = await uploadImagesToCloudinary(product.productImage);
      setImageUrls(urls);

      // Add logic to handle form submission, e.g., send product data along with URLs to the server
      // console.log("Product submitted with URLs:", {
      //   ...product,
      //   productImage: urls,
      // });

      await createProduct({
        productName: product.productName,
        productPrice: product.productPrice,
        productSizes: product.productSizes,
        productQuantity: product.productQuantity,
        productImage: urls,
        productDescription: product.productDescription,
        productSpecification: product.productSpecification,
        productCategory: product.productCategory,
        productSubCategory: product.productSubCategory,
        path: pathname,
        storeID: product.storeID,
        storePassword: product.storePassword
      });

      router.push("/");
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
    <section>
      <div className=" max-w-5xl mx-auto">
        {/* sm:grid grid-cols-1 flex flex-col gap-6 mt-8 md:grid-cols-2 */}
        <form
          className=" ... mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center gap-4 text-ellipsis">
            <h1 className=" shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 text-ellipsis">
              Add Product
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button type="submit" onSubmit={handleSubmit}>
                <span>
                  {isLoading && (
                    <p className="flex flex-row items-center justify-between w-full">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </p>
                  )}
                  {!isLoading && (
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
                      <Label className="text-base-semibold text-light-2">
                        Product Name
                      </Label>

                      <Input
                        name="productName"
                        value={product.productName}
                        onChange={(e) => handleChange(e)}
                        className="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-white placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                        type="text"
                        placeholder="Product Name"
                        aria-label="Product Name"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label className="text-base-semibold text-light-2">
                        Product Description
                      </Label>

                      <Textarea
                        rows={5}
                        name="productDescription"
                        value={product.productDescription}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label className="text-base-semibold text-light-2">
                        Product Specification
                      </Label>

                      <Textarea
                        rows={5}
                        name="productSpecification"
                        value={product.productSpecification}
                        onChange={(e) => handleChange(e)}
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
                      <Label className="text-base-semibold text-light-2">
                        Product Price
                      </Label>

                      <Input
                        name="productPrice"
                        value={product.productPrice}
                        onChange={(e) => handleChange(e)}
                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 dark:text-white bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                        type="text"
                        placeholder="Product Price"
                        aria-label="Product Price"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label className="text-base-semibold text-light-2">
                        product Quantity
                      </Label>

                      <Input
                        name="productQuantity"
                        value={product.productQuantity}
                        onChange={(e) => handleChange(e)}
                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 dark:text-white bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                        type="text"
                        placeholder="Product Quantity"
                        aria-label="Product Quantity"
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
                  <CardTitle>Product Sizes</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* <Label className="text-base-semibold text-light-2">
                    Product Sizes
                  </Label> */}
                  <div className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                    {possibleSizes.map((size) => (
                      <label key={size} className="block">
                        <input
                          type="checkbox"
                          value={size}
                          checked={product.productSizes.includes(size)}
                          onChange={handleSizeChange}
                          className="mr-2 text-slate-100"
                        />
                        {size}
                      </label>
                    ))}
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
                  <div className="grid gap-2 pb-6">
                    <button
                      type="button"
                      className="flex aspect-square relative w-full items-center justify-center rounded-md"
                    >
                      <Upload className="h-10 z-10 w-10 text-muted-foreground" />
                      <span className="sr-only">Upload</span>
                      <Input
                        name="productImage"
                        onChange={(e) => handleChange(e)}
                        className="block absolute h-full w-full border-dashed px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                        type="file"
                        multiple
                        accept="image/*"
                        placeholder="Product Image"
                        aria-label="Product Image"
                      />
                    </button>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {/* Display selected images */}
                      {imagePreviews && (
                        <>
                          {imagePreviews.map((src, index) => (
                            <button key={index}>
                              <Image
                                className="aspect-square w-full rounded-md object-cover"
                                height="200"
                                src={src}
                                alt={`Selected Preview ${index + 1}`}
                                width="200"
                                loading="lazy"
                              />
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 border-t-2 pt-3">
                      <Label className="text-base-semibold text-light-2">
                        Store Password
                      </Label>

                      <Input
                        name="storePassword"
                        value={product.storePassword}
                        onChange={(e) => handleChange(e)}
                        className="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-white placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                        type="text"
                        placeholder="Your Store Password"
                        aria-label="Your Store Password"
                      />
                    </div>
                </CardContent>
              </Card>
              <div className="flex items-center justify-center gap-2 md:hidden w-full">
                <Button
                  type="submit"
                  className=" w-full"
                  onSubmit={handleSubmit}
                >
                  <span>
                    {isLoading && (
                      <p className="flex flex-row items-center justify-between w-full">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Loading...</span>
                      </p>
                    )}
                    {!isLoading && (
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

        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      </div>
    </section>
  );
}

export default CreateProduct;
