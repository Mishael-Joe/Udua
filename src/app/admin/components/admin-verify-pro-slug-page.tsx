"use client";

import React, { use } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import axios from "axios";
import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { addCommasToNumber } from "@/lib/utils";
import { CheckCircle2, Clock } from "lucide-react";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { withAdminAuth } from "../components/auth/with-admin-auth";

type Products = Omit<Product, "storeID" | "images" | "path" | "price"> & {
  price: string;
  images: ""[];
};

function VerifyProduct({ params }: { params: { slug: string } }) {
  const { toast } = useToast();
  //   console.log('params', params)
  const [product, setProduct] = useState<Products>({
    name: "",
    price: "",
    sizes: [],
    productQuantity: "",
    images: [""],
    description: "",
    specifications: "",
    category: "",
    subCategory: "",
    productType: "physicalproducts",
  });

  const sanitizedContentForDescription = DOMPurify.sanitize(
    product.description
  );

  const sanitizedContentForSpecifications = DOMPurify.sanitize(
    product.specifications
  );

  const fetchUserData = async () => {
    try {
      const response = await axios.post("/api/store/fetch-product", {
        productID: params.slug,
      });
      setProduct(response.data.product);
      // console.log(`response.data`, response.data.product);
    } catch (error: any) {
      console.error("Failed to fetch seller Products", error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  // console.log(`Product`, product);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/admin/verify-product", {
        productID: params.slug,
      });
      if (response.status === 200) {
        toast({
          variant: "default",
          title: `Error`,
          description: `Product verified.`,
        });
        fetchUserData();
      }
    } catch (error: any) {
      console.error("Failed to fetch seller Products", error.message);
      toast({
        variant: "default",
        title: `Error`,
        description: `Product verified.`,
      });
    }
  };

  return (
    <main className="flex flex-col py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Product ID:</span>
                <Badge variant="outline" className="font-mono">
                  {params.slug}
                </Badge>
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              className="gap-2 bg-udua-blue-primary hover:bg-blue-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Verify Product
            </Button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Details Card */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Name
                    </Label>
                    <p className="text-gray-900">{product.name}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Description
                    </Label>
                    <div
                      className="prose prose-sm border rounded-lg p-4 bg-gray-50"
                      dangerouslySetInnerHTML={{
                        __html: sanitizedContentForDescription,
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Specifications
                    </Label>
                    <div
                      className="prose prose-sm border rounded-lg p-4 bg-gray-50"
                      dangerouslySetInnerHTML={{
                        __html: sanitizedContentForSpecifications,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Inventory Card */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Pricing & Inventory</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {product.price === null ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">
                          Price
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900">
                            ₦{addCommasToNumber(parseFloat(product.price))}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">
                          Quantity
                        </Label>
                        <p className="text-gray-900">
                          {product.productQuantity}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 font-medium text-gray-600">
                        <span>Size</span>
                        <span>Price</span>
                        <span>Quantity</span>
                      </div>
                      {product.sizes?.map((size, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-3 gap-4 py-2 border-t"
                        >
                          <span className="text-gray-900">{size.size}</span>
                          <span className="text-gray-900">
                            ₦{addCommasToNumber(size.price)}
                          </span>
                          <span className="text-gray-900">{size.quantity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Status Card */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Verification Status</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    {product.isVerifiedProduct ? (
                      <>
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-medium text-green-600">Verified</p>
                          <p className="text-sm text-gray-500">
                            Verified on {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Clock className="h-6 w-6 text-yellow-600" />
                        <div>
                          <p className="font-medium text-yellow-600">
                            Pending Verification
                          </p>
                          <p className="text-sm text-gray-500">
                            Awaiting admin approval
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Category Card */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Classification</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-600">
                      Category
                    </Label>
                    <Badge variant="outline" className="text-gray-700">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-600">
                      Sub-category
                    </Label>
                    <Badge variant="outline" className="text-gray-700">
                      {product.subCategory}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Images Card */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Product Images</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {product.images.map((img, i) => (
                      <div
                        key={i}
                        className="aspect-square relative rounded-lg overflow-hidden border"
                      >
                        <Image
                          alt={`Product image ${i + 1}`}
                          fill
                          className="object-cover"
                          src={img}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export const VerifyProductPage = withAdminAuth(VerifyProduct, {
  requiredPermissions: [PERMISSIONS.VERIFY_PRODUCT],
});
