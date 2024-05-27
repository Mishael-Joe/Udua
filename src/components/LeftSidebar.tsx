"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

function LeftSidebar({ onCategoryData }: (categoryData: string) => void) {
  const router = useRouter();
  const pathname = usePathname();

  const handleCategoryClick = async (category: string, k?: string) => {
    try {
      const res = await fetch(`/api/categories/${category}`);
      const result = await res.json();

      if (result.success) {
        onCategoryData(result.data);
      } else {
        console.error("Failed to fetch category data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-3 pl-6 relative">
        <h1>Categories</h1>
        <ul className="flex flex-col gap-1">
          <li className="show-dropdown-menu1 cursor-pointer">
            <a onClick={() => handleCategoryClick("health-beauty")}>
              Health & Beauty
            </a>

            <div className="dropdown-menu1 bg-black border rounded">
              <ul>
                <li
                  onClick={() =>
                    handleCategoryClick("health-beauty", "skincare")
                  }
                >
                  <a>Skincare</a>
                </li>
                <li
                  onClick={() => handleCategoryClick("health-beauty", "makeup")}
                >
                  <a>Makeup</a>
                </li>
              </ul>
            </div>
          </li>

          <li
            onClick={() => handleCategoryClick("home-office")}
            className="show-dropdown-menu1 cursor-pointer"
          >
            <a>Home & Office</a>

            <div className="dropdown-menu1 bg-black border rounded">
              <ul>
                <li
                  onClick={() =>
                    handleCategoryClick("health-beauty", "skincare")
                  }
                >
                  <a>pens</a>
                </li>
                <li
                  onClick={() => handleCategoryClick("health-beauty", "makeup")}
                >
                  <a>books</a>
                </li>
              </ul>
            </div>
          </li>

          <li
            onClick={() => handleCategoryClick("appliances")}
            className="show-dropdown-menu1 cursor-pointer"
          >
            <a>Appliances</a>

            <div className="dropdown-menu1 bg-black border rounded">
              <ul>
                <li
                  onClick={() =>
                    handleCategoryClick("health-beauty", "skincare")
                  }
                >
                  <a>fjgbvm</a>
                </li>
                <li
                  onClick={() => handleCategoryClick("health-beauty", "makeup")}
                >
                  <a>radio</a>
                </li>
              </ul>
            </div>
          </li>

          <li
            onClick={() => handleCategoryClick("phones-tablets")}
            className="show-dropdown-menu1 cursor-pointer"
          >
            <a>Phones & Tablets</a>

            <div className="dropdown-menu1 bg-black border rounded">
              <ul>
                <li
                  onClick={() =>
                    handleCategoryClick("health-beauty", "skincare")
                  }
                >
                  <a>Phones</a>
                </li>
                <li
                  onClick={() => handleCategoryClick("health-beauty", "makeup")}
                >
                  <a>Tablets</a>
                </li>
              </ul>
            </div>
          </li>

          <li
            onClick={() => handleCategoryClick("computing")}
            className="show-dropdown-menu1 cursor-pointer"
          >
            <a>Computing</a>

            <div className="dropdown-menu1 bg-black border rounded">
              <ul>
                <li
                  onClick={() =>
                    handleCategoryClick("health-beauty", "skincare")
                  }
                >
                  <a>Computers</a>
                </li>
                <li
                  onClick={() => handleCategoryClick("health-beauty", "makeup")}
                >
                  <a>Ipads</a>
                </li>
              </ul>
            </div>
          </li>

          <li
            onClick={() => handleCategoryClick("electronics")}
            className="show-dropdown-menu1 cursor-pointer"
          >
            <a>Electronics</a>

            <div className="dropdown-menu1 bg-black border rounded">
              <ul>
                <li
                  onClick={() =>
                    handleCategoryClick("health-beauty", "skincare")
                  }
                >
                  <a>pads</a>
                </li>
                <li
                  onClick={() => handleCategoryClick("health-beauty", "makeup")}
                >
                  <a>box office</a>
                </li>
              </ul>
            </div>
          </li>

          <li
            onClick={() => handleCategoryClick("fashion")}
            className="show-dropdown-menu1 cursor-pointer"
          >
            <a>Fashion</a>

            <div className="dropdown-menu1 bg-black border rounded">
              <ul>
                <li
                  onClick={() =>
                    handleCategoryClick("health-beauty", "skincare")
                  }
                >
                  <a>men's Fashion</a>
                </li>
                <li
                  onClick={() => handleCategoryClick("health-beauty", "makeup")}
                >
                  <a>children's clothing</a>
                </li>
              </ul>
            </div>
          </li>

          <li
            onClick={() => handleCategoryClick("gaming")}
            className="show-dropdown-menu1 cursor-pointer"
          >
            <a>Gaming</a>

            <div className="dropdown-menu1 bg-black border rounded">
              <ul>
                <li
                  onClick={() =>
                    handleCategoryClick("health-beauty", "skincare")
                  }
                >
                  <a>pads</a>
                </li>
                <li
                  onClick={() => handleCategoryClick("health-beauty", "makeup")}
                >
                  <a>box office</a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>

      <Link href={"/seller-hub"} className="px-4">
        <Button className="mt-8 w-full bg-violet-600 py-5 text-base font-medium text-white hover:bg-violet-700">
          Sell on Alfa
        </Button>
      </Link>
    </section>
  );
}

export default LeftSidebar;
