"use client";

import { Button } from "@/components/ui/button";
const { v4: uuidv4 } = require("uuid");

import { useStateContext } from "@/context/stateContext";

import { addCommasToNumber } from "@/lib/utils";
import { User } from "@/types";
import { Loader2 } from "lucide-react";
import { useState, FormEvent } from "react";

type userData = {
  userData: User;
};

export function CheckoutSummary({ userData }: userData) {
  const { cartItems, totalPrice } = useStateContext();
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [isLoading, setIsLoading] = useState(false);

  // Update shipping fee and description based on selected method
  const shippingFee = shippingMethod === "standard" ? 1000 : 3000;
  const deliveryMethod =
    shippingMethod === "standard"
      ? "Standard Delivery (3-5 business days)"
      : "Udua Swift Delivery (1-2 business days)";

  const config = {
    amount: 0,
    customer: {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      uniqueRef: "Udua" + uuidv4(),
      phone_number: userData.phoneNumber,
    },
    meta: {
      city: userData.cityOfResidence,
      state: userData.stateOfResidence,
      address: userData.address,
      itemsInCart: [...cartItems],
      deliveryMethod: deliveryMethod,
      postal_code: userData.postalCode || "",
      userID: userData._id,
    },
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/paystack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (response.status === 200) {
        window.location.href = data.data.authorization_url; // Redirect to the payment link
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }

    setIsLoading(false);
  };

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-8 rounded-lg border-2 border-udua-orange-primary/30 bg-gray-50 px-4 py-6 shadow-md dark:border-gray-900 dark:bg-black sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 id="summary-heading" className="text-lg font-semibold">
        Order Summary
      </h2>

      <div>
        <h3 className="text-sm font-semibold mt-3">Select Shipping Method</h3>
        <div className="mt-2">
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="radio"
              name="shippingMethod"
              value="udua-swift"
              checked={shippingMethod === "udua-swift"}
              onChange={() => setShippingMethod("udua-swift")}
              className="h-3 w-3"
            />
            <span className="text-sm">Udua Swift Delivery</span>
          </label>
          <p className="text-sm mt-1">
            Fast premium shipping: 1-2 business days at &#8358;3,000.
          </p>

          <label className="flex items-center space-x-2 mt-4">
            <input
              type="radio"
              name="shippingMethod"
              value="standard"
              checked={shippingMethod === "standard"}
              onChange={() => setShippingMethod("standard")}
              className="h-3 w-3"
            />
            <span className="text-sm">Standard Delivery</span>
          </label>
          <p className="text-sm mt-1">
            Regular shipping: 3-5 business days at &#8358;1,000.
          </p>
        </div>
      </div>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm font-semibold">Subtotal</dt>
          <dd className="text-sm font-medium">
            &#8358; {addCommasToNumber(Number(totalPrice))}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-sm font-semibold">Shipping Estimate</dt>
          <dd className="text-sm font-medium">
            &#8358; {addCommasToNumber(Number(shippingFee))}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-sm font-semibold">Order Total</dt>
          <dd className="text-sm font-medium">
            &#8358; {addCommasToNumber(Number(totalPrice) + shippingFee)}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button
          className="w-full hover:bg-udua-orange-primary bg-udua-orange-primary/80"
          onClick={handleSubmit}
          disabled={!userData.isVerified}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Loading..." : "Pay Now"}
        </Button>
      </div>
    </section>
  );
}
