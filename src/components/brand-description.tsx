"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Info, Share2Icon } from "lucide-react";
import { Store } from "@/types";
import ShareButton from "@/utils/shareBTN";
import { usePathname } from "next/navigation";

type store = {
  store: Store | null;
};

function BrandDescription({ store }: store) {
  const pathname = usePathname();
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const currentUrl = `${baseUrl}/${pathname}`;

  // console.log('currentUrl', currentUrl)
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>Store Description</CardTitle>
        <CardDescription>
          What <span className=" font-semibold">{store?.name}</span> is all
          about.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="space-y-1">{store?.description}</div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 items-start">
        <span className="flex gap-2 font-semibold">
          <Info height={24} width={24} />
          More Info
        </span>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <p className="font-semibold">Store ID:</p>{" "}
            <span className="flex gap-3 font-semibold items-center cursor-pointer">
              {" "}
              {store?.uniqueId} <ShareButton slug={currentUrl} />
            </span>
          </div>

          {/* <p>Location: </p> */}
          <p>
            <span className="font-semibold">Joined date: </span>

            {store?.createdAt &&
              new Date(store.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

export default BrandDescription;
