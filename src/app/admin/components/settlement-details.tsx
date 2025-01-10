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

function SettlementDetails({ params }: { params: { slug: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [settlementDetails, setSettlementDetails] = useState<Settlement | null>(
    null
  );

  useEffect(() => {
    const body = {
      settlementID: params.slug,
    };
    const FetchPendingPayout = async () => {
      try {
        const response = await axios.post(
          "/api/admin/fetch-settlement-details",
          body
        );
        //   console.log("FetchPendingPayout", response);
        // console.log("sellerdata.data.orders", response.data.orders);
        setSettlementDetails(response.data.settlement);
        setLoading(false); // Stop loading when data is fetched
      } catch (error: any) {
        console.error("Failed to fetch settlement details", error.message);
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

  if (settlementDetails === null) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin" /> Loading...
        </p>
      </div>
    );
  }
  return (
    <>
      <h1>SettlementDetails</h1>
      <div>
        <h2>Settlement Information</h2>
        <ul>
          <li>
            <strong>Settlement ID:</strong> 673379232c993083a24611af
          </li>
          <li>
            <strong>Store ID:</strong> 66fbae5615b9fec5eac1b9bb
          </li>
          <li>
            <strong>Order ID:</strong> 67007b3e0d87b0b2b62ad1bf
          </li>
          <li>
            <strong>Settlement Amount:</strong> 4846.25
          </li>
          <li>
            <strong>Payout Status:</strong> Requested
          </li>
          <li>
            <strong>Created At:</strong> 2024-11-12T15:49:55.232Z
          </li>
        </ul>

        <h2>Payout Account Information</h2>
        <ul>
          <li>
            <strong>Bank Name:</strong> PalmPay
          </li>
          <li>
            <strong>Account Number:</strong> 8148600290
          </li>
          <li>
            <strong>Account Holder Name:</strong> MISHAEL JOSEPH ETUKUDO
          </li>
          <li>
            <strong>Payout Account ID:</strong> 673379232c993083a24611b0
          </li>
        </ul>
      </div>
    </>
  );
}

export default SettlementDetails;
