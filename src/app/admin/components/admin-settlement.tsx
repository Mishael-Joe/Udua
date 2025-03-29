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
import { formatNaira } from "@/lib/utils";
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
              {formatNaira(pendingSettlementAmount)}
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
                      {formatNaira(settlement.settlementAmount)}
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
                  {formatNaira(pendingSettlementAmount)}
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
