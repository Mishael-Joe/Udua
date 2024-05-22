"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface Image {
  type: "image/jpeg" | "image/png";
  webkitRelativePath: string;
  name: string;
  lastModified: number;
  lastModifiedDate: Date;
  size: number;
}

interface Product {
  productName: string;
  productPrice: string;
  productSizes: string;
  productQuantity: string;
  productImage: Image[];
  productDescription: string;
  productSpecification: string;
  productCategory: string;
  accountId: string;
}

function CreateProduct() {
  const router = useRouter();
  const pathname = usePathname();
  const userData = localStorage.getItem("userData");
  const parsedUserData = JSON.parse(userData || "");

  const userId = parsedUserData.id;

  const [product, setProduct] = useState<Product>({
    productName: "",
    productPrice: "",
    productSizes: "",
    productQuantity: "",
    productImage: [],
    productDescription: "",
    productSpecification: "",
    productCategory: "",
    accountId: userId,
  });

  // const DisplayProductImage = ({ image }) => {
  //   image.map((img) => {
  //     return (
  //       <div>
  //         <Image src={img.name} width={200} height={200} alt={img.name} />
  //       </div>
  //     );
  //   });
  // };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();

    const { name, value, type, files } = e.target as HTMLInputElement;

    setProduct((prev) => {
      if (type === "file" && files) {
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

    console.log(type === "file" && files ? Array.from(files) : "no file");
    console.log(product);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (product.productImage.length === 0) {
      return;
    } else {
      product.productImage.map((image) => {
        if (image.type !== "image/png") {
          return;
        }
      });
    }

    // await createThread({
    //   text: values.thread,
    //   author: userId,
    //   communityId: organization ? organization.id : null,
    //   path: pathname,
    // });
    // router.push("/");
  };

  return (
    <section>
      <div className=" max-w-4xl mx-auto px-6">
        <form
          className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
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
              Product Sizes
            </Label>

            <Input
              name="productSizes"
              value={product.productSizes}
              onChange={(e) => handleChange(e)}
              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              type="text"
              placeholder="Product Sizes"
              aria-label="Product Sizes"
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

          <div className="col-span-2">
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

          {/* {product.productImage.length > 0 &&
            product.productImage.map((name, index) => (
              <img key={index} src={name} alt={`Product Image ${index + 1}`} />
            ))} */}

          {/* {product.productImage[0] && (
            <DisplayProductImage image={product.productImage} />
          )} */}

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
      </div>
    </section>
  );
}

export default CreateProduct;
