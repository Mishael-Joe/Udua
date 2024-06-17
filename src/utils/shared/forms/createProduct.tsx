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

type Products = Omit<Product, "productImage" | "path" | "productPrice"> & {
  productPrice: string;
  productImage: File[];
  path?: string;
  // userID: string | undefined;
};

type userID = {
  id?: string;
};

function CreateProduct({ id }: userID) {
  const router = useRouter();
  const pathname = usePathname();
  const [userID, setUserID] = useState<string | undefined>(id);

  // console.log(`userID`, userID);

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
    accountId: userID === undefined ? "" : userID,
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

  useEffect(() => {
    return () => {
      // Cleanup object URLs when the component unmounts
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    if (product.productImage.length === 0) {
      return;
    } else {
      product.productImage.map((image) => {
        if (image.type !== "image/png" || image.size > 10485760) {
          return;
        }
      });
    }

    // Upload images to Cloudinary
    const urls = await uploadImagesToCloudinary(product.productImage);

    console.log(`urls`, urls);

    try {
    } catch (error) {}
    setImageUrls(urls);
    // Add logic to handle form submission, e.g., send product data along with URLs to the server
    console.log("Product submitted with URLs:", {
      ...product,
      productImage: urls,
    });

    await createProduct({
      productName: product.productName,
      productPrice: product.productPrice,
      productSizes: product.productSizes,
      productQuantity: product.productQuantity,
      productImage: urls,
      productDescription: product.productDescription,
      productSpecification: product.productSpecification,
      productCategory: product.productCategory,
      path: pathname,
      accountId: product.accountId,
    });
    router.push("/");
  };

  return (
    <section>
      <div className=" max-w-4xl mx-auto px-6">
        <form
          className="sm:grid grid-cols-1 flex flex-col gap-6 mt-8 md:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <div>
            <Label className="text-base-semibold text-light-2">
              Product Name
            </Label>

            <Input
              name="productName"
              value={product.productName}
              onChange={(e) => handleChange(e)}
              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              type="text"
              placeholder="Product Name"
              aria-label="Product Name"
            />
          </div>

          <div>
            <Label className="text-base-semibold text-light-2">
              Product Price
            </Label>

            <Input
              name="productPrice"
              value={product.productPrice}
              onChange={(e) => handleChange(e)}
              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              type="text"
              placeholder="Product Price"
              aria-label="Product Price"
            />
          </div>

          <div>
            <Label className="text-base-semibold text-light-2">
              product Quantity
            </Label>

            <Input
              name="productQuantity"
              value={product.productQuantity}
              onChange={(e) => handleChange(e)}
              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              type="text"
              placeholder="Product Quantity"
              aria-label="Product Quantity"
            />
          </div>

          <div>
            <Label className="text-base-semibold text-light-2">
              Product Category
            </Label>

            <Input
              name="productCategory"
              value={product.productCategory}
              onChange={(e) => handleChange(e)}
              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              type="text"
              placeholder="Product Category"
              aria-label="Product Category"
            />
          </div>

          <div>
            <Label className="text-base-semibold text-light-2">
              Product Sizes
            </Label>
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
          </div>

          <div className="">
            <Label className="text-base-semibold text-light-2">
              Product Image
            </Label>

            <Input
              name="productImage"
              onChange={(e) => handleChange(e)}
              className="block w-full h-40 border-dashed px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              type="file"
              multiple
              accept="image/*"
              placeholder="Product Image"
              aria-label="Product Image"
            />
          </div>

          <div>
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

          <div>
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

          <Button
            type="submit"
            className="flex col-span-2 items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 mb-6"
          >
            <span>Upload</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 rtl:-scale-x-100"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </Button>
        </form>

        {/* Display selected images */}
        {imagePreviews && (
          <div className="flex flex-row gap-4 flex-wrap items-center justify-center">
            {imagePreviews.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Selected Preview ${index + 1}`}
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  margin: "5px",
                  border: "1px solid #FFFFFF",
                  borderRadius: "5px",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CreateProduct;
