"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";

function SearchBar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultSearchQuery = searchParams.get("search") ?? "";

  const displaySearchInput = pathname.endsWith("/");

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get("search");
    router.push(`/?search=${searchQuery}`);
    router.refresh();
    // console.log(searchQuery);
  };
  return (
    <Suspense fallback={`search`}>
      <div>
        {displaySearchInput && (
          <form onKeyUp={handleSubmit} className="">
            <Input
              id="search"
              name="search"
              type="search"
              autoComplete="off"
              placeholder="Search products..."
              className="h-9 lg:w-[450px] hover:border-udua-orange-primary delay-75 transition-all ease-in-out  focus:!ring-white focus:border-udua-orange-primary focus:!outline-none focus:!ring-1 focus:!ring-opacity-90"
              defaultValue={defaultSearchQuery}
            />
          </form>
        )}
      </div>
    </Suspense>
  );
}

export default SearchBar;
