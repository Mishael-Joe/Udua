"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2, CheckCircle2, Store } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const ResetStorePassword = () => {
  const [storeID, setStoreID] = useState("");
  const [message, setMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`/api/auth/forgot-store-password`, {
        storeID,
      });

      if (response.data.success) {
        toast({
          title: "Reset Link Sent",
          description:
            "We've sent a password reset link to your registered email.",
        });
        setMessage(true);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to send reset link. Please check your Store ID and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold">Store Password Reset</h1>
          <p className="text-sm text-muted-foreground">
            Enter your Store ID to receive a password reset link
          </p>
        </CardHeader>

        {!message ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeID">Store ID</Label>
                <Input
                  id="storeID"
                  value={storeID}
                  onChange={(e) => setStoreID(e.target.value)}
                  placeholder="Enter your Store ID"
                  required
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-blue-500 hover:bg-udua-blue-primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Link...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium">Check Your Email</h3>
            <p className="text-sm text-muted-foreground">
              We've sent instructions to your registered email address.
              <br />
              Follow the link to reset your password.
            </p>
          </CardContent>
        )}
      </Card>
    </main>
  );
};

export default ResetStorePassword;

// "use client";

// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
// import axios from "axios";
// import { useState } from "react";
// import { Loader } from "lucide-react";

// const ResetStorePassword = () => {
//   const [storeID, setStoreID] = useState("");
//   const [message, setMessage] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       setIsLoading(true);

//       const response = await axios.post(`/api/auth/forgot-store-password`, JSON.stringify({ storeID }));
//       // console.log(`response`, response);

//       if (response.data.success === true || response.status === 200) {
//         toast({
//           title: `Success`,
//           description: `We have sent a mail registered with this store.`,
//         });
//         setIsLoading(false);
//         setMessage(true);
//       } else {
//         toast({
//           variant: `destructive`,
//           title: `Error`,
//           description: `There was an error sending you the reset link. Please try again.`,
//         });
//         setIsLoading(false);
//       }
//     } catch (error) {
//       toast({
//         variant: `destructive`,
//         title: "Error",
//         description: `There was an error sending you the reset link. Please try again.`,
//       });
//       setIsLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex flex-row justify-center items-center">
//       <section className="max-w-3xl mx-auto my-5 px-6">
//       {!message ? (
//         <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
//         <div className="px-6 py-4">
//           <div className="flex justify-center mx-auto">
//             {/* <Image
//               className="w-auto h-7 sm:h-8"
//               src="https://merakiui.com/images/logo.svg"
//               width={`60`}
//               height={`60`}
//               alt=""
//             /> */}
//           </div>

//           <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
//             Reset My Store Password
//           </h3>

//           <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
//             Provide your store id.
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-8 ">
//           <input
//             className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
//             aria-label="store id"
//             type="text"
//             value={storeID}
//             onChange={(e) => setStoreID(e.target.value)}
//             placeholder="Enter your store id"
//             required
//           />
//           <Button
//             type="submit"
//             className="items-end w-full bg-purple-500 hover:bg-purple-600"
//           >
//             {!isLoading && "Send Reset Link"}
//             {isLoading && (
//               <Loader className=" animate-spin w-5 h-5 mr-4" />
//             )}{" "}
//             {isLoading && "Please wait..."}
//           </Button>
//         </form>
//         </div>
//       </div>
//       ) : (
//         <div className="flex items-center flex-col">
//           <div className="border rounded-md py-4 px-6">
//             <p>A Link has been sent to the E-mail provided.</p>

//             <p className="pt-2">
//               Please ensure to check your E-mail and follow the instructions
//               carefully.
//             </p>
//           </div>
//         </div>
//       )}
//     </section>
//     </main>
//   );
// };

// export default ResetStorePassword;
