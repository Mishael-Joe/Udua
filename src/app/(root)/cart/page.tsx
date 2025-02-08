"use client";

import { CartItems } from "@/components/cart-items";
import { CartSummary } from "@/components/cart-summary";
import React, { useEffect, useCallback, useMemo, useState } from "react";
import axios from "axios";
import { CombinedProduct } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { addCommasToNumber } from "@/lib/utils";
import { shimmer, toBase64 } from "@/lib/image";
import { useStateContext } from "@/context/stateContext";

// Reusable Product Card Component
const ProductCard = ({ product }: { product: CombinedProduct }) => {
  const isPhysical = product.productType === "Physical Product";
  const imageUrl = isPhysical ? product.images[0] : product.coverIMG[0];
  const title = isPhysical ? product.name : product.title;
  const price = isPhysical
    ? product.price ?? product.sizes?.[0]?.price
    : product.price;

  // Memoize blur data URL generation
  const blurData = useMemo(
    () => `data:image/svg+xml;base64,${toBase64(shimmer(300, 150))}`,
    []
  );

  return (
    <Link
      href={`/product/${product._id}`}
      className="group text-sm flex flex-col w-40 md:w-52"
      aria-label={`View ${title}`}
    >
      <div className="aspect-square w-40 h-40 md:h-52 relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
        <Image
          placeholder="blur"
          blurDataURL={blurData}
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 40vw, 20vw"
        />
      </div>

      <h3 className="mt-1 font-medium line-clamp-1 w-40 md:w-52">{title}</h3>

      {price && (
        <p className="mt-1 font-medium">&#8358; {addCommasToNumber(price)}</p>
      )}
    </Link>
  );
};

