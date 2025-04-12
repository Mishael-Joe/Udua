/**
 * Product Specification Component
 *
 * Displays product description and specifications in a visually appealing format.
 * Uses DOMPurify to sanitize HTML content for security.
 */

"use client";

import { Suspense, useMemo } from "react";
import DOMPurify from "dompurify";
import type { CombinedProduct, ForProductInfo } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { ProductReviewComponent2 } from "./product-review";

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
    <Card className="border shadow-xs">
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

export function ProductDetailsComponent({
  description = "No description available.",
  specifications = "",
  item,
}: {
  description: CombinedProduct["description"];
  specifications: CombinedProduct["specifications"];
  item: {
    _id: string;
    productType: CombinedProduct["productType"];
  };
}) {
  // Memoize sanitized content to prevent unnecessary re-sanitization
  const [sanitizedDescription, sanitizedSpecifications] = useMemo(
    () => [
      DOMPurify.sanitize(description, sanitizeConfig),
      DOMPurify.sanitize(specifications, sanitizeConfig),
    ],
    [description, specifications]
  );

  // Move conditional return after hooks
  if (!specifications) return null;

  return (
    <Tabs defaultValue="description" className="mb-12">
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
        <TabsTrigger
          value="description"
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-udua-orange-primary py-3"
        >
          Description
        </TabsTrigger>
        {specifications && (
          <TabsTrigger
            value="specifications"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-udua-orange-primary py-3"
          >
            Specifications
          </TabsTrigger>
        )}
        <TabsTrigger
          value="reviews"
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-udua-orange-primary py-3"
        >
          Reviews
        </TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="pt-4">
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          className="prose max-w-none dark:prose-invert"
          aria-live="polite"
        />
      </TabsContent>
      <TabsContent value="specifications" className="pt-4">
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedSpecifications }}
          className="prose max-w-none dark:prose-invert"
          aria-live="polite"
        />
      </TabsContent>
      <TabsContent value="reviews" className="pt-4">
        {/* Reviews */}
        <section aria-labelledby="reviews-heading" className="pt-4">
          <Suspense
            fallback={
              <div className="rounded-lg border border-border p-8">
                <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-4/6"></div>
                </div>
              </div>
            }
          >
            <ProductReviewComponent2 item={item} />
          </Suspense>
        </section>
      </TabsContent>
    </Tabs>
  );
}
