import { User } from "@/types";
import { Edit } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

type user = {
  user: User;
};

function AccountSettings({ user }: user) {
  return (
    <div className="p-4 bg-black border rounded w-full">
      <div className="pb-4 flex flex-row justify-between gap-3">
        <h1>Account Settings</h1>
        {/* {user.isVerified !== false && (
          <span className="text-sm text-green-600">verified</span>
        )} */}
      </div>

      <div className="grid grid-cols-2 flex-row gap-6 flex-wrap items-cente justify-center lg:justify-between">
        <div className="p-3 border rounded">
          <h1 className="py-3 flex flex-row justify-between gap-3">
            Account Details{" "}
            <span>
              <Button className="bg-transparent">
                <Edit className="w-5 h-5" />
              </Button>
            </span>
          </h1>

          <div>
            <p>
              Name {`${user.firstName} ${user.otherNames} ${user.lastName}`}
            </p>
            <p>Phone: {user.phoneNumber}</p>
            <p>Email {user.email}</p>
          </div>
        </div>

        <div className="p-3 border rounded">
          <h1 className="py-3 flex flex-row justify-between gap-3">
            Shipping Address{" "}
            <span>
              <Button className="bg-transparent">
                <Edit className="w-5 h-5" />
              </Button>
            </span>
          </h1>

          <div>
            <p>Address: {user.address}</p>
            <p>City Of Residence: {user.cityOfResidence}</p>
            <p>State Of Residence: {user.stateOfResidence}</p>
            <p>Postal Code: {user.postalCode}</p>
          </div>
        </div>

        <div className="p-3 border rounded">
          <h1 className="py-3 flex flex-row justify-between gap-3">
            Change Password{" "}
            <span>
              <Button className="bg-transparent">
                <Edit className="w-5 h-5" />
              </Button>
            </span>
          </h1>
        </div>

        <div className="p-3 border rounded">
          <h1 className="py-3 flex flex-row justify-between gap-3">
            Delect Account{" "}
            <span>
              <Button className="bg-transparent">
                <Edit className="w-5 h-5" />
              </Button>
            </span>
          </h1>
        </div>
      </div>

      {user.isVerified === false && (
        <div className="w-full border rounded-md p-3 mt-4">
          <p className=" font-semibold">Hi {user.firstName},</p>
          <div>
            <p className="pb-3">Welcome to Udua.</p>
            <p className="pb-3 w-full flex flex-wrap justify-between">
              To complete your registration and access all the features we
              offer, please verify your account.{" "}
              <Link href={`/verification`} className=" hover:underline">
                verify account
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountSettings;
