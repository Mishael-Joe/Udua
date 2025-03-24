"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { User } from "@/types";

interface OrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  totalItems: number;
  onPlaceOrder: () => void;
  userData: User;
  isComplete: boolean;
}

export default function OrderSummary({
  subtotal,
  shippingCost,
  totalItems,
  onPlaceOrder,
  userData,
  isComplete,
}: OrderSummaryProps) {
  const total = subtotal + shippingCost;

  return (
    <Card className="sticky top-6">
      <Accordion type="single" collapsible defaultValue="shipping-to">
        <AccordionItem value="shipping-methods" className="border-none">
          <AccordionTrigger className="pr-4 hover:no-underline pb-2">
            <CardHeader className="px-6 py-1 text-sm">
              <CardTitle className="text-sm">Shipping To</CardTitle>
            </CardHeader>
          </AccordionTrigger>

          <AccordionContent className="">
            <CardContent className="">
              <h2 id="cart-heading" className="sr-only">
                Pleasa, Fill out your Information
              </h2>

              <div>
                <p className="text-sm">
                  {userData.firstName} {userData.lastName}
                </p>
                <p className="text-sm mt-2">{userData.phoneNumber}</p>
                <p className="text-sm mt-1">{userData.address}</p>
                <p className="text-sm mt-1">
                  {userData.cityOfResidence}, {userData.stateOfResidence}
                </p>
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <CardHeader className="pt-1">
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items ({totalItems})</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{formatCurrency(shippingCost)}</span>
        </div>

        <Separator />

        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>

        {!isComplete && (
          <p className="text-sm text-amber-600">
            Please select shipping methods for all stores to continue.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={onPlaceOrder}
          disabled={!isComplete}
        >
          Place Order
        </Button>
      </CardFooter>
    </Card>
  );
}
