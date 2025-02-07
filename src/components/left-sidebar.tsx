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
          <NavigationMenuContent className="w-[240px]">
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

// "use client";

// import { HeartPulseIcon } from "lucide-react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
//   navigationMenuTriggerStyle,
// } from "@/components/ui/navigation-menu";

// function Categories() {
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const router = useRouter();

//   const handleChange = (value: string) => {
//     // setTab(value);
//     const params = new URLSearchParams(searchParams);
//     if (value) {
//       params.set("categories", value);
//     } else {
//       params.delete("categories");
//     }
//     router.replace(`${pathname}?${params.toString()}`);
//   };

//   return (
//     <NavigationMenu className="custom-scrollbar">
//       <NavigationMenuList>
//         <NavigationMenuItem>
//           <NavigationMenuTrigger className=" hover:text-udua-orange-primary">
//             Categories
//           </NavigationMenuTrigger>
//           <NavigationMenuContent>
//             <div className="flex md:w-[200px] flex-1 flex-col gap-3 px-3 py-2 relative">
//               <ul className="flex flex-col gap-3">
//                 <li className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out">
//                   <a
//                     onClick={() => handleChange("Body Care Products")}
//                     className="flex gap-2"
//                   >
//                     <span>
//                       <HeartPulseIcon width={20} height={20} />
//                     </span>
//                     Health & Beauty
//                   </a>

//                   <div className="dropdown-menu1 bg-black border rounded">
//                     <ul>
//                       <li onClick={() => handleChange("Perfume skincare")}>
//                         <a>Skincare</a>
//                       </li>
//                       <li onClick={() => handleChange("Perfume makeup")}>
//                         <a>Makeup</a>
//                       </li>
//                     </ul>
//                   </div>
//                 </li>

//                 <li
//                   onClick={() => handleChange("home-office")}
//                   className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
//                 >
//                   <a
//                     onClick={() => handleChange("Perfume")}
//                     className="flex gap-2"
//                   >
//                     <span>
//                       <HeartPulseIcon width={20} height={20} />
//                     </span>
//                     Home & Office
//                   </a>

//                   <div className="dropdown-menu1 bg-black border rounded">
//                     <ul>
//                       <li
//                         onClick={() => handleChange("health-beauty skincare")}
//                       >
//                         <a>pens</a>
//                       </li>
//                       <li onClick={() => handleChange("health-beauty makeup")}>
//                         <a>books</a>
//                       </li>
//                     </ul>
//                   </div>
//                 </li>

//                 <li
//                   onClick={() => handleChange("appliances")}
//                   className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
//                 >
//                   <a
//                     onClick={() => handleChange("Perfume")}
//                     className="flex gap-2"
//                   >
//                     <span>
//                       <HeartPulseIcon width={20} height={20} />
//                     </span>
//                     Appliances
//                   </a>

//                   <div className="dropdown-menu1 bg-black border rounded">
//                     <ul>
//                       <li
//                         onClick={() => handleChange("health-beauty skincare")}
//                       >
//                         <a>fjgbvm</a>
//                       </li>
//                       <li onClick={() => handleChange("health-beauty makeup")}>
//                         <a>radio</a>
//                       </li>
//                     </ul>
//                   </div>
//                 </li>

//                 <li
//                   onClick={() => handleChange("phones-tablets")}
//                   className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
//                 >
//                   <a
//                     onClick={() => handleChange("Perfume")}
//                     className="flex gap-2"
//                   >
//                     <span>
//                       <HeartPulseIcon width={20} height={20} />
//                     </span>
//                     Phones & Tablets
//                   </a>

//                   <div className="dropdown-menu1 bg-black border rounded">
//                     <ul>
//                       <li
//                         onClick={() => handleChange("health-beauty skincare")}
//                       >
//                         <a>Phones</a>
//                       </li>
//                       <li onClick={() => handleChange("health-beauty makeup")}>
//                         <a>Tablets</a>
//                       </li>
//                     </ul>
//                   </div>
//                 </li>

//                 <li
//                   onClick={() => handleChange("computing")}
//                   className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
//                 >
//                   <a
//                     onClick={() => handleChange("Perfume")}
//                     className="flex gap-2"
//                   >
//                     <span>
//                       <HeartPulseIcon width={20} height={20} />
//                     </span>
//                     Computing
//                   </a>

//                   <div className="dropdown-menu1 bg-black border rounded">
//                     <ul>
//                       <li
//                         onClick={() => handleChange("health-beauty skincare")}
//                       >
//                         <a>Computers</a>
//                       </li>
//                       <li onClick={() => handleChange("health-beauty makeup")}>
//                         <a>Ipads</a>
//                       </li>
//                     </ul>
//                   </div>
//                 </li>

//                 <li
//                   onClick={() => handleChange("electronics")}
//                   className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
//                 >
//                   <a
//                     onClick={() => handleChange("Perfume")}
//                     className="flex gap-2"
//                   >
//                     <span>
//                       <HeartPulseIcon width={20} height={20} />
//                     </span>
//                     Electronics
//                   </a>

//                   <div className="dropdown-menu1 bg-black border rounded">
//                     <ul>
//                       <li
//                         onClick={() => handleChange("health-beauty skincare")}
//                       >
//                         <a>pads</a>
//                       </li>
//                       <li onClick={() => handleChange("health-beauty makeup")}>
//                         <a>box office</a>
//                       </li>
//                     </ul>
//                   </div>
//                 </li>

//                 <li
//                   onClick={() => handleChange("fashion")}
//                   className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
//                 >
//                   <a
//                     onClick={() => handleChange("Perfume")}
//                     className="flex gap-2"
//                   >
//                     <span>
//                       <HeartPulseIcon width={20} height={20} />
//                     </span>
//                     Fashion
//                   </a>

//                   <div className="dropdown-menu1 bg-black border rounded">
//                     <ul>
//                       <li
//                         onClick={() => handleChange("health-beauty skincare")}
//                       >
//                         <a>men's Fashion</a>
//                       </li>
//                       <li onClick={() => handleChange("health-beauty makeup")}>
//                         <a>children's clothing</a>
//                       </li>
//                     </ul>
//                   </div>
//                 </li>

//                 <li
//                   onClick={() => handleChange("gaming")}
//                   className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
//                 >
//                   <a
//                     onClick={() => handleChange("Perfume")}
//                     className="flex gap-2"
//                   >
//                     <span>
//                       <HeartPulseIcon width={20} height={20} />
//                     </span>
//                     Gaming
//                   </a>

//                   <div className="dropdown-menu1 bg-black border rounded">
//                     <ul>
//                       <li
//                         onClick={() => handleChange("health-beauty skincare")}
//                       >
//                         <a>pads</a>
//                       </li>
//                       <li onClick={() => handleChange("health-beauty makeup")}>
//                         <a>box office</a>
//                       </li>
//                     </ul>
//                   </div>
//                 </li>
//               </ul>
//             </div>
//           </NavigationMenuContent>
//         </NavigationMenuItem>
//       </NavigationMenuList>
//     </NavigationMenu>
//   );
// }

// export default Categories;
