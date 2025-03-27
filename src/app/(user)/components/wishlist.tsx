"use client";

import Link from "next/link";
import { Heart, Plus, XCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { shimmer, toBase64 } from "@/lib/image";
import { addCommasToNumber } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Aside1 from "./aside-1";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Product = {
  productId: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    title: string;
    coverIMG: string[];
    productType: string;
  };
  productType: string;
};

const WishlistSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
    <div className="grid md:grid-cols-[240px_1fr] gap-6">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-3 lg:gap-x-8">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export function Wishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchWishlist = useCallback(async () => {
    try {
      const { data } = await axios.post<{ wishlist: { products: Product[] } }>(
        "/api/user/wishlist"
      );
      setWishlist(data.wishlist.products);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load wishlist",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const controller = new AbortController();
    fetchWishlist();
    return () => controller.abort();
  }, [fetchWishlist]);

  const handleRemove = async (productId: string, productType: string) => {
    try {
      const response = await fetch("/api/wishlist/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          productType,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);
      setRemovingId(productId);
      setWishlist((prev) =>
        prev.filter((item) => item.productId._id !== productId)
      );
      toast({
        title: "Removed from wishlist",
        description: "Product has been removed from your wishlist",
      });
    } catch (error) {
      console.error("Remove failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove product from wishlist",
      });
    } finally {
      setRemovingId(null);
      router.refresh();
    }
  };

  if (isLoading) return <WishlistSkeleton />;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-3 py-8">
      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        {/* Navigation Sidebar */}
        <aside className="bg-card rounded-lg shadow-sm hidden md:inline-block">
          <Aside1 />
        </aside>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Wishlist Header */}
          <section className="bg-card rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Heart className="w-6 h-6" />
                My Wishlist
              </h1>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                {wishlist.length} Items
              </Badge>
            </div>

            {/* Wishlist Products */}
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-3 lg:gap-x-8">
                {wishlist.map((product) => {
                  const isPhysical = product.productType === "physicalproducts";
                  const imageSource = isPhysical
                    ? product.productId.images?.[0]
                    : product.productId.coverIMG?.[0];
                  const productName = isPhysical
                    ? product.productId.name
                    : product.productId.title;

                  return (
                    <div key={product.productId._id} className="relative group">
                      <button
                        onClick={() =>
                          handleRemove(
                            product.productId._id,
                            product.productType
                          )
                        }
                        disabled={removingId === product.productId._id}
                        className="absolute top-2 right-2 z-10 p-2 bg-background rounded-full shadow hover:bg-red-100 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        {removingId === product.productId._id ? (
                          <Heart className="w-6 h-6 fill-red-500 text-red-500 animate-pulse" />
                        ) : (
                          <Heart className="w-6 h-6 fill-red-500 text-red-500" />
                        )}
                      </button>

                      <Link
                        href={`/product/${product.productId._id}`}
                        className="text-sm space-y-4"
                      >
                        <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-muted bg-muted relative">
                          <Image
                            placeholder="blur"
                            blurDataURL={`data:image/svg+xml;base64,${toBase64(
                              shimmer(300, 150)
                            )}`}
                            src={imageSource || "/placeholder.svg"}
                            alt={productName || "Product image"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, 33vw"
                          />
                        </div>
                        <h3 className="font-medium line-clamp-1">
                          {productName || "Untitled Product"}
                        </h3>
                        <p className="font-medium">
                          &#8358;{" "}
                          {addCommasToNumber(product.productId.price || 0)}
                        </p>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed shadow-sm h-[300px]">
                <div className="flex flex-col items-center gap-1 text-center p-8">
                  <XCircle className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No products added
                  </h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Add products to your wishlist
                  </p>
                  <Link href="/">
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

// "use client";

// import Link from "next/link";
// import { Heart, Plus, XCircle } from "lucide-react";
// import { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { shimmer, toBase64 } from "@/lib/image";
// import { addCommasToNumber } from "@/lib/utils";
// import { useRouter } from "next/navigation";
// import { useToast } from "@/components/ui/use-toast";
// import Aside1 from "./aside-1";

// type Product = {
//   productId: {
//     _id: string;
//     name: string;
//     price: number;
//     images: string[];
//     title: string;
//     coverIMG: string[];
//   };
//   productType: string;
// };

// const SkeletonLoader = () => (
//   <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] md:px-4 gap-4">
//     <div className="hidden bg-muted/10 md:block">
//       <div className="flex h-full max-h-screen flex-col gap-2">
//         <Aside1 />
//       </div>
//     </div>

//     <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//       <div className="h-8 bg-gray-200/50 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>

//       <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-3 lg:gap-x-8">
//         {[...Array(6)].map((_, i) => (
//           <div key={i} className="space-y-4 animate-pulse">
//             <div className="aspect-square w-full bg-gray-200/50 dark:bg-gray-700 rounded-lg"></div>
//             <div className="h-4 bg-gray-200/50 dark:bg-gray-700 rounded w-3/4"></div>
//             <div className="h-4 bg-gray-200/50 dark:bg-gray-700 rounded w-1/2"></div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// );

// export function Wishlist() {
//   const [wishlist, setWishlist] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [removingId, setRemovingId] = useState<string | null>(null);
//   const router = useRouter();
//   const { toast } = useToast();

//   const fetchWishlist = useCallback(async () => {
//     try {
//       const { data } = await axios.post<{ wishlist: { products: Product[] } }>(
//         "/api/user/wishlist"
//       );
//       console.log("wishlist", data);
//       setWishlist(data.wishlist.products);
//     } catch (error) {
//       console.error("Error fetching wishlist:", error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to load wishlist",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [toast]);

//   useEffect(() => {
//     const controller = new AbortController();
//     fetchWishlist();
//     return () => controller.abort();
//   }, [fetchWishlist]);

//   const handleRemove = async (productId: string) => {
//     try {
//       setRemovingId(productId);
//       // await removeFromWishlist(productId);
//       setWishlist((prev) =>
//         prev.filter((item) => item.productId._id !== productId)
//       );
//       toast({
//         title: "Removed from wishlist",
//         description: "Product has been removed from your wishlist",
//       });
//     } catch (error) {
//       console.error("Remove failed:", error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to remove product from wishlist",
//       });
//     } finally {
//       setRemovingId(null);
//       router.refresh();
//     }
//   };

//   if (isLoading) return <SkeletonLoader />;
//   return (
//     <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] md:px-4 gap-4">
//       {/* ... sidebar code ... */}
//       <div className="hidden bg-muted/10 md:block">
//         <div className="flex h-full max-h-screen flex-col gap-2">
//           <Aside1 />
//         </div>
//       </div>

//       <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//         <h1 className="text-lg font-semibold md:text-2xl">Wishlist</h1>

//         {wishlist.length > 0 ? (
//           <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-3 lg:gap-x-8">
//             {wishlist.map((product) => {
//               // Determine product type-specific fields
//               console.log("product", product.productId);
//               const isPhysical = product.productType === "physicalproducts";
//               const imageSource = isPhysical
//                 ? product.productId.images?.[0]
//                 : product.productId.coverIMG?.[0];
//               const productName = isPhysical
//                 ? product.productId.name
//                 : product.productId.title;

//               return (
//                 <div key={product.productId._id} className="relative group">
//                   <button
//                     onClick={() => handleRemove(product.productId._id)}
//                     disabled={removingId === product.productId._id}
//                     className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-full shadow hover:bg-red-100 transition-colors"
//                     aria-label="Remove from wishlist"
//                   >
//                     {removingId === product.productId._id ? (
//                       <Heart className="w-6 h-6 fill-red-500 text-red-500 animate-pulse" />
//                     ) : (
//                       <Heart className="w-6 h-6 fill-red-500 text-red-500" />
//                     )}
//                   </button>

//                   <Link
//                     href={`/product/${product.productId._id}`}
//                     className="text-sm space-y-4"
//                   >
//                     <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 relative">
//                       <Image
//                         placeholder="blur"
//                         blurDataURL={`data:image/svg+xml;base64,${toBase64(
//                           shimmer(300, 150)
//                         )}`}
//                         src={imageSource}
//                         alt={productName || "Product image"}
//                         fill
//                         className="object-cover"
//                         sizes="(max-width: 640px) 50vw, 33vw"
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).src =
//                             "/placeholder.svg";
//                         }}
//                       />
//                     </div>
//                     <h3 className="font-medium line-clamp-1">
//                       {productName || "Untitled Product"}
//                     </h3>
//                     <p className="font-medium">
//                       &#8358; {addCommasToNumber(product.productId.price || 0)}
//                     </p>
//                   </Link>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed shadow-sm">
//             <div className="flex flex-col items-center gap-1 text-center p-8">
//               <XCircle className="h-10 w-10 text-muted-foreground" />
//               <h3 className="mt-4 text-lg font-semibold">No products added</h3>
//               <p className="mb-4 mt-2 text-sm text-muted-foreground">
//                 Add products to your wishlist
//               </p>
//               <Link href="/">
//                 <Button size="sm">
//                   <Plus className="mr-2 h-4 w-4" />
//                   Browse Products
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
