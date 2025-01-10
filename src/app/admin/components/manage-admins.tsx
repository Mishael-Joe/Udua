"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useState } from "react";
import { Loader } from "lucide-react";
import { User } from "@/types";

type user2 = User & {
  isAdmin: boolean;
};

function ManageAdmins() {
  const [adminID, setAdminId] = useState("");
  const [confirmAdminID, setConfirmAdminID] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<Partial<user2>>({
    firstName: "",
    lastName: "",
    otherNames: "",
    email: "",
    phoneNumber: "",
    postalCode: "",
    isVerified: false,
    cityOfResidence: "",
    stateOfResidence: "",
    isAdmin: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (val: string, e: React.FormEvent) => {
    e.preventDefault();

    if (val === "requestAdminData") {
      try {
        setIsLoading(true);

        const response = await axios.get("/api/admin/manage-admins", {
          params: {
            adminID,
          },
        });
        // console.log(`response`, response);

        if (response.data.success === true || response.status === 200) {
          toast({
            title: `Success`,
            description: `Here is the seller details.`,
          });
          setUser(response.data.data);
          setIsLoading(false);
        } else {
          toast({
            variant: `destructive`,
            title: `Error`,
            description: `There was an error fetching user data. Please try again.`,
          });
          setIsLoading(false);
        }
      } catch (error) {
        toast({
          variant: `destructive`,
          title: "Error",
          description: `There was an error fetching user data. Please try again.`,
        });
        setIsLoading(false);
      }
    }

    if (val === "makeUserAdmin") {
      try {
        setIsLoading(true);

        const response = await axios.post("/api/admin/manage-admins", {
          confirmAdminID,
          password,
          type: "makeUserAdmin",
        });
        // console.log(`response`, response);

        if (response.data.success === true || response.status === 200) {
          toast({
            title: `Success`,
            description: `This user is now an admin.`,
          });
        //   setUser(response.data.data);
          setIsLoading(false);
        } else {
          toast({
            variant: `destructive`,
            title: `Error`,
            description: `There was an error making this user an admin. Please try again.`,
          });
          setIsLoading(false);
        }
      } catch (error) {
        toast({
          variant: `destructive`,
          title: "Error",
          description: `There was an error making this user an admin. Please try again.`,
        });
        setIsLoading(false);
      }
    }

    if (val === "suspendAdmin") {
      try {
        setIsLoading(true);

        const response = await axios.post("/api/admin/manage-admins", {
          confirmAdminID,
          type: "suspendAdmin",
        });
        // console.log(`response`, response);

        if (response.data.success === true || response.status === 200) {
          toast({
            title: `Success`,
            description: `This Admin is now suspended.`,
          });
          setUser(response.data.data);
          setIsLoading(false);
        } else {
          toast({
            variant: `destructive`,
            title: `Error`,
            description: `There was an error suspending this admin. Please try again.`,
          });
          setIsLoading(false);
        }
      } catch (error) {
        toast({
          variant: `destructive`,
          title: "Error",
          description: `There was an error suspending this admin. Please try again.`,
        });
        setIsLoading(false);
      }
    }
  };

  return (
    <section>
      <h3 className="my-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
        Approve an admin or otherwise
      </h3>

      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 mb-6">
        <div className="px-6 py-4">
          <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
            Provide the User Id you want to make as an admin.
          </p>

          <form
            onSubmit={(e) => handleSubmit("requestAdminData", e)}
            className="space-y-8 "
          >
            <input
              className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
              aria-label="ID"
              type="text"
              value={adminID}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Admin ID"
              required
            />
            <Button
              type="submit"
              className="items-end w-full bg-purple-500 hover:bg-purple-600"
            >
              {!isLoading && "Submit"}
              {isLoading && (
                <Loader className=" animate-spin w-5 h-5 mr-4" />
              )}{" "}
              {isLoading && "Please wait..."}
            </Button>
          </form>
        </div>
      </div>

      <div>
        <div className="py-6 border-t-2 flex flex-row justify-between gap-3">
          <h1 className="text-xl font-semibold">User Details</h1>
          {user.isVerified !== false && (
            <span className="text-sm text-green-600">verified</span>
          )}
          {user.isVerified === false && (
            <span className="text-sm text-red-600">Unverified</span>
          )}
        </div>

        <div className="grid md:grid-cols-2 flex-row gap-6 flex-wrap lg:justify-between">
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

        {user.isAdmin !== undefined && user.isAdmin === false && (
          <div className="w-full sm:w-1/2 mx-auto border rounded-md p-3 mt-4">
            <div>
              <p className=" max-w-xl">
                Verify that this user meets the criteria before approving them
                as an Admin.
              </p>
              <form
                onSubmit={(e) => handleSubmit("makeUserAdmin", e)}
                className="flex flex-col gap-3 justify-end pt-3"
              >
                <input
                  className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-label="ID"
                  type="text"
                  value={confirmAdminID}
                  onChange={(e) => setConfirmAdminID(e.target.value)}
                  placeholder="Admin ID"
                  required
                />

                <input
                  className="block w-full px-4 py-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-label="ID"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Current Admin's PassWord"
                  required
                />

                <Button type="submit" className="hover:text-purple-600">
                  {!isLoading && "Make User Admin"}
                  {isLoading && (
                    <Loader className=" animate-spin w-5 h-5 mr-4" />
                  )}{" "}
                  {isLoading && "Please wait..."}
                </Button>
              </form>
            </div>
          </div>
        )}

        {user.isAdmin && (
          <div className="w-full border rounded-md p-3 mt-4">
            <div>
              <p className=" max-w-xl">
                You can suspend this admin if necessary.
              </p>
              <form
                onSubmit={(e) => handleSubmit("suspendAdmin", e)}
                className="flex justify-end pt-3"
              >
                <Button type="submit" className="hover:text-purple-600">
                  {!isLoading && "Suspend Admin"}
                  {isLoading && (
                    <Loader className=" animate-spin w-5 h-5 mr-4" />
                  )}{" "}
                  {isLoading && "Please wait..."}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ManageAdmins;
