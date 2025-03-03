"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "slugify";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { sellerInfoValidation } from "@/lib/validations/seller-info-validation";
import { useToast } from "@/components/ui/use-toast";
import { CheckCheck, Loader } from "lucide-react";
import axios from "axios";
import { User } from "@/types";
import { siteConfig } from "@/config/site";
import Link from "next/link";

function AboutSellerAndProduct() {
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [slug, setSlug] = useState("");
  const [isSlugEditable, setIsSlugEditable] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false); // For checkbox
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const result = await axios.post<{ data: User }>("/api/user/userData");
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

  // Generate slug automatically based on store name
  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const storeName = e.target.value;
    const generatedSlug = slugify(storeName, { lower: true });
    if (!isSlugEditable) {
      setSlug(generatedSlug);
    }
    form.setValue("businessName", storeName);
  };

  // Toggle slug edit mode
  const toggleSlugEdit = () => {
    setIsSlugEditable((prev) => !prev);
  };

  async function onSubmit(values: z.infer<typeof sellerInfoValidation>) {
    if (!agreedToTerms) {
      toast({
        title: "Terms not agreed",
        description: "You must agree to the terms and conditions.",
      });
      return;
    }

    setIsLoading(true);
    const sellerParams = {
      seller: `${userData?.firstName} ${userData?.lastName}`,
      email: userData?.email,
      businessName: values.businessName,
      storeSlug: slug,
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

      if (response.status === 200) {
        setIsLoading(false);
        toast({
          title: "Successful",
          description: "Store created successfully.",
        });
        setShowInfo(true);
      } else {
        throw new Error("Error creating store");
      }
    } catch (error) {
      toast({
        title: "Failed",
        description: "An error occurred. Please try again.",
      });
      setIsLoading(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto my-5 px-6 min-h-screen">
      {!showInfo && (
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-semibold">Partner with Udua</h2>

          <p>
            Udua collaborates with a diverse range of business partners and
            service providers to deliver affordable, high-quality products to
            consumers.
          </p>
          <p>
            <Link
              href="/code-of-conduct"
              className="text-blue-500 hover:underline"
            >
              Udua's Code of Conduct
            </Link>{" "}
            outlines the standards for conducting business in an ethical,
            lawful, and responsible manner.{" "}
            <Link
              href="/prohibited-products"
              className="text-blue-500 hover:underline"
            >
              Please click here to view our list of prohibited products.
            </Link>{" "}
          </p>
          <p>
            <Link
              href="/human-rights-policy"
              className="text-blue-500 hover:underline"
            >
              Udua's Human Rights Policy
            </Link>{" "}
            affirms our commitment to respecting and promoting human rights
            throughout our business and partnerships. We ensure that all
            individuals are treated with respect, dignity, and fairness. This
            commitment is essential to building trust and reliability with our
            employees, business partners, and stakeholders.
          </p>

          <p>
            To create your store and partner with Udua, please fill out the form
            below with accurate details. Before submitting, ensure that you have
            read and agreed to our Code of Conduct.
          </p>
        </div>
      )}
      {!showInfo ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Seller Name */}
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

            {/* Seller Email */}
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

            {/* Store Name */}
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business/Store Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Your Company or Store Name"
                      {...field}
                      onChange={handleStoreNameChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Store Slug */}
            <FormItem>
              <FormLabel>Store URL Slug</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled={!isSlugEditable}
                />
              </FormControl>
              <Button variant="link" type="button" onClick={toggleSlugEdit}>
                {isSlugEditable ? "Lock Slug" : "Edit Slug"}
              </Button>
              <FormMessage />
            </FormItem>

            {/* Checkbox for agreement */}
            <FormItem className="flex items-center">
              <Checkbox
                className="mt-2"
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
              />
              <FormLabel htmlFor="terms" className="ml-2">
                I have read and agree to the{" "}
                <Link
                  href="/code-of-conduct"
                  className="text-blue-500 hover:underline"
                >
                  Code of Conduct.
                </Link>
              </FormLabel>
            </FormItem>

            <Button
              type="submit"
              className="items-end w-full bg-purple-500 hover:bg-purple-600"
              disabled={isLoading}
            >
              {!isLoading && "Submit"}
              {isLoading && <Loader className="animate-spin w-5 h-5 mr-4" />}
              {isLoading && "Please wait..."}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="flex items-center flex-col">
          <CheckCheck className="h-28 w-28 text-green-500 my-5" />
          <div className="py-4 px-6">
            <p>
              Thank you for choosing {siteConfig.name} as your platform of
              choice. We appreciate your interest, and our team will review your
              proposal promptly.
            </p>

            <p className="pt-2 font-semibold">
              Please ensure to check your E-mail ({userData?.email}) and follow
              the instructions carefully.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default AboutSellerAndProduct;
