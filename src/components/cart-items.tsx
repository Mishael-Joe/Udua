"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, X, Minus, Plus, InfoIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { shimmer, toBase64 } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { CartItemsEmpty } from "@/components/cart-items-empty";
import { addCommasToNumber } from "@/lib/utils";
import { useStateContext } from "@/context/stateContext";

// Reusable Info Message Component
const InfoMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 pt-4 items-center">
    <InfoIcon className="h-4 w-4 shrink-0" />
    <span className="text-xs">{children}</span>
  </div>
);

// Memoized Product Image Component
const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  const blurData = useMemo(
    () => `data:image/svg+xml;base64,${toBase64(shimmer(200, 200))}`,
    []
  );

  return (
    <div className="shrink-0 relative h-24 w-24 sm:h-48 sm:w-48">
      <Image
        placeholder="blur"
        blurDataURL={blurData}
        src={src}
        alt={alt}
        fill
        className="rounded-md border-2 border-gray-200 object-cover dark:border-gray-800"
        sizes="(max-width: 640px) 100px, 200px"
      />
    </div>
  );
};

export function CartItems() {
  const { onRemove, cartItems, toggleCartItemQuantity, fetchCartItems } =
    useStateContext();

  useEffect(() => {
    fetchCartItems();
  }, []);

  // console.log("cartItems", cartItems);

  if (cartItems.length === 0) return <CartItemsEmpty />;

  return (
    <>
      <ul
        role="list"
        className="divide-y divide-udua-orang-primary/30 border-y border-udua-orange-primary/30 dark:divide-gray-500 dark:border-gray-500"
      >
        {cartItems.map((product, index) => {
          console.log("product", product._id);

          const isPhysical = product.productType === "physicalproducts";

          const price = isPhysical
            ? product.selectedSize?.price ?? product.product?.price
            : product.product.price;
          const title = isPhysical
            ? product.product.name
            : product.product.title;
          const imageSrc = isPhysical
            ? product.product.images?.[0]
            : product.product.coverIMG?.[0];
          const size = isPhysical ? product.selectedSize?.size : null;

          return (
            <li
              key={`cart-item-${product._id}-${index}`}
              className="flex py-6 sm:py-10"
            >
              {imageSrc && <ProductImage src={imageSrc} alt={title || ""} />}

              <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div className="relative justify-between pr-9 sm:flex sm:gap-x-6 sm:pr-0">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-sm line-clamp-2">
                        <Link
                          href={`/product/${product.product._id}`}
                          className="font-medium hover:text-udua-orange-primary"
                        >
                          {title}
                        </Link>
                      </h3>
                    </div>

                    {price && (
                      <p className="mt-1 font-medium">
                        &#8358; {addCommasToNumber(price)}
                      </p>
                    )}

                    {size && (
                      <p className="mt-1 text-sm font-medium">Size: {size}</p>
                    )}

                    {/* {!isPhysical && (
                      <p className="mt-1 text-sm font-medium">File Type: PDF</p>
                    )} */}
                  </div>

                  <div className="mt-4 sm:mt-0 sm:pr-9">
                    {isPhysical && (
                      <div className="flex gap-4">
                        <QuantityButton
                          action="decrease"
                          onClick={() =>
                            toggleCartItemQuantity(product._id, "decrease")
                          }
                        />
                        <Button
                          disabled
                          size="icon"
                          className="bg-slate-100 text-udua-orange-primary font-bold"
                        >
                          {product.quantity}
                        </Button>
                        <QuantityButton
                          action="increase"
                          onClick={() =>
                            toggleCartItemQuantity(product._id, "increase")
                          }
                        />
                      </div>
                    )}

                    <div className="absolute right-0 top-0">
                      <Button
                        variant="ghost"
                        type="button"
                        className="-mr-2 hover:text-udua-orange-primary"
                        onClick={() => {
                          onRemove(product, product.selectedSize);
                        }}
                        size="icon"
                        aria-label={`Remove ${title} from cart`}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {isPhysical && (
                  <p className="mt-4 flex space-x-2 text-sm">
                    <Clock className="h-5 w-5 shrink-0" />
                    <span>Ships in 4 days</span>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="space-y-4">
        <InfoMessage>
          Product availability and prices are not guaranteed until payment is
          final.
        </InfoMessage>
        <InfoMessage>
          Shipping estimate is based on the Product bought, the shipping method
          you choose, and it is calculated at checkout.
        </InfoMessage>
        <InfoMessage>
          You will not be charged until you review this order on the next page
        </InfoMessage>
      </div>
    </>
  );
}

// Reusable Quantity Control Button
const QuantityButton = ({
  action,
  onClick,
}: {
  action: "increase" | "decrease";
  onClick: () => void;
}) => (
  <Button
    type="button"
    onClick={onClick}
    size="icon"
    className="hover:bg-udua-orange-primary bg-udua-orange-primary/80"
    aria-label={`${action === "increase" ? "Increase" : "Decrease"} quantity`}
  >
    {action === "increase" ? (
      <Plus className="h-5 w-5" />
    ) : (
      <Minus className="h-5 w-5" />
    )}
  </Button>
);
