"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, X, Minus, Plus, InfoIcon } from "lucide-react";

import { shimmer, toBase64 } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CartItemsEmpty } from "@/components/cart-items-empty";
import { addCommasToNumber } from "@/lib/utils";
import { useStateContext } from "@/context/stateContext";
import { ProductFromLocalStorage } from "@/types";

export function CartItems() {
  const { toast } = useToast();
  const { onRemove, cartItems, toggleCartItemQuantity } = useStateContext();

  const notify = (product: ProductFromLocalStorage) => {
    if (product.productType === "Physical Product") {
      toast({
        title: `Product removed from cart`,
        description: `Quantity: ${product.quantity}`,
      });
    } else {
      toast({
        title: `Product removed from cart`,
        description: `Quantity: ${product.quantity}`,
      });
    }
  };

  if (cartItems.length === 0) return <CartItemsEmpty />;

  return (
    <>
      <ul
        role="list"
        className="divide-y divide-gray-200 divide-udua-orang-primary/30 border-y border-udua-orange-primary/30 dark:divide-gray-500 dark:border-gray-500"
      >
        {cartItems.length >= 1 &&
          cartItems.map((product, productIdx) => {
            if (product.productType === "Physical Product") {
              return (
                <li key={product._id} className="flex py-6 sm:py-10">
                  <div className="shrink-0">
                    <Image
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                        shimmer(200, 200)
                      )}`}
                      src={product.images![0]}
                      alt={product.name!}
                      width={200}
                      height={200}
                      className="h-24 w-24 rounded-md border-2 border-gray-200 object-cover object-center dark:border-gray-800 sm:h-48 sm:w-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative justify-between pr-9 sm:flex sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3
                            className="text-sm"
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
                            <Link
                              href={`/product/${product._id}`}
                              className="font-medium"
                            >
                              {product.name}
                            </Link>
                          </h3>
                        </div>
                        {product.price !== null ? (
                          <p className="mt-1 font-medium">
                            &#8358; {addCommasToNumber(product.price as number)}{" "}
                          </p>
                        ) : (
                          <p className="mt-1 font-medium">
                            &#8358; {addCommasToNumber(product.size!.price)}{" "}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label
                          htmlFor={`quantity-${productIdx}`}
                          className="sr-only"
                        >
                          Quantity, {product.name}
                        </label>
                        <div className="flex gap-4">
                          <Button
                            type="button"
                            onClick={() =>
                              toggleCartItemQuantity(product._id!, "decrease")
                            }
                            size={"icon"}
                            className="hover:bg-udua-orange-primary bg-udua-orange-primary/80"
                          >
                            <Minus className="h-5 w-5" />
                          </Button>
                          <Button
                            disabled
                            size={"icon"}
                            className="hover:bg-slate-100 bg-slate-100 text-udua-orange-primary font-bold border-none"
                          >
                            {product.quantity}
                          </Button>
                          <Button
                            type="button"
                            onClick={() =>
                              toggleCartItemQuantity(product._id!, "increase")
                            }
                            size={"icon"}
                            className="hover:bg-udua-orange-primary bg-udua-orange-primary/80"
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        </div>

                        <div className="absolute right-0 top-0">
                          <Button
                            variant="ghost"
                            type="button"
                            className="-mr-2 inline-flex p-2 hover:text-udua-orange-primary"
                            onClick={() => {
                              notify(product);
                              onRemove(product);
                            }}
                            size={"icon"}
                          >
                            <span className="sr-only">Remove</span>
                            <X className="h-5 w-5" aria-hidden="true" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 flex space-x-2 text-sm">
                      <Clock className="h-5 w-5 shrink-0" aria-hidden="true" />
                      <span>Ships in 4 days</span>
                    </p>
                  </div>
                </li>
              );
            } else {
              return (
                <li key={product._id} className="flex py-6 sm:py-10">
                  <div className="shrink-0">
                    <Image
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                        shimmer(200, 200)
                      )}`}
                      src={product.coverIMG![0]}
                      alt={product.title!}
                      width={200}
                      height={200}
                      className="h-24 w-24 rounded-md border-2 border-gray-200 object-cover object-center dark:border-gray-800 sm:h-48 sm:w-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative justify-between pr-9 sm:flex sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3
                            className="text-sm"
                            style={{
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              WebkitLineClamp: 2, // Limits the text to 3 lines
                              maxHeight: "3.5em", // Adjust this based on the number of lines and line height
                              lineHeight: "1.5em", // Adjust based on font size for accurate height control
                            }}
                          >
                            <Link
                              href={`/product/${product._id}`}
                              className="font-medium"
                            >
                              {product.title}
                            </Link>
                          </h3>
                        </div>
                        <p className="mt-1 text-sm font-medium">
                          &#8358; {addCommasToNumber(product.price as number)}
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          File Type: PDF
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label
                          htmlFor={`quantity-${productIdx}`}
                          className="sr-only"
                        >
                          Quantity, {product.name}
                        </label>
                        {/* <div className="flex gap-4">
                          <Button
                            type="button"
                            onClick={() =>
                              toggleCartItemQuantity(product._id!, "decrease")
                            }
                            size={"icon"}
                            className="hover:bg-udua-orange-primary bg-udua-orange-primary/80"
                          >
                            <Minus className="h-5 w-5" />
                          </Button>
                          <Button
                            disabled
                            size={"icon"}
                            className="hover:bg-slate-100 bg-slate-100 text-udua-orange-primary font-bold border-none"
                          >
                            {product.quantity}
                          </Button>
                          <Button
                            type="button"
                            onClick={() =>
                              toggleCartItemQuantity(product._id!, "increase")
                            }
                            size={"icon"}
                            className="hover:bg-udua-orange-primary bg-udua-orange-primary/80"
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        </div> */}

                        <div className="absolute right-0 top-0">
                          <Button
                            variant="ghost"
                            type="button"
                            className="-mr-2 inline-flex p-2 hover:text-udua-orange-primary"
                            onClick={() => {
                              notify(product);
                              onRemove(product);
                            }}
                            size={"icon"}
                          >
                            <span className="sr-only">Remove</span>
                            <X className="h-5 w-5" aria-hidden="true" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            }
          })}
      </ul>

      <div>
        <div className=" flex gap-3 pt-4 items-center">
          <span>
            <InfoIcon width={15} height={15} />
          </span>
          <span className=" text-xs">
            Product availability and prices are not guaranteed until payment is
            final.
          </span>
        </div>

        <div className=" flex gap-3 pt-4 items-center">
          <span>
            <InfoIcon width={15} height={15} />
          </span>
          <span className=" text-xs">
            Shipping estimate is based on the Product bought, the shipping
            method you choose and it is calculated at checkout.
          </span>
        </div>

        <div className=" flex gap-3 pt-4 items-center">
          <span>
            <InfoIcon width={15} height={15} />
          </span>
          <span className=" text-xs">
            You will not be charged until you review this order on the next page
          </span>
        </div>
      </div>
    </>
  );
}
