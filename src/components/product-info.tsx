"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, Minus } from "lucide-react";

import { addCommasToNumber } from "@/lib/utils";
import { useStateContext } from "@/context/stateContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import ShareButton from "../utils/shareBTN";
import { useRouter, usePathname } from "next/navigation";
import { ForProductInfo, Product } from "@/types";

export function ProductInfo({ product }: ForProductInfo) {
  const router = useRouter();
  const pathname = usePathname();
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const currentUrl = `${baseUrl}/${pathname}`;

  // console.log('Current :', currentUrl);
  // console.log(product);
  const [selectedSize, setSelectedSize] = useState(() => {
    if (product.productSizes === undefined || product.productSizes === null) {
      return null;
    }
    return product.productSizes[0];
  });

  const [selectedColor, setSelectedColor] = useState(() => {
    if (product.colors === undefined || product.colors === null) {
      return null;
    }
    return product.colors[0];
  });

  const { toast } = useToast();
  const { addToCart, quantity, incrementQuantity, decrementQuantity } =
    useStateContext();

  const notify = (product: Product) => {
    toast({
      title: `${product.productName}. Quantity: ${quantity}`,
      description: `Product added to cart`,
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
    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
      <h1 className="text-3xl font-bold tracking-tight">
        {product.productName}
      </h1>

      <div className="mt-3">
        <h2 className="sr-only">Product information</h2>
        <p className="text-3xl tracking-tight">
          &#8358; {addCommasToNumber(product.productPrice as number)}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="sr-only">Description</h3>
        <div className="space-y-6 text-base">{product.productDescription}</div>
      </div>

      <div className="mt-4">
        <div className="flex gap-4 pb-4 w-full justify-between">
          <div className="flex gap-4 pb-4">
            <Button
              type="button"
              onClick={() => {
                decrementQuantity(), router.refresh();
              }}
            >
              <Minus className="h-5 w-5" />
            </Button>
            <Button className=" border-none" disabled>
              {quantity}
            </Button>
            <Button
              type="button"
              onClick={() => {
                incrementQuantity(), router.refresh();
              }}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          <div>
            <ShareButton slug={currentUrl} />
          </div>
        </div>
        {selectedSize && (
          <p>
            Size: <strong>{selectedSize && selectedSize}</strong>
          </p>
        )}
        {product.productSizes &&
          product.productSizes.map((size: any) => (
            <Button
              onClick={() => setSelectedSize(size)}
              key={size}
              variant={selectedSize === size ? "default" : `outline`}
              className={`mr-2 mt-4 ${
                selectedSize === size ? " bg-purple-700" : ``
              }`}
            >
              {size && size}
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

      <form className="mt-6">
        <div className="mt-4 flex">
          <Button
            type="button"
            className="w-full bg-violet-600 py-6 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            onClick={() => {
              notify(product);
              addToCart(product, quantity, selectedSize, selectedColor);
            }}
          >
            Add to cart
          </Button>
        </div>
      </form>
    </div>
  );
}
