"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { sellerInfoValidation } from "@/lib/validations/seller-info-validation";
import { useToast } from "@/components/ui/use-toast";
import { CheckCheck, Loader } from "lucide-react";
import axios from "axios";
import { User } from "@/types";
import { siteConfig } from "@/config/site";

function AboutSellerAndProduct() {
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const result = await axios.post<{ data: User }>(`/api/user/userData`);
      setUserData(result.data.data);
    };

    fetchUserData();
  }, []);

  const form = useForm<z.infer<typeof sellerInfoValidation>>({
    resolver: zodResolver(sellerInfoValidation),
    defaultValues: {
      sellerName: `${userData?.firstName} ${userData?.lastName}`,
      sellerEmail: `${userData?.email}`,
    },
  });

  async function onSubmit(values: z.infer<typeof sellerInfoValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values)
    setIsLoading((val) => !val);
    const sellerParams = {
      seller: `${userData?.firstName} ${userData?.lastName}`,
      email: userData?.email,
      businessName: values.businessName,
      userID: userData?._id,
    };

    try {
      const response = await fetch("/api/sellerInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sellerParams),
      });

      const res = response;
      // console.log(res.status);

      if (res.status === 200) {
        setIsLoading((val) => !val);
        toast({
          title: `Successfull`,
          description: `Message sent Successfully`,
        });

        toast({
          title: `Further Instructions.`,
          description: `To complete this process, Please check your email for further instructions`,
        });

        setShowInfo((val) => !val);
      } else {
        toast({
          title: `Failed`,
          description: `An error occurred. Please try again. `,
        });
        setIsLoading((val) => !val);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <section className="max-w-3xl mx-auto my-5 px-6 min-h-screen">
      {!showInfo ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            {/* seller Name */}
            <FormField
              control={form.control}
              name="sellerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Joe Smith"
                      {...field}
                      value={`${userData?.firstName} ${userData?.lastName}`}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* seller Email */}
            <FormField
              control={form.control}
              name="sellerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="joesmith35@gmail.com"
                      {...field}
                      value={userData?.email}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Business Name */}
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Your Company or Organization's Business Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Category  */}
            {/* <FormField
              control={form.control}
              name="productCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Category</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Product Category" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="School Supplies">
                        School Supplies
                      </SelectItem>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Body Care Products">
                        Body Care Products
                      </SelectItem>
                      <SelectItem value="Phone Accessories">
                        Phones Accessories
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <Button
              type="submit"
              className="items-end w-full bg-purple-500 hover:bg-purple-600"
              disabled={
                userData?.firstName === null ||
                userData?.firstName === undefined
              }
            >
              {!isLoading && "Submit"}
              {isLoading && (
                <Loader className=" animate-spin w-5 h-5 mr-4" />
              )}{" "}
              {isLoading && "Please wait..."}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="flex items-center flex-col">
          <CheckCheck className="h-28 w-28 text-green-500 my-5" />
          <div className="border rounded-md py-4 px-6">
            <p>
              Thank you for considering a partnership with {siteConfig.name}. We
              appreciate your interest, and our team will review your proposal
              promptly. If we find that there is a potential for collaboration,
              we will reach out to you to discuss further details.
            </p>

            <p className="pt-4">Further Instructions:</p>

            <p className="pt-2">
              Please ensure to check your E-mail and follow the instructions
              carefully.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default AboutSellerAndProduct;
