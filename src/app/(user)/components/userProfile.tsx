import { User } from "@/types";
import Link from "next/link";
import React from "react";
import { Button } from "../../../components/ui/button";

type user = {
  user: User;
};

function UserProfile({ user }: user) {
  return (
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
    </div>
  );
}

export default UserProfile;
