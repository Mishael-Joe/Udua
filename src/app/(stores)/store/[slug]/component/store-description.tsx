"use client";

import React, { ChangeEvent, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Store } from "@/types";

interface StoreDescriptionProps {
  store: Store | null;
}

export default function StoreDescription({ store }: StoreDescriptionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [storeDescription, setStoreDescription] = useState({
    updatedDescription: store?.description || "",
  });

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreDescription((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/store/update-store-description",
        storeDescription
      );

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Store description updated successfully.",
        });
        router.refresh();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "There was an error updating your store description.",
      });
    }
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>Store Description</CardTitle>
        <CardDescription>
          What <span className="font-semibold">{store?.name}</span> is all
          about.
        </CardDescription>
        <div className="absolute right-3 top-3">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                aria-label="Edit store description"
              >
                <EditIcon className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Store Description</DialogTitle>
                <DialogDescription>
                  Make changes to your store description here. Click save when
                  you're done.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={onSubmit}
                className={cn("grid items-start gap-4")}
              >
                <div className="grid gap-2">
                  <Label htmlFor="updatedDescription">Store Description</Label>
                  <Textarea
                    id="updatedDescription"
                    name="updatedDescription"
                    value={storeDescription.updatedDescription}
                    onChange={handleChange}
                    placeholder="Enter your store description"
                  />
                </div>
                <Button type="submit">Save changes</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-gray-700 dark:text-gray-300">
          {store?.description || "No description available."}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 items-start">
        <div className="flex items-center gap-2 font-semibold">
          <Info className="w-6 h-6" />
          More Info
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <p className="font-semibold">Store ID:</p>
            <span className="font-medium">{store?.uniqueId}</span>
          </div>

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

// "use client";

// import React, { ChangeEvent, useState } from "react";
// import { cn } from "@/lib/utils";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { toast } from "@/components/ui/use-toast";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { EditIcon, Info, Share2Icon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import axios from "axios";
// import { Textarea } from "@/components/ui/textarea";
// import { Store } from "@/types";
// import ShareButton from "@/utils/shareBTN";

// type store = {
//   store: Store | null;
// };

// function StoreDescription({ store }: store) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const baseUrl = `${window.location.protocol}//${window.location.host}`;
//   const currentUrl = `${baseUrl}/${pathname}`;
//   const [open, setOpen] = useState(false); // State to manage the description Dialog box visibility
//   const [storeDescription, setStoreDescription] = useState({
//     updatedDescription: store?.description,
//   });

//   // Handles input changes for user data
//   const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
//     const { name, value } = e.target;

//     setStoreDescription((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // console.log(storeDescription)
//   };

//   // Handles submission of form data
//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         `/api/store/update-store-description`,
//         storeDescription
//       );

//       if (response.status === 200) {
//         toast({
//           title: `Successful`,
//           description: `Store description updated successfully.`,
//         });
//         router.refresh();
//       }
//     } catch (error: any) {
//       toast({
//         variant: "destructive",
//         title: `Error`,
//         description:
//           error.response?.data?.message ||
//           `There was an error updating your store description`,
//       });
//     }
//   };

//   return (
//     <Card className="relative">
//       <CardHeader>
//         <CardTitle>Store Description</CardTitle>
//         <CardDescription>
//           What <span className=" font-semibold">{store?.name}</span> is all
//           about.
//         </CardDescription>
//         <div className="absolute right-3 top-3">
//           <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//               <Button size="icon" className="bg-udua-orange-primary/80 hover:bg-udua-orange-primary">
//                 <EditIcon className="w-5 h-5" />
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//               <DialogHeader>
//                 <DialogTitle>Edit Store Description</DialogTitle>
//                 <DialogDescription>
//                   Make changes to your store description here. Click save when
//                   you're done.
//                 </DialogDescription>
//               </DialogHeader>
//               <form
//                 onSubmit={onSubmit}
//                 className={cn("grid items-start gap-4")}
//               >
//                 <div className="grid gap-2">
//                   <Label htmlFor="updatedDescription">Store Description</Label>
//                   <Textarea
//                     id="updatedDescription"
//                     name="updatedDescription"
//                     value={storeDescription.updatedDescription}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <Button type="submit">Save changes</Button>{" "}
//                 {/* Change to type="submit" */}
//               </form>
//             </DialogContent>
//           </Dialog>
//         </div>
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
//               {store?.uniqueId}
//               {/* <ShareButton slug={currentUrl} /> */}
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

// export default StoreDescription;
