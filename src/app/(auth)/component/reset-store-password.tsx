"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export const ResetStorePassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword.toString().length < 6) {
      toast({
        variant: `destructive`,
        title: `Error`,
        description: `Password must be at least 6 characters long.`,
      });
      setIsLoading(false);
      return;
    }

    if (newPassword.toString() !== password.toString()) {
      toast({
        variant: `destructive`,
        title: "Invalid Password",
        description: `New Password and Confirm Password must be the same.`,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/reset-store-password", {
        token,
        newPassword,
      });

      if (response.data.success === true || response.status === 200) {
        toast({
          title: `Success`,
          description: `Store Password change successfully`,
        });
        setIsLoading(false);
        router.push(`/`);
      } else {
        toast({
          variant: `destructive`,
          title: `Error`,
          description: `There was an error reseting your store password. Please try again.`,
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        variant: `destructive`,
        title: `Error`,
        description: `There was an error reseting your store password. Please try again.`,
      });
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-row justify-center items-center">
      <section className="w-full">
        <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="px-6 py-4">
            <div className="flex justify-center mx-auto">
              {/* <Image
              className="w-auto h-7 sm:h-8"
              src="https://merakiui.com/images/logo.svg"
              width={`60`}
              height={`60`}
              alt=""
            /> */}
            </div>

            <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
              Reset Store My Password
            </h3>

            <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
              Provide your new Password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* <label htmlFor="password">Password:</label> */}
              <input
                className="block w-full px-4 py-2 mt-4 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                aria-label="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />

              {/* <label htmlFor="confirm password">Confirm Password:</label> */}
              <input
                className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                aria-label="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="confirm password"
                required
              />
              <Button
                type="submit"
                className="items-end w-full bg-purple-500 hover:bg-purple-600"
              >
                {!isLoading && "Reset Password"}
                {isLoading && (
                  <Loader className=" animate-spin w-5 h-5 mr-4" />
                )}{" "}
                {isLoading && "Please wait..."}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ResetStorePassword;
