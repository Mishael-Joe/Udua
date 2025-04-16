"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useState } from "react";
import { Loader } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const ForgotPassword = () => {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") as "user" | "store" | null;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await axios.post(
        `/api/auth/forgot-password`,
        JSON.stringify({ email, ref })
      );
      // console.log(`response`, response);

      if (response.data.success === true || response.status === 200) {
        toast({
          title: `Success`,
          description: `We have sent a mail to the provided E-mail.`,
        });
        setIsLoading(false);
        setMessage(true);
      } else {
        toast({
          variant: `destructive`,
          title: `Error`,
          description: `There was an error sending you the reset link. Please try again.`,
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        variant: `destructive`,
        title: "Error",
        description: `There was an error sending you the reset link. Please try again.`,
      });
      setIsLoading(false);
    }
  };

  if (ref === "user") {
    return (
      <main className="min-h-screen flex flex-row justify-center items-center bg-udua-blue-primary/10">
        <section className="max-w-3xl mx-auto my-5 px-6">
          {!message ? (
            <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="px-6 py-4">
                <div className="flex justify-center mx-auto">
                  <Link href={`/`} className=" w-full flex justify-center">
                    <Image
                      src="/udua-blue.svg"
                      width={`100`}
                      height={`100`}
                      alt=""
                    />
                  </Link>
                </div>

                <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
                  Reset My Password
                </h3>

                <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
                  Provide the E-mail you used to create an account with Udua.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8 ">
                  <input
                    className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:ring-udua-blue-primary! focus:outline-hidden! focus:ring-1! focus:ring-opacity-90! border-udua-blue-primary focus:border-transparent"
                    aria-label="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  <Button
                    type="submit"
                    className="items-end w-full bg-udua-blue-primary/80 hover:bg-udua-blue-primary"
                  >
                    {!isLoading && "Send Reset Link"}
                    {isLoading && (
                      <Loader className=" animate-spin w-5 h-5 mr-4" />
                    )}{" "}
                    {isLoading && "Please wait..."}
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex items-center flex-col">
              <div className="border rounded-md py-4 px-6">
                <p>A Link has been sent to the E-mail provided.</p>

                <p className="pt-2">
                  Please ensure to check your E-mail and follow the instructions
                  carefully.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  if (ref === "store") {
    return (
      <main className="min-h-screen flex flex-row justify-center items-center bg-udua-blue-primary/10">
        <section className="max-w-3xl mx-auto my-5 px-6">
          {!message ? (
            <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="px-6 py-4">
                <div className="flex justify-center mx-auto">
                  <Link href={`/`} className=" w-full flex justify-center">
                    <Image
                      src="/udua-blue.svg"
                      width={`100`}
                      height={`100`}
                      alt=""
                    />
                  </Link>
                </div>

                <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
                  Reset My Password
                </h3>

                <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
                  Provide the E-mail you used to create a store with Udua.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8 ">
                  <input
                    className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:ring-udua-blue-primary! focus:outline-hidden! focus:ring-1! focus:ring-opacity-90! border-udua-blue-primary focus:border-transparent"
                    aria-label="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  <Button
                    type="submit"
                    className="items-end w-full bg-udua-blue-primary/80 hover:bg-udua-blue-primary"
                  >
                    {!isLoading && "Send Reset Link"}
                    {isLoading && (
                      <Loader className=" animate-spin w-5 h-5 mr-4" />
                    )}{" "}
                    {isLoading && "Please wait..."}
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex items-center flex-col">
              <div className="border rounded-md py-4 px-6">
                <p>A Link has been sent to the E-mail provided.</p>

                <p className="pt-2">
                  Please ensure to check your E-mail and follow the instructions
                  carefully.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }
};

export default ForgotPassword;
