"use client";

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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateCommission, security } from "@/constant/constant";
import { PayoutAccount, Settlement, Store } from "@/types";
import axios from "axios";
import {
  ArrowUpRightFromSquare,
  ClockIcon,
  Loader,
  MoreHorizontalIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addCommasToNumber } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function PayoutHistory() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [storeTotalEarnings, setStoreTotalEarnings] = useState<number | null>(
    null
  );
  const [pendingSettlementAmount, setPendingSettlementAmount] =
    useState<number>(0);
  const [pendingSettlements, setPendingSettlements] = useState<
    Settlement[] | null
  >(null);
  const [successfulSettlements, setSuccessfulSettlements] = useState<
    Settlement[] | null
  >(null);
  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);

  useEffect(() => {
    const fetchStoreTotalEarnings = async () => {
      try {
        const response = await axios.post<{ store: Store }>(
          "/api/store/fetch-store-total-earnings"
        );
        // console.log("StoreTotalEarnings", response);
        // console.log("sellerdata.data.orders", response.data.orders);
        setStoreTotalEarnings(response.data.store.totalEarnings);
      } catch (error: any) {
        console.error("Failed to fetch Store Total Earnings", error.message);
      }
    };

    fetchStoreTotalEarnings();
  }, []);

  useEffect(() => {
    const FetchPendingPayout = async () => {
      try {
        const response = await axios.post("/api/store/fetch-pending-payout");
        //   console.log("FetchPendingPayout", response);
        // console.log("sellerdata.data.orders", response.data.orders);
        setPendingSettlements(response.data.data.pendingSettlements);
        setSuccessfulSettlements(response.data.data.successfulSettlements);
        setPendingSettlementAmount(response.data.data.pendingSettlementAmount);
        setLoading(false); // Stop loading when data is fetched
      } catch (error: any) {
        console.error("Failed to fetch Store Total Earnings", error.message);
        setError(true);
        setLoading(false);
      }
    };

    FetchPendingPayout();

    // Set a timeout to show error message if data isn't fetched within 10 seconds
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError(true);
        setLoading(false);
      }
    }, 10000); // 10 seconds timeout

    // Cleanup the timeout when the component unmounts or fetch is successful
    return () => clearTimeout(timeoutId);
  }, [loading]);

  useEffect(() => {
    async function fetchPayoutAccounts() {
      try {
        const response = await axios.post("/api/store/fetch-payout-accounts");

        if (response.status === 200) {
          setPayoutAccounts(response.data.payoutAccounts);
        } else {
          throw new Error(
            response.data.error || "Failed to fetch payout accounts"
          );
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPayoutAccounts();
  }, []);

  if (loading && !error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin" /> Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-center text-red-600">
          An error occurred. Please check your internet connection.
        </p>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="w-full">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="h-full">
            <CardHeader>
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Total Earnings</CardTitle>
                <p>&#8358;</p>
              </div>
              <CardDescription>
                The total amount this store has earned.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                &#8358;{" "}
                {storeTotalEarnings ? addCommasToNumber(storeTotalEarnings) : 0}
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Pending Settlement</CardTitle>
                <p>&#8358;</p>
              </div>
              <CardDescription>
                All payouts with status 'requested' or 'processing'.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                &#8358; {addCommasToNumber(pendingSettlementAmount)}
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Last Payout Date</CardTitle>
                <p>
                  <ClockIcon />
                </p>
              </div>
              <CardDescription>
                When the last payout was made to this store.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">Nov 5, 2024</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="w-full">
        <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Pending Settlement Requests</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <Table>
                <TableCaption>
                  This tabel shows all Settlements with status "requested" and
                  "Processing".
                </TableCaption>
                <TableHeader>
                  <TableRow className=" text-[12.8px]">
                    <TableHead>Order ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payout Account</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingSettlements!.map((settlement) => (
                    <TableRow key={settlement._id}>
                      <TableCell className="font-medium">
                        {settlement.orderID}
                      </TableCell>

                      <TableCell>{settlement.settlementAmount}</TableCell>

                      <TableCell>{settlement.payoutAccount.bankName}</TableCell>

                      <TableCell>
                        {settlement.payoutStatus.toUpperCase()}
                      </TableCell>

                      <TableCell>
                        {new Date(settlement.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="w-full">
        <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Settlement History</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <Table>
                <TableCaption>
                  This tabel shows all Settlements with status "Paid".
                </TableCaption>
                <TableHeader>
                  <TableRow className=" text-[12.8px]">
                    <TableHead>Date</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payout Method</TableHead>
                    <TableHead>Status</TableHead>
                    {/* <TableHead>Requested On</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {successfulSettlements!.map((settlement) => (
                    <TableRow key={settlement._id}>
                      <TableCell className="font-medium">
                        {settlement.orderID}
                      </TableCell>

                      <TableCell>{settlement.settlementAmount}</TableCell>

                      <TableCell>{settlement.payoutAccount.bankName}</TableCell>

                      <TableCell>
                        {settlement.payoutStatus.toUpperCase()}
                      </TableCell>

                      <TableCell>
                        {new Date(settlement.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="w-full">
        <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Payout Accounts</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <Table>
                <TableHeader>
                  <TableRow className=" text-[12.8px]">
                    <TableHead>Payout Method</TableHead>
                    <TableHead>Bank Name</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Account Holder Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutAccounts!.map((account) => (
                    <TableRow key={account.payoutMethod}>
                      <TableCell>{account.payoutMethod.toUpperCase()}</TableCell>

                      <TableCell>{account.bankDetails.bankName}</TableCell>

                      <TableCell>{account.bankDetails.accountNumber}</TableCell>

                      <TableCell>
                        {account.bankDetails.accountHolderName}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default PayoutHistory;
