"use client";

import { useState } from "react";
import {
  ShoppingBagIcon,
  ShirtIcon,
  SofaIcon,
  ToyBrickIcon as ToyIcon,
  ShoppingCartIcon,
  PencilIcon,
  SparklesIcon,
  SmartphoneIcon,
  BookIcon,
  LaptopIcon,
  ChevronDownIcon,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { productCategories, subCategories } from "@/constant/constant";

// Convert category name with underscores to display format
export const formatCategoryName = (name: string): string => {
  return name.replace(/_/g, " ");
};

// Convert display format to category name with underscores
export const formatCategoryKey = (name: string): string => {
  return name.replace(/\s+/g, "_");
};

// Map categories to icons
export const getCategoryIcon = (category: string) => {
  const iconSize = { width: 20, height: 20 };

  switch (category) {
    case "Electronics":
      return <LaptopIcon {...iconSize} />;
    case "Clothing":
      return <ShirtIcon {...iconSize} />;
    case "Furniture":
      return <SofaIcon {...iconSize} />;
    case "Toys":
      return <ToyIcon {...iconSize} />;
    case "Groceries":
      return <ShoppingCartIcon {...iconSize} />;
    case "School Supplies":
      return <PencilIcon {...iconSize} />;
    case "Body Care Products":
      return <SparklesIcon {...iconSize} />;
    case "Fashion":
      return <ShoppingBagIcon {...iconSize} />;
    case "Phone Accessories":
      return <SmartphoneIcon {...iconSize} />;
    default:
      return <BookIcon {...iconSize} />;
  }
};

export default function Categories() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("categories", value);
    router.replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const CategoryItem = ({ category }: { category: string }) => {
    const categoryKey = formatCategoryKey(category);
    const hasSubcategories =
      subCategories[categoryKey] && subCategories[categoryKey].length > 0;

    return (
      <li className="group relative">
        <button
          onClick={() => handleCategoryChange(category.toLowerCase())}
          className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:text-udua-orange-primary dark:hover:text-udua-orange-primary"
        >
          {getCategoryIcon(category)}
          {category}
        </button>

        {hasSubcategories && (
          <div className="absolute right-full top-0 z-10 mr-1 hidden w-56 rounded border bg-white shadow-lg group-hover:block dark:bg-gray-800">
            <ul className="p-2">
              {subCategories[categoryKey].map((sub) => (
                <li key={sub}>
                  <button
                    onClick={() =>
                      handleCategoryChange(
                        `${category.toLowerCase()}-${sub
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`
                      )
                    }
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 hover:text-udua-orange-primary dark:hover:bg-gray-700 dark:hover:text-udua-orange-primary"
                  >
                    {sub}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium hover:text-udua-orange-primary focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Categories
        <ChevronDownIcon
          className={`ml-1 h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-10 mt-1 w-[220px] origin-top-left rounded-md border bg-white shadow-lg focus:outline-none dark:bg-gray-800">
          <ul className="flex flex-col gap-1 p-2">
            {productCategories.map((category) => (
              <CategoryItem key={category} category={category} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
