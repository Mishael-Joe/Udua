"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info, Share2 } from "lucide-react";
import { Store } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface BrandDescriptionProps {
  store: Store | null;
  loading?: boolean;
}

export default function BrandDescription({
  store,
  loading,
}: BrandDescriptionProps) {
  const pathname = usePathname();
  const storeUrl = `${window.location.origin}${pathname}`;

  const sanitizedDescription = store?.description
    ? DOMPurify.sanitize(store.description)
    : "";

  if (loading || !store) {
    return (
      <Card className="relative">
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
        </CardContent>
        <CardFooter className="flex flex-col gap-3 items-start">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[200px]" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {store.name}
              <Badge variant="outline" className="text-sm">
                {store.uniqueId}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-2">
              What {store.name} is all about
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="prose dark:prose-invert">
          {store.description ? (
            <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Info className="w-4 h-4" />
              <span>No store description provided</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 items-start border-t pt-4">
        <HoverCard>
          <HoverCardTrigger className="flex items-center gap-2 text-sm cursor-help">
            <Info className="w-4 h-4" />
            <span className="font-medium">Store Details</span>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <p className="text-sm">
                This information is visible to all customers visiting the store.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Store ID</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{store.uniqueId}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(storeUrl)}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Established</span>
            <span className="text-sm">
              {store.createdAt &&
                format(new Date(store.createdAt), "MMM dd, yyyy")}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
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

// import { Info, Share2Icon } from "lucide-react";
// import { Store } from "@/types";
// import ShareButton from "@/utils/shareBTN";
// import { usePathname } from "next/navigation";

// type store = {
//   store: Store | null;
// };

// function BrandDescription({ store }: store) {
//   const pathname = usePathname();
//   const baseUrl = `${window.location.protocol}//${window.location.host}`;
//   const currentUrl = `${baseUrl}/${pathname}`;

//   // console.log('currentUrl', currentUrl)
//   return (
//     <Card className="relative">
//       <CardHeader>
//         <CardTitle>Store Description</CardTitle>
//         <CardDescription>
//           What <span className=" font-semibold">{store?.name}</span> is all
//           about.
//         </CardDescription>
//       </CardHeader>

//       <CardContent className="space-y-2">
//         <div className="space-y-1">{store?.description}</div>
//       </CardContent>

//       <CardFooter className="flex flex-col gap-3 items-start">
//         <span className="flex gap-2 font-semibold">
//           <Info height={24} width={24} />
//           More Info
//         </span>

//         <div className="flex flex-col gap-3">
//           <div className="flex gap-2 items-center">
//             <p className="font-semibold">Store ID:</p>{" "}
//             <span className="flex gap-3 font-semibold items-center cursor-pointer">
//               {" "}
//               {store?.uniqueId} <ShareButton slug={currentUrl} />
//             </span>
//           </div>

//           {/* <p>Location: </p> */}
//           <p>
//             <span className="font-semibold">Joined date: </span>

//             {store?.createdAt &&
//               new Date(store.createdAt).toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//           </p>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

// export default BrandDescription;
