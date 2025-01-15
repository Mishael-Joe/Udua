"use client";

import { ForProductInfo } from "@/types";
import DOMPurify from "dompurify";

export function ProductSpecification({ product }: ForProductInfo) {
  // console.log("product.specifications.length", product);
  const sanitizedContentForDescription = DOMPurify.sanitize(
    product.description
  );
  const sanitizedContentForSpecifications = DOMPurify.sanitize(
    product.specifications
  );
  if (product.specifications === "") return;

  return (
    <div className="mb-10 sm:divide-x-2 divide-udua-orange-primary/40 rounded grid sm:grid-cols-2 gap-3 sm:border-2 border-udua-orange-primary/50 bg-udua-orange-primary/10 px-4 py-6 shadow dark:border-gray-900 dark:bg-black sm:p-6">
      <div className=" pb-5 sm:pb-0">
        <h3 className="text-lg pb-3 font-semibold">Description</h3>
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedContentForDescription }}
        ></div>
      </div>

      <div className=" sm:pl-4">
        <h2 className="text-lg font-semibold pb-3">Specifications:</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizedContentForSpecifications,
          }}
        ></div>
      </div>
    </div>
  );
}
