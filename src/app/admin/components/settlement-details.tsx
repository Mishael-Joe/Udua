"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  Truck,
  Package,
  Building,
  AlertCircle,
  Loader,
  Clipboard,
} from "lucide-react";
import { cn, formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { withAdminAuth } from "./auth/with-admin-auth";
import { PERMISSIONS } from "@/lib/rbac/permissions";

/**
 * Interface representing payout account details
 */
interface PayoutAccount {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  bankCode: Number;
}

/**
 * Interface representing shipping method details
 */
interface ShippingMethod {
  name: string;
  price: number;
  estimatedDeliveryDays: number;
  description: string;
}

/**
 * Interface representing product details in a sub-order
 */
interface Product {
  _id: string;
  physicalProducts?: string;
  digitalProducts?: string;
  price: number;
  quantity: number;
}

/**
 * Interface representing sub-order details
 */
interface SubOrder {
  _id: string;
  products: Product[];
  totalAmount: number;
  shippingMethod: ShippingMethod;
  deliveryStatus: string;
  payoutStatus: string;
}

/**
 * Interface representing main order details
 */
interface MainOrder {
  _id: string;
  totalAmount: number;
  createdAt: string;
  subOrders: SubOrder[];
}

/**
 * Interface representing store information
 */
interface Store {
  _id: string;
  name: string;
  storeEmail: string;
}

/**
 * Interface representing full settlement details
 */
interface Settlement {
  storeID: Store;
  mainOrderID: MainOrder;
  subOrderID: string;
  settlementAmount: number;
  payoutAccount: PayoutAccount;
  payoutStatus: string;
}

/**
 * SettlementDetails component displays detailed information about a specific settlement
 * @param params - Object containing route parameters (slug: settlement ID)
 */
function SettlementDetailsPage({ params }: { params: { slug: string } }) {
  const [settlement, setSettlement] = useState<Settlement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  // Fetch settlement details on component mount
  useEffect(() => {
    const fetchSettlementDetails = async () => {
      try {
        const response = await axios.post(
          "/api/admin/fetch-settlement-details",
          {
            settlementID: params.slug,
          }
        );
        setSettlement(response.data.settlement);
        setLoading(false);
      } catch (err) {
        setError("Failed to load settlement details");
        setLoading(false);
      }
    };

    fetchSettlementDetails();
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError("Request timed out. Please try again.");
        setLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [params.slug, loading]);

  const handleCreateTransferRecipient = async () => {
    if (!settlement) return;
    const config = {
      accountNumber: settlement.payoutAccount.accountNumber,
      bankCode: settlement.payoutAccount.bankCode,
      accountName: settlement.payoutAccount.accountHolderName,
      storeId: settlement.storeID._id,
      bankName: settlement.payoutAccount.bankName,
    };
    try {
      setIsLoading(true);
      const response = await axios.post(
        `/api/admin/create-transfer-recipient`,
        { config }
      );
      // console.log("response", response.data);

      if (response.data.status) {
        // Start the countdown
        setShowRedirectMessage(true);
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);

        // After 5 seconds, redirect to the new page
        const redirectTimeout = setTimeout(() => {
          router.push(
            `/admin/complete-the-payout?amount=${settlement.settlementAmount}&recipient=${response.data.data.recipient_code}`
          );
        }, 5000);

        // Cleanup on component unmount
        return () => {
          clearInterval(countdownInterval);
          clearTimeout(redirectTimeout);
        };
      }
    } catch (error) {
      console.log("Erorr Creating Transfer Recipient", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle loading and error states
  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-9 w-48" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  if (error || !settlement) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  // Find the specific sub-order
  const subOrder = settlement.mainOrderID.subOrders.find(
    (order) => order._id === settlement.subOrderID
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost">
          <Link href="/admin/settlement">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settlements
          </Link>
        </Button>
        <Badge
          className={cn(
            "text-sm uppercase",
            settlement.payoutStatus === "completed"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          )}
        >
          {settlement.payoutStatus}
        </Badge>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Store & Order Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Store Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <DetailItem label="Store Name" value={settlement.storeID.name} />
              <DetailItem
                label="Store Email"
                value={settlement.storeID.storeEmail}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <DetailItem label="Order ID" value={settlement.mainOrderID._id} />
              <DetailItem
                label="Order Date"
                value={new Date(
                  settlement.mainOrderID.createdAt
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
              <DetailItem
                label="Total Amount"
                value={formatNaira(settlement.mainOrderID.totalAmount)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Settlement & Shipping Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex justify-between items-center gap-x-2">
                <div className="flex items-center gap-2">
                  <Banknote className="h-5 w-5" />
                  Settlement Details
                </div>

                {/* <div>
                  {showRedirectMessage && (
                    <p className="text-xs">Redirecting in {countdown}...</p>
                  )}
                  {!showRedirectMessage && (
                    <Button
                      className="bg-transparent hover:bg-transparent hover:underline text-black"
                      onClick={handleCreateTransferRecipient}
                      disabled={isLoading}
                    >
                      <p className="hover:underline text-xs">
                        {isLoading && (
                          <p>
                            <Loader className="h-4 w-4 animate-spin" />
                          </p>
                        )}
                        {!isLoading && <p>Create Recipient</p>}
                      </p>
                    </Button>
                  )}
                </div> */}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <DetailItem
                label="Settlement Amount"
                value={formatNaira(settlement.settlementAmount)}
              />
              <DetailItem
                label="Payout Method"
                value={settlement.payoutAccount.bankName}
              />
              <DetailItem
                label="Account Number"
                value={settlement.payoutAccount.accountNumber}
              />
              <DetailItem
                label="Account Holder"
                value={settlement.payoutAccount.accountHolderName}
              />
            </CardContent>
          </Card>

          {subOrder && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <DetailItem
                  label="Shipping Method"
                  value={subOrder.shippingMethod.name}
                />
                <DetailItem
                  label="Shipping Cost"
                  value={formatNaira(subOrder.shippingMethod.price)}
                />
                <DetailItem
                  label="Delivery Status"
                  value={
                    <Badge
                      variant="outline"
                      className={cn(
                        "uppercase",
                        subOrder.deliveryStatus === "delivered"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-yellow-200 bg-yellow-50 text-yellow-700"
                      )}
                    >
                      {subOrder.deliveryStatus}
                    </Badge>
                  }
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Products Table */}
      {subOrder && (
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products ({subOrder.products.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Type</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subOrder.products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      {product.physicalProducts ? "Physical" : "Digital"}
                    </TableCell>
                    <TableCell className="font-mono">
                      {product.physicalProducts || product.digitalProducts}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNaira(product.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.quantity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Reusable component for displaying key-value pairs
 * @param label - Label for the detail item
 * @param value - Value to display (can be string or JSX element)
 */
function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export default withAdminAuth(SettlementDetailsPage, {
  requiredPermissions: [PERMISSIONS.PROCESS_SETTLEMENT],
});
