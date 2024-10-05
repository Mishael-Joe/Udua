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

type store = {
  store: Store | null;
};

function BrandDescription({ store }: store) {
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
          <p className="flex gap-2">
            <span className="font-semibold">Store ID:</span>{" "}
            <span className="flex gap-3 font-semibold items-center cursor-pointer">
              {" "}
              {store?.uniqueId} <Share2Icon height={17} width={17} />
            </span>
          </p>
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
