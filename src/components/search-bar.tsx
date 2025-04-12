"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";

function SearchBar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultSearchQuery = searchParams.get("search") ?? "";
  const [query, setQuery] = useState(defaultSearchQuery);

  // const displaySearchInput = pathname.endsWith("/");
  const displaySearchInput = pathname.startsWith("/");

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Suspense fallback={`search`}>
      <div>
        {displaySearchInput && (
          <form onSubmit={handleSubmit} className=" relative flex">
            <Input
              id="search"
              name="search"
              type="search"
              autoComplete="off"
              placeholder="Search products..."
              className="h-9 md:w-[370px] lg:w-[580px] hover:border-udua-orange-primary delay-75 transition-all ease-in-out  focus:!ring-white focus:border-udua-orange-primary focus:!outline-none focus:!ring-1 focus:!ring-opacity-90"
              defaultValue={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button className="absolute h-9 w-9 right-0 bg-udua-orange-primary rounded-l-xs rounded-r p-0 hover:bg-udua-orange-primary">
              <div className="flex justify-center items-center">
                <Image
                  src={"/svg-icons/search-gray.svg"}
                  height={20}
                  width={20}
                  alt={"search-icon"}
                />
              </div>
            </Button>
          </form>
        )}
      </div>
    </Suspense>
  );
}

export default SearchBar;
