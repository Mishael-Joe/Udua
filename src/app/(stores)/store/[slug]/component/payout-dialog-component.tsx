"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { addCommasToNumber } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { BankDetails, PayoutAccount } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Banknote, AlertCircle } from "lucide-react";

interface PayableAmountProps {
  payableAmount: number;
  mainOrderID: string;
  subOrderID: string;
}

/**
 * PayoutDialog component for handling settlement requests
 * Allows users to select a bank account and initiate payout
 */
export function PayoutDialog({
  payableAmount,
  mainOrderID,
  subOrderID,
}: PayableAmountProps) {
  const { toast } = useToast();
  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<BankDetails | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch payout accounts on component mount
  useEffect(() => {
    const fetchPayoutAccounts = async () => {
      try {
        const { data } = await axios.post("/api/store/fetch-payout-accounts");
        setPayoutAccounts(data.payoutAccounts);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load payout accounts");
      } finally {
        setLoading(false);
      }
    };

    fetchPayoutAccounts();
  }, []);

  /**
   * Handles payout request submission
   * Validates selection and initiates API call
   */
  const handleSubmit = async () => {
    if (!selectedAccount) return;

    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/api/store/settlement", {
        mainOrderID,
        subOrderID,
        settlementAmount: payableAmount,
        selectedPayoutAccount: selectedAccount,
      });

      toast({
        title: "Success",
        description: data.message || "Settlement requested successfully",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to process payout",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Banknote className="h-4 w-4" />
          Request Payout
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Initiate Payout
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>Select account for transferring your funds</p>

            {/* Payment Summary */}
            <Alert className="text-left">
              <AlertDescription>
                Total Payable Amount:{" "}
                <span className="font-semibold">
                  ₦{addCommasToNumber(payableAmount)}
                </span>
              </AlertDescription>
            </Alert>
          </DialogDescription>
        </DialogHeader>

        {/* Account Selection Area */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : payoutAccounts.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {payoutAccounts.map((account, index) => (
                <AccountCard
                  key={index}
                  account={account.bankDetails}
                  isSelected={
                    selectedAccount?.bankCode === account.bankDetails.bankCode
                  }
                  onSelect={() => setSelectedAccount(account.bankDetails)}
                />
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                No payout accounts found. Please add a bank account first.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Submission Controls */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!selectedAccount || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Payout"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Reusable account card component
 * @param account - BankDetails object
 * @param isSelected - Boolean indicating selection state
 * @param onSelect - Selection handler function
 */
function AccountCard({
  account,
  isSelected,
  onSelect,
}: {
  account: BankDetails;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Card
      onClick={onSelect}
      className={cn(
        "cursor-pointer transition-all hover:border-primary",
        isSelected ? "border-2 border-primary" : ""
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {account.accountHolderName}
        </CardTitle>
        <span className="text-xs text-muted-foreground">
          {account.bankName}
        </span>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-sm">{account.accountNumber}</p>
      </CardContent>
    </Card>
  );
}

// Utility function for conditional class names
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { BankDetails, PayoutAccount } from "@/types";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { addCommasToNumber } from "@/lib/utils";
// import { useToast } from "@/components/ui/use-toast";

// interface PayableAmount {
//   payableAmount: number;
//   mainOrderID: string;
//   subOrderID: string;
// }

// function PayoutDialog({
//   payableAmount,
//   mainOrderID,
//   subOrderID,
// }: PayableAmount) {
//   const { toast } = useToast();
//   const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedPayoutAccount, setselectedPayoutAccount] =
//     useState<BankDetails | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchPayoutAccounts() {
//       try {
//         const response = await axios.post("/api/store/fetch-payout-accounts");

//         if (response.status === 200) {
//           setPayoutAccounts(response.data.payoutAccounts);
//           console.log(
//             "response.data.payoutAccounts",
//             response.data.payoutAccounts
//           );
//         } else {
//           throw new Error(
//             response.data.error || "Failed to fetch payout accounts"
//           );
//         }
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchPayoutAccounts();
//   }, []);

//   const handleClick = (index: number) => {
//     setselectedPayoutAccount(payoutAccounts[index].bankDetails);

//     // console.log('selectedPayoutAccount', selectedPayoutAccount)
//   };

//   const handleSubmit = async () => {
//     setLoading(true); // Set loading state before the request

//     const body = {
//       mainOrderID: mainOrderID,
//       subOrderID: subOrderID,
//       settlementAmount: payableAmount,
//       selectedPayoutAccount: selectedPayoutAccount,
//     };

//     try {
//       const response = await axios.post("/api/store/settlement", body);

//       if (response.status === 200) {
//         toast({
//           title: "Success",
//           description: "Settlement requested successfully",
//         });
//       } else if (response.status === 409) {
//         toast({
//           title: "Error",
//           description: response.data.message,
//         });
//       }
//     } catch (error: any) {
//       // Check if the error has a response from the server
//       if (error.response) {
//         toast({
//           title: "Error",
//           description:
//             error.response.data.message ||
//             "An error occurred while processing your request. Please try again later.",
//         });
//       } else {
//         toast({
//           title: "Error",
//           description:
//             "An error occurred while processing your request. Please try again later. If this error persists, please contact our support team.",
//         });
//       }

//       console.error("An error occurred while processing your request.", error);
//     } finally {
//       setLoading(false); // Stop loading after the request is complete
//     }
//   };

//   return (
//     <div>
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button
//             className="bg-udua-orange-primary/85 text-slate-100 hover:bg-udua-orange-primary hover:text-slate-100"
//             variant={"ghost"}
//           >
//             <span>Request Payout</span>
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Select Account</DialogTitle>
//             <DialogDescription>
//               Please select an account you want your money transferred to.
//             </DialogDescription>

//             <p>
//               Note: Your total payable Amount is &#8358;{" "}
//               {addCommasToNumber(payableAmount)}
//             </p>

//             {loading ? (
//               <p>Loading payout accounts...</p>
//             ) : error ? (
//               <p className="text-red-500">{error}</p>
//             ) : (
//               <div className="py-4">
//                 <h2 className="pb-2">
//                   Payout Account{payoutAccounts.length > 1 && "s"}
//                 </h2>
//                 {payoutAccounts.length > 0 ? (
//                   <div className=" h-52 overflow-auto">
//                     {payoutAccounts.map((account, index) => (
//                       <Card
//                         key={index}
//                         className={`cursor-pointer my-3 ${
//                           selectedPayoutAccount?.accountNumber ===
//                             account.bankDetails.accountNumber &&
//                           selectedPayoutAccount?.bankName ===
//                             account.bankDetails.bankName
//                             ? "!border-udua-orange-primary !border"
//                             : ""
//                         }`}
//                         onClick={() => handleClick(index)}
//                       >
//                         <CardHeader>
//                           <CardTitle>
//                             {account.bankDetails.accountHolderName}
//                           </CardTitle>
//                           <CardDescription>
//                             {account.bankDetails.bankName}
//                           </CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                           {account.bankDetails.accountNumber}
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 ) : (
//                   <p>No payout accounts found.</p>
//                 )}
//               </div>
//             )}

//             <Button
//               disabled={selectedPayoutAccount === null ? true : false}
//               onClick={() => handleSubmit()}
//               className="bg-udua-orange-primary/85 hover:bg-udua-orange-primary"
//             >
//               Submit
//             </Button>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default PayoutDialog;
