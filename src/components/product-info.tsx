"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, Minus, ShoppingBagIcon } from "lucide-react";

import { addCommasToNumber } from "@/lib/utils";
import { useStateContext } from "@/context/stateContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import ShareButton from "../utils/shareBTN";
import { useRouter, usePathname } from "next/navigation";
import { ForProductInfo } from "@/types";

import DOMPurify from "dompurify";

export function ProductInfo({ product }: ForProductInfo) {
  const router = useRouter();
  const pathname = usePathname();
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const currentUrl = `${baseUrl}/${pathname}`;
  const { toast } = useToast();
  const { addToCart, quantity, incrementQuantity, decrementQuantity } =
    useStateContext();
  // console.log('Current :', currentUrl);
  // console.log(product);
  const [selectedSize, setSelectedSize] = useState(() => {
    if (product.productType !== "Physical Product") return null;
    if (product.sizes === undefined || product.sizes === null) {
      return null;
    }
    return product.sizes[0];
  });

  const [selectedColor, setSelectedColor] = useState(() => {
    if (product.productType !== "Physical Product") return null;
    if (product.colors === undefined || product.colors === null) {
      return null;
    }
    return product.colors[0];
  });
  const sanitizedContent = DOMPurify.sanitize(product.description);

  if (product.productType === "Physical Product") {
    const notify = () => {
      toast({
        title: `Product added to cart.`,
        description: `Quantity: ${quantity}.`,
        action: (
          <Link href={`/cart`}>
            <Button variant={`link`} className="gap-x-2 whitespace-nowrap">
              <span>open cart</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        ),
      });
    };

    return (
      <div className="mt-5 px-4 sm:mt-8 sm:px-0 lg:mt-0 lg:sticky md:top-20">
        <h1 className="text-lg sm:text-2xl font-bold tracking-tight">
          {product.name}
        </h1>

        <div className="sm:mt-3">
          <h2 className="sr-only">Product information</h2>
          {product.price !== null ? (
            <p className="text-lg sm:text-2xl tracking-tight font-semibold">
              &#8358; {addCommasToNumber(product.price as number)}{" "}
            </p>
          ) : (
            <p className="text-lg sm:text-2xl tracking-tight font-semibold">
              &#8358; {addCommasToNumber(selectedSize!.price)}{" "}
            </p>
          )}
        </div>

        <form className="mt-3">
          <div className="mt-4 flex">
            <Button
              type="button"
              className="w-full flex gap-4 justify-center items-center bg-udua-orange-primary/80 py-6 text-base font-medium text-white hover:bg-udua-orange-primary"
              onClick={() => {
                notify();
                addToCart(product, quantity, selectedSize, selectedColor);
              }}
            >
              <ShoppingBagIcon className="h-5 w-5" />
              Add to cart
            </Button>
          </div>
        </form>

        <div className="mt-4">
          <div className="flex gap-4 w-full justify-between">
            <div className="flex gap-4 pb-4">
              <Button
                type="button"
                onClick={() => {
                  decrementQuantity(), router.refresh();
                }}
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
                {quantity}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  incrementQuantity(), router.refresh();
                }}
                size={"icon"}
                className="hover:bg-udua-orange-primary bg-udua-orange-primary/80"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            <div>
              <ShareButton slug={currentUrl} />
            </div>
          </div>
          {selectedSize && (
            <div className="flex gap-x-3 items-center">
              <p>
                Size: <strong>{selectedSize.size && selectedSize.size}</strong>
              </p>
              <p className="text-xs text-udua-orange-primary">
                ONLY{" "}
                <span>
                  <strong>{selectedSize.size && selectedSize.quantity}</strong>
                </span>{" "}
                LEFT
              </p>
            </div>
          )}
          {product.sizes &&
            product.sizes.map((size) => (
              <Button
                onClick={() => setSelectedSize(size)}
                key={size.quantity}
                className={`mr-2 mt-4 ${
                  selectedSize?.size === size.size
                    ? " hover:bg-udua-orange-primary bg-udua-orange-primary/90"
                    : `hover:bg-udua-orange-primary bg-udua-orange-primary/55`
                }`}
                disabled={size.quantity === 0}
              >
                {size.size && size.size}
              </Button>
            ))}

          {selectedColor && (
            <p className="pt-2">
              Color: <strong>{selectedColor && selectedColor}</strong>
            </p>
          )}
          {product.colors &&
            product.colors.map((color: any) => (
              <Button
                onClick={() => setSelectedColor(color)}
                key={color}
                variant={selectedColor === color ? `outline` : `default`}
                className={`mr-2 mt-4 ${
                  selectedColor === color ? " bg-purple-700" : ``
                }`}
              >
                {color && color}
              </Button>
            ))}
        </div>

        <div className="mt-6 hidden md:block">
          <h3 className="sr-only">Description</h3>
          {/* <div className="space-y-6 text-base">{product.description}</div> */}
          <div
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              WebkitLineClamp: 3, // Limits the text to 3 lines
              maxHeight: "4.5em", // Adjust this based on the number of lines and line height
              lineHeight: "1.5em", // Adjust based on font size for accurate height control
            }}
          ></div>
        </div>
      </div>
    );
  } else {
    const notify = () => {
      toast({
        title: `Product added to cart.`,
        description: `Quantity: ${quantity}.`,
        action: (
          <Link href={`/cart`}>
            <Button variant={`link`} className="gap-x-2 whitespace-nowrap">
              <span>open cart</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        ),
      });
    };

    return (
      <div className="mt-10 px-4 sm:mt-6 sm:px-0 lg:mt-6 md:sticky md:top-20">
        <h1 className="text-xl font-bold tracking-tight">{product.title}</h1>

        <div className="mt-3">
          <h2 className="sr-only">Product information</h2>
          <p className="text-2xl tracking-tight font-semibold">
            &#8358; {addCommasToNumber(product.price as number)}
          </p>
        </div>

        <form className="mt-3">
          <div className="flex">
            <Button
              type="button"
              className="w-full bg-udua-orange-primary/80 py-6 text-base font-medium text-white hover:bg-udua-orange-primary"
              onClick={() => {
                notify();
                addToCart(product, quantity, null, null);
              }}
            >
              Add to cart
            </Button>
          </div>
        </form>

        <div className="mt-2">
          <div className="flex gap-4 pb-2 w-full justify-end">
            <div>
              <ShareButton slug={currentUrl} />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="sr-only">Description</h3>
          {/* <div className="space-y-6 text-base">{product.description}</div> */}
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }}></div>

          <blockquote className="mt-2 text-gray-600 italic border-l-4 pl-4 border-udua-orange-primary rounded">
            After your purchase, please check your email for the download link
            to your eBook. The link will be valid for 5 minutes, so make sure to
            download it before it expires.
          </blockquote>
        </div>
      </div>
    );
  }
}
