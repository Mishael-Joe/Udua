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
    <Card className="sticky top-6 border-udua-orange-primary/30">
      <Accordion type="single" collapsible defaultValue="shipping-to">
        <AccordionItem value="shipping-to" className="border-none">
          <AccordionTrigger className="group px-6 py-3 hover:no-underline hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-udua-orange-primary"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <CardTitle className="text-base font-semibold text-gray-900">
                Shipping Information
              </CardTitle>
            </div>
          </AccordionTrigger>

          <AccordionContent className="">
            <CardContent className="px-6 py-2">
              <h2 id="cart-heading" className="sr-only">
                Please, Fill out your Information
              </h2>

              <div className="grid gap-3 text-sm">
                <div className="flex items-center space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    {userData.firstName} {userData.lastName}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>{userData.phoneNumber}</span>
                </div>

                <div className="flex items-start space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p>{userData.address}</p>
                    <p className="text-gray-600">
                      {userData.cityOfResidence}, {userData.stateOfResidence}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* <Accordion type="single" collapsible defaultValue="shipping-to">
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
      </Accordion> */}

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
          className="w-full bg-udua-orange-primary hover:bg-orange-400"
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
