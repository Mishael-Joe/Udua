"use client";

import { HeartPulseIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface Category {
  name: string;
  value: string;
  icon: React.ReactNode;
  subcategories: Array<{ name: string; value: string }>;
}

export default function Categories() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("categories", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const categories: Category[] = [
    {
      name: "Health & Beauty",
      value: "health-beauty",
      icon: <HeartPulseIcon width={20} height={20} />,
      subcategories: [
        { name: "Skincare", value: "skincare" },
        { name: "Makeup", value: "makeup" },
      ],
    },
    {
      name: "Home & Office",
      value: "home-office",
      icon: <HeartPulseIcon width={20} height={20} />,
      subcategories: [
        { name: "Pens", value: "pens" },
        { name: "Books", value: "books" },
      ],
    },
    {
      name: "Appliances",
      value: "appliances",
      icon: <HeartPulseIcon width={20} height={20} />,
      subcategories: [
        { name: "Kitchen", value: "kitchen" },
        { name: "Radio", value: "radio" },
      ],
    },
    {
      name: "Phones & Tablets",
      value: "phones-tablets",
      icon: <HeartPulseIcon width={20} height={20} />,
      subcategories: [
        { name: "Phones", value: "phones" },
        { name: "Tablets", value: "tablets" },
      ],
    },
    {
      name: "Computing",
      value: "computing",
      icon: <HeartPulseIcon width={20} height={20} />,
      subcategories: [
        { name: "Computers", value: "computers" },
        { name: "Ipads", value: "ipads" },
      ],
    },
    {
      name: "Electronics",
      value: "electronics",
      icon: <HeartPulseIcon width={20} height={20} />,
      subcategories: [
        { name: "Audio", value: "audio" },
        { name: "Accessories", value: "accessories" },
      ],
    },
    {
      name: "Fashion",
      value: "fashion",
      icon: <HeartPulseIcon width={20} height={20} />,
      subcategories: [
        { name: "Men's", value: "mens" },
        { name: "Children's", value: "childrens" },
      ],
    },
    {
      name: "Gaming",
      value: "gaming",
      icon: <HeartPulseIcon width={20} height={20} />,
      subcategories: [
        { name: "Consoles", value: "consoles" },
        { name: "Accessories", value: "accessories" },
      ],
    },
  ];

  const CategoryItem = ({ category }: { category: Category }) => (
    <li className="group relative">
      <button
        onClick={() => handleCategoryChange(category.value)}
        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:text-udua-orange-primary dark:hover:text-udua-orange-primary"
      >
        {category.icon}
        {category.name}
      </button>

      {category.subcategories.length > 0 && (
        <div className="absolute left-full top-0 z-10 ml-1 hidden w-48 rounded border bg-white shadow-lg group-hover:block dark:bg-gray-800">
          <ul className="p-2">
            {category.subcategories.map((sub) => (
              <li key={sub.value}>
                <button
                  onClick={() =>
                    handleCategoryChange(`${category.value}-${sub.value}`)
                  }
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {sub.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="hover:text-udua-orange-primary">
            Categories
          </NavigationMenuTrigger>
          <NavigationMenuContent className="md:w-[200px]">
            <ul className="flex flex-col gap-1 p-2">
              {categories.map((category) => (
                <CategoryItem key={category.value} category={category} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
