"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { storeSignInInfoValidation } from "@/lib/validations/store-signin-info-validation";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useState } from "react";
import { Loader } from "lucide-react";
import Image from "next/image";

function StoreSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/"; // Default to '/'
  const { toast } = useToast();

  const form = useForm<z.infer<typeof storeSignInInfoValidation>>({
    resolver: zodResolver(storeSignInInfoValidation),
    defaultValues: {
      storeID: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof storeSignInInfoValidation>) => {
    setIsLoading(true);

    const userInput = {
      uniqueID: values.storeID,
      password: values.password,
    };

    try {
      const response = await axios.post(`/api/auth/store-sign-in`, userInput);
      // console.log(`response`, response);

      if (response.data.success === true || response.status === 200) {
        toast({
          title: `Success`,
          description: `You have Successfully signed In.`,
        });
        setIsLoading(false);
        router.push(callbackUrl);
      } else {
        toast({
          title: `Error`,
          description: `There was an error signing you in. Please try again.`,
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error signing you in. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <main className=" min-h-screen flex flex-row justify-center items-center">
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
              Welcome Back
            </h3>

            <p className="mt-1 text-center text-gray-500 dark:text-gray-400">
              Login to view your store
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  // className="w-full mt-4"
                  control={form.control}
                  name="storeID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store ID</FormLabel>
                      <FormControl>
                        <Input
                          className="block w-full px-4 py-2 mt-2 text-black dark:text-slate-200 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                          type="text"
                          placeholder="Store ID"
                          aria-label="Store ID"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  // className="w-full mt-4"
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                          type="password"
                          placeholder="Enter your password"
                          aria-label="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between mt-4">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500"
                  >
                    Forgot Password?
                  </Link>

                  <Button
                    className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <p className="flex flex-row items-center gap-4">
                        <Loader
                          className=" animate-spin"
                          width={25}
                          height={25}
                        />{" "}
                        Loading...
                      </p>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default StoreSignIn;
