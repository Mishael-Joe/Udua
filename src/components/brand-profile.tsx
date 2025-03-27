"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Users,
  Package,
  Share2,
  StoreIcon,
  UserPlus,
} from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import BrandDescription from "./brand-description";
import { ProductGrid } from "./product-grid";
import { Store } from "@/types";
import DOMPurify from "dompurify";
import { toast } from "@/components/ui/use-toast";

export default function BrandProfile({ params }: { params: { slug: string } }) {
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.post<{ store: Store }>("/api/brand", {
          storeID: params.slug,
        });
        setStore(response.data.store);
      } catch (error) {
        console.error("Failed to fetch store data:", error);
      }
    };

    fetchStoreData();
  }, [params.slug]);

  if (!store) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-6 w-[200px]" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Tabs defaultValue="products">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">
              <Skeleton className="h-6 w-24" />
            </TabsTrigger>
            <TabsTrigger value="description">
              <Skeleton className="h-6 w-24" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    );
  }

  const { name, description, products, uniqueId } = store;
  const sanitizedDescription = DOMPurify.sanitize(description);

  return (
    <main className="container max-w-6xl mx-auto px-4 md:px-8 py-6">
      {/* Store Header */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="relative h-48 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-t-lg">
            <div className="absolute -bottom-8 left-0 right-0 sm:left-6 px-4 flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="bg-background p-4 rounded-lg shadow-lg w-full max-w-full sm:flex-1 sm:max-w-fit sm:min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h1 className="text-2xl sm:text-3xl font-bold truncate break-words">
                    {name}
                  </h1>
                  <Badge variant="outline" className="text-xs sm:text-sm w-fit">
                    ID: {uniqueId}
                  </Badge>
                </div>

                {/* Stats Container */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-4">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="text-sm sm:text-base font-medium">
                      {"0"} Followers
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="text-sm sm:text-base font-medium">
                      {products?.length.toLocaleString()} Products
                    </span>
                  </div>
                </div>
              </div>

              {/* Follow Button */}
              <Button
                variant="outline"
                // onClick={handleFollowStore}
                className="sm:mb-4 gap-2 w-full sm:w-auto"
              >
                <UserPlus className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">
                  {/* {isFollowing ? "Following" : "Follow Store"} */} Following
                </span>
              </Button>
            </div>
          </div>

          <div className="pt-20 px-6 pb-6">
            {description && (
              <div
                className="prose dark:prose-invert max-w-4xl"
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Store Content Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products" className="flex gap-2">
            <Package className="h-4 w-4" /> Products
          </TabsTrigger>
          <TabsTrigger value="description" className="flex gap-2">
            <Users className="h-4 w-4" /> About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Available Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductGrid products={products || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="description" className="mt-6">
          <BrandDescription store={store} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

// "use client";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import axios from "axios";
// import { useEffect, useRef, useState } from "react";
// import { icons, Loader, Star, StoreIcon } from "lucide-react";
// import Image from "next/image";
// import { Store } from "@/types";
// import BrandDescription from "./brand-description";
// import { ProductGrid } from "./product-grid";
// import Rating from "@/lib/helpers/rating";

// export default function BrandProfile({ params }: { params: { slug: string } }) {
//   const [store, setStore] = useState<Store | null>(null);

//   const body = {
//     storeID: params.slug,
//   };
//   useEffect(() => {
//     const fetchStoreData = async () => {
//       try {
//         const response = await axios.post<{ store: Store }>("/api/brand", body);
//         // console.log("storedata", response.data);
//         setStore(response.data.store);
//       } catch (error: any) {
//         console.error("Failed to fetch store data", error.message);
//       }
//     };

//     fetchStoreData();
//   }, []);

//   if (store === null) {
//     return (
//       <div className="w-full min-h-screen flex items-center justify-center">
//         <p className="w-full h-full flex items-center justify-center">
//           <Loader className="animate-spin" /> Loading...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <section className=" max-w-5xl mx-auto my-3 px-6 xl:px-0">
//       <div className="p-4 border border-gray-700 h-72 w-full rounded-md bg-muted/50">
//         <div className="flex h-2/3 w-[100%] items-center">
//           <div className="bg-lime-60 basis-2/5 sm:basis-1/5 w-3/12 sm:flex flex-col justify-center  hidden">
//             <StoreIcon
//               className="h-16 w-16 sm:h-[100px] sm:w-[100px] mx-auto"
//               height={50}
//               width={50}
//             />
//           </div>

//           <div className="flex flex-col gap-4 w-full sm:pl-5 lg:pl-0">
//             <p className=" text-2xl font-semibold">{store?.name}</p>
//             <p
//               style={{
//                 display: "-webkit-box",
//                 WebkitBoxOrient: "vertical",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 WebkitLineClamp: 3, // Limits the text to 3 lines
//                 maxHeight: "4.5em", // Adjust this based on the number of lines and line height
//                 lineHeight: "1.5em", // Adjust based on font size for accurate height control
//               }}
//             >
//               {store?.description}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="pt-4 w-full h-fit">
//         <Tabs defaultValue="products" className="max-w-6xl mx-auto">
//           <TabsList className="grid w-full grid-cols-2 text-xl font-bold">
//             <TabsTrigger value="products">Products</TabsTrigger>
//             <TabsTrigger value="description">Description</TabsTrigger>
//           </TabsList>
//           <TabsContent value="products">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Products on this store</CardTitle>
//               </CardHeader>

//               <CardContent>
//                 <ProductGrid
//                   products={store?.products !== null ? store.products : []}
//                 />
//               </CardContent>
//             </Card>
//           </TabsContent>
//           <TabsContent value="description">
//             <BrandDescription store={store} />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </section>
//   );
// }
