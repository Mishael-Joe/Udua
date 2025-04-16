"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export const ResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const ref = searchParams.get("ref") || "";
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await axios.post("/api/auth/reset-password", {
        token,
        newPassword,
        ref,
      });

      if (response.data.success === true || response.status === 200) {
        toast({
          title: `Success`,
          description: `Password change successfully`,
        });
        setIsLoading(false);
        router.push(`/sign-in`);
      } else {
        toast({
          variant: `destructive`,
          title: `Error`,
          description: `There was an error reseting your password. Please try again.`,
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        variant: `destructive`,
        title: `Error`,
        description: `There was an error reseting your password. Please try again.`,
      });
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-row justify-center items-center">
      <section className="w-full">
        <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="px-6 py-4">
            <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
              Reset My Password
            </h3>

            <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
              Provide your new Password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="block w-full px-4 py-2 mt-4 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                aria-label="password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />

              <input
                className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                aria-label="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="confirm password"
                required
              />

              <div className="flex items-center justify-between mt-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-purple-600"
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-200">
                    Show Password
                  </span>
                </label>
              </div>
              <Button
                type="submit"
                className="items-end w-full bg-blue-500 hover:bg-udua-blue-primary"
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

export default ResetPassword;
