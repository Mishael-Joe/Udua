"use client";

import { Suspense, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, SlidersHorizontal, Filter, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ProductGrid } from "./product-grid";
import { bookCategories, productCategories } from "@/constant/constant";
import { Switch } from "./ui/switch";
import { formatNaira } from "@/lib/utils";
import { CombinedProduct } from "@/types";

// Define sorting options
const SORT_OPTIONS = [
  { label: "Newest", value: "createdAt:desc" },
  { label: "Price: Low to High", value: "price:asc" },
  { label: "Price: High to Low", value: "price:desc" },
];

interface Product {
  products: CombinedProduct[];
}

export default function ProductFilters({ products }: Product) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [cartegoryType, setCartegoryType] = useState("Products");

  // Parse categories from URL
  const categoriesParam = searchParams.get("categories");
  const initialCategories = categoriesParam
    ? typeof categoriesParam === "string"
      ? categoriesParam.split(" ")
      : categoriesParam
    : [];

  // Initialize filter state from URL params
  const [filters, setFilters] = useState({
    categories: initialCategories,
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 12,
    minPrice: Number(searchParams.get("minPrice")) || 1000,
    maxPrice: Number(searchParams.get("maxPrice")) || 100000,
    search: searchParams.get("search") || "",
    sortBy: searchParams.get("sortBy") || "",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    inStock: searchParams.get("inStock") === "true",
    minRating: Number(searchParams.get("minRating")) || 0,
    dateFrom: searchParams.get("dateFrom")
      ? new Date(searchParams.get("dateFrom") as string)
      : undefined,
    dateTo: searchParams.get("dateTo")
      ? new Date(searchParams.get("dateTo") as string)
      : undefined,
  });

  // Count active filters for badge
  const activeFilterCount = Object.entries(filters).reduce(
    (count, [key, value]) => {
      if (key === "categories") {
        return count + (value as string[]).length;
      }
      if (key === "minPrice" && value !== 1000) return count + 1;
      if (key === "maxPrice" && value !== 100000) return count + 1;
      if (key === "inStock" && value === true) return count + 1;
      if (key === "minRating" && value !== 0) return count + 1;
      if (key === "search" && value !== "") return count + 1;
      if (key === "sortBy" && value !== "") return count + 1;
      if (key === "dateFrom" && value !== undefined) return count + 1;
      if (key === "dateTo" && value !== undefined) return count + 1;
      return count;
    },
    0
  );

  // Create a debounced function to update URL
  const updateUrl = useCallback(
    debounce((newFilters) => {
      const params = new URLSearchParams();

      // Add filter parameters to URL
      if (newFilters.categories.length > 0) {
        params.set("categories", newFilters.categories.join(" "));
      }
      if (newFilters.page > 1) {
        params.set("page", newFilters.page.toString());
      }
      if (newFilters.limit !== 12) {
        params.set("limit", newFilters.limit.toString());
      }
      if (newFilters.minPrice > 1000) {
        params.set("minPrice", newFilters.minPrice.toString());
      }
      if (newFilters.maxPrice < 100000) {
        params.set("maxPrice", newFilters.maxPrice.toString());
      }
      if (newFilters.search) {
        params.set("search", newFilters.search);
      }
      if (newFilters.sortBy) {
        params.set("sortBy", newFilters.sortBy);
      }
      if (newFilters.sortOrder) {
        params.set("sortOrder", newFilters.sortOrder);
      }
      if (newFilters.inStock) {
        params.set("inStock", "true");
      }
      if (newFilters.minRating > 0) {
        params.set("minRating", newFilters.minRating.toString());
      }
      if (newFilters.dateFrom) {
        params.set("dateFrom", newFilters.dateFrom.toISOString());
      }
      if (newFilters.dateTo) {
        params.set("dateTo", newFilters.dateTo.toISOString());
      }

      // Update the URL without refreshing the page
      router.push(`?${params.toString()}`, { scroll: false });
    }, 500),
    [router]
  );

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: any) => {
    let newFilters = { ...filters };

    switch (filterType) {
      case "category":
        if (newFilters.categories.includes(value)) {
          newFilters.categories = newFilters.categories.filter(
            (cat) => cat !== value
          );
        } else {
          newFilters.categories = [...newFilters.categories, value];
        }
        // Reset to page 1 when filters change
        newFilters.page = 1;
        break;
      case "price":
        newFilters.minPrice = value[0];
        newFilters.maxPrice = value[1];
        newFilters.page = 1;
        break;
      case "inStock":
        newFilters.inStock = value;
        newFilters.page = 1;
        break;
      case "rating":
        newFilters.minRating = value;
        newFilters.page = 1;
        break;
      case "search":
        newFilters.search = value;
        newFilters.page = 1;
        break;
      case "sort":
        const [sortBy, sortOrder] = value.split(":");
        newFilters.sortBy = sortBy;
        newFilters.sortOrder = sortOrder;
        break;
      case "dateFrom":
        newFilters.dateFrom = value;
        newFilters.page = 1;
        break;
      case "dateTo":
        newFilters.dateTo = value;
        newFilters.page = 1;
        break;
      case "reset":
        newFilters = {
          categories: [],
          page: 1,
          limit: 12,
          minPrice: 1000,
          maxPrice: 100000,
          search: "",
          sortBy: "",
          sortOrder: "desc",
          inStock: false,
          minRating: 0,
          dateFrom: undefined,
          dateTo: undefined,
        };
        break;
      default:
        break;
    }

    setFilters(newFilters);
    updateUrl(newFilters);
    // console.log(newFilters);
  };

  // Filter content component - reused in both desktop and mobile views
  const FilterContent = () => (
    <>
      <div className="space-y-4">
        {/* Since we have a search input in the navbar, it's best we disable this one */}
        {/* Search Input */}
        {/* <div>
          <Label htmlFor="search">Search Products</Label>
          <div className="mt-2">
            <Input
              type="text"
              id="search"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full"
            />
          </div>
        </div> */}

        {/* Sort by (Only for mobile device) */}
        <Select
          // value={`${filters.sortBy}:${filters.sortOrder}`}
          onValueChange={(value) => handleFilterChange("sort", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Categories */}
        <Accordion type="single" collapsible defaultValue="categories">
          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>

            {cartegoryType === "Products" && (
              <AccordionContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    className=""
                    id="cartegory-type"
                    onCheckedChange={() =>
                      setCartegoryType((prev) =>
                        prev === "Products" ? "Books" : "Products"
                      )
                    }
                    // checked={cartegoryType === "Books"}
                  />
                  <Label htmlFor="cartegory-type">Books</Label>
                </div>
                <div className="space-y-2">
                  {productCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.categories.includes(
                          category.replace(/ /g, "_")
                        )}
                        onCheckedChange={() =>
                          handleFilterChange(
                            "category",
                            category.replace(/ /g, "_")
                          )
                        }
                      />
                      <Label
                        htmlFor={`category-${category}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            )}

            {cartegoryType === "Books" && (
              <AccordionContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    className=""
                    id="cartegory-type"
                    onCheckedChange={() =>
                      setCartegoryType((prev) =>
                        prev === "Products" ? "Books" : "Products"
                      )
                    }
                    checked={cartegoryType === "Books"}
                  />
                  <Label htmlFor="cartegory-type">Books</Label>
                </div>
                <div className="space-y-2">
                  {bookCategories.map((category) => (
                    <div
                      key={category.category}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`category-${category.category}`}
                        checked={filters.categories.includes(
                          category.category.replace(/ /g, "_")
                        )}
                        onCheckedChange={() =>
                          handleFilterChange(
                            "category",
                            category.category.replace(/ /g, "_")
                          )
                        }
                      />
                      <Label
                        htmlFor={`category-${category.category}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category.category}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        </Accordion>

        {/* Price Range */}
        <Accordion type="single" collapsible defaultValue="price">
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider
                  // dir="rtl"
                  // inverted
                  defaultValue={[filters.minPrice, filters.maxPrice]}
                  min={1000}
                  max={100000}
                  step={1000}
                  onValueChange={(value) => handleFilterChange("price", value)}
                  className="mt-6"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {formatNaira(filters.minPrice)}
                  </span>
                  <span className="text-sm">
                    {formatNaira(filters.maxPrice)}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* In Stock */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStock}
            onCheckedChange={(checked) =>
              handleFilterChange("inStock", checked)
            }
          />
          <Label
            htmlFor="in-stock"
            className="text-sm font-normal cursor-pointer"
          >
            In Stock Only
          </Label>
        </div>

        {/* Rating */}
        <Accordion type="single" collapsible defaultValue="rating">
          <AccordionItem value="rating">
            <AccordionTrigger>Minimum Rating</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={filters.minRating === rating}
                      onCheckedChange={() =>
                        handleFilterChange("rating", rating)
                      }
                    />
                    <Label
                      htmlFor={`rating-${rating}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {rating} Stars & Above
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* We do not need this for now */}
        {/* Date Range */}
        {/* <Accordion type="single" collapsible defaultValue="date">
          <AccordionItem value="date">
            <AccordionTrigger>Date Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date-from">From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                        id="date-from"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateFrom ? (
                          format(filters.dateFrom, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateFrom}
                        onSelect={(date) =>
                          handleFilterChange("dateFrom", date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="date-to">To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                        id="date-to"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateTo ? (
                          format(filters.dateTo, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateTo}
                        onSelect={(date) => handleFilterChange("dateTo", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion> */}

        {/* Reset Filters Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleFilterChange("reset", null)}
        >
          Reset Filters
        </Button>
      </div>
    </>
  );

  return (
    <div className="">
      {/* Mobile filter dialog */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-background py-4 pb-12 shadow-xl">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium">Filters</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>

            <div className="mt-4 px-4">
              <FilterContent />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          {/* only displays xs, sm, amd md screens */}
          <div className="flex items-center fixed bottom-8 right-4">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden flex items-center gap-1 rounded-full h-11 animate-pulse"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <Filter className="h-4 w-4" />
              {/* Filters */}
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* only shows on lg screens and above */}
          <div className="lg:flex items-center hidden">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* only shows on lg screens and above*/}
          <div className="lg:flex items-center hidden">
            <Select
              // value={`${filters.sortBy}:${filters.sortOrder}`}
              onValueChange={(value) => handleFilterChange("sort", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4 mt-4">
          {/* Desktop filters */}
          <div className="hidden lg:block">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </h2>
            <FilterContent />
          </div>

          {/* Active filters display */}
          <div className="lg:col-span-3">
            {activeFilterCount > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Active Filters:</h3>
                <div className="flex flex-wrap gap-2">
                  {filters.categories.map((category) => (
                    <Badge
                      key={`cat-${category}`}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {category}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange("category", category)}
                      />
                    </Badge>
                  ))}
                  {filters.minPrice > 1000 && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      Min: ${filters.minPrice}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          handleFilterChange("price", [1000, filters.maxPrice])
                        }
                      />
                    </Badge>
                  )}
                  {filters.maxPrice < 100000 && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      Max: ${filters.maxPrice}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          handleFilterChange("price", [
                            filters.minPrice,
                            100000,
                          ])
                        }
                      />
                    </Badge>
                  )}
                  {filters.inStock && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      In Stock
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange("inStock", false)}
                      />
                    </Badge>
                  )}
                  {filters.minRating > 0 && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {filters.minRating}+ Stars
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange("rating", 0)}
                      />
                    </Badge>
                  )}
                  {filters.search && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      "{filters.search}"
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange("search", "")}
                      />
                    </Badge>
                  )}
                  {filters.dateFrom && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      From: {format(filters.dateFrom, "PP")}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          handleFilterChange("dateFrom", undefined)
                        }
                      />
                    </Badge>
                  )}
                  {filters.dateTo && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      To: {format(filters.dateTo, "PP")}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange("dateTo", undefined)}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            )}
            {/* Product grid will be rendered here by the parent component */}
            <div>
              <Suspense fallback={"Loading products..."}>
                <ProductGrid products={products} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
