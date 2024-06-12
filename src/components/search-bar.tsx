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
          <form
            onKeyUp={handleSubmit}
            className="hidden items-center lg:inline-flex"
          >
            <Input
              id="search"
              name="search"
              type="search"
              autoComplete="off"
              placeholder="Search products..."
              className="h-9 lg:w-[300px]"
              defaultValue={defaultSearchQuery}
            />
          </form>
        )}
      </div>
    </Suspense>
  );
}

export default SearchBar;
