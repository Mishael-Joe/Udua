"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { debounce } from "lodash";

export type FilterState = {
  categories: string[] | string;
  page: number;
  limit: number;
  minPrice: number;
  maxPrice: number;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  inStock: boolean;
  minRating: number;
  dateFrom?: Date | string;
  dateTo?: Date | string;
};

export function useFilterState(initialState?: Partial<FilterState>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse categories from URL
  const categoriesParam = searchParams.get("categories");
  const initialCategories = categoriesParam
    ? typeof categoriesParam === "string"
      ? categoriesParam.split(" ")
      : categoriesParam
    : [];

  // Initialize state from URL params or defaults
  const [filters, setFilters] = useState<FilterState>({
    categories: initialCategories,
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 12,
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 1000,
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
    ...initialState,
  });

  // Create a debounced function to update URL
  const updateUrl = useCallback(
    debounce((newFilters: FilterState) => {
      const params = new URLSearchParams();

      // Add filter parameters to URL
      if (
        Array.isArray(newFilters.categories) &&
        newFilters.categories.length > 0
      ) {
        params.set("categories", newFilters.categories.join(" "));
      } else if (
        typeof newFilters.categories === "string" &&
        newFilters.categories
      ) {
        params.set("categories", newFilters.categories);
      }

      if (newFilters.page > 1) {
        params.set("page", newFilters.page.toString());
      }

      if (newFilters.limit !== 12) {
        params.set("limit", newFilters.limit.toString());
      }

      if (newFilters.minPrice > 0) {
        params.set("minPrice", newFilters.minPrice.toString());
      }

      if (newFilters.maxPrice < 1000) {
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
        params.set(
          "dateFrom",
          newFilters.dateFrom instanceof Date
            ? newFilters.dateFrom.toISOString()
            : newFilters.dateFrom
        );
      }

      if (newFilters.dateTo) {
        params.set(
          "dateTo",
          newFilters.dateTo instanceof Date
            ? newFilters.dateTo.toISOString()
            : newFilters.dateTo
        );
      }

      // Update the URL without refreshing the page
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500),
    [router, pathname]
  );

  // Update URL when filters change
  useEffect(() => {
    updateUrl(filters);
  }, [filters, updateUrl]);

  // Function to update a specific filter
  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters((prev) => {
      // Reset to page 1 when filters change (except when changing page)
      if (key !== "page") {
        return { ...prev, [key]: value, page: 1 };
      }
      return { ...prev, [key]: value };
    });
  }, []);

  // Function to reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      categories: [],
      page: 1,
      limit: 12,
      minPrice: 0,
      maxPrice: 1000,
      search: "",
      sortBy: "",
      sortOrder: "desc",
      inStock: false,
      minRating: 0,
      dateFrom: undefined,
      dateTo: undefined,
    });
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
    setFilters,
  };
}

// const orderProducts = [];
// const notifications = []; // to inform the store that one of its products has been sold
// const insufficientProducts = [];
// const stores = [];

// // product operation begins
// for (const { _id, quantity } of cartItems) {
//   const product: APIProduct = await Product.findById(_id).session(
//     session
//   );
//   // console.log(`product`, product);
//   // NOTE: StoreID serves as the store this product belongs to

//   // Product not found
//   if (!product) {
//     throw new Error(`Product not found: ${_id}`);
//   }

//   // Insufficient Products
//   if (product.productQuantity < quantity) {
//     insufficientProducts.push({ product, quantity });
//     continue; // Skip to the next product
//   }

//   // Reduce the product Quantity by the Quantity purchased the save it within a session
//   product.productQuantity -= quantity;
//   await product.save({ session });

//   // store operation begins
//   // calculate pending balance of the store. This is done by multiplying the
//   // product price and the bought qty then taking away our commission or charges
//   const totalProductPurchasedAmount = product.price! * quantity; // TODO: Work on this, i got this error: 'product.price' is possibly 'undefined'. and i included '!' just to make it pass TS check
//   const pendingBalance = calculateCommission(
//     totalProductPurchasedAmount
//   ).settleAmount;

//   // console.log('pendingBalance', pendingBalance)
//   const store: APIStore = await Store.findById(
//     product.storeID
//   ).session(session);
//   // NOTE: storeID serves as the store the product belongs to.
//   // console.log(`store`, store);

//   if (store) {
//     notifications.push({
//       storeEmail: store.storeEmail,
//       productName: product.name,
//       quantity,
//     });

//     store.pendingBalance += pendingBalance;
//     await store.save({ session });
//   }

//   stores.push(product.storeID);

//   orderProducts.push({
//     product: product._id,
//     store: product.storeID,
//     quantity,
//     price: product.price! * quantity, // TODO: Work on this, i got this error: 'product.price' is possibly 'undefined'. and i included '!' just to make it pass TS check
//   });
// }
// // product operation ends

// if (insufficientProducts.length > 0) {
//   // Handle insufficient products: notify the seller and potentially refund
//   // NOTE: accountId serves as the owner of the product i.e ownerID
//   for (const { product, quantity } of insufficientProducts) {
//     const store: APIStore = await Store.findById(
//       product.storeID
//     ).session(session);

//     if (store) {
//       const mailOptions = {
//         from: '"Your E-commerce Site" <mishaeljoe55@zohomail.com>',
//         to: store.storeEmail,
//         subject: "Stock Alert Notification",
//         text: `Your product ${product.name} is low on stock. Ordered quantity: ${quantity}, Available quantity: ${product.productQuantity}. Please restock.`,
//       };

//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.error("Error sending email:", error);
//         } else {
//           console.log("Email sent:", info.response);
//         }
//       });
//     }
//   }

//   // Optionally, handle refund for insufficient products
//   // This can be a separate logic based on business rules
// }
