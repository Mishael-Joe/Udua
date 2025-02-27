"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";
import { shimmer, toBase64 } from "@/lib/image";
import { useStateContext } from "@/context/stateContext";
import { useRouter } from "next/navigation";

const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  const blurData = useMemo(
    () => `data:image/svg+xml;base64,${toBase64(shimmer(200, 200))}`,
    []
  );

  return (
    <div className="shrink-0 relative h-36 w-36 sm:h-52 sm:w-52">
      <Image
        placeholder="blur"
        blurDataURL={blurData}
        src={src}
        alt={alt}
        fill
        className="rounded-md border-2 border-gray-200 object-cover dark:border-gray-800"
        sizes="(max-width: 640px) 100px, (max-width: 768px) 200px, 200px"
      />
    </div>
  );
};

export function CheckoutCartItems() {
  const router = useRouter();
  const { cartItems, fetchCartItems } = useStateContext();

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (cartItems.length === 0) router.push("/cart");

  return (
    <>
      <h3 className="text-sm font-semibold pb-2">Items in cart</h3>
      <ul
        role="list"
        className="gri grid-cols-2 md:grid-cols-3 flex flex-wrap gap-x-4 divide-udua-orang-primary/30 border-y border-udua-orange-primary/30 dark:divide-gray-500 dark:border-gray-500"
      >
        {cartItems.map((product, index) => {
          //   console.log("product", product._id);

          const isPhysical = product.productType === "physicalproducts";

          const title = isPhysical
            ? product.product.name
            : product.product.title;
          const imageSrc = isPhysical
            ? product.product.images?.[0]
            : product.product.coverIMG?.[0];

          return (
            <li key={`cart-item-${product._id}-${index}`} className="flex py-3">
              {imageSrc && <ProductImage src={imageSrc} alt={title || ""} />}
            </li>
          );
        })}
      </ul>
    </>
  );
}
