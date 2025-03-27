"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PayoutAccount, Settlement, Store } from "@/types";
import {
  ArrowUpRight,
  Clock,
  Banknote,
  WalletCards,
  Loader2,
  MoreHorizontal,
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
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

/**
 * LoadingState component displays a skeleton loader while data is being fetched
 * @component
 */
const LoadingState = () => (
  <div className="p-8 space-y-6">
    <div className="grid gap-4 md:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="h-64 rounded-xl" />
    ))}
  </div>
);

/**
 * ErrorState component displays error messages with retry functionality
 * @component
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {Function} [props.onRetry] - Retry callback function
 */
const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => (
  <div className="h-screen flex flex-col items-center justify-center gap-4 p-8">
    <Card className="max-w-md text-center">
      <CardHeader>
        <CardTitle className="text-destructive">Loading Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{message}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  </div>
);

/**
 * StatsCard component displays key metrics with icons and formatted values
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Display value
 * @param {string} props.description - Metric description
 * @param {React.ElementType} props.icon - Lucide React icon component
 */
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
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="p-2 rounded-full bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <CardDescription className="pt-2">{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {typeof value === "number" ? `₦${addCommasToNumber(value)}` : value}
      </div>
    </CardContent>
  </Card>
);

/**
 * StatusBadge component displays colored status indicators
 * @component
 * @param {Object} props - Component props
 * @param {string} props.status - Current status value
 */
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, string> = {
    PAID: "bg-green-100 text-green-800",
    PROCESSING: "bg-yellow-100 text-yellow-800",
    REQUESTED: "bg-blue-100 text-blue-800",
    FAILED: "bg-red-100 text-red-800",
  };

  return (
    <Badge className={`${statusConfig[status] || "bg-gray-100"} capitalize`}>
      {status.toLowerCase()}
    </Badge>
  );
};

/**
 * PayoutHistory component displays store financial data and transaction history
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.params - Route parameters
 * @param {string} props.params.slug - Store identifier
 */
