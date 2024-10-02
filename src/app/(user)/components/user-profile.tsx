"use client";

import { User as USER} from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import Link from "next/link";
import Aside1 from "./aside-1";
import { Button } from "@/components/ui/button";
import { admins } from "@/config/site";

type user = USER & {
  store: string
}

const Profile = () => {
  const [user, setUser] = useState<user | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post<{ data: user }>("/api/user/userData");
        // console.log("userdata", response);
        setUser(response.data.data);
      } catch (error: any) {
        console.error("Failed to fetch user data", error.message);
      }
    };

    fetchUserData();
  }, []);

  if (user === null) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin" /> Loading...
        </p>
      </div>
    );
  }

  return (
    <section className="">
      <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ... md:px-4 gap-4">
        <div className="hidden bg-muted/10 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <Aside1 />
          </div>
        </div>

        <div className="p-4 bg-muted/10 md:border rounded w-full">
          <div className="pb-4 flex flex-row justify-between gap-3">
            <h1 className="text-xl font-semibold">My Profile</h1>
            {user.isVerified !== false && (
              <span className="text-sm text-green-600">verified</span>
            )}
          </div>

          <div className="grid sm:grid-cols-2 flex-row gap-6 flex-wrap lg:justify-between">
            <div className=" w-full p-3 border rounded">
              <h1 className="py-2 font-medium">Account Details</h1>

              <div>
                <p>
                  <span className=" text-base font-semibold">Name:</span>{" "}
                  <span>{`${user.firstName} ${user.otherNames} ${user.lastName}`}</span>
                </p>

                <p>
                  <span className=" text-base font-semibold">Email:</span>{" "}
                  <span>{user.email}</span>
                </p>
              </div>
            </div>

            <div className=" w-full p-3 border rounded">
              <h1 className="py-2 font-medium">Primary Shipping Address</h1>

              <div>
                <p>
                  <span className=" text-base font-semibold">Name:</span>{" "}
                  <span>{`${user.firstName} ${user.otherNames} ${user.lastName}`}</span>
                </p>

                <p>
                  <span className=" text-base font-semibold">Email:</span>{" "}
                  <span>{user.email}</span>
                </p>

                <p>
                  <span className=" text-base font-semibold">Phone:</span>{" "}
                  <span>{user.phoneNumber}</span>
                </p>

                <p>
                  <span className=" text-base font-semibold">Address:</span>{" "}
                  <span>{user.address}</span>
                </p>

                <p>
                  <span className=" text-base font-semibold">
                    City Of Residence:{" "}
                  </span>{" "}
                  <span>{user.cityOfResidence}</span>
                </p>

                <p>
                  <span className=" text-base font-semibold">
                    State Of Residence:{" "}
                  </span>{" "}
                  <span>{user.stateOfResidence}</span>
                </p>

                <p>
                  <span className=" text-base font-semibold">Postal Code:</span>{" "}
                  <span>{user.postalCode}</span>
                </p>
              </div>
            </div>
          </div>

          {user.store && user.store !== "" && (
            <div className="w-full border rounded-md p-3 mt-4">
              <p className=" font-semibold">Hi {user.firstName},</p>
              <div>
                <p className="pb-3">My store.</p>
                <p className=" max-w-xl">
                  Store owners can create and manage their own store, including
                  customizing the store layout, adding product categories, and
                  managing product listings (titles, descriptions, pricing,
                  stock levels, and images).
                </p>
                <div className="flex justify-end pt-3">
                  <Link
                    href={`/store/${user.store}/my-store`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    My Store
                  </Link>
                </div>
              </div>
            </div>
          )}

          {user.isVerified === false && (
            <div className="w-full border rounded-md p-3 mt-4">
              <p className=" font-semibold">Hi {user.firstName},</p>
              <div>
                <p className="pb-3">Welcome to Udua.</p>
                <p className=" max-w-xl">
                  To complete your registration and access all the features we
                  offer, please verify your account.
                </p>
                <div className="flex justify-end pt-3">
                  <Link href={`/verification`} className=" float-end">
                    <Button className=" hover:underline">verify account</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {admins.ID.includes(user._id as string) && (
            <div className="w-full border rounded-md p-3 mt-4">
              <div>
                <p className="pb-3">For Admins.</p>
                <p className=" max-w-xl">
                  LOGIN to the admin dashboard (only admins can see this).
                </p>
                <div className="flex justify-end pt-3">
                  <Link href={`/admin/create-store`} className=" float-end">
                    <Button className=" hover:underline">Admins</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
