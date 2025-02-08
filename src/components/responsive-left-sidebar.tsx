"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { siteConfig } from "@/config/site";
import { HeartPulseIcon } from "lucide-react";

interface CategoryItem {
  name: string;
  value: string;
  icon: React.ReactNode;
  subcategories: Array<{ name: string; value: string }>;
}

export default function ResponsiveLeftSidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("categories", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const categories: CategoryItem[] = [
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

  const CategoryItem = ({ item }: { item: CategoryItem }) => (
    <li className="group relative">
      <button
        onClick={() => handleCategoryChange(item.value)}
        className="flex w-full items-center gap-2 px-4 py-2 transition-colors hover:text-udua-orange-primary dark:hover:text-udua-orange-primary"
        aria-expanded="false"
        aria-controls={`submenu-${item.value}`}
      >
        {item.icon}
        {item.name}
      </button>

      <div
        id={`submenu-${item.value}`}
        className="invisible absolute left-full top-0 z-10 ml-1 w-48 rounded border bg-white shadow-lg group-hover:visible dark:bg-gray-800"
      >
        <ul className="p-2">
          {item.subcategories.map((sub) => (
            <li key={sub.value}>
              <button
                onClick={() =>
                  handleCategoryChange(`${item.value}-${sub.value}`)
                }
                className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {sub.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );

  return (
    <section className="custom-scrollbar flex w-full flex-col pb-5">
      <div className="flex h-36 w-full items-end bg-udua-deep-gray-primary">
        <div className="p-4 text-slate-100">
          <span className="text-sm">Browse</span>
          <h2 className="text-3xl font-semibold">{siteConfig.name}</h2>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col">
        <h1 className="border-b border-udua-deep-gray-primary py-4 px-4 font-semibold">
          Top Categories
        </h1>

        <ul className="flex flex-col gap-3 border-b border-udua-deep-gray-primary px-4 pb-6 pt-3">
          {categories.map((category) => (
            <CategoryItem key={category.value} item={category} />
          ))}
        </ul>
      </div>

      <div className="px-4 py-2">
        <h2 className="text-sm">Useful Links</h2>
        <Link href="/seller-hub" className="mt-4 block">
          <Button className="w-full bg-violet-600 py-5 text-base font-medium text-white hover:bg-violet-700">
            Sell on {siteConfig.name}
          </Button>
        </Link>
      </div>
    </section>
  );
}

// "use client";

// import Link from "next/link";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { Button } from "./ui/button";
// import { siteConfig } from "@/config/site";
// import { HeartPulseIcon } from "lucide-react";

// function ResponsiveLeftSidebar() {
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
//     <section className="custom-scrollbar flex w-full flex-col justify-between pb-5">
//       <div className="h-36 w-full bg-udua-deep-gray-primary flex items-end">
//         <p className="p-4 text-slate-100">
//           <span className=" text-sm">Browse</span> <br />{" "}
//           <span className=" font-semibold text-3xl">{siteConfig.name}</span>
//         </p>
//       </div>

//       <div className="flex w-full flex-1 flex-col gap-2 relative">
//         <h1 className=" font-semibold border-b border-udua-deep-gray-primary py-4">
//           <span className="px-4">Top Categories</span>
//         </h1>

//         <ul className="flex flex-col gap-3 px-4 pb-6 pt-3 border-b border-udua-deep-gray-primary">
//           <li className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out">
//             <a onClick={() => handleChange("Perfume")} className="flex gap-2">
//               <span>
//                 <HeartPulseIcon width={20} height={20}/>
//               </span>
//               Health & Beauty
//             </a>

//             <div className="dropdown-menu1 bg-black border rounded">
//               <ul>
//                 <li onClick={() => handleChange("Perfume skincare")}>
//                   <a>Skincare</a>
//                 </li>
//                 <li onClick={() => handleChange("Perfume makeup")}>
//                   <a>Makeup</a>
//                 </li>
//               </ul>
//             </div>
//           </li>

//           <li
//             onClick={() => handleChange("home-office")}
//             className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
//           >
//             <a onClick={() => handleChange("Perfume")} className="flex gap-2">
//               <span>
//                 <HeartPulseIcon width={20} height={20}/>
//               </span>
//               Home & Office
//             </a>

//             <div className="dropdown-menu1 bg-black border rounded">
//               <ul>
//                 <li onClick={() => handleChange("health-beauty skincare")}>
//                   <a>pens</a>
//                 </li>
//                 <li onClick={() => handleChange("health-beauty makeup")}>
//                   <a>books</a>
//                 </li>
//               </ul>
//             </div>
//           </li>

//           <li
//             onClick={() => handleChange("appliances")}
//             className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
//           >
//             <a onClick={() => handleChange("Perfume")} className="flex gap-2">
//               <span>
//                 <HeartPulseIcon width={20} height={20}/>
//               </span>
//               Appliances
//             </a>

//             <div className="dropdown-menu1 bg-black border rounded">
//               <ul>
//                 <li onClick={() => handleChange("health-beauty skincare")}>
//                   <a>fjgbvm</a>
//                 </li>
//                 <li onClick={() => handleChange("health-beauty makeup")}>
//                   <a>radio</a>
//                 </li>
//               </ul>
//             </div>
//           </li>

//           <li
//             onClick={() => handleChange("phones-tablets")}
//             className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
//           >
//             <a onClick={() => handleChange("Perfume")} className="flex gap-2">
//               <span>
//                 <HeartPulseIcon width={20} height={20}/>
//               </span>
//               Phones & Tablets
//             </a>

//             <div className="dropdown-menu1 bg-black border rounded">
//               <ul>
//                 <li onClick={() => handleChange("health-beauty skincare")}>
//                   <a>Phones</a>
//                 </li>
//                 <li onClick={() => handleChange("health-beauty makeup")}>
//                   <a>Tablets</a>
//                 </li>
//               </ul>
//             </div>
//           </li>

//           <li
//             onClick={() => handleChange("computing")}
//             className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
//           >
//             <a onClick={() => handleChange("Perfume")} className="flex gap-2">
//               <span>
//                 <HeartPulseIcon width={20} height={20}/>
//               </span>
//               Computing
//             </a>

//             <div className="dropdown-menu1 bg-black border rounded">
//               <ul>
//                 <li onClick={() => handleChange("health-beauty skincare")}>
//                   <a>Computers</a>
//                 </li>
//                 <li onClick={() => handleChange("health-beauty makeup")}>
//                   <a>Ipads</a>
//                 </li>
//               </ul>
//             </div>
//           </li>

//           <li
//             onClick={() => handleChange("electronics")}
//             className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
//           >
//             <a onClick={() => handleChange("Perfume")} className="flex gap-2">
//               <span>
//                 <HeartPulseIcon width={20} height={20}/>
//               </span>
//               Electronics
//             </a>

//             <div className="dropdown-menu1 bg-black border rounded">
//               <ul>
//                 <li onClick={() => handleChange("health-beauty skincare")}>
//                   <a>pads</a>
//                 </li>
//                 <li onClick={() => handleChange("health-beauty makeup")}>
//                   <a>box office</a>
//                 </li>
//               </ul>
//             </div>
//           </li>

//           <li
//             onClick={() => handleChange("fashion")}
//             className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
//           >
//             <a onClick={() => handleChange("Perfume")} className="flex gap-2">
//               <span>
//                 <HeartPulseIcon width={20} height={20}/>
//               </span>
//               Fashion
//             </a>

//             <div className="dropdown-menu1 bg-black border rounded">
//               <ul>
//                 <li onClick={() => handleChange("health-beauty skincare")}>
//                   <a>men's Fashion</a>
//                 </li>
//                 <li onClick={() => handleChange("health-beauty makeup")}>
//                   <a>children's clothing</a>
//                 </li>
//               </ul>
//             </div>
//           </li>

//           <li
//             onClick={() => handleChange("gaming")}
//             className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
//           >
//             <a onClick={() => handleChange("Perfume")} className="flex gap-2">
//               <span>
//                 <HeartPulseIcon width={20} height={20}/>
//               </span>
//               Gaming
//             </a>

//             <div className="dropdown-menu1 bg-black border rounded">
//               <ul>
//                 <li onClick={() => handleChange("health-beauty skincare")}>
//                   <a>pads</a>
//                 </li>
//                 <li onClick={() => handleChange("health-beauty makeup")}>
//                   <a>box office</a>
//                 </li>
//               </ul>
//             </div>
//           </li>
//         </ul>
//       </div>

//       <div className="px-4 py-2">
//         <h1><span className=" text-sm">Useful Links</span></h1>
//       </div>

//       {/* <Link href={"/seller-hub"} className="px-0">
//         <Button className="mt-8 w-full bg-violet-600 py-5 text-base font-medium text-white hover:bg-violet-700">
//           Sell on {siteConfig.name}
//         </Button>
//       </Link> */}
//     </section>
//   );
// }

// export default ResponsiveLeftSidebar;