function PayoutHistory({ params }: { params: { slug: string } }) {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeTotalEarnings, setStoreTotalEarnings] = useState(0);
  const [pendingSettlementAmount, setPendingSettlementAmount] = useState(0);
  const [pendingSettlements, setPendingSettlements] = useState<Settlement[]>(
    []
  );
  const [successfulSettlements, setSuccessfulSettlements] = useState<
    Settlement[]
  >([]);
  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);

  /**
   * Fetches store's total earnings from API
   * @async
   */
  const fetchStoreTotalEarnings = async () => {
    try {
      const { data } = await axios.post<{ store: Store }>(
        "/api/store/fetch-store-total-earnings"
      );
      setStoreTotalEarnings(data.store.totalEarnings);
    } catch (err) {
      console.error("Failed to fetch total earnings:", err);
      setError("Failed to load financial summary");
    }
  };

  /**
   * Fetches payout-related data including settlements and accounts
   * @async
   */
  const fetchPayoutData = async () => {
    try {
      const [settlementsRes, accountsRes] = await Promise.all([
        axios.post("/api/store/fetch-pending-payout"),
        axios.post("/api/store/fetch-payout-accounts"),
      ]);

      setPendingSettlements(settlementsRes.data.data.pendingSettlements);
      setSuccessfulSettlements(settlementsRes.data.data.successfulSettlements);
      setPendingSettlementAmount(
        settlementsRes.data.data.pendingSettlementAmount
      );
      setPayoutAccounts(accountsRes.data.payoutAccounts);
    } catch (err) {
      console.error("Failed to fetch payout data:", err);
      setError("Failed to load transaction history");
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
        setError("Failed to initialize dashboard data");
      }
    };

    loadData();
    return () => controller.abort();
  }, []);

  if (loading) return <LoadingState />;
  if (error)
    return (
      <ErrorState message={error} onRetry={() => window.location.reload()} />
    );

  return (
    <main className="p-4 md:p-8 space-y-8">
      {/* Financial Overview Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Financial Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Earnings"
            value={storeTotalEarnings}
            description="Lifetime store revenue"
            icon={Banknote}
          />
          <StatsCard
            title="Pending Settlement"
            value={pendingSettlementAmount}
            description="Awaiting payment processing"
            icon={Clock}
          />
          <StatsCard
            title="Payout Accounts"
            value={payoutAccounts.length}
            description="Registered payment methods"
            icon={WalletCards}
          />
        </div>
      </section>

      {/* Transaction History Section */}
      <section className="space-y-6">
        {/* Pending Settlements Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pending Settlements</CardTitle>
                <CardDescription>Awaiting processing</CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {pendingSettlements.length} Transactions
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSettlements.map((settlement) => (
                  <TableRow key={settlement._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {settlement.mainOrderID.slice(-8)}
                    </TableCell>
                    <TableCell>
                      ₦{addCommasToNumber(settlement.settlementAmount)}
                    </TableCell>
                    <TableCell>{settlement.payoutAccount.bankName}</TableCell>
                    <TableCell>
                      <StatusBadge status={settlement.payoutStatus} />
                    </TableCell>
                    <TableCell>
                      {format(new Date(settlement.createdAt), "PP")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>
                            Transaction Actions
                          </DropdownMenuLabel>
                          <Link
                            href={`/store/${params.slug}/order-details/${settlement.mainOrderID}`}
                          >
                            <DropdownMenuItem className="cursor-pointer">
                              View Details
                            </DropdownMenuItem>
                          </Link>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Completed Settlements Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Completed transactions</CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {successfulSettlements.length} Records
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {successfulSettlements.map((settlement) => (
                  <TableRow key={settlement._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {settlement.mainOrderID.slice(-8)}
                    </TableCell>
                    <TableCell>
                      ₦{addCommasToNumber(settlement.settlementAmount)}
                    </TableCell>
                    <TableCell>{settlement.payoutAccount.bankName}</TableCell>
                    <TableCell>
                      <StatusBadge status={settlement.payoutStatus} />
                    </TableCell>
                    <TableCell>
                      {format(new Date(settlement.createdAt), "PP")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>
                            Transaction Actions
                          </DropdownMenuLabel>
                          <Link
                            href={`/store/${params.slug}/order-details/${settlement.mainOrderID}`}
                          >
                            <DropdownMenuItem className="cursor-pointer">
                              View Details
                            </DropdownMenuItem>
                          </Link>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Payout Accounts Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Registered payout accounts</CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {payoutAccounts.length} Accounts
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Bank</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payoutAccounts.map((account) => (
                  <TableRow
                    key={account.payoutMethod}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>{account.bankDetails.bankName}</TableCell>
                    <TableCell>{account.bankDetails.accountNumber}</TableCell>
                    <TableCell>
                      {account.bankDetails.accountHolderName}
                    </TableCell>
                    <TableCell className="uppercase">
                      {account.payoutMethod}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

export default PayoutHistory;

// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import Link from "next/link";
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
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { calculateCommission, security } from "@/constant/constant";
// import { PayoutAccount, Settlement, Store } from "@/types";
// import {
//   ArrowUpRightFromSquare,
//   ClockIcon,
//   Loader,
//   MoreHorizontalIcon,
// } from "lucide-react";
// import { addCommasToNumber } from "@/lib/utils";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";

// // Reusable loading component with accessibility features
// const LoadingState = () => (
//   <div className="min-h-screen flex flex-col items-center justify-center gap-3">
//     <Loader
//       className="animate-spin w-8 h-8 text-gray-600"
//       aria-label="Loading..."
//     />
//     <p className="text-gray-600">Loading payout data...</p>
//   </div>
// );

// // Error component for consistent error display
// const ErrorState = ({ message }: { message: string }) => (
//   <div className="min-h-screen flex flex-col items-center justify-center gap-3">
//     <div className="text-red-600 text-center max-w-md">
//       <p className="font-medium">Error loading data:</p>
//       <p className="text-sm">{message}</p>
//     </div>
//   </div>
// );

// // Reusable stats card component for consistent UI
// const StatsCard = ({
//   title,
//   value,
//   description,
//   icon: Icon,
// }: {
//   title: string;
//   value: string | number;
//   description: string;
//   icon: React.ElementType;
// }) => (
//   <Card className="h-full hover:shadow-md transition-shadow">
//     <CardHeader>
//       <div className="flex items-center justify-between pb-2">
//         <CardTitle className="text-lg">{title}</CardTitle>
//         <Icon className="w-5 h-5 text-muted-foreground" />
//       </div>
//       <CardDescription>{description}</CardDescription>
//     </CardHeader>
//     <CardContent>
//       <div className="text-2xl font-bold">
//         {typeof value === "number" ? `₦${addCommasToNumber(value)}` : value}
//       </div>
//     </CardContent>
//   </Card>
// );

// // Reusable table component with configurable columns
// const DataTable = ({
//   caption,
//   columns,
//   data,
//   renderRow,
// }: {
//   caption: string;
//   columns: string[];
//   data: any[];
//   renderRow: (item: Settlement | PayoutAccount) => React.ReactNode;
// }) => (
//   <Table>
//     <TableCaption>{caption}</TableCaption>
//     <TableHeader>
//       <TableRow>
//         {columns.map((column) => (
//           <TableHead key={column} className="text-xs sm:text-sm">
//             {column}
//           </TableHead>
//         ))}
//       </TableRow>
//     </TableHeader>
//     <TableBody>{data.map((item) => renderRow(item))}</TableBody>
//   </Table>
// );

// function PayoutHistory({ params }: { params: { slug: string } }) {
//   // State management with TypeScript types
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [storeTotalEarnings, setStoreTotalEarnings] = useState<number>(0);
//   const [pendingSettlementAmount, setPendingSettlementAmount] =
//     useState<number>(0);
//   const [pendingSettlements, setPendingSettlements] = useState<Settlement[]>(
//     []
//   );
//   const [successfulSettlements, setSuccessfulSettlements] = useState<
//     Settlement[]
//   >([]);
//   const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);

//   /**
//    * Fetches store total earnings from API
//    * @returns {Promise<void>} Updates state with fetched data
//    */
//   const fetchStoreTotalEarnings = async () => {
//     try {
//       const { data } = await axios.post<{ store: Store }>(
//         "/api/store/fetch-store-total-earnings"
//       );
//       setStoreTotalEarnings(data.store.totalEarnings);
//     } catch (err) {
//       console.error("Failed to fetch total earnings:", err);
//       setError("Failed to load total earnings data");
//     }
//   };

//   /**
//    * Fetches payout-related data including settlements and accounts
//    * @returns {Promise<void>} Updates multiple state variables
//    */
//   const fetchPayoutData = async () => {
//     try {
//       const [settlementsRes, accountsRes] = await Promise.all([
//         axios.post("/api/store/fetch-pending-payout"),
//         axios.post("/api/store/fetch-payout-accounts"),
//       ]);

//       // Process settlements response
//       const settlementsData = settlementsRes.data.data;
//       setPendingSettlements(settlementsData.pendingSettlements);
//       setSuccessfulSettlements(settlementsData.successfulSettlements);
//       setPendingSettlementAmount(settlementsData.pendingSettlementAmount);

//       // Process payout accounts response
//       if (accountsRes.status === 200) {
//         setPayoutAccounts(accountsRes.data.payoutAccounts);
//       }
//     } catch (err) {
//       console.error("Failed to fetch payout data:", err);
//       setError("Failed to load payout information");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Combined data fetching effect
//   useEffect(() => {
//     const controller = new AbortController();

//     const loadData = async () => {
//       try {
//         await Promise.all([fetchStoreTotalEarnings(), fetchPayoutData()]);
//       } catch (err) {
//         setError("Failed to initialize data");
//       }
//     };

//     loadData();
//     return () => controller.abort();
//   }, []);

//   if (loading) return <LoadingState />;
//   if (error) return <ErrorState message={error} />;

//   return (
//     <main className="flex flex-col gap-6 p-4 md:p-8">
//       {/* Stats Cards Section */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         <StatsCard
//           title="Total Earnings"
//           value={storeTotalEarnings}
//           description="The total amount this store has earned"
//           icon={ArrowUpRightFromSquare}
//         />
//         <StatsCard
//           title="Pending Settlement"
//           value={pendingSettlementAmount}
//           description="Payouts with status 'Requested' or 'Processing'"
//           icon={ClockIcon}
//         />
//         <StatsCard
//           title="Last Payout Date"
//           value="Nov 5, 2024" // This should be dynamic in a real implementation
//           description="When the last payout was made"
//           icon={ClockIcon}
//         />
//       </div>

//       {/* Pending Settlements Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Pending Settlement Requests</CardTitle>
//           <CardDescription>Settlements awaiting processing</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <DataTable
//             caption="Pending settlements with status 'Requested' or 'Processing'"
//             columns={["Order ID", "Amount", "Bank", "Status", "Request Date"]}
//             data={pendingSettlements}
//             renderRow={(settlement) => (
//               <TableRow key={(settlement as Settlement)._id}>
//                 <TableCell>{(settlement as Settlement).mainOrderID}</TableCell>
//                 <TableCell>
//                   ₦
//                   {addCommasToNumber(
//                     (settlement as Settlement).settlementAmount
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   {(settlement as Settlement).payoutAccount.bankName}
//                 </TableCell>
//                 <TableCell className="uppercase">
//                   {(settlement as Settlement).payoutStatus}
//                 </TableCell>
//                 <TableCell>
//                   {new Date(
//                     (settlement as Settlement).createdAt
//                   ).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                   })}
//                 </TableCell>
//                 <TableCell>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         aria-label="Order actions"
//                       >
//                         <MoreHorizontalIcon className="w-5 h-5" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                       <Link
//                         href={`/store/${params.slug}/order-details/${
//                           (settlement as Settlement).mainOrderID
//                         }`}
//                         legacyBehavior
//                       >
//                         <DropdownMenuItem asChild>
//                           <a className="cursor-pointer">View Details</a>
//                         </DropdownMenuItem>
//                       </Link>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//             )}
//           />
//         </CardContent>
//       </Card>

//       {/* Settlement History Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Settlement History</CardTitle>
//           <CardDescription>Completed settlements</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <DataTable
//             caption="Completed settlements with status 'Paid'"
//             columns={[
//               "Order ID",
//               "Amount",
//               "Bank",
//               "Status",
//               "Date",
//               "Actions",
//             ]}
//             data={successfulSettlements}
//             renderRow={(settlement) => (
//               <TableRow key={(settlement as Settlement)._id}>
//                 <TableCell>{(settlement as Settlement).mainOrderID}</TableCell>
//                 <TableCell>
//                   ₦
//                   {addCommasToNumber(
//                     (settlement as Settlement).settlementAmount
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   {(settlement as Settlement).payoutAccount.bankName}
//                 </TableCell>
//                 <TableCell className="uppercase">
//                   {(settlement as Settlement).payoutStatus}
//                 </TableCell>
//                 <TableCell>
//                   {new Date(
//                     (settlement as Settlement).createdAt
//                   ).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                   })}
//                 </TableCell>
//                 <TableCell>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         aria-label="Order actions"
//                       >
//                         <MoreHorizontalIcon className="w-5 h-5" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                       <Link
//                         href={`/store/${params.slug}/order-details/${
//                           (settlement as Settlement).mainOrderID
//                         }`}
//                         legacyBehavior
//                       >
//                         <DropdownMenuItem asChild>
//                           <a className="cursor-pointer">View Details</a>
//                         </DropdownMenuItem>
//                       </Link>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//             )}
//           />
//         </CardContent>
//       </Card>

//       {/* Payout Accounts Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Payout Accounts</CardTitle>
//           <CardDescription>Registered payment methods</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <DataTable
//             caption="Registered payout accounts for this store"
//             columns={["Method", "Bank", "Account Number", "Account Name"]}
//             data={payoutAccounts}
//             renderRow={(account) => (
//               <TableRow key={(account as PayoutAccount).payoutMethod}>
//                 <TableCell className="uppercase">
//                   {(account as PayoutAccount).payoutMethod}
//                 </TableCell>
//                 <TableCell>
//                   {(account as PayoutAccount).bankDetails.bankName}
//                 </TableCell>
//                 <TableCell>
//                   {(account as PayoutAccount).bankDetails.accountNumber}
//                 </TableCell>
//                 <TableCell>
//                   {(account as PayoutAccount).bankDetails.accountHolderName}
//                 </TableCell>
//               </TableRow>
//             )}
//           />
//         </CardContent>
//       </Card>
//     </main>
//   );
// }

// export default PayoutHistory;