export default function Page() {
  const { setCartItemsFromStorage } = useStateContext();
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<
    CombinedProduct[]
  >([]);

  // Memoized product IDs fetcher
  const getProductIds = useCallback((key: string) => {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (error) {
      console.error(`Error parsing ${key}:`, error);
      return [];
    }
  }, []);

  // Fetch recently viewed products
  useEffect(() => {
    const fetchRecentProducts = async () => {
      const recentlyViewed = getProductIds("recentlyViewed");
      if (!recentlyViewed.length) return;

      try {
        const { data } = await axios.post("/api/user/recently-viewed", {
          productIds: recentlyViewed,
        });
        setRecentlyViewedProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching recently viewed:", error);
      }
    };

    fetchRecentProducts();
  }, [getProductIds]);

  // Update cart items from storage
  const updateCartItems = useCallback(async () => {
    const productsInLocalStorage = getProductIds("cartItems");
    if (!productsInLocalStorage.length) return;

    try {
      const { data } = await axios.post("/api/user/get-updated-products", {
        productIds: productsInLocalStorage.map((p: CombinedProduct) => p._id),
      });

      const updatedProducts = data.UpdatedProducts || [];
      const newCartItems = productsInLocalStorage
        .map((product: CombinedProduct) => {
          const foundProduct = updatedProducts.find(
            (p: CombinedProduct) => p._id === product._id
          );

          if (!foundProduct) return null;

          // Handle physical product sizes
          if (foundProduct.price === null && foundProduct.sizes) {
            const foundSize = foundProduct.sizes.find(
              (s: CombinedProduct) => s._id === product.size?._id
            );
            return foundSize
              ? {
                  ...product,
                  size: { ...product.size, ...foundSize },
                }
              : null;
          }

          // Update general product info
          return {
            ...product,
            price: foundProduct.price,
            ...(foundProduct.productQuantity !== undefined && {
              productQuantity: foundProduct.productQuantity,
            }),
          };
        })
        .filter(Boolean);

      setCartItemsFromStorage(newCartItems as CombinedProduct[]);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  }, [getProductIds, setCartItemsFromStorage]);

  useEffect(() => {
    updateCartItems();
  }, [updateCartItems]);

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          Shopping Cart
        </h1>

        <form className="mt-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            <CartItems />
          </section>

          <CartSummary />
        </form>

        {recentlyViewedProducts.length > 0 && (
          <section className="mt-6 border p-4 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Recently Viewed Products
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-4">
              {recentlyViewedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// "use client";

// import { CartItems } from "@/components/cart-items";
// import { CartSummary } from "@/components/cart-summary";
// import React, { useEffect, useState } from "react";
// import axios from "axios"; // Assuming axios is used for API calls
// import { CombinedProduct } from "@/types";
// import Link from "next/link";
// import Image from "next/image";
// import { addCommasToNumber } from "@/lib/utils";
// import { shimmer, toBase64 } from "@/lib/image";
// import { useStateContext } from "@/context/stateContext";

// export default function Page() {
//   const { setCartItemsFromStorage } = useStateContext();
//   const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<
//     CombinedProduct[]
//   >([]);

//   useEffect(() => {
//     // Get recently viewed product IDs from localStorage
//     const recentlyViewed = JSON.parse(
//       localStorage.getItem("recentlyViewed") || "[]"
//     );

//     // If there are no products, return early
//     if (recentlyViewed.length === 0) return;

//     // Fetch the recently viewed products from the backend
//     const fetchProducts = async () => {
//       try {
//         // Assuming you have an endpoint for fetching products by multiple IDs
//         const response = await axios.post("/api/user/recently-viewed", {
//           productIds: recentlyViewed,
//         });

//         // console.log("Recently viewed products:", response.data.products);
//         // Set the fetched products in the state
//         setRecentlyViewedProducts(response.data.products);
//       } catch (error) {
//         console.error("Error fetching recently viewed products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     // Define the async function inside useEffect
//     const updateProductInfoInLocalStorage = async () => {
//       // Retrieve the products from localStorage
//       const productsInLocalStorage = JSON.parse(
//         localStorage.getItem("cartItems") || "[]"
//       );

//       // Extract the product IDs from the stored products
//       const productIds = productsInLocalStorage.map(
//         (product: { _id: string }) => product._id
//       );

//       if (productIds.length === 0) return; // No products, nothing to update

//       try {
//         // Send the product IDs to the backend to fetch updated information
//         const response = await axios.post("/api/user/get-updated-products", {
//           productIds,
//         });

//         const updatedProducts = response.data.UpdatedProducts;

//         const newCartItems = productsInLocalStorage
//           .map((product: CombinedProduct) => {
//             const foundProduct: CombinedProduct = updatedProducts.find(
//               (item: CombinedProduct) => item._id === product._id
//             );
//             // console.log("foundProduct", foundProduct);

//             if (foundProduct) {
//               if (foundProduct.price === null) {
//                 // Check if the product is a physical product with sizes
//                 const foundSize = foundProduct.sizes?.find(
//                   (size) => size._id === product.size?._id
//                 );

//                 if (!foundSize) {
//                   // If no size is found, return null to filter it out
//                   return null;
//                 }

//                 // Update the product with the found size's price
//                 return {
//                   ...product,
//                   size: {
//                     ...product.size,
//                     price: foundSize.price,
//                     quantity: foundSize.quantity,
//                   },
//                 };
//               }

//               // For products without size-based pricing
//               const updatedProduct = {
//                 ...product,
//                 price: foundProduct.price,
//               };

//               // Update 'productQuantity' only if it exists (for physical products)
//               if (foundProduct.productQuantity !== undefined) {
//                 updatedProduct.productQuantity = foundProduct.productQuantity;
//               }

//               return updatedProduct;
//             }

//             // If no product is found, return null to filter it out
//             return null;
//           })
//           // Filter out products where foundProduct or foundSize was not found
//           .filter((item: CombinedProduct) => item !== null);

//         // Update the localStorage with the fresh product information
//         setCartItemsFromStorage(newCartItems as CombinedProduct[]);
//       } catch (error) {
//         console.error("Error fetching updated product info:", error);
//       }
//     };

//     // Call the function when the component is mounted
//     updateProductInfoInLocalStorage();
//   }, []); // Empty dependency array ensures the effect runs only once when the component is mounted

//   return (
//     <div>
//       <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:max-w-7xl lg:px-8">
//         <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
//           Shopping Cart
//         </h1>

//         <form className="mt-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
//           <section aria-labelledby="cart-heading" className="lg:col-span-7">
//             <h2 id="cart-heading" className="sr-only">
//               Items in your shopping cart
//             </h2>
//             {/* Cart Items */}
//             <CartItems />
//           </section>
//           {/* Cart Summary */}
//           <CartSummary />
//         </form>

//         {recentlyViewedProducts.length > 0 && (
//           <>
//             <div className="border p-4 rounded-md shadow-2xl mt-6">
//               <h1 className=" text-xl font-semibold">
//                 Recently viewed products
//               </h1>

//               <div className=" flex gap-4 pt-4 overflow-auto">
//                 {recentlyViewedProducts.map((product) => {
//                   return (
//                     <Link
//                       key={product._id}
//                       href={`/product/${product._id}`}
//                       className="group text-sm"
//                     >
//                       {product.productType === "Physical Product" ? (
//                         <>
//                           <div className="aspect-square w-40 h-40 md:h-52 md:w-52 overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
//                             <Image
//                               placeholder="blur"
//                               blurDataURL={`data:image/svg+xml;base64,${toBase64(
//                                 shimmer(300, 150)
//                               )}`}
//                               src={product.images[0]}
//                               alt={product.name}
//                               width={300}
//                               height={150}
//                               className="h-full w-full object-cover object-center"
//                               quality={90}
//                             />
//                           </div>

//                           <h3
//                             className="mt-1 font-medium w-40 md:w-52"
//                             style={{
//                               display: "-webkit-box",
//                               WebkitBoxOrient: "vertical",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                               WebkitLineClamp: 1, // Limits the text to 3 lines
//                               maxHeight: "1.5em", // Adjust this based on the number of lines and line height
//                               lineHeight: "1.5em", // Adjust based on font size for accurate height control
//                             }}
//                           >
//                             {product.name}
//                           </h3>
//                           {product.price !== null ? (
//                             <p className="mt-1 font-medium">
//                               &#8358;{" "}
//                               {addCommasToNumber(product.price as number)}{" "}
//                             </p>
//                           ) : (
//                             <p className="mt-1 font-medium">
//                               &#8358;{" "}
//                               {addCommasToNumber(product.sizes![0].price)}{" "}
//                             </p>
//                           )}
//                         </>
//                       ) : (
//                         <>
//                           <div className="aspect-square w-40 h-40 md:h-52 md:w-52 overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
//                             <Image
//                               placeholder="blur"
//                               blurDataURL={`data:image/svg+xml;base64,${toBase64(
//                                 shimmer(300, 150)
//                               )}`}
//                               src={product.coverIMG[0]}
//                               alt={product.title}
//                               width={300}
//                               height={150}
//                               className="h-full w-full object-cover object-center"
//                               quality={90}
//                             />
//                           </div>

//                           <h3
//                             className="mt-1 font-medium w-40 md:w-52"
//                             style={{
//                               display: "-webkit-box",
//                               WebkitBoxOrient: "vertical",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                               WebkitLineClamp: 1, // Limits the text to 3 lines
//                               maxHeight: "1.5em", // Adjust this based on the number of lines and line height
//                               lineHeight: "1.5em", // Adjust based on font size for accurate height control
//                             }}
//                           >
//                             {product.title}
//                           </h3>
//                           <p className="mt-1 font-medium">
//                             &#8358; {addCommasToNumber(product.price as number)}{" "}
//                           </p>
//                         </>
//                       )}
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>
//           </>
//         )}
//       </main>
//     </div>
//   );
// }
