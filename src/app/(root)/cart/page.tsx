"use client";

import { CartItems } from "@/components/cart-items";
import { CartSummary } from "@/components/cart-summary";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Assuming axios is used for API calls
import { CombinedProduct } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { addCommasToNumber } from "@/lib/utils";
import { shimmer, toBase64 } from "@/lib/image";
import { useStateContext } from "@/context/stateContext";

export default function Page() {
  const { setCartItemsFromStorage } = useStateContext();
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<
    CombinedProduct[]
  >([]);

  useEffect(() => {
    // Get recently viewed product IDs from localStorage
    const recentlyViewed = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    );

    // If there are no products, return early
    if (recentlyViewed.length === 0) return;

    // Fetch the recently viewed products from the backend
    const fetchProducts = async () => {
      try {
        // Assuming you have an endpoint for fetching products by multiple IDs
        const response = await axios.post("/api/user/recently-viewed", {
          productIds: recentlyViewed,
        });

        // console.log("Recently viewed products:", response.data.products);
        // Set the fetched products in the state
        setRecentlyViewedProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching recently viewed products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Define the async function inside useEffect
    const updateProductInfoInLocalStorage = async () => {
      // Retrieve the products from localStorage
      const productsInLocalStorage = JSON.parse(
        localStorage.getItem("cartItems") || "[]"
      );

      // Extract the product IDs from the stored products
      const productIds = productsInLocalStorage.map(
        (product: { _id: string }) => product._id
      );

      if (productIds.length === 0) return; // No products, nothing to update

      try {
        // Send the product IDs to the backend to fetch updated information
        const response = await axios.post("/api/user/get-updated-products", {
          productIds,
        });

        const updatedProducts = response.data.UpdatedProducts;

        const newCartItems = productsInLocalStorage.map(
          (product: CombinedProduct) => {
            const foundProduct: CombinedProduct = updatedProducts.find(
              (item: CombinedProduct) => item._id === product._id
            );

            if (foundProduct) {
              // Check if the product has a 'productQuantity' field (e.g., for physical products)
              const updatedProduct = {
                ...product,
                price: foundProduct.price,
              };

              // Update 'productQuantity' only if it exists (for physical products)
              if (foundProduct.productQuantity !== undefined) {
                updatedProduct.productQuantity = foundProduct.productQuantity;
              }

              return updatedProduct;
            }

            return product; // If no match found, return the original product
          }
        );

        // Update the localStorage with the fresh product information
        setCartItemsFromStorage(newCartItems);
      } catch (error) {
        console.error("Error fetching updated product info:", error);
      }
    };

    // Call the function when the component is mounted
    updateProductInfoInLocalStorage();
  }, []); // Empty dependency array ensures the effect runs only once when the component is mounted

  return (
    <div>
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          Shopping Cart
        </h1>

        <form className="mt-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            {/* Cart Items */}
            <CartItems />
          </section>
          {/* Cart Summary */}
          <CartSummary />
        </form>

        {recentlyViewedProducts.length > 0 && (
          <>
            <div className="border p-4 rounded-md shadow-2xl mt-6">
              <h1 className=" text-xl font-semibold">
                Recently viewed products
              </h1>

              <div className=" flex gap-4 pt-4">
                {recentlyViewedProducts.map((product) => {
                  return (
                    <Link
                      key={product._id}
                      href={`/products/${product._id}`}
                      className="group text-sm"
                    >
                      {product.productType === "Physical Product" ? (
                        <>
                          <div className="aspect-square h-60 w-60 overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
                            <Image
                              placeholder="blur"
                              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                shimmer(300, 150)
                              )}`}
                              src={product.images[0]}
                              alt={product.name}
                              width={300}
                              height={150}
                              className="h-full w-full object-cover object-center"
                              quality={90}
                            />
                          </div>

                          <h3
                            className="mt-1 font-medium w-60"
                            style={{
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              WebkitLineClamp: 1, // Limits the text to 3 lines
                              maxHeight: "1.5em", // Adjust this based on the number of lines and line height
                              lineHeight: "1.5em", // Adjust based on font size for accurate height control
                            }}
                          >
                            {product.name}
                          </h3>
                          <p className="mt-1 font-medium">
                            &#8358; {addCommasToNumber(product.price as number)}{" "}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="aspect-square h-60 w-60 overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
                            <Image
                              placeholder="blur"
                              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                shimmer(300, 150)
                              )}`}
                              src={product.coverIMG[0]}
                              alt={product.title}
                              width={300}
                              height={150}
                              className="h-full w-full object-cover object-center"
                              quality={90}
                            />
                          </div>

                          <h3
                            className="mt-1 font-medium w-60"
                            style={{
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              WebkitLineClamp: 1, // Limits the text to 3 lines
                              maxHeight: "1.5em", // Adjust this based on the number of lines and line height
                              lineHeight: "1.5em", // Adjust based on font size for accurate height control
                            }}
                          >
                            {product.title}
                          </h3>
                          <p className="mt-1 font-medium">
                            &#8358; {addCommasToNumber(product.price as number)}{" "}
                          </p>
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
