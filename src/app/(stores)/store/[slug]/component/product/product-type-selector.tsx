"use client";

import { Label } from "@/components/ui/label";

type ProductTypeSelectorProps = {
  productType: string;
  onChange: (type: string) => void;
  options: string[];
};

const ProductTypeSelector = ({
  productType,
  onChange,
  options,
}: ProductTypeSelectorProps) => {
  return (
    <div className="grid gap-6">
      <div className="grid gap-3">
        <Label htmlFor="productType">Select Product Type</Label>
        <select
          id="productType"
          name="productType"
          value={productType}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400"
          aria-label="Select Product Type"
        >
          {options.map((type) => (
            <option key={type} value={type}>
              {type === "physicalproducts"
                ? `Physical Products`
                : `Digital Products`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductTypeSelector;
