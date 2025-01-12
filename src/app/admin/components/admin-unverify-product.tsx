"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useState } from "react";
import { Loader } from "lucide-react";
import { Product } from "@/types";
import Image from "next/image";
import { shimmer, toBase64 } from "@/lib/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addCommasToNumber } from "@/lib/utils";

function AdminUnVerifyProduct() {
  const [productID, setProductID] = useState("");
  const [product, setProduct] = useState<Partial<Product>>({
    _id: "",
    name: "",
    price: 0,
    sizes: [],
    productQuantity: "",
    images: [],
    description: "",
    specifications: "",
    subCategory: "",
    storeID: "",
    isVerifiedProduct: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (val: string, e: React.FormEvent) => {
    e.preventDefault();

    if (val === "requestProductData") {
      try {
        setIsLoading(true);

        const response = await axios.get("/api/admin/verify-product", {
          params: {
            productID,
          },
        });
        // console.log(`response`, response);

        if (response.data.success === true || response.status === 200) {
          toast({
            title: `Success`,
            description: `Here is the User details.`,
          });
          setProduct(response.data.data);
          setIsLoading(false);
        } else {
          toast({
            variant: `destructive`,
            title: `Error`,
            description: `There was an error fetching user data. Please try again.`,
          });
          setIsLoading(false);
        }
      } catch (error) {
        toast({
          variant: `destructive`,
          title: "Error",
          description: `There was an error fetching user data. Please try again.`,
        });
        setIsLoading(false);
      }
    }

    if (val === "UnVerifyProduct") {
      try {
        setIsLoading(true);

        const response = await axios.post("/api/admin/unverify-product", {
          productID,
          type: "UnVerifyProduct",
        });
        // console.log(`response`, response);

        if (response.data.success === true || response.status === 200) {
          toast({
            title: `Success`,
            description: `This product is now unverfified.`,
          });
          setProduct(response.data.data);
          setIsLoading(false);
        } else {
          toast({
            variant: `destructive`,
            title: `Error`,
            description: `There was an error unverifing product. Please try again.`,
          });
          setIsLoading(false);
        }
      } catch (error) {
        toast({
          variant: `destructive`,
          title: "Error",
          description: `There was an error unverifing product. Please try again.`,
        });
        setIsLoading(false);
      }
    }
  };

  return (
    <section>
      <h3 className="my-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
        Unverify Product
      </h3>

      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 mb-6">
        <div className="px-6 py-4">
          <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
            Provide the Product Id.
          </p>

          <form
            onSubmit={(e) => handleSubmit("requestProductData", e)}
            className="space-y-8 "
          >
            <input
              className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
              aria-label="ID"
              type="text"
              value={productID}
              onChange={(e) => setProductID(e.target.value)}
              placeholder="Product ID"
              required
            />
            <Button
              type="submit"
              className="items-end w-full bg-purple-500 hover:bg-purple-600"
            >
              {!isLoading && "Submit"}
              {isLoading && (
                <Loader className=" animate-spin w-5 h-5 mr-4" />
              )}{" "}
              {isLoading && "Please wait..."}
            </Button>
          </form>
        </div>
      </div>

      <div>
        <div className="py-6 border-t-2 flex flex-row justify-between gap-3">
          <CardTitle>Product Images</CardTitle>
          {product.isVerifiedProduct !== false && (
            <span className="text-lg text-green-600">verified</span>
          )}
          {product.isVerifiedProduct === false && (
            <span className="text-lg text-red-600">Unverified</span>
          )}
        </div>

        <div className="grid grid-cols-1 flex-row gap-6 flex-wrap lg:justify-between">
          <div className="mx-auto w-full max-w-5xl sm:block lg:max-w-none">
            <ul className="grid sm:grid-cols-3 gap-6">
              {product.images !== undefined &&
                product.images.map((image, imageIndex: number) => (
                  <div
                    key={imageIndex}
                    className="relative flex h-52 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase hover:bg-gray-50"
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <Image
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(
                          shimmer(200, 200)
                        )}`}
                        src={image}
                        width={200}
                        height={200}
                        alt=""
                        className="h-full w-full object-cover object-center"
                      />
                    </span>
                  </div>
                ))}
            </ul>
          </div>

          <div className=" w-full grid gap-3">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <p>
                    <span className=" text-base font-semibold">
                      Product Name:
                    </span>{" "}
                    <span>{`${product.name}`}</span>
                  </p>

                  <p>
                    <span className=" text-base font-semibold">
                      Product Description:{" "}
                    </span>{" "}
                    <span>{product.description}</span>
                  </p>

                  <p>
                    <span className=" text-base font-semibold">
                      Product Specification:{" "}
                    </span>{" "}
                    <span>{product.specifications}</span>
                  </p>

                  <p>
                    <span className=" text-base font-semibold">
                      Product SubCategory:
                    </span>{" "}
                    <span>{product.subCategory}</span>
                  </p>

                  <p>
                    <span className=" text-base font-semibold">
                      Product Category:
                    </span>{" "}
                    <span>{product.category}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <p>
                    <span className=" text-base font-semibold">
                      Product Price:
                    </span>{" "}
                    <span>
                      &#8358;{addCommasToNumber(product.price as number)}
                    </span>
                  </p>

                  <p>
                    <span className=" text-base font-semibold">
                      Product Quantity:
                    </span>{" "}
                    <span>{product.productQuantity}</span>
                  </p>

                  <p>
                    <span className=" text-base font-semibold">
                      Product Sizes:
                    </span>{" "}
                    {product.sizes !== undefined &&
                      product.sizes.map((size, i: number) => (
                        <Button disabled key={i}>
                          {size}
                        </Button>
                      ))}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Other Data </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <span className=" text-base font-semibold">Owner Id:</span>{" "}
                  <span>{product.storeID}</span>
                </p>

                <p>
                  <span className=" text-base font-semibold">
                    Verified Product:
                  </span>{" "}
                  {product.isVerifiedProduct !== false && (
                    <span className="text-lg text-green-600">verified</span>
                  )}
                  {product.isVerifiedProduct === false && (
                    <span className="text-lg text-red-600">Unverified</span>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {product.isVerifiedProduct && (
          <div className="w-full border rounded-md p-3 mt-4">
            <div>
              <p className=" max-w-xl">
                You can unverify this product if necessary.
              </p>
              <form
                onSubmit={(e) => handleSubmit("UnVerifyProduct", e)}
                className="flex justify-end pt-3"
              >
                <Button type="submit" className="hover:text-purple-600">
                  {!isLoading && "Unverify Product"}
                  {isLoading && (
                    <Loader className=" animate-spin w-5 h-5 mr-4" />
                  )}{" "}
                  {isLoading && "Please wait..."}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminUnVerifyProduct;
