"use client";

import { Settlement } from "@/types";
import axios from "axios";
import { Loader, MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { addCommasToNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function AdminSettlement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pendingSettlements, setPendingSettlements] = useState<
    Settlement[] | null
  >(null);
  const [pendingSettlementAmount, setPendingSettlementAmount] =
    useState<number>(0);

  useEffect(() => {
    const FetchPendingPayout = async () => {
      try {
        const response = await axios.post("/api/admin/fetch-pending-payout");
        //   console.log("FetchPendingPayout", response);
        // console.log("sellerdata.data.orders", response.data.orders);
        setPendingSettlementAmount(response.data.data.pendingSettlementAmount);
        setPendingSettlements(response.data.data.pendingSettlements);
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

  if (pendingSettlements === null) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin" /> Loading...
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>AdminSettlement</h1>
      <div className="w-full">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                    <TableHead>More</TableHead>
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

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontalIcon className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Link href={`/admin/payout/${settlement._id}`}>
                              <DropdownMenuItem>More</DropdownMenuItem>
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
        </div>
      </div>
    </div>
  );
}

export default AdminSettlement;
