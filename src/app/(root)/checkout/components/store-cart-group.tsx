"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatCurrency } from "@/lib/utils";
import ProductItem from "./product-item";
import { Truck } from "lucide-react";
import { GroupedCart, ShippingMethod } from "../page";

interface StoreCartGroupProps {
  storeGroup: GroupedCart;
  onShippingMethodChange: (method: ShippingMethod) => void;
  selectedShippingMethod: ShippingMethod;
}

export default function StoreCartGroup({
  storeGroup,
  onShippingMethodChange,
  selectedShippingMethod,
}: StoreCartGroupProps) {
  const [storeName, setStoreName] = useState<string>("");

  useEffect(() => {
    // In a real app, you would fetch the store name using the storeID
    // For now, we'll use a placeholder
    setStoreName(`Store ${storeGroup.storeID.substring(0, 5)}`);
  }, [storeGroup.storeID]);

  // Extract the actual product data from the complex structure
  const normalizedProducts = storeGroup.products.map((item: any) => {
    // console.log("item", item);
    // Extract the actual product data from _doc
    const productData = item._doc || item;

    // Extract the product details
    const product = productData.product;

    // Get the selected size if it exists
    const selectedSize = productData.selectedSize || null;

    return {
      _id: productData._id,
      product,
      quantity: productData.quantity,
      productType: productData.productType,
      selectedSize,
      price: item.price, // This was calculated in the API
    };
  });

  const handleShippingMethodChange = (methodName: string) => {
    const selectedMethod = storeGroup.shippingMethods!.find(
      (method: ShippingMethod) => method.name === methodName
    );
    onShippingMethodChange(selectedMethod!);
  };

  // Check if this store has any physical products that require shipping
  const hasPhysicalProducts = normalizedProducts.some(
    (p) => p.productType === "physicalproducts"
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-xl">{storeName}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {normalizedProducts.map((item: any) => (
            <ProductItem key={item._id} item={item} />
          ))}
        </div>

        <Separator className="my-6" />

        <Accordion type="single" collapsible defaultValue="shipping-methods">
          <AccordionItem value="shipping-methods" className="border-none">
            <AccordionTrigger className="py-2 hover:no-underline">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span className="font-medium">Shipping Method</span>
                {selectedShippingMethod && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({selectedShippingMethod.name}:{" "}
                    {formatCurrency(selectedShippingMethod.price)})
                  </span>
                )}
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-4">
              {storeGroup.shippingMethods &&
              storeGroup.shippingMethods.length > 0 ? (
                <RadioGroup
                  value={selectedShippingMethod?.name || ""}
                  onValueChange={handleShippingMethodChange}
                  className="space-y-3"
                >
                  {storeGroup.shippingMethods.map((method: ShippingMethod) => (
                    <div
                      key={method.name}
                      className="flex items-center space-x-2 rounded-md border p-3"
                    >
                      <RadioGroupItem
                        value={method.name}
                        id={`shipping-${method.name}`}
                      />
                      <Label
                        htmlFor={`shipping-${method.name}`}
                        className="flex flex-1 justify-between cursor-pointer"
                      >
                        <div>
                          <span className="font-medium">{method.name}</span>
                          {method.estimatedDeliveryDays && (
                            <p className="text-sm text-muted-foreground">
                              Estimated delivery: {method.estimatedDeliveryDays}{" "}
                              days
                            </p>
                          )}
                          {method.description && (
                            <p className="text-sm text-muted-foreground">
                              {method.description}
                            </p>
                          )}
                        </div>
                        <span className="font-medium">
                          {formatCurrency(method.price)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="rounded-md border p-3 bg-muted/30">
                  {hasPhysicalProducts ? (
                    <p className="text-muted-foreground">
                      No shipping methods available for this store.
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      Digital products don't require shipping.
                    </p>
                  )}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { formatCurrency } from "@/lib/utils";
// import ProductItem from "./product-item";

// interface StoreCartGroupProps {
//   storeGroup: any;
//   onShippingMethodChange: (method: any) => void;
//   selectedShippingMethod: any;
// }

// export default function StoreCartGroup({
//   storeGroup,
//   onShippingMethodChange,
//   selectedShippingMethod,
// }: StoreCartGroupProps) {
//   const [storeName, setStoreName] = useState<string>("");

//   useEffect(() => {
//     // In a real app, you would fetch the store name using the storeID
//     // For now, we'll use a placeholder
//     setStoreName(`Store ${storeGroup.storeID.substring(0, 5)}`);
//   }, [storeGroup.storeID]);

//   // Extract the actual product data from the complex structure
//   const normalizedProducts = storeGroup.products.map((item: any) => {
//     // Extract the actual product data from _doc
//     const productData = item._doc || item;

//     // Extract the product details
//     const product = productData.product;

//     // Get the selected size if it exists
//     const selectedSize = productData.selectedSize || null;

//     return {
//       _id: productData._id,
//       product,
//       quantity: productData.quantity,
//       productType: productData.productType,
//       selectedSize,
//       price: item.price, // This was calculated in the API
//     };
//   });

//   const handleShippingMethodChange = (value: string) => {
//     const selectedMethod = storeGroup.shippingMethods.find(
//       (method: any) => method._id === value
//     );
//     onShippingMethodChange(selectedMethod);
//   };

//   return (
//     <Card className="overflow-hidden">
//       <CardHeader className="bg-muted/30">
//         <CardTitle className="text-xl">{storeName}</CardTitle>
//       </CardHeader>
//       <CardContent className="p-6">
//         <div className="space-y-4">
//           {normalizedProducts.map((item: any) => (
//             <ProductItem key={item._id} item={item} />
//           ))}
//         </div>

//         <Separator className="my-6" />

//         <div className="space-y-4">
//           <h3 className="font-medium">Shipping Method</h3>

//           {storeGroup.shippingMethods &&
//           storeGroup.shippingMethods.length > 0 ? (
//             <RadioGroup
//               value={selectedShippingMethod?._id || ""}
//               onValueChange={handleShippingMethodChange}
//               className="space-y-3"
//             >
//               {storeGroup.shippingMethods.map((method: any) => (
//                 <div
//                   key={method._id}
//                   className="flex items-center space-x-2 rounded-md border p-3"
//                 >
//                   <RadioGroupItem
//                     value={method._id}
//                     id={`shipping-${method._id}`}
//                   />
//                   <Label
//                     htmlFor={`shipping-${method._id}`}
//                     className="flex flex-1 justify-between cursor-pointer"
//                   >
//                     <div>
//                       <span className="font-medium">{method.name}</span>
//                       {method.estimatedDeliveryDays && (
//                         <p className="text-sm text-muted-foreground">
//                           Estimated delivery: {method.estimatedDeliveryDays}{" "}
//                           days
//                         </p>
//                       )}
//                       {method.description && (
//                         <p className="text-sm text-muted-foreground">
//                           {method.description}
//                         </p>
//                       )}
//                     </div>
//                     <span className="font-medium">
//                       {formatCurrency(method.price)}
//                     </span>
//                   </Label>
//                 </div>
//               ))}
//             </RadioGroup>
//           ) : (
//             <div className="rounded-md border p-3 bg-muted/30">
//               <p className="text-muted-foreground">
//                 No shipping methods available for this store.
//               </p>
//               {normalizedProducts.some(
//                 (p: any) => p.productType === "digitalproducts"
//               ) && (
//                 <p className="text-sm mt-1">
//                   Digital products don't require shipping.
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
