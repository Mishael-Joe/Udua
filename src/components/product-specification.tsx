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
