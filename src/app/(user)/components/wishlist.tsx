"use client";

import Link from "next/link";
import { Heart, Plus, XCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { shimmer, toBase64 } from "@/lib/image";
import { addCommasToNumber } from "@/lib/utils";
import { removeFromWishlist } from "@/lib/actions/product.action";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Aside1 from "./aside-1";

type Product = {
  _id: string;
  name: string;
  price: number;
  images: string[];
};

const SkeletonLoader = () => (
  <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] md:px-4 gap-4">
    <div className="hidden bg-muted/10 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <Aside1 />
      </div>
    </div>

    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="h-8 bg-gray-200/50 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-3 lg:gap-x-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4 animate-pulse">
            <div className="aspect-square w-full bg-gray-200/50 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-4 bg-gray-200/50 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200/50 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
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

  const handleRemove = async (productId: string) => {
    try {
      setRemovingId(productId);
      await removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
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

  if (isLoading) return <SkeletonLoader />;

  return (
    <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] md:px-4 gap-4">
      <div className="hidden bg-muted/10 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <Aside1 />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <h1 className="text-lg font-semibold md:text-2xl">Wishlist</h1>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-3 lg:gap-x-8">
            {wishlist.map((product) => (
              <div key={product._id} className="relative group">
                <button
                  onClick={() => handleRemove(product._id)}
                  disabled={removingId === product._id}
                  className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-full shadow hover:bg-red-100 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  {removingId === product._id ? (
                    <Heart className="w-6 h-6 fill-red-500 text-red-500 animate-pulse" />
                  ) : (
                    <Heart className="w-6 h-6 fill-red-500 text-red-500" />
                  )}
                </button>

                <Link
                  href={`/product/${product._id}`}
                  className="text-sm space-y-4"
                >
                  <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 relative">
                    <Image
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                        shimmer(300, 150)
                      )}`}
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="font-medium line-clamp-1">{product.name}</h3>
                  <p className="font-medium">
                    &#8358; {addCommasToNumber(product.price)}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center p-8">
              <XCircle className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No products added</h3>
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
      </div>
    </div>
  );
}

// "use client";

// import Link from "next/link";
// import { Heart, Loader, Plus, XCircle } from "lucide-react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { shimmer, toBase64 } from "@/lib/image";
// import { addCommasToNumber } from "@/lib/utils";
// import { removeFromWishlist } from "@/lib/actions/product.action";
// import { useRouter } from "next/navigation";
// import { useToast } from "@/components/ui/use-toast";
// import Aside1 from "./aside-1";

// export function Wishlist() {
//   const [wishlist, setWishlist] = useState<any>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const router = useRouter();
//   const { toast } = useToast();

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const response = await axios.post("/api/user/wishlist");
//         setWishlist(response.data.wishlist.products);
//         // console.log("response.data.wishlist", response.data.wishlist);
//       } catch (error: any) {
//         console.error("Error fetching orders:", error.message);
//       }
//     };

//     fetchWishlist();
//   }, []);

//   const handleWishlist = async (val: string) => {
//     try {
//       setIsLoading(true);
//       const response: Response = await removeFromWishlist(val);
//       // console.log('res', response)
//       if (response.status === 200) {
//         toast({
//           variant: "default",
//           title: `Succesful`,
//           description: `Product removed from your Wishlist. Please, refresh your browser`,
//         });
//       }
//       router.refresh();
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//       router.refresh();
//     }
//   };

//   if (wishlist !== undefined && wishlist.length > 0) {
//     return (
//       <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ... md:px-4 gap-4">
//         <div className="hidden bg-muted/10 md:block">
//           <div className="flex h-full max-h-screen flex-col gap-2">
//             <Aside1 />
//           </div>
//         </div>

//         <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//           <div className="flex items-center">
//             <h1 className="text-lg font-semibold md:text-2xl">Wishlist</h1>
//           </div>
//           {isLoading && (
//             <div className=" inset-0 bg-black/80 w-full min-h-screen flex items-center justify-center absolute z-20">
//               <button>
//                 <Loader className="w-10 h-10 z-10 animate-spin" />
//               </button>
//             </div>
//           )}

//           <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-3 lg:gap-x-8">
//             {wishlist.map((product: any) => (
//               <div className=" relative" key={product._id}>
//                 {/* {!isLoading && (
//                   <button onClick={() => handleWishlist(product._id)}>
//                     <Heart className=" text-white rounded p-1 top-12 left-6 md:top-10 md:left-3 bg-red-500 w-10 h-10 z-10 absolute" />
//                   </button>
//                 )} */}
//                 <Link
//                   key={product._id}
//                   href={`/product/${product._id}`}
//                   className="group relative text-sm"
//                 >
//                   <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
//                     <Image
//                       placeholder="blur"
//                       blurDataURL={`data:image/svg+xml;base64,${toBase64(
//                         shimmer(300, 150)
//                       )}`}
//                       src={product.images[0]}
//                       alt={product.name}
//                       width={300}
//                       height={150}
//                       className="h-full w-full object-cover object-center"
//                       quality={90}
//                     />
//                   </div>

//                   <h3 className="mt-4 font-medium">{product.name}</h3>
//                   <p className="mt-2 font-medium">
//                     &#8358; {addCommasToNumber(product.price as number)}{" "}
//                   </p>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   } else if (wishlist.length < 1) {
//     return (
//       <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ... md:px-4 gap-4">
//         <div className="hidden bg-muted/10 md:block">
//           <div className="flex h-full max-h-screen flex-col gap-2">
//             <Aside1 />
//           </div>
//         </div>

//         <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//           <div className="flex items-center">
//             <h1 className="text-lg font-semibold md:text-2xl">Wishlist</h1>
//           </div>
//           <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed shadow-sm">
//             <div className="flex flex-col items-center gap-1 text-center">
//               <XCircle className="h-10 w-10 text-muted-foreground" />
//               <h3 className="mt-4 text-lg font-semibold">No products added</h3>
//               <p className="mb-4 mt-2 text-sm text-muted-foreground">
//                 Add products to your wishlist.
//               </p>
//               <Link href="/">
//                 <Button size="sm" className="relative">
//                   <Plus className="mr-2 h-4 w-4" />
//                   Add Products
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
