"use client";

import { CheckoutSummary } from "@/components/checkout-cart-summary";
import { User } from "@/types";
import axios from "axios";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

type user = {
  data: User;
};

const LoginForm = () => {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<user>(`/api/users/userData`);
        console.log("userdata", response);
        setUserData(response.data.data);
      } catch (error: any) {
        console.log(error);
        throw new Error(`Failed to fetch user data`, error.Message);
      }
    };

    fetchUserData();
  }, []);

  // Logic to disable inputs based on user data
  //    const disableNameInput = !!userData?.firstName;
  //    const disableEmailInput = !!userData?.email;

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
    <div>
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready To Pay
        </h1>

        <p className="mt-4">
          To ensure a smooth and timely delivery, please make sure your contact
          information is up to date. If any details have changed, kindly update
          them before proceeding with your payment. You can do so under the
          account settings in your profile page.
        </p>

        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Pleasa, Fill out your Information
            </h2>
            {/* Cart Items */}
            {/* <CartItems /> */}
            <div className="mt-4">
              <input
                name="name"
                value={`${userData.firstName} ${userData.otherNames} ${userData.lastName}`}
                type="text"
                placeholder="Your Name "
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border-2 dark:border-1 border-gray-300 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-gray-200 dark:focus:border-gray-200 focus:ring-green-100 focus:outline-none focus:ring focus:ring-opacity-10 focus:border-2"
                disabled={true}
              />
            </div>

            <div className="mt-4">
              <input
                name="email"
                value={userData.email}
                type="email"
                placeholder="E-Mail"
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border-2 dark:border-1 border-gray-300 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-gray-200 dark:focus:border-gray-200 focus:ring-green-100 focus:outline-none focus:ring focus:ring-opacity-10 focus:border-2"
                disabled={true}
              />
            </div>

            <div className="mt-4">
              <input
                name="primaryPhoneNumber"
                value={userData.phoneNumber}
                type="text"
                disabled={true}
                placeholder="primary Phone Number"
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border-2 dark:border-1 border-gray-300 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-gray-200 dark:focus:border-gray-200 focus:ring-green-100 focus:outline-none focus:ring focus:ring-opacity-10 focus:border-2"
              />
            </div>

            <div className="mt-4">
              <input
                name="address"
                value={userData.address}
                type="text"
                disabled={true}
                required
                placeholder="Your address"
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border-2 dark:border-1 border-gray-300 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-gray-200 dark:focus:border-gray-200 focus:ring-green-100 focus:outline-none focus:ring focus:ring-opacity-10 focus:border-2"
              />
            </div>

            <div className="mt-4">
              <input
                name="postalcode"
                value={userData.postalCode}
                type="text"
                disabled={true}
                placeholder="Your postal code"
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border-2 dark:border-1 border-gray-300 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-gray-200 dark:focus:border-gray-200 focus:ring-green-100 focus:outline-none focus:ring focus:ring-opacity-10 focus:border-2"
              />
            </div>

            <div className="mt-4">
              <input
                name="city"
                value={`${userData.cityOfResidence}, ${userData.stateOfResidence}`}
                type="text"
                disabled={true}
                required
                placeholder="Your city"
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border-2 dark:border-1 border-gray-300 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-gray-200 dark:focus:border-gray-200 focus:ring-green-100 focus:outline-none focus:ring focus:ring-opacity-10 focus:border-2"
              />
            </div>

            {/* <p>Thank you for helping us serve you better!</p> */}
          </section>
          {/* Cart Summary */}
          <CheckoutSummary userData={userData} />
        </form>
      </main>
    </div>
  );
};

export default LoginForm;
