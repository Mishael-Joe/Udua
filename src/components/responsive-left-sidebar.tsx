"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { MainNav } from "./main-nav";
import { siteConfig } from "@/config/site"

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
    <section className="custom-scrollbar flex h-96 w-full flex-col justify-between pb-5">
      <MainNav />
      <div className="flex w-full flex-1 flex-col gap-2 px-0 relative pt-4">
        <h1>Categories</h1>
        <ul className="flex flex-col gap-1">
          <li className="show-dropdown-menu cursor-pointer">
            <a onClick={() => handleChange("Perfume")}>Health & Beauty</a>

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
            className="show-dropdown-menu cursor-pointer"
          >
            <a>Home & Office</a>

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
            className="show-dropdown-menu cursor-pointer"
          >
            <a>Appliances</a>

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
            className="show-dropdown-menu cursor-pointer"
          >
            <a>Phones & Tablets</a>

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
            className="show-dropdown-menu cursor-pointer"
          >
            <a>Computing</a>

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
            className="show-dropdown-menu cursor-pointer"
          >
            <a>Electronics</a>

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
            className="show-dropdown-menu cursor-pointer"
          >
            <a>Fashion</a>

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
            className="show-dropdown-menu cursor-pointer"
          >
            <a>Gaming</a>

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

      {/* <Link href={"/seller-hub"} className="px-0">
        <Button className="mt-8 w-full bg-violet-600 py-5 text-base font-medium text-white hover:bg-violet-700">
          Sell on {siteConfig.name}
        </Button>
      </Link> */}
    </section>
  );
}

export default ResponsiveLeftSidebar;
