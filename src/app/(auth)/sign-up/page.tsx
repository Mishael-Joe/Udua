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
import { userSignUpInfoValidation } from "@/lib/validations/user-signUp-info-validation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Image from "next/image";

function SignUp() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof userSignUpInfoValidation>>({
    resolver: zodResolver(userSignUpInfoValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      otherNames: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      phoneNumber: "",
      cityOfResidence: "",
      stateOfResidence: "",
      postalCode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof userSignUpInfoValidation>) => {
    // console.log(values);
    if (values.confirmPassword !== values.password) {
      toast({
        title: "Invalid Password",
        description: `Password and Confirm Password must be the same.`,
      });

      return;
    }

    const user = {
      firstName: values.firstName,
      lastName: values.lastName,
      otherNames: values.otherNames,
      email: values.email,
      password: values.password,
      address: values.address,
      phoneNumber: values.phoneNumber,
      cityOfResidence: values.cityOfResidence,
      stateOfResidence: values.stateOfResidence,
      postalCode: values.postalCode,
    };

    try {
      const response = await axios.post(`/api/auth/signUp`, user);

      if (response.status === 200 || response.data.success === true) {
        toast({
          title: "Success",
          description: `Sign Up Successfully`,
        });
        router.push("/sign-in");
      } else {
        toast({
          title: "Error",
          description: `There was an error signing you up. Please try again`,
        });
      }
    } catch (error: any) {
      // toast({
      //   title: "Error",
      //   description: `There was an error signing you up. Please try again`,
      // });
      toast({
        title: "Error",
        variant: "destructive",
        description: `${error.response.data.error}`,
      });
      // console.log(error);
    }
  };

  return (
    <main className=" min-h-screen bg-udua-blue-primary/20">
      <section className="flex justify-center">
        <div className="hidden bg-cover lg:block lg:w-2/5 bg-[url('https://images.unsplash.com/photo-1494621930069-4fd4b2e24a11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80')]"></div>

        <div className="w-full max-w-3xl mx-auto px-4 lg:px-6 lg:w-3/5 overflow-hidden py-4">
          <Link href={`/`} className=" w-full flex justify-center">
            <Image src="/udua-blue.svg" width={`100`} height={`100`} alt="" />
          </Link>

          <p className="mt-4 text-center text-gray-500 dark:text-gray-400">
            Let&#x27;s get you all set up so you can verify your personal
            account.
          </p>

          <div className="">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
              >
                <FormField
                  // className="w-full mt-4"
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>First Name</FormLabel> */}
                      <FormControl>
                        <Input
                          className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:!ring-udua-blue-primary focus:!outline-none focus:!ring-1 focus:!ring-opacity-90 border-udua-blue-primary focus:border-transparent"
                          type="text"
                          placeholder="Your First Name"
                          aria-label="name"
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Last Name</FormLabel> */}
                      <FormControl>
                        <Input
                          className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:!ring-udua-blue-primary focus:!outline-none focus:!ring-1 focus:!ring-opacity-90 border-udua-blue-primary focus:border-transparent"
                          type="text"
                          placeholder="Your Last Name"
                          aria-label="name"
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
                  name="otherNames"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Other Names</FormLabel> */}
                      <FormControl>
                        <Input
                          className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:!ring-udua-blue-primary focus:!outline-none focus:!ring-1 focus:!ring-opacity-90 border-udua-blue-primary focus:border-transparent"
                          type="text"
                          placeholder="Other Names"
                          aria-label="name"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Email</FormLabel> */}
                      <FormControl>
                        <Input
                          className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:!ring-udua-blue-primary focus:!outline-none focus:!ring-1 focus:!ring-opacity-90 border-udua-blue-primary focus:border-transparent"
                          type="email"
                          placeholder="Your Email"
                          aria-label="Your Email"
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
                      {/* <FormLabel>Password</FormLabel> */}
                      <FormControl>
                        <Input
                          className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:!ring-udua-blue-primary focus:!outline-none focus:!ring-1 focus:!ring-opacity-90 border-udua-blue-primary focus:border-transparent"
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

                <FormField
                  // className="w-full mt-4"
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Confirm Password</FormLabel> */}
                      <FormControl>
                        <Input
                          className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:!ring-udua-blue-primary focus:!outline-none focus:!ring-1 focus:!ring-opacity-90 border-udua-blue-primary focus:border-transparent"
                          type="password"
                          placeholder="confirm your password"
                          aria-label="confirm your password"
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
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Your Address</FormLabel> */}
                      <FormControl>
                        <Input
                          className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:!ring-udua-blue-primary focus:!outline-none focus:!ring-1 focus:!ring-opacity-90 border-udua-blue-primary focus:border-transparent"
                          type="text"
                          placeholder="Enter your Address"
                          aria-label="Enter your Address"
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
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Phone Number</FormLabel> */}
                      <FormControl>
                        <Input
                          className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:!ring-udua-blue-primary focus:!outline-none focus:!ring-1 focus:!ring-opacity-90 border-udua-blue-primary focus:border-transparent"
                          type="text"
                          placeholder="090******35"
                          aria-label="Enter your phone number"
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
                  name="cityOfResidence"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>City Of Residence</FormLabel> */}
                      <FormControl>
                        <Input
                          className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:!ring-udua-blue-primary focus:!outline-none focus:!ring-1 focus:!ring-opacity-90 border-udua-blue-primary focus:border-transparent"
                          type="text"
                          placeholder="Enter your city of Residence"
                          aria-label="Enter your city of Residence"
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
                  name="stateOfResidence"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>State of Residence</FormLabel> */}
                      <FormControl>
                        <Input
                          className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:!ring-udua-blue-primary focus:!outline-none focus:!ring-1 focus:!ring-opacity-90 border-udua-blue-primary focus:border-transparent"
                          type="text"
                          placeholder="Enter your state of Residence"
                          aria-label="Enter your state of Residence"
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
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>postalCode</FormLabel> */}
                      <FormControl>
                        <Input
                          className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:!ring-udua-blue-primary focus:!outline-none focus:!ring-1 focus:!ring-opacity-90 border-udua-blue-primary focus:border-transparent"
                          type="text"
                          placeholder="Enter your postal Code"
                          aria-label="Enter your postal Code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="px-6 py-2 mt-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 w-full">
                  Sign Up
                </Button>

                <div className="flex items-center justify-between mt-4"></div>
              </form>
            </Form>
          </div>

          <div className="flex items-center justify-center py-4 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-200">
              Already have an account?{" "}
            </span>

            <Link
              href="/sign-in"
              className="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignUp;
