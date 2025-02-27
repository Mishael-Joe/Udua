"use client";

import { CheckoutSummary } from "@/components/checkout-cart-summary";
import { CheckoutCartItems } from "@/components/chect-out-cart-items";
import { User } from "@/types";
import axios from "axios";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

type user = {
  data: User;
};

const CheckoutPage = () => {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post<user>(`/api/user/userData`);
        // console.log("userdata", response);
        setUserData(response.data.data);
      } catch (error: any) {
        console.log(error);
        throw new Error(`Failed to fetch user data`, error.Message);
      }
    };

    fetchUserData();
  }, []);

  if (userData === null) {
    return (
      <>
        <div className="w-full min-h-screen flex items-center justify-center">
          <p className="w-full h-full flex items-center justify-center">
            <Loader className=" animate-spin" /> Loading...
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          Ready To Pay
        </h1>

        <form className="my-5 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Pleasa, Fill out your Information
            </h2>

            <div>
              <h3 className="text-sm font-semibold mt-3">Shipping to</h3>

              <div className="flex justify-between pb-4">
                <div>
                  <p className="text-sm mt-2">
                    {userData.firstName} {userData.lastName}
                  </p>
                  <p className="text-sm mt-2">{userData.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm mt-1">{userData.address}</p>
                  <p className="text-sm mt-1">
                    {userData.cityOfResidence}, {userData.stateOfResidence}
                  </p>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <CheckoutCartItems />

            {/* <p>Thank you for helping us serve you better!</p> */}
          </section>
          {/* Cart Summary */}
          <CheckoutSummary userData={userData} />
        </form>

        <p className="mt-4 text-sm">
          To ensure a smooth and timely delivery, please make sure your contact
          information is up to date. If any details have changed, kindly update
          them before proceeding with your payment. You need to verify your
          account before making any purchase. You can do so under the account
          settings in your profile page.
        </p>
      </main>
    </div>
  );
};

export default CheckoutPage;
