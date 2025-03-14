"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateCommission, security } from "@/constant/constant";
import { PayoutAccount, Settlement, Store } from "@/types";
import {
  ArrowUpRightFromSquare,
  ClockIcon,
  Loader,
  MoreHorizontalIcon,
} from "lucide-react";
import { addCommasToNumber } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Reusable loading component with accessibility features
const LoadingState = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-3">
    <Loader
      className="animate-spin w-8 h-8 text-gray-600"
      aria-label="Loading..."
    />
    <p className="text-gray-600">Loading payout data...</p>
  </div>
);

// Error component for consistent error display
const ErrorState = ({ message }: { message: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-3">
    <div className="text-red-600 text-center max-w-md">
      <p className="font-medium">Error loading data:</p>
      <p className="text-sm">{message}</p>
    </div>
  </div>
);

// Reusable stats card component for consistent UI
const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
}) => (
  <Card className="h-full hover:shadow-md transition-shadow">
    <CardHeader>
      <div className="flex items-center justify-between pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {typeof value === "number" ? `₦${addCommasToNumber(value)}` : value}
      </div>
    </CardContent>
  </Card>
);

// Reusable table component with configurable columns
const DataTable = ({
  caption,
  columns,
  data,
  renderRow,
}: {
  caption: string;
  columns: string[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;
}) => (
  <Table>
    <TableCaption>{caption}</TableCaption>
    <TableHeader>
      <TableRow>
        {columns.map((column) => (
          <TableHead key={column} className="text-xs sm:text-sm">
            {column}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>{data.map((item) => renderRow(item))}</TableBody>
  </Table>
);

function PayoutHistory() {
  // State management with TypeScript types
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeTotalEarnings, setStoreTotalEarnings] = useState<number>(0);
  const [pendingSettlementAmount, setPendingSettlementAmount] =
    useState<number>(0);
  const [pendingSettlements, setPendingSettlements] = useState<Settlement[]>(
    []
  );
  const [successfulSettlements, setSuccessfulSettlements] = useState<
    Settlement[]
  >([]);
  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);

  /**
   * Fetches store total earnings from API
   * @returns {Promise<void>} Updates state with fetched data
   */
  const fetchStoreTotalEarnings = async () => {
    try {
      const { data } = await axios.post<{ store: Store }>(
        "/api/store/fetch-store-total-earnings"
      );
      setStoreTotalEarnings(data.store.totalEarnings);
    } catch (err) {
      console.error("Failed to fetch total earnings:", err);
      setError("Failed to load total earnings data");
    }
  };

  /**
   * Fetches payout-related data including settlements and accounts
   * @returns {Promise<void>} Updates multiple state variables
   */
  const fetchPayoutData = async () => {
    try {
      const [settlementsRes, accountsRes] = await Promise.all([
        axios.post("/api/store/fetch-pending-payout"),
        axios.post("/api/store/fetch-payout-accounts"),
      ]);

      // Process settlements response
      const settlementsData = settlementsRes.data.data;
      setPendingSettlements(settlementsData.pendingSettlements);
      setSuccessfulSettlements(settlementsData.successfulSettlements);
      setPendingSettlementAmount(settlementsData.pendingSettlementAmount);

      // Process payout accounts response
      if (accountsRes.status === 200) {
        setPayoutAccounts(accountsRes.data.payoutAccounts);
      }
    } catch (err) {
      console.error("Failed to fetch payout data:", err);
      setError("Failed to load payout information");
    } finally {
      setLoading(false);
    }
  };

  // Combined data fetching effect
  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        await Promise.all([fetchStoreTotalEarnings(), fetchPayoutData()]);
      } catch (err) {
        setError("Failed to initialize data");
      }
    };

    loadData();
    return () => controller.abort();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <main className="flex flex-col gap-6 p-4 md:p-8">
      {/* Stats Cards Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Earnings"
          value={storeTotalEarnings}
          description="The total amount this store has earned"
          icon={ArrowUpRightFromSquare}
        />
        <StatsCard
          title="Pending Settlement"
          value={pendingSettlementAmount}
          description="Payouts with status 'requested' or 'processing'"
          icon={ClockIcon}
        />
        <StatsCard
          title="Last Payout Date"
          value="Nov 5, 2024" // This should be dynamic in a real implementation
          description="When the last payout was made"
          icon={ClockIcon}
        />
      </div>

      {/* Pending Settlements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Settlement Requests</CardTitle>
          <CardDescription>Settlements awaiting processing</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            caption="Pending settlements with status 'Requested' or 'Processing'"
            columns={["Order ID", "Amount", "Bank", "Status", "Request Date"]}
            data={pendingSettlements}
            renderRow={(settlement) => (
              <TableRow key={settlement._id}>
                <TableCell>{settlement.orderID}</TableCell>
                <TableCell>
                  ₦{addCommasToNumber(settlement.settlementAmount)}
                </TableCell>
                <TableCell>{settlement.payoutAccount.bankName}</TableCell>
                <TableCell className="uppercase">
                  {settlement.payoutStatus}
                </TableCell>
                <TableCell>
                  {new Date(settlement.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
              </TableRow>
            )}
          />
        </CardContent>
      </Card>

      {/* Settlement History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Settlement History</CardTitle>
          <CardDescription>Completed settlements</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            caption="Completed settlements with status 'Paid'"
            columns={["Order ID", "Amount", "Bank", "Status", "Date"]}
            data={successfulSettlements}
            renderRow={(settlement) => (
              <TableRow key={settlement._id}>
                <TableCell>{settlement.orderID}</TableCell>
                <TableCell>
                  ₦{addCommasToNumber(settlement.settlementAmount)}
                </TableCell>
                <TableCell>{settlement.payoutAccount.bankName}</TableCell>
                <TableCell className="uppercase">
                  {settlement.payoutStatus}
                </TableCell>
                <TableCell>
                  {new Date(settlement.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
              </TableRow>
            )}
          />
        </CardContent>
      </Card>

      {/* Payout Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Accounts</CardTitle>
          <CardDescription>Registered payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            caption="Registered payout accounts for this store"
            columns={["Method", "Bank", "Account Number", "Account Name"]}
            data={payoutAccounts}
            renderRow={(account) => (
              <TableRow key={account.payoutMethod}>
                <TableCell className="uppercase">
                  {account.payoutMethod}
                </TableCell>
                <TableCell>{account.bankDetails.bankName}</TableCell>
                <TableCell>{account.bankDetails.accountNumber}</TableCell>
                <TableCell>{account.bankDetails.accountHolderName}</TableCell>
              </TableRow>
            )}
          />
        </CardContent>
      </Card>
    </main>
  );
}

export default PayoutHistory;

// "use client";

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
// import { calculateCommission, security } from "@/constant/constant";
// import { PayoutAccount, Settlement, Store } from "@/types";
// import axios from "axios";
// import {
//   ArrowUpRightFromSquare,
//   ClockIcon,
//   Loader,
//   MoreHorizontalIcon,
// } from "lucide-react";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { addCommasToNumber } from "@/lib/utils";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";

// function PayoutHistory() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [storeTotalEarnings, setStoreTotalEarnings] = useState<number>(0);
//   const [pendingSettlementAmount, setPendingSettlementAmount] =
//     useState<number>(0);
//   const [pendingSettlements, setPendingSettlements] = useState<
//     Settlement[] | null
//   >(null);
//   const [successfulSettlements, setSuccessfulSettlements] = useState<
//     Settlement[] | null
//   >(null);
//   const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);

//   useEffect(() => {
//     const fetchStoreTotalEarnings = async () => {
//       try {
//         const response = await axios.post<{ store: Store }>(
//           "/api/store/fetch-store-total-earnings"
//         );
//         // console.log("StoreTotalEarnings", response);
//         // console.log("sellerdata.data.orders", response.data.orders);
//         setStoreTotalEarnings(response.data.store.totalEarnings);
//       } catch (error: any) {
//         console.error("Failed to fetch Store Total Earnings", error.message);
//       }
//     };

//     fetchStoreTotalEarnings();
//   }, []);

//   useEffect(() => {
//     const FetchPendingPayout = async () => {
//       try {
//         const response = await axios.post("/api/store/fetch-pending-payout");
//         //   console.log("FetchPendingPayout", response);
//         // console.log("sellerdata.data.orders", response.data.orders);
//         setPendingSettlements(response.data.data.pendingSettlements);
//         setSuccessfulSettlements(response.data.data.successfulSettlements);
//         setPendingSettlementAmount(response.data.data.pendingSettlementAmount);
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

//   useEffect(() => {
//     async function fetchPayoutAccounts() {
//       try {
//         const response = await axios.post("/api/store/fetch-payout-accounts");

//         if (response.status === 200) {
//           setPayoutAccounts(response.data.payoutAccounts);
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

//   if (pendingSettlements === null || successfulSettlements === null) {
//     return (
//       <div className="w-full min-h-screen flex items-center justify-center">
//         <p className="w-full h-full flex items-center justify-center">
//           <Loader className="animate-spin" /> Loading...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
//       <div className="w-full">
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           <Card className="h-full">
//             <CardHeader>
//               <div className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle>Total Earnings</CardTitle>
//                 <p>&#8358;</p>
//               </div>
//               <CardDescription>
//                 The total amount this store has earned.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 &#8358;{" "}
//                 {storeTotalEarnings ? addCommasToNumber(storeTotalEarnings) : 0}
//               </div>
//             </CardContent>
//           </Card>

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

//           <Card className="h-full">
//             <CardHeader>
//               <div className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle>Last Payout Date</CardTitle>
//                 <p>
//                   <ClockIcon />
//                 </p>
//               </div>
//               <CardDescription>
//                 When the last payout was made to this store.
//               </CardDescription>
//             </CardHeader>

//             <CardContent>
//               <div className="text-2xl font-bold">Nov 5, 2024</div>
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
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {pendingSettlements!.map((settlement) => (
//                     <TableRow key={settlement._id}>
//                       <TableCell className="font-medium">
//                         {settlement.orderID}
//                       </TableCell>

//                       <TableCell>{settlement.settlementAmount}</TableCell>

//                       <TableCell>{settlement.payoutAccount.bankName}</TableCell>

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
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <div className="w-full">
//         <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
//           <Card>
//             <CardHeader>
//               <CardTitle>Settlement History</CardTitle>
//             </CardHeader>
//             <CardContent className="grid gap-8">
//               <Table>
//                 <TableCaption>
//                   This tabel shows all Settlements with status "Paid".
//                 </TableCaption>
//                 <TableHeader>
//                   <TableRow className=" text-[12.8px]">
//                     <TableHead>Date</TableHead>
//                     <TableHead>Order ID</TableHead>
//                     <TableHead>Amount</TableHead>
//                     <TableHead>Payout Method</TableHead>
//                     <TableHead>Status</TableHead>
//                     {/* <TableHead>Requested On</TableHead> */}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {successfulSettlements!.map((settlement) => (
//                     <TableRow key={settlement._id}>
//                       <TableCell className="font-medium">
//                         {settlement.orderID}
//                       </TableCell>

//                       <TableCell>{settlement.settlementAmount}</TableCell>

//                       <TableCell>{settlement.payoutAccount.bankName}</TableCell>

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
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <div className="w-full">
//         <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
//           <Card>
//             <CardHeader>
//               <CardTitle>Payout Accounts</CardTitle>
//             </CardHeader>
//             <CardContent className="grid gap-8">
//               <Table>
//                 <TableHeader>
//                   <TableRow className=" text-[12.8px]">
//                     <TableHead>Payout Method</TableHead>
//                     <TableHead>Bank Name</TableHead>
//                     <TableHead>Account Number</TableHead>
//                     <TableHead>Account Holder Name</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {payoutAccounts!.map((account) => (
//                     <TableRow key={account.payoutMethod}>
//                       <TableCell>
//                         {account.payoutMethod.toUpperCase()}
//                       </TableCell>

//                       <TableCell>{account.bankDetails.bankName}</TableCell>

//                       <TableCell>{account.bankDetails.accountNumber}</TableCell>

//                       <TableCell>
//                         {account.bankDetails.accountHolderName}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </main>
//   );
// }

// export default PayoutHistory;
