"use client";

import Link from "next/link";
// import { v4 as uuidv4 } from "uuid";
const { v4: uuidv4 } = require("uuid");
import { useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { addCommasToNumber } from "@/lib/utils";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
// import { ReloadIcon } from "@radix-ui/react-icons";

export default function AdminCompleteThePayOutPage() {
  const { toast } = useToast();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get transaction parameters from URL
  const amount = searchParams.get("amount");
  const recipient = searchParams.get("recipient");
  const uniqueRef = "Udua" + uuidv4();

  // Convert amount to kobo (smallest currency unit) for payment processing
  const amountInKobo = Number(amount) * 100;

  const handleInitiateTransfer = async () => {
    if (!recipient || !amount) {
      setErrorMessage("Missing required transaction parameters");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Initiate transfer through API
      const response = await axios.post("/api/admin/transfer", {
        recipient_code: recipient,
        amount: amountInKobo,
        reference: uniqueRef,
      });

      if (response.data.success) {
        setIsSuccess(true);
        toast({
          title: "Transfer Initiated Successfully",
          description: "Funds are being processed to the recipient account",
        });
      }
    } catch (error: any) {
      console.error("Transfer Error:", error);
      const message =
        error.response?.data?.error || "Failed to initiate transfer";
      setErrorMessage(message);
      toast({
        title: "Transfer Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Payout Processing
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Transaction Details */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient Code:</span>
              <span className="font-medium">{recipient}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transfer Amount:</span>
              <span className="font-medium">
                ₦{addCommasToNumber(Number(amount))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Transaction Reference:
              </span>
              <span className="font-medium text-primary">{uniqueRef}</span>
            </div>
          </div>

          {/* Status Indicators */}
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTitle>Transaction Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {isSuccess && (
            <Alert>
              <AlertTitle>Transfer Initiated</AlertTitle>
              <AlertDescription>
                Funds transfer processing has started. Please allow 1-3 business
                days for settlement.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {/* Action Button */}
          <Button
            onClick={handleInitiateTransfer}
            disabled={isLoading || isSuccess}
            className="w-full sm:w-48"
            size="lg"
          >
            {isLoading ? (
              <>
                {/* <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> */}
                Processing...
              </>
            ) : isSuccess ? (
              "Transfer Initiated"
            ) : (
              "Confirm Transfer"
            )}
          </Button>

          {/* Additional Information */}
          <p className="text-center text-sm text-muted-foreground">
            {" "}
            Please verify all details before proceeding.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}

// "use client";

// import Link from "next/link";
// const { v4: uuidv4 } = require("uuid");
// import { useSearchParams, usePathname } from "next/navigation";
// import { useEffect } from "react";
// import { addCommasToNumber } from "@/lib/utils";
// import axios from "axios";

// export default function AdminCompleteThePayOutPage() {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const startsWithSuccess = pathname.startsWith("/success");

//   const amount = searchParams.get("amount");
//   const recipient = searchParams.get("recipient");
//   const uniqueRef = "Udua" + uuidv4();
//   // console.log(`recipient`, recipient);
//   // console.log(`amount`, amount);

//   const handleInitiateTransaction = async () => {

//       try {
//         // setIsLoading(true);
//         const response = await axios.post(
//           `/api/admin/create-transfer-recipient`
//         );
//         // console.log("response", response.data);

//       } catch (error) {
//         console.log("Erorr Creating Transfer Recipient", error);
//       } finally {
//         // setIsLoading(false);
//       }
//     };

//   return (
//     <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
//       <div className="text-center">
//         <h1>
//           Complete this transaction using the generated recipient ID:{" "}
//           {recipient}
//         </h1>
//         <h1>Payout amout: ₦{addCommasToNumber(Number(amount!))}</h1>
//         {/* Checkout session */}
//         <>
//           <h1 className="mt-4 text-3xl font-bold tracking-tight text-lime-500 dark:text-lime-400 sm:text-5xl">
//             Order Successful!
//           </h1>
//           <h3 className="mt-8 text-2xl leading-7">Thank you</h3>
//           <p className="mt-8">
//             Check your purchase email
//             <span className="mx-1 font-extrabold text-indigo-500">
//               {amount}
//             </span>
//             for your invoice.
//           </p>
//           <p className="mt-8">
//             Your transaction reference{" "}
//             <span className="mx-1 font-extrabold text-indigo-500">
//               {recipient}
//             </span>
//           </p>
//         </>
//       </div>
//     </main>
//   );
// }
