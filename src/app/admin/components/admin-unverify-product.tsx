"use client";

// Core Imports
import { useState, useMemo } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { CheckCircle2, Clock, Loader } from "lucide-react";
import Image from "next/image";

// Custom Component Imports
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

// Utility Imports
import { Product } from "@/types";
import { formatNaira } from "@/lib/utils";
import { withAdminAuth } from "./auth/with-admin-auth";
import { PERMISSIONS } from "@/lib/rbac/permissions";

/**
 * AdminUnVerifyProduct Component
 * Allows administrators to unverify products with proper validation and audit logging
 * Features product data review, status management, and administrative notes
 */
function UnVerifyProduct() {
  // Component State Management
  const [productID, setProductID] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Product Data State with Type Safety
  const [product, setProduct] = useState<Partial<Product>>({
    _id: "",
    name: "",
    price: 0,
    sizes: [],
    productQuantity: 0,
    images: [],
    description: "",
    specifications: "",
    subCategory: "",
    storeID: "",
    isVerifiedProduct: false,
  });

  // Memoized Sanitized Content for Security and Performance
  const sanitizedContent = useMemo(
    () => ({
      description: DOMPurify.sanitize(product.description || ""),
      specifications: DOMPurify.sanitize(product.specifications || ""),
    }),
    [product.description, product.specifications]
  );

  /**
   * Handles form submissions for both product data retrieval and unverification
   * @param actionType - Determines submission type ("requestProductData" | "UnVerifyProduct")
   * @param e - React Form Event
   */
  const handleSubmission = async (actionType: string, e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (actionType !== "requestProductData" && note.length < 20) {
        toast({
          title: `Required`,
          description:
            "Document reason for unverification. Reasons must be more than 20 letters long!",
        });
        return;
      }
      actionType === "requestProductData"
        ? setIsLoading(true)
        : setIsProcessing(true);

      const endpoint =
        actionType === "requestProductData"
          ? "/api/admin/verify-product"
          : "/api/admin/unverify-product";

      const response =
        actionType === "requestProductData"
          ? await axios.get(endpoint, { params: { productID } })
          : await axios.post(endpoint, {
              productID,
              note,
              type: "UnVerifyProduct",
            });

      console.log("response", response);

      if (response.status === 200) {
        toast({
          title: `Success`,
          description:
            actionType === "requestProductData"
              ? `Product details retrieved successfully`
              : `Product verification status updated`,
        });
        if (actionType === "requestProductData") setProduct(response.data.data);
        console.log("response.data.data", response.data.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Operation failed: ${
          axios.isAxiosError(error) ? error.message : "Unknown error"
        }`,
      });
    } finally {
      actionType === "requestProductData"
        ? setIsLoading(false)
        : setIsProcessing(false);
    }
  };

  return (
    <section role="region" aria-label="Product Verification Management">
      {/* Page Header with Semantic HTML */}
      <header className="my-3 text-center">
        <h1 className="text-xl font-medium text-gray-600 dark:text-gray-200">
          Product Verification Management
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Administrative interface for product verification status updates
        </p>
      </header>

      {/* Product ID Input Section */}
      <div className="w-full max-w-sm mx-auto mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4">
            <form
              onSubmit={(e) => handleSubmission("requestProductData", e)}
              role="search"
              aria-label="Retrieve product data"
            >
              <div className="space-y-4">
                <input
                  className="block w-full px-4 py-2 dark:text-slate-200 placeholder-gray-500 bg-white dark:bg-gray-800 border rounded-lg"
                  aria-label="Product Identification Number"
                  type="text"
                  value={productID}
                  onChange={(e) => setProductID(e.target.value.trim())}
                  placeholder="Enter Product ID"
                  required
                  title="Please enter a valid 24-character Product ID"
                />
                <Button
                  type="submit"
                  className="w-full bg-udua-blue-primary hover:bg-blue-700"
                  aria-disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin w-5 h-5 mr-2" />
                      Retrieving Product...
                    </>
                  ) : (
                    "Retrieve Product Data"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      {product._id && (
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Action Header with ARIA Live Region */}
            <div
              className="flex flex-col sm:flex-row justify-between gap-4"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold truncate">{product.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="sr-only">Product Identifier:</span>
                  <Badge variant="outline" className="font-mono">
                    {product._id}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <Label
                  htmlFor="unverifyNote"
                  className="block text-sm font-medium"
                >
                  Unverification Rationale
                </Label>
                <input
                  id="unverifyNote"
                  className="w-full px-4 py-2 dark:text-slate-200 bg-white dark:bg-gray-800 border rounded-lg"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Document reason for unverification"
                  required
                  aria-required="true"
                />
                <Button
                  onClick={(e) => handleSubmission("UnVerifyProduct", e)}
                  className="gap-2 bg-udua-blue-primary hover:bg-blue-700"
                  aria-disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader className="animate-spin w-5 h-5 mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Revoke Product Verification"
                  )}
                </Button>
              </div>
            </div>

            {/* Product Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Product Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card aria-labelledby="productDetailsHeading">
                  <CardHeader className="border-b">
                    <CardTitle id="productDetailsHeading" className="text-lg">
                      Product Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {/* Product Description with Sanitized HTML */}
                    <section aria-labelledby="descriptionHeading">
                      <Label
                        id="descriptionHeading"
                        className="block font-medium mb-2"
                      >
                        Product Description
                      </Label>
                      <div
                        className="prose-sm border rounded-lg p-4 bg-gray-50"
                        dangerouslySetInnerHTML={{
                          __html: sanitizedContent.description,
                        }}
                        role="article"
                        aria-describedby="descriptionHeading"
                      />
                    </section>

                    {/* Technical Specifications */}
                    <section aria-labelledby="specsHeading">
                      <Label
                        id="specsHeading"
                        className="block font-medium mb-2"
                      >
                        Product Specification
                      </Label>
                      <div
                        className="prose-sm border rounded-lg p-4 bg-gray-50"
                        dangerouslySetInnerHTML={{
                          __html: sanitizedContent.specifications,
                        }}
                        role="article"
                        aria-describedby="specsHeading"
                      />
                    </section>
                  </CardContent>
                </Card>

                {/* Inventory Management Section */}
                <Card aria-labelledby="inventoryHeading">
                  <CardHeader className="border-b">
                    <CardTitle id="inventoryHeading" className="text-lg">
                      Inventory Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 grid gap-4">
                    {product.sizes?.length ? (
                      <>
                        <div className="grid grid-cols-3 gap-4 font-medium">
                          <span>Variant</span>
                          <span>Pricing</span>
                          <span>Stock Level</span>
                        </div>
                        {product.sizes.map((size, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-3 gap-4 py-2 border-t"
                          >
                            <span>{size.size}</span>
                            <span>{formatNaira(size.price)}</span>
                            <span>{size.quantity}</span>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No inventory variants available
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Price Management Section */}
                {product.price && (
                  <Card aria-labelledby="PriceHeading">
                    <CardHeader className="border-b">
                      <CardTitle id="PriceHeading" className="text-lg">
                        Product Price
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      Product price: {formatNaira(product.price)}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Supplementary Product Information */}
              <div className="space-y-6">
                {/* Verification Status Card */}
                <Card aria-labelledby="statusHeading">
                  <CardHeader className="border-b">
                    <CardTitle id="statusHeading" className="text-lg">
                      Verification Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 flex items-center gap-3">
                    {product.isVerifiedProduct ? (
                      <>
                        <CheckCircle2
                          aria-hidden="true"
                          className="h-6 w-6 text-green-600"
                        />
                        <span className="sr-only">Verified</span>
                        <p className="font-medium text-green-600">
                          Approved Product
                        </p>
                      </>
                    ) : (
                      <>
                        <Clock
                          aria-hidden="true"
                          className="h-6 w-6 text-yellow-600"
                        />
                        <span className="sr-only">Pending Verification</span>
                        <p className="font-medium text-yellow-600">
                          Awaiting Certification
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Product Media Gallery */}
                <Card aria-labelledby="mediaGalleryHeading">
                  <CardHeader className="border-b">
                    <CardTitle id="mediaGalleryHeading" className="text-lg">
                      Product Media Assets
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 grid grid-cols-2 gap-4">
                    {product.images?.map((img, index) => (
                      <div
                        key={index}
                        className="aspect-square relative rounded-lg overflow-hidden border"
                        role="group"
                        aria-label={`Product visual ${index + 1}`}
                      >
                        <Image
                          alt={`Visual representation of ${
                            product.name
                          } - View ${index + 1}`}
                          fill
                          className="object-cover"
                          src={img}
                          loading="lazy"
                          sizes="(max-width: 768px) 50vw, 33vw"
                          quality={80}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export const AdminUnVerifyProduct = withAdminAuth(UnVerifyProduct, {
  requiredPermissions: [PERMISSIONS.VERIFY_PRODUCT],
});
