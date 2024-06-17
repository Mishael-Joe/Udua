import HeroBanners from "@/components/banners";
import LeftSidebar from "@/components/left-sidebar";
import { ProductGrid } from "@/components/product-grid";
import { fetchProducts } from "@/lib/actions/product.action";
import SkeletonLoader from "@/lib/loaders/skeletonLoader";
import { Product } from "@/types";
import { Suspense } from "react";

type Props = {
  searchParams: {
    categories?: string[] | string;
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    inStock?: boolean;
    minRating?: number;
    dateFrom?: string | Date;
    dateTo?: string | Date;
  };
};

export default async function Home({ searchParams }: Props) {
  const {
    categories,
    page,
    limit,
    minPrice,
    maxPrice,
    search,
    sortBy,
    sortOrder,
    inStock,
    minRating,
    dateFrom,
    dateTo,
  } = searchParams;
  // Convert categories string to an array of strings
  const categoriesArray = categories ? (categories as string).split(" ") : [];
  // console.log(`categoriesArray`, categoriesArray);

  const products: Product[] = await fetchProducts(
    categoriesArray,
    page,
    limit,
    minPrice,
    maxPrice,
    search,
    sortBy,
    sortOrder,
    inStock,
    minRating
    // dateFrom,
    // dateTo
  );

  return (
    <main className="grid min-h-screen mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] px-5 md:px-4 gap-4 max-w-7xl">
      <div className="hidden border-r bg-muted/10 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <LeftSidebar />
        </div>
      </div>

      <div className="py-4">
        <Suspense fallback={<SkeletonLoader />}>
          <HeroBanners />
          <ProductGrid products={products} />
        </Suspense>
      </div>
    </main>
  );
}

// ngrok http 3000

// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import LeftSidebar from "@/components/LeftSidebar";
// import { ProductGrid } from "@/components/product-grid";
// import { fetchProducts } from "@/lib/actions/product.action";
// import SkeletonLoader from "@/lib/loaders/skeletonLoader";
// import { Product } from "@/types";
// import { Suspense } from "react";

// // Pagination Components
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationPrevious,
//   PaginationLink,
//   PaginationEllipsis,
//   PaginationNext,
// } from '@/components/Pagination'; // Ensure you import your Pagination components correctly

// export default function Home() {
//   const router = useRouter();
//   const {
//     categories,
//     page = 1,
//     limit = 30,
//     minPrice,
//     maxPrice,
//     search,
//     sortBy,
//     sortOrder = 'asc',
//     inStock,
//     minRating,
//     dateFrom,
//     dateTo,
//   } = router.query;

//   const [products, setProducts] = useState<Product[]>([]);
//   const [currentPage, setCurrentPage] = useState<number>(parseInt(page as string) || 1);
//   const [totalPages, setTotalPages] = useState<number>(0); // You can set this based on your total product count

//   useEffect(() => {
//     const fetchProductData = async () => {
//       const categoriesArray = categories ? (categories as string).split(' ') : [];

//       const products: Product[] = await fetchProducts(
//         categoriesArray,
//         currentPage,
//         parseInt(limit as string) || 30,
//         parseFloat(minPrice as string),
//         parseFloat(maxPrice as string),
//         search as string,
//         sortBy as string,
//         sortOrder as 'asc' | 'desc',
//         inStock === 'true',
//         parseFloat(minRating as string),
//         dateFrom ? new Date(dateFrom as string) : undefined,
//         dateTo ? new Date(dateTo as string) : undefined
//       );

//       setProducts(products);
//       // Set totalPages based on the total product count and limit
//       const totalProductCount = 100; // Replace with actual count from your data source
//       setTotalPages(Math.ceil(totalProductCount / (parseInt(limit as string) || 30)));
//     };

//     fetchProductData();
//   }, [categories, currentPage, limit, minPrice, maxPrice, search, sortBy, sortOrder, inStock, minRating, dateFrom, dateTo]);

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//     router.push({
//       pathname: router.pathname,
//       query: {
//         ...router.query,
//         page: newPage,
//       },
//     });
//   };

//   return (
//     <main className="grid min-h-screen mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ... px-5 md:px-4 flex flex-row gap-4 max-w-[75rem]">
//       <div className="hidden border-r bg-muted/10 md:block">
//         <div className="flex h-full max-h-screen flex-col gap-2">
//           <LeftSidebar />
//         </div>
//       </div>

//       <div className="py-4">
//         <Suspense fallback={<SkeletonLoader />}>
//           <ProductGrid products={products} />
//         </Suspense>
//         <Pagination>
//           <PaginationContent>
//             <PaginationItem>
//               <PaginationPrevious
//                 href="#"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   if (currentPage > 1) handlePageChange(currentPage - 1);
//                 }}
//               />
//             </PaginationItem>
//             {[...Array(totalPages)].map((_, index) => (
//               <PaginationItem key={index}>
//                 <PaginationLink
//                   href="#"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handlePageChange(index + 1);
//                   }}
//                 >
//                   {index + 1}
//                 </PaginationLink>
//               </PaginationItem>
//             ))}
//             {totalPages > 5 && <PaginationEllipsis />}
//             <PaginationItem>
//               <PaginationNext
//                 href="#"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   if (currentPage < totalPages) handlePageChange(currentPage + 1);
//                 }}
//               />
//             </PaginationItem>
//           </PaginationContent>
//         </Pagination>
//       </div>
//     </main>
//   );
// }
