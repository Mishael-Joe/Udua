"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, ShoppingBag, Loader2 } from "lucide-react";
import axios from "axios";

/**
 * Checkout Success Page
 * Displayed after successful payment
 * - Shows order confirmation
 * - Provides links to continue shopping or view order
 */
export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        setLoading(true);

        // Get reference from URL
        const reference = searchParams.get("reference");
        if (!reference) {
          setError("Payment reference not found");
          return;
        }

        // Process the order
        const response = await axios.post("/api/checkout/process-order", {
          paymentReference: reference,
          paymentMethod: "paystack",
        });

        if (response.data.success) {
          setOrderNumber(response.data.orderNumber);
        } else {
          setError("Failed to process order");
        }
      } catch (err: any) {
        console.error("Error processing payment:", err);
        setError(
          err.response?.data?.error ||
            "An error occurred while processing your order"
        );
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Processing your order...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">
              Order Processing Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <p className="mt-4 text-muted-foreground">
              Your payment may have been processed, but we encountered an error
              while creating your order. Please contact customer support with
              your payment reference.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              className="w-full bg-udua-orange-primary hover:bg-orange-400"
              onClick={() => router.push("/")}
            >
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <Card className="border-green-200">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-2" />
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>

          {orderNumber && (
            <div className="bg-muted p-3 rounded-md my-4">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-mono font-bold">{orderNumber}</p>
            </div>
          )}

          <p className="text-sm text-muted-foreground mt-4">
            A confirmation email has been sent to your email address.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            className="w-full bg-udua-orange-primary hover:bg-orange-400"
            onClick={() => router.push("/orders")}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            View My Orders
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// This component handles the success page after a successful payment.
