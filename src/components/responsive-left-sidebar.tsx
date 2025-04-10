"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { siteConfig } from "@/config/site";
import { formatCategoryKey, getCategoryIcon } from "./left-sidebar";
import { productCategories } from "@/constant/constant";

export default function ResponsiveLeftSidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("categories", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const CategoryItem = ({ category }: { category: string }) => {
    const categoryKey = formatCategoryKey(category);

    return (
      <li className="group relative">
        <button
          onClick={() => handleCategoryChange(category.toLowerCase())}
          className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:text-udua-orange-primary dark:hover:text-udua-orange-primary"
        >
          {getCategoryIcon(category)}
          {category}
        </button>
      </li>
    );
  };

  return (
    <section className="custom-scrollbar flex w-full flex-col pb-5 h-full">
      <div className="flex h-40 w-full items-end bg-udua-deep-gray-primary">
        <div className="p-4 text-slate-100">
          <span className="text-sm">Browse</span>
          <h2 className="text-3xl font-semibold">{siteConfig.name}</h2>
        </div>
      </div>

      <div className=" overflow-y-auto overflow-x-hidden">
        <div className="flex w-full flex-1 flex-col">
          <h1 className="border-b border-udua-deep-gray-primary py-4 px-4 font-semibold">
            Top Categories
          </h1>

          <ul className="flex flex-col gap-3 border-b border-udua-deep-gray-primary px-4 pb-6 pt-3">
            {productCategories.map((category) => (
              <CategoryItem key={category} category={category} />
            ))}
          </ul>
        </div>

        <div className="px-4 py-2">
          {/* <h2 className="text-sm">Useful Links</h2> */}
          <Link href="/partner-with-udua" className="mt-4 block">
            <Button className="w-full bg-udua-orange-primary/90 py-5 text-base font-medium text-white hover:bg-udua-orange-primary">
              Partner with {siteConfig.name}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
