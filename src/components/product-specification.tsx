// "use client";

// import { useMemo } from "react";
// import DOMPurify from "dompurify";
// import type { ForProductInfo } from "@/types";
// import React from "react";

// // Security configuration for DOMPurify
// const sanitizeConfig = {
//   ALLOWED_TAGS: ["p", "strong", "em", "ul", "ol", "li", "br", "h3", "h4"],
//   ALLOWED_ATTR: [],
// };

// export const ProductSpecification = React.memo(
//   ({ product }: ForProductInfo) => {
//     // Early return if no specifications
//     if (!product?.specifications) return null;

//     // Memoize sanitized content to prevent unnecessary re-sanitization
//     const [description, specifications] = useMemo(
//       () => [
//         DOMPurify.sanitize(product.description || "", sanitizeConfig),
//         DOMPurify.sanitize(product.specifications || "", sanitizeConfig),
//       ],
//       [product.description, product.specifications]
//     );

//     return (
//       <section
//         aria-labelledby="product-specifications-heading"
//         className="mb-10 bg-udua-orange-primary/10 rounded-lg shadow-sm border border-udua-orange-primary/30 p-4 sm:p-6"
//       >
//         <h2 id="product-specifications-heading" className="sr-only">
//           Product specifications and description
//         </h2>

//         <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
//           <DescriptionSection content={description} />
//           <SpecificationsSection content={specifications} />
//         </div>
//       </section>
//     );
//   }
// );

// const DescriptionSection = React.memo(({ content }: { content: string }) => (
//   <article
//     aria-labelledby="description-heading"
//     className="pb-5 sm:pb-0 sm:pr-6"
//   >
//     <h3 id="description-heading" className="text-lg font-semibold mb-3">
//       Description
//     </h3>
//     <div
//       dangerouslySetInnerHTML={{ __html: content }}
//       className="prose prose-sm max-w-none"
//       aria-live="polite"
//     />
//   </article>
// ));

// const SpecificationsSection = React.memo(({ content }: { content: string }) => (
//   <article
//     aria-labelledby="specifications-heading"
//     className="sm:pl-6 sm:border-l border-udua-orange-primary/30"
//   >
//     <h3 id="specifications-heading" className="text-lg font-semibold mb-3">
//       Specifications
//     </h3>
//     <div
//       dangerouslySetInnerHTML={{ __html: content }}
//       className="prose prose-sm max-w-none"
//       aria-live="polite"
//     />
//   </article>
// ));

// ProductSpecification.displayName = "ProductSpecification";

// "use client";

// import { ForProductInfo } from "@/types";
// import DOMPurify from "dompurify";

// export function ProductSpecification({ product }: ForProductInfo) {
//   // console.log("product.specifications.length", product);
//   const sanitizedContentForDescription = DOMPurify.sanitize(
//     product.description
//   );
//   const sanitizedContentForSpecifications = DOMPurify.sanitize(
//     product.specifications
//   );
//   if (product.specifications === "") return;

//   return (
//     <div className="mb-10 sm:divide-x-2 divide-udua-orange-primary/40 rounded grid sm:grid-cols-2 gap-3 sm:border-2 border-udua-orange-primary/50 bg-udua-orange-primary/10 px-4 py-6 shadow dark:border-gray-900 dark:bg-black sm:p-6">
//       <div className=" pb-5 sm:pb-0">
//         <h3 className="text-lg pb-3 font-semibold">Description</h3>
//         <div
//           dangerouslySetInnerHTML={{ __html: sanitizedContentForDescription }}
//         ></div>
//       </div>

//       <div className=" sm:pl-4">
//         <h2 className="text-lg font-semibold pb-3">Specifications:</h2>
//         <div
//           dangerouslySetInnerHTML={{
//             __html: sanitizedContentForSpecifications,
//           }}
//         ></div>
//       </div>
//     </div>
//   );
// }

/**
 * Product Specification Component
 *
 * Displays product description and specifications in a visually appealing format.
 * Uses DOMPurify to sanitize HTML content for security.
 */

"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";
import type { ForProductInfo } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Security configuration for DOMPurify
const sanitizeConfig = {
  ALLOWED_TAGS: ["p", "strong", "em", "ul", "ol", "li", "br", "h3", "h4"],
  ALLOWED_ATTR: [],
};

export function ProductSpecification({ product }: ForProductInfo) {
  const description = product?.description || "";
  const specificationsContent = product?.specifications || "";

  // Memoize sanitized content to prevent unnecessary re-sanitization
  const [sanitizedDescription, sanitizedSpecifications] = useMemo(
    () => [
      DOMPurify.sanitize(description, sanitizeConfig),
      DOMPurify.sanitize(specificationsContent, sanitizeConfig),
    ],
    [description, specificationsContent]
  );

  // Move conditional return after hooks
  if (!product?.specifications) return null;

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-6">
            <div
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              className="prose prose-sm max-w-none dark:prose-invert"
              aria-live="polite"
            />
          </TabsContent>
          <TabsContent value="specifications" className="p-6">
            <div
              dangerouslySetInnerHTML={{ __html: sanitizedSpecifications }}
              className="prose prose-sm max-w-none dark:prose-invert"
              aria-live="polite"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
