"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userSignUpInfoValidation } from "@/lib/validations/user-signUp-info-validation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Image from "next/image";

const steps = [
  {
    title: "Personal Details",
    fields: ["firstName", "lastName", "otherNames"],
  },
  {
    title: "Address Information",
    fields: ["address", "cityOfResidence", "stateOfResidence", "postalCode"],
  },
  {
    title: "Contact & Security",
    fields: ["email", "phoneNumber", "password", "confirmPassword"],
  },
];

function SignUp() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

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

  const handleNext = async () => {
    const fields = steps[currentStep - 1].fields;
    const isValid = await form.trigger(fields as any);

    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (values: z.infer<typeof userSignUpInfoValidation>) => {
    if (values.confirmPassword !== values.password) {
      toast({ title: "Invalid Password", description: "Passwords must match" });
      return;
    }

    try {
      const response = await axios.post(`/api/auth/signUp`, values);
      if (response.status === 200 || response.data.success === true) {
        toast({ title: "Success", description: "Sign Up Successful" });
        router.push("/sign-in");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        variant: "destructive",
        description: error.response?.data?.error || "An error occurred",
      });
    }
  };

  const inputClass =
    "w-full px-4 py-2 mt-2 bg-background border rounded-lg focus:ring-2 focus:ring-udua-blue-primary focus:outline-hidden";

  return (
    <main className="min-h-screen bg-udua-blue-primary/20">
      <section className="flex lg:min-h-screen">
        {/* Side Image - Hidden on mobile */}
        <div className="hidden bg-cover lg:block lg:w-2/5 bg-[url('https://images.unsplash.com/photo-1494621930069-4fd4b2e24a11?ixlib=rb-1.2.1&auto=format&fit=crop&w=715&q=80')] relative">
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="w-full max-w-3xl px-4 lg:px-8 lg:w-3/5 py-8">
          <Link href="/" className="w-full flex justify-center mb-4">
            <Image src="/udua-blue.svg" width={120} height={40} alt="Logo" />
          </Link>

          <p className="flex justify-center items-center text-udua-blue-primary dark:text-gray-400 mb-4">
            Let&#x27;s get you all set up so you can verify your personal
            account.
          </p>

          <div className="max-w-lg mx-auto lg:px-4">
            <div className="mb-8 flex justify-between">
              {steps.map((step, index) => (
                <div key={step.title} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      currentStep > index + 1
                        ? "bg-green-500"
                        : currentStep === index + 1
                        ? "bg-udua-blue-primary text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-1 transition-colors ${
                        currentStep > index + 1 ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              {steps[currentStep - 1].title}
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 mt-4"
              >
                {/* Step 1 */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    {["firstName", "lastName", "otherNames"].map((field) => (
                      <FormField
                        key={field}
                        control={form.control}
                        name={field as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder={
                                  field.name === "firstName"
                                    ? "First Name"
                                    : field.name === "lastName"
                                    ? "Last Name"
                                    : "Other Names"
                                }
                                className={inputClass}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                )}

                {/* Step 2 */}
                {currentStep === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "address",
                      "cityOfResidence",
                      "stateOfResidence",
                      "postalCode",
                    ].map((field) => (
                      <FormField
                        key={field}
                        control={form.control}
                        name={field as any}
                        render={({ field }) => (
                          <FormItem
                            className={
                              field.name === "address" ? "md:col-span-2" : ""
                            }
                          >
                            <FormControl>
                              <Input
                                placeholder={
                                  field.name === "address"
                                    ? "Street Address"
                                    : field.name === "cityOfResidence"
                                    ? "City"
                                    : field.name === "stateOfResidence"
                                    ? "State"
                                    : "Postal Code"
                                }
                                className={inputClass}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                )}

                {/* Step 3 */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    {[
                      "email",
                      "phoneNumber",
                      "password",
                      "confirmPassword",
                    ].map((field) => (
                      <FormField
                        key={field}
                        control={form.control}
                        name={field as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type={
                                  field.name.includes("password")
                                    ? "password"
                                    : "text"
                                }
                                placeholder={
                                  field.name === "email"
                                    ? "Email Address"
                                    : field.name === "phoneNumber"
                                    ? "Phone Number"
                                    : field.name === "password"
                                    ? "Password"
                                    : "Confirm Password"
                                }
                                className={inputClass}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-8 gap-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      onClick={handlePrev}
                      variant="outline"
                      className="w-32"
                    >
                      Previous
                    </Button>
                  )}

                  <div className="flex-1"></div>

                  {currentStep < steps.length ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="w-32 bg-udua-blue-primary hover:bg-udua-blue-primary/90"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="w-32 bg-udua-blue-primary hover:bg-udua-blue-primary/90"
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </form>
            </Form>

            <div className="text-center mt-8">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-udua-blue-primary font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignUp;

// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { userSignUpInfoValidation } from "@/lib/validations/user-signUp-info-validation";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useToast } from "@/components/ui/use-toast";
// import axios from "axios";
// import Image from "next/image";

// function SignUp() {
//   const { toast } = useToast();
//   const router = useRouter();

//   const form = useForm<z.infer<typeof userSignUpInfoValidation>>({
//     resolver: zodResolver(userSignUpInfoValidation),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       otherNames: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       address: "",
//       phoneNumber: "",
//       cityOfResidence: "",
//       stateOfResidence: "",
//       postalCode: "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof userSignUpInfoValidation>) => {
//     // console.log(values);
//     if (values.confirmPassword !== values.password) {
//       toast({
//         title: "Invalid Password",
//         description: `Password and Confirm Password must be the same.`,
//       });

//       return;
//     }

//     const user = {
//       firstName: values.firstName,
//       lastName: values.lastName,
//       otherNames: values.otherNames,
//       email: values.email,
//       password: values.password,
//       address: values.address,
//       phoneNumber: values.phoneNumber,
//       cityOfResidence: values.cityOfResidence,
//       stateOfResidence: values.stateOfResidence,
//       postalCode: values.postalCode,
//     };

//     try {
//       const response = await axios.post(`/api/auth/signUp`, user);

//       if (response.status === 200 || response.data.success === true) {
//         toast({
//           title: "Success",
//           description: `Sign Up Successfully`,
//         });
//         router.push("/sign-in");
//       } else {
//         toast({
//           title: "Error",
//           description: `There was an error signing you up. Please try again`,
//         });
//       }
//     } catch (error: any) {
//       // toast({
//       //   title: "Error",
//       //   description: `There was an error signing you up. Please try again`,
//       // });
//       toast({
//         title: "Error",
//         variant: "destructive",
//         description: `${error.response.data.error}`,
//       });
//       // console.log(error);
//     }
//   };

//   return (
//     <main className=" min-h-screen bg-udua-blue-primary/20">
//       <section className="flex justify-center">
//         <div className="hidden bg-cover lg:block lg:w-2/5 bg-[url('https://images.unsplash.com/photo-1494621930069-4fd4b2e24a11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80')]"></div>

//         <div className="w-full max-w-3xl mx-auto px-4 lg:px-6 lg:w-3/5 overflow-hidden py-4">
//           <Link href={`/`} className=" w-full flex justify-center">
//             <Image src="/udua-blue.svg" width={`100`} height={`100`} alt="" />
//           </Link>

//           <p className="mt-4 text-center text-gray-500 dark:text-gray-400">
//             Let&#x27;s get you all set up so you can verify your personal
//             account.
//           </p>

//           <div className="">
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
//               >
//                 <FormField
//                   // className="w-full mt-4"
//                   control={form.control}
//                   name="firstName"
//                   render={({ field }) => (
//                     <FormItem>
//                       {/* <FormLabel>First Name</FormLabel> */}
//                       <FormControl>
//                         <Input
//                           className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:ring-udua-blue-primary! focus:outline-hidden! focus:ring-1! focus:ring-opacity-90! border-udua-blue-primary focus:border-transparent"
//                           type="text"
//                           placeholder="Your First Name"
//                           aria-label="name"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   // className="w-full mt-4"
//                   control={form.control}
//                   name="lastName"
//                   render={({ field }) => (
//                     <FormItem>
//                       {/* <FormLabel>Last Name</FormLabel> */}
//                       <FormControl>
//                         <Input
//                           className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:ring-udua-blue-primary! focus:outline-hidden! focus:ring-1! focus:ring-opacity-90! border-udua-blue-primary focus:border-transparent"
//                           type="text"
//                           placeholder="Your Last Name"
//                           aria-label="name"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   // className="w-full mt-4"
//                   control={form.control}
//                   name="otherNames"
//                   render={({ field }) => (
//                     <FormItem>
//                       {/* <FormLabel>Other Names</FormLabel> */}
//                       <FormControl>
//                         <Input
//                           className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:ring-udua-blue-primary! focus:outline-hidden! focus:ring-1! focus:ring-opacity-90! border-udua-blue-primary focus:border-transparent"
//                           type="text"
//                           placeholder="Other Names"
//                           aria-label="name"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   // className="w-full mt-4"
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       {/* <FormLabel>Email</FormLabel> */}
//                       <FormControl>
//                         <Input
//                           className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:ring-udua-blue-primary! focus:outline-hidden! focus:ring-1! focus:ring-opacity-90! border-udua-blue-primary focus:border-transparent"
//                           type="email"
//                           placeholder="Your Email"
//                           aria-label="Your Email"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   // className="w-full mt-4"
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       {/* <FormLabel>Password</FormLabel> */}
//                       <FormControl>
//                         <Input
//                           className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:ring-udua-blue-primary! focus:outline-hidden! focus:ring-1! focus:ring-opacity-90! border-udua-blue-primary focus:border-transparent"
//                           type="password"
//                           placeholder="Enter your password"
//                           aria-label="password"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   // className="w-full mt-4"
//                   control={form.control}
//                   name="confirmPassword"
//                   render={({ field }) => (
//                     <FormItem>
//                       {/* <FormLabel>Confirm Password</FormLabel> */}
//                       <FormControl>
//                         <Input
//                           className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:ring-udua-blue-primary! focus:outline-hidden! focus:ring-1! focus:ring-opacity-90! border-udua-blue-primary focus:border-transparent"
//                           type="password"
//                           placeholder="confirm your password"
//                           aria-label="confirm your password"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   // className="w-full mt-4"
//                   control={form.control}
//                   name="address"
//                   render={({ field }) => (
//                     <FormItem>
//                       {/* <FormLabel>Your Address</FormLabel> */}
//                       <FormControl>
//                         <Input
//                           className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:ring-udua-blue-primary! focus:outline-hidden! focus:ring-1! focus:ring-opacity-90! border-udua-blue-primary focus:border-transparent"
//                           type="text"
//                           placeholder="Enter your Address"
//                           aria-label="Enter your Address"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   // className="w-full mt-4"
//                   control={form.control}
//                   name="phoneNumber"
//                   render={({ field }) => (
//                     <FormItem>
//                       {/* <FormLabel>Phone Number</FormLabel> */}
//                       <FormControl>
//                         <Input
//                           className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:ring-udua-blue-primary! focus:outline-hidden! focus:ring-1! focus:ring-opacity-90! border-udua-blue-primary focus:border-transparent"
//                           type="text"
//                           placeholder="090******35"
//                           aria-label="Enter your phone number"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   // className="w-full mt-4"
//                   control={form.control}
//                   name="cityOfResidence"
//                   render={({ field }) => (
//                     <FormItem>
//                       {/* <FormLabel>City Of Residence</FormLabel> */}
//                       <FormControl>
//                         <Input
//                           className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:ring-udua-blue-primary! focus:outline-hidden! focus:ring-1! focus:ring-opacity-90! border-udua-blue-primary focus:border-transparent"
//                           type="text"
//                           placeholder="Enter your city of Residence"
//                           aria-label="Enter your city of Residence"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   // className="w-full mt-4"
//                   control={form.control}
//                   name="stateOfResidence"
//                   render={({ field }) => (
//                     <FormItem>
//                       {/* <FormLabel>State of Residence</FormLabel> */}
//                       <FormControl>
//                         <Input
//                           className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:ring-udua-blue-primary! focus:outline-hidden! focus:ring-1! focus:ring-opacity-90! border-udua-blue-primary focus:border-transparent"
//                           type="text"
//                           placeholder="Enter your state of Residence"
//                           aria-label="Enter your state of Residence"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   // className="w-full mt-4"
//                   control={form.control}
//                   name="postalCode"
//                   render={({ field }) => (
//                     <FormItem>
//                       {/* <FormLabel>postalCode</FormLabel> */}
//                       <FormControl>
//                         <Input
//                           className="block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-200 text-black focus:ring-udua-blue-primary! focus:outline-hidden! focus:ring-1! focus:ring-opacity-90! border-udua-blue-primary focus:border-transparent"
//                           type="text"
//                           placeholder="Enter your postal Code"
//                           aria-label="Enter your postal Code"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <Button className="px-6 py-2 mt-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-hidden focus:ring-3 focus:ring-blue-300 focus:ring-opacity-50 w-full">
//                   Sign Up
//                 </Button>

//                 <div className="flex items-center justify-between mt-4"></div>
//               </form>
//             </Form>
//           </div>

//           <div className="flex items-center justify-center py-4 text-center">
//             <span className="text-sm text-gray-600 dark:text-gray-200">
//               Already have an account?{" "}
//             </span>

//             <Link
//               href="/sign-in"
//               className="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline"
//             >
//               Sign In
//             </Link>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// export default SignUp;
