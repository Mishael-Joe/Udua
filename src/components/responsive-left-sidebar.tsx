"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { siteConfig } from "@/config/site";
import { HeartPulseIcon } from "lucide-react";

function ResponsiveLeftSidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (value: string) => {
    // setTab(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("categories", value);
    } else {
      params.delete("categories");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <section className="custom-scrollbar flex w-full flex-col justify-between pb-5">
      <div className="h-36 w-full bg-udua-deep-gray-primary flex items-end">
        <p className="p-4 text-slate-100">
          <span className=" text-sm">Browse</span> <br />{" "}
          <span className=" font-semibold text-3xl">{siteConfig.name}</span>
        </p>
      </div>

      <div className="flex w-full flex-1 flex-col gap-2 relative">
        <h1 className=" font-semibold border-b border-udua-deep-gray-primary py-4">
          <span className="px-4">Top Categories</span>
        </h1>

        <ul className="flex flex-col gap-3 px-4 pb-6 pt-3 border-b border-udua-deep-gray-primary">
          <li className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out">
            <a onClick={() => handleChange("Perfume")} className="flex gap-2">
              <span>
                <HeartPulseIcon width={20} height={20}/>
              </span>
              Health & Beauty
            </a>

            <div className="dropdown-menu1 bg-black border rounded">
              <ul>
                <li onClick={() => handleChange("Perfume skincare")}>
                  <a>Skincare</a>
                </li>
                <li onClick={() => handleChange("Perfume makeup")}>
                  <a>Makeup</a>
                </li>
              </ul>
            </div>
          </li>

          <li
            onClick={() => handleChange("home-office")}
            className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
          >
            <a onClick={() => handleChange("Perfume")} className="flex gap-2">
              <span>
                <HeartPulseIcon width={20} height={20}/>
              </span>
              Home & Office
            </a>

            <div className="dropdown-menu1 bg-black border rounded">
              <ul>
                <li onClick={() => handleChange("health-beauty skincare")}>
                  <a>pens</a>
                </li>
                <li onClick={() => handleChange("health-beauty makeup")}>
                  <a>books</a>
                </li>
              </ul>
            </div>
          </li>

          <li
            onClick={() => handleChange("appliances")}
            className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
          >
            <a onClick={() => handleChange("Perfume")} className="flex gap-2">
              <span>
                <HeartPulseIcon width={20} height={20}/>
              </span>
              Appliances
            </a>

            <div className="dropdown-menu1 bg-black border rounded">
              <ul>
                <li onClick={() => handleChange("health-beauty skincare")}>
                  <a>fjgbvm</a>
                </li>
                <li onClick={() => handleChange("health-beauty makeup")}>
                  <a>radio</a>
                </li>
              </ul>
            </div>
          </li>

          <li
            onClick={() => handleChange("phones-tablets")}
            className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
          >
            <a onClick={() => handleChange("Perfume")} className="flex gap-2">
              <span>
                <HeartPulseIcon width={20} height={20}/>
              </span>
              Phones & Tablets
            </a>

            <div className="dropdown-menu1 bg-black border rounded">
              <ul>
                <li onClick={() => handleChange("health-beauty skincare")}>
                  <a>Phones</a>
                </li>
                <li onClick={() => handleChange("health-beauty makeup")}>
                  <a>Tablets</a>
                </li>
              </ul>
            </div>
          </li>

          <li
            onClick={() => handleChange("computing")}
            className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
          >
            <a onClick={() => handleChange("Perfume")} className="flex gap-2">
              <span>
                <HeartPulseIcon width={20} height={20}/>
              </span>
              Computing
            </a>

            <div className="dropdown-menu1 bg-black border rounded">
              <ul>
                <li onClick={() => handleChange("health-beauty skincare")}>
                  <a>Computers</a>
                </li>
                <li onClick={() => handleChange("health-beauty makeup")}>
                  <a>Ipads</a>
                </li>
              </ul>
            </div>
          </li>

          <li
            onClick={() => handleChange("electronics")}
            className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
          >
            <a onClick={() => handleChange("Perfume")} className="flex gap-2">
              <span>
                <HeartPulseIcon width={20} height={20}/>
              </span>
              Electronics
            </a>

            <div className="dropdown-menu1 bg-black border rounded">
              <ul>
                <li onClick={() => handleChange("health-beauty skincare")}>
                  <a>pads</a>
                </li>
                <li onClick={() => handleChange("health-beauty makeup")}>
                  <a>box office</a>
                </li>
              </ul>
            </div>
          </li>

          <li
            onClick={() => handleChange("fashion")}
            className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
          >
            <a onClick={() => handleChange("Perfume")} className="flex gap-2">
              <span>
                <HeartPulseIcon width={20} height={20}/>
              </span>
              Fashion
            </a>

            <div className="dropdown-menu1 bg-black border rounded">
              <ul>
                <li onClick={() => handleChange("health-beauty skincare")}>
                  <a>men's Fashion</a>
                </li>
                <li onClick={() => handleChange("health-beauty makeup")}>
                  <a>children's clothing</a>
                </li>
              </ul>
            </div>
          </li>

          <li
            onClick={() => handleChange("gaming")}
            className="show-dropdown-menu cursor-pointer dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
          >
            <a onClick={() => handleChange("Perfume")} className="flex gap-2">
              <span>
                <HeartPulseIcon width={20} height={20}/>
              </span>
              Gaming
            </a>

            <div className="dropdown-menu1 bg-black border rounded">
              <ul>
                <li onClick={() => handleChange("health-beauty skincare")}>
                  <a>pads</a>
                </li>
                <li onClick={() => handleChange("health-beauty makeup")}>
                  <a>box office</a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>

      <div className="px-4 py-2">
        <h1><span className=" text-sm">Useful Links</span></h1>
      </div>

      {/* <Link href={"/seller-hub"} className="px-0">
        <Button className="mt-8 w-full bg-violet-600 py-5 text-base font-medium text-white hover:bg-violet-700">
          Sell on {siteConfig.name}
        </Button>
      </Link> */}
    </section>
  );
}

export default ResponsiveLeftSidebar;
