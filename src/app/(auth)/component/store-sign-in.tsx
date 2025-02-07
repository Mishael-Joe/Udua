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
import { useState, useCallback } from "react";
import { Loader } from "lucide-react";
import Image from "next/image";

function StoreSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { toast } = useToast();

  // Initialize react-hook-form with Zod schema validation.
  const form = useForm<z.infer<typeof storeSignInInfoValidation>>({
    resolver: zodResolver(storeSignInInfoValidation),
    defaultValues: {
      storeID: "",
      password: "",
    },
  });

  // Memoized submit handler for form submission.
  const onSubmit = useCallback(
    async (values: z.infer<typeof storeSignInInfoValidation>) => {
      // Basic check: you may remove this if the schema handles empty values.
      if (!values.storeID) {
        toast({
          title: "Error",
          description: "Please, input a valid store ID.",
        });
        return;
      }

      setIsLoading(true);

      try {
        const response = await axios.post("/api/auth/store-sign-in", {
          uniqueID: values.storeID,
          password: values.password,
        });

        if (response.data.success || response.status === 200) {
          toast({
            title: "Success",
            description: "You have successfully signed in.",
          });
          router.push(callbackUrl);
        } else {
          toast({
            title: "Error",
            description: "There was an error signing you in. Please try again.",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: "There was an error signing you in. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [callbackUrl, router, toast]
  );

  return (
    <main className="min-h-screen bg-udua-blue-primary/20">
      <div className="flex justify-center h-screen">
        {/* Image panel visible on larger screens */}
        <div className="hidden md:block md:w-2/4 bg-cover bg-[url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)]">
          <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40"></div>
        </div>

        {/* Sign-in form container */}
        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <Link href="/" className="flex justify-center w-full">
                <Image
                  src="/udua-blue.svg"
                  width={100}
                  height={100}
                  alt="Udua logo"
                />
              </Link>
              <h3 className="mt-3 text-xl font-medium text-gray-600 dark:text-gray-200">
                Welcome Back
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Login to access your store
              </p>
            </div>

            <div className="mt-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Store ID Field */}
                  <FormField
                    control={form.control}
                    name="storeID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store ID</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Store ID"
                            aria-label="Store ID"
                            className="block w-full px-4 py-2 mt-2 text-black dark:text-slate-200 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:!ring-udua-blue-primary focus:!outline-none focus:!ring-1 focus:!ring-opacity-90 border-udua-blue-primary focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter your password"
                            aria-label="Password"
                            className="block w-full px-4 py-2 mt-2 text-black dark:text-slate-200 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:!ring-udua-blue-primary focus:!outline-none focus:!ring-1 focus:!ring-opacity-90 border-udua-blue-primary focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between mt-4">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-gray-600 dark:text-gray-200 hover:text-udua-blue-primary hover:underline"
                    >
                      Forgot Password?
                    </Link>

                    <Button
                      type="submit"
                      className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-4">
                          <Loader
                            className="animate-spin"
                            width={25}
                            height={25}
                          />
                          <span>Loading...</span>
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default StoreSignIn;
