"use client";

import Link from "next/link";
import { Heart, Loader, Plus, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { shimmer, toBase64 } from "@/lib/image";
import { addCommasToNumber } from "@/lib/utils";
import { removeFromWishlist } from "@/lib/actions/product.action";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Aside1 from "./aside-1";

export function Wishlist() {
  const [wishlist, setWishlist] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.post("/api/user/wishlist");
        setWishlist(response.data.wishlist.products);
        // console.log("response.data.wishlist", response.data.wishlist);
      } catch (error: any) {
        console.error("Error fetching orders:", error.message);
      }
    };

    fetchWishlist();
  }, []);

  const handleWishlist = async (val: string) => {
    try {
      setIsLoading(true);
      const response: Response = await removeFromWishlist(val);
      // console.log('res', response)
      if (response.status === 200) {
        toast({
          variant: "default",
          title: `Succesful`,
          description: `Product removed from your Wishlist. Please, refresh your browser`,
        });
      }
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  if (wishlist !== undefined && wishlist.length > 0) {
    return (
      <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ... md:px-4 gap-4">
        <div className="hidden bg-muted/10 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <Aside1 />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Wishlist</h1>
          </div>
          {isLoading && (
            <div className=" inset-0 bg-black/80 w-full min-h-screen flex items-center justify-center absolute z-20">
              <button>
                <Loader className="w-10 h-10 z-10 animate-spin" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-3 lg:gap-x-8">
            {wishlist.map((product: any) => (
              <div className=" relative" key={product._id}>
                {/* {!isLoading && (
                  <button onClick={() => handleWishlist(product._id)}>
                    <Heart className=" text-white rounded p-1 top-12 left-6 md:top-10 md:left-3 bg-red-500 w-10 h-10 z-10 absolute" />
                  </button>
                )} */}
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  className="group relative text-sm"
                >
                  <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
                    <Image
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                        shimmer(300, 150)
                      )}`}
                      src={product.images[0]}
                      alt={product.name}
                      width={300}
                      height={150}
                      className="h-full w-full object-cover object-center"
                      quality={90}
                    />
                  </div>

                  <h3 className="mt-4 font-medium">{product.name}</h3>
                  <p className="mt-2 font-medium">
                    &#8358; {addCommasToNumber(product.price as number)}{" "}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else if (wishlist.length < 1) {
    return (
      <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ... md:px-4 gap-4">
        <div className="hidden bg-muted/10 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <Aside1 />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Wishlist</h1>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <XCircle className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No products added</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Add products to your wishlist.
              </p>
              <Link href="/">
                <Button size="sm" className="relative">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
