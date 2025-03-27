"use client";

// Core imports
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Icons & Types
import {
  Loader,
  MoreHorizontalIcon,
  AlertCircle,
  Banknote,
  Clock,
} from "lucide-react";
import { Settlement } from "@/types";

// Utilities
import { addCommasToNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { withAdminAuth } from "./auth/with-admin-auth";
import { PERMISSIONS } from "@/lib/rbac/permissions";

/**
 * Admin Settlement Dashboard Component
 * Displays pending settlement requests and financial overview for administrators
 */
function AdminSettlementPage() {
  // State Management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pendingSettlements, setPendingSettlements] = useState<
    Settlement[] | null
  >(null);
  const [pendingSettlementAmount, setPendingSettlementAmount] =
    useState<number>(0);

  /**
   * Fetches pending payout data from the API
   * Handles loading states and errors
   */
  useEffect(() => {
    const fetchPendingPayout = async () => {
      try {
        const response = await axios.post("/api/admin/fetch-pending-payout");
        setPendingSettlementAmount(response.data.data.pendingSettlementAmount);
        setPendingSettlements(response.data.data.pendingSettlements);
        setLoading(false);
      } catch (error: any) {
        console.error("Failed to fetch settlement data", error.message);
        setError(true);
        setLoading(false);
      }
    };

    fetchPendingPayout();

    // Cleanup timeout for aborting fetch
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError(true);
        setLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [loading]);

  // Loading State UI
  if (loading && !error) {
    return (
      <div className="min-h-screen p-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[150px] rounded-xl" />
        </div>
        <Skeleton className="h-[500px] rounded-xl" />
      </div>
    );
  }

  // Error State UI
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Failed to Load Data</h2>
          <p className="text-muted-foreground">
            Please check your network connection and try again
          </p>
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Settlement Management
        </h1>
        <p className="text-muted-foreground">
          Review and manage pending settlement requests
        </p>
      </div>

      {/* Financial Overview Card */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Balance
            </CardTitle>
            <Banknote className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₦{addCommasToNumber(pendingSettlementAmount)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total requested settlements awaiting processing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Settlement Requests Table */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Bank Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pendingSettlements?.map((settlement) => (
                <TableRow key={settlement._id} className="hover:bg-muted/10">
                  {/* Amount */}
                  <TableCell>
                    <div className="font-semibold">
                      ₦{addCommasToNumber(settlement.settlementAmount)}
                    </div>
                  </TableCell>

                  {/* Bank Details */}
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">
                        {settlement.payoutAccount.accountHolderName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {settlement.payoutAccount.bankName}
                      </p>
                      <p className="font-mono text-sm">
                        {settlement.payoutAccount.accountNumber}
                      </p>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "uppercase text-xs",
                        settlement.payoutStatus === "Requested" &&
                          "bg-yellow-500/10 text-yellow-600",
                        settlement.payoutStatus === "Processing" &&
                          "bg-blue-500/10 text-blue-600"
                      )}
                    >
                      {settlement.payoutStatus}
                    </Badge>
                  </TableCell>

                  {/* Request Date */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {new Date(settlement.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(settlement.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </TableCell>

                  {/* Actions Menu */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="data-[state=open]:bg-muted"
                        >
                          <MoreHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Link href={`/admin/payout/${settlement._id}`}>
                          <DropdownMenuItem className="cursor-pointer">
                            View Details
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>Export Record</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Flag Issue
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            {/* Table Footer */}
            <TableFooter className="bg-muted/50">
              <TableRow>
                <TableCell colSpan={5}>Total Pending</TableCell>
                <TableCell className="text-right font-bold">
                  ₦{addCommasToNumber(pendingSettlementAmount)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

export default withAdminAuth(AdminSettlementPage, {
  requiredPermissions: [PERMISSIONS.VIEW_SETTLEMENTS],
});

// "use client";

// import { Settlement } from "@/types";
// import axios from "axios";
// import { Loader, MoreHorizontalIcon } from "lucide-react";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { addCommasToNumber } from "@/lib/utils";
// import { Button } from "@/components/ui/button";

// function AdminSettlement() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [pendingSettlements, setPendingSettlements] = useState<
//     Settlement[] | null
//   >(null);
//   const [pendingSettlementAmount, setPendingSettlementAmount] =
//     useState<number>(0);

//   useEffect(() => {
//     const FetchPendingPayout = async () => {
//       try {
//         const response = await axios.post("/api/admin/fetch-pending-payout");
//         //   console.log("FetchPendingPayout", response);
//         // console.log("sellerdata.data.orders", response.data.orders);
//         setPendingSettlementAmount(response.data.data.pendingSettlementAmount);
//         setPendingSettlements(response.data.data.pendingSettlements);
//         setLoading(false); // Stop loading when data is fetched
//       } catch (error: any) {
//         console.error("Failed to fetch Store Total Earnings", error.message);
//         setError(true);
//         setLoading(false);
//       }
//     };

//     FetchPendingPayout();

//     // Set a timeout to show error message if data isn't fetched within 10 seconds
//     const timeoutId = setTimeout(() => {
//       if (loading) {
//         setError(true);
//         setLoading(false);
//       }
//     }, 10000); // 10 seconds timeout

//     // Cleanup the timeout when the component unmounts or fetch is successful
//     return () => clearTimeout(timeoutId);
//   }, [loading]);

//   if (loading && !error) {
//     return (
//       <div className="w-full min-h-screen flex items-center justify-center">
//         <p className="w-full h-full flex items-center justify-center">
//           <Loader className="animate-spin" /> Loading...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full min-h-screen flex items-center justify-center">
//         <p className="text-center text-red-600">
//           An error occurred. Please check your internet connection.
//         </p>
//       </div>
//     );
//   }

//   if (pendingSettlements === null) {
//     return (
//       <div className="w-full min-h-screen flex items-center justify-center">
//         <p className="w-full h-full flex items-center justify-center">
//           <Loader className="animate-spin" /> Loading...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>AdminSettlement</h1>
//       <div className="w-full">
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           <Card className="h-full">
//             <CardHeader>
//               <div className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle>Pending Settlement</CardTitle>
//                 <p>&#8358;</p>
//               </div>
//               <CardDescription>
//                 All payouts with status 'requested' or 'processing'.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 &#8358; {addCommasToNumber(pendingSettlementAmount)}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <div className="w-full">
//         <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
//           <Card>
//             <CardHeader>
//               <CardTitle>Pending Settlement Requests</CardTitle>
//             </CardHeader>
//             <CardContent className="grid gap-8">
//               <Table>
//                 <TableCaption>
//                   This tabel shows all Settlements with status "requested" and
//                   "Processing".
//                 </TableCaption>
//                 <TableHeader>
//                   <TableRow className=" text-[12.8px]">
//                     <TableHead>Order ID</TableHead>
//                     <TableHead>Amount</TableHead>
//                     <TableHead>Payout Account</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Requested On</TableHead>
//                     <TableHead>More</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {pendingSettlements!.map((settlement) => (
//                     <TableRow key={settlement._id}>
//                       <TableCell className="font-medium">
//                         {settlement.mainOrderID} - {settlement.subOrderID}
//                       </TableCell>

//                       <TableCell>
//                         &#8358; {addCommasToNumber(settlement.settlementAmount)}
//                       </TableCell>

//                       <TableCell>
//                         {settlement.payoutAccount.bankName} <br />
//                         {settlement.payoutAccount.accountHolderName} <br />
//                         {settlement.payoutAccount.accountNumber}
//                       </TableCell>

//                       <TableCell>
//                         {settlement.payoutStatus.toUpperCase()}
//                       </TableCell>

//                       <TableCell>
//                         {new Date(settlement.createdAt).toLocaleDateString(
//                           "en-US",
//                           {
//                             year: "numeric",
//                             month: "long",
//                             day: "numeric",
//                           }
//                         )}
//                       </TableCell>

//                       <TableCell>
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button
//                               aria-haspopup="true"
//                               size="icon"
//                               variant="ghost"
//                             >
//                               <MoreHorizontalIcon className="h-4 w-4" />
//                               <span className="sr-only">Toggle menu</span>
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                             <Link href={`/admin/payout/${settlement._id}`}>
//                               <DropdownMenuItem>More</DropdownMenuItem>
//                             </Link>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminSettlement;
