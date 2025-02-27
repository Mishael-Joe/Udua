// components/deals/Step1.tsx
import { Control, useWatch } from "react-hook-form";
import { DealFormValues } from "@/lib/validations/deal-validation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { shimmer, toBase64 } from "@/lib/image";
import { CombinedProduct } from "@/types";

interface Step1Props {
  control: Control<DealFormValues>;
  products: CombinedProduct[];
  selectedProducts: string[];
  setSelectedProducts: (prev: any) => void;
  dealType: string;
  setDealType: (type: string) => void;
  goNext: () => void;
}

const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  const blurData = useMemo(
    () => `data:image/svg+xml;base64,${toBase64(shimmer(200, 200))}`,
    []
  );

  return (
    <div>
      <Image
        placeholder="blur"
        blurDataURL={blurData}
        src={src}
        alt={alt}
        className="aspect-square rounded-md object-cover"
        height={100}
        width={100}
      />
    </div>
  );
};

export const Step1 = ({
  control,
  products,
  setSelectedProducts,
  dealType,
  goNext,
}: Step1Props) => {
  // Use `useWatch` to watch the value of `productIds` from react-hook-form
  const productIds = useWatch({
    control, // from react-hook-form
    name: "productIds", // field name to watch
    defaultValue: [], // initial value
  });

  // Update state when `productIds` changes
  useEffect(() => {
    setSelectedProducts(productIds); // Sync state with form value
  }, [productIds]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Select Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {products.map((product) => {
            const isPhysical = product.productType === "physicalproducts";
            const title = isPhysical ? product.name : product.title;
            const imageSrc = isPhysical
              ? product.images?.[0]
              : product.coverIMG?.[0];
            return (
              <div
                key={product._id}
                className="flex items-center p-4 border rounded-lg"
              >
                <input
                  type="checkbox"
                  id={product._id}
                  value={product._id}
                  {...control.register("productIds", { valueAsNumber: false })}
                />
                <label htmlFor={product._id} className="ml-2">
                  <div className="flex items-center gap-2 justify-between flex-wrap">
                    {imageSrc && (
                      <ProductImage src={imageSrc} alt={title || ""} />
                    )}
                    {product.name}
                  </div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Deal Type</h3>
        <select
          value={dealType}
          {...control.register("dealType", { valueAsNumber: false })}
          className="w-full p-2 mt-2 border rounded"
        >
          <option value="flash_sale">Flash Sale</option>
        </select>
      </div>

      <Button onClick={goNext} className="mt-6">
        Next
      </Button>
    </div>
  );
};
