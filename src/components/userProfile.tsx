import { User } from "@/types";
import Link from "next/link";
import React from "react";

type user = {
  user: User;
};

// Profile Picture   | Name: John Doe                   |
// |                    | Email: john.doe@example.com      |
// |                    | Phone: +1234567890               |
// |                    | Address: 123 Main St, City, State|
// |                    | Postal Code: 12345               |
// |                    | [Edit Profile] [Change Password]

function UserProfile({ user }: user) {
  return (
    <div className="p-4 bg-black border rounded w-full">
      <h1 className="pb-4">My Profile</h1>

      <div className="flex flex-row gap-6 flex-wrap items-cente justify-center lg:justify-between">
        <div className="w-[47%] p-3 border rounded">
          <h1 className="py-3">Account Details</h1>

          <div>
            <p>
              Name {`${user.firstName} ${user.otherNames} ${user.lastName}`}
            </p>
            <p>Email {user.email}</p>
          </div>
        </div>

        <div className="w-[47%] p-3 border rounded">
          <h1 className="py-3">Primary Shipping Address:</h1>

          <div>
            <p>
              Name: {`${user.firstName} ${user.otherNames} ${user.lastName}`}
            </p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phoneNumber}</p>
            <p>Address: {user.address}</p>
            <p>City Of Residence: {user.cityOfResidence}</p>
            <p>State Of Residence: {user.stateOfResidence}</p>
            <p>Postal Code: {user.postalCode}</p>
          </div>
        </div>
      </div>

      <div className="w-full border rounded-md p-3 mt-4">
        <p className=" font-semibold">Hi {user.firstName},</p>

        <div>
          <p className="pb-3">Welcome to Udua.</p>
          <p className="pb-3 w-full flex flex-wrap justify-between">
            To complete your registration and access all the features we offer,
            please verify your account.{" "}
            <Link href={``} className=" hover:underline">
              verify account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
