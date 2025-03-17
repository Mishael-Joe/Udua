"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DealFormValues, dealSchema } from "@/lib/validations/deal-validation";

import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Step2 } from "./deals/step2";
import { Step1 } from "./deals/step1";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CombinedProduct } from "@/types";
import { useRouter } from "next/navigation";

const steps = [
  { title: "Select Products & Deal Type" },
  { title: "Configure Deal Details" },
  { title: "Review & Publish" },
];

function UploadDeal({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [products, setProducts] = useState<CombinedProduct[] | []>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]); // Track selected product IDs
  const [dealType, setDealType] = useState<string>("flash_sale"); // Track selected deal type

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const { data } = await axios.post<{ products: CombinedProduct[] }>(
          "/api/store/fetch-products",
          { signal: controller.signal }
        );
        setProducts(data.products);
        // console.log(" data.products", data.products);
      } catch (error: any) {
        if (!axios.isCancel(error)) {
          console.error("Failed to fetch products", error.message);
          toast({
            title: "Error",
            variant: "destructive",
            description: "Failed to load products. Please try again later.",
          });
        }
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      storeID: params.slug, // Get from session/context
      dealType: "flash_sale",
      productIds: selectedProducts, // Initialize with empty array
      startDate: startDate,
      endDate: endDate,
    },
  });

  const handleNext = async () => {
    // console.log("form values:", form.watch()); // Logs current form values

    const arrOfFieldsToValidat: (
      | "dealType"
      | "percentage"
      | "flashSaleQuantity"
      | "productIds"
      | "startDate"
      | "endDate"
    )[] =
      currentStep === 1
        ? ["dealType", "productIds"]
        : ["startDate", "endDate", "percentage", "flashSaleQuantity"];
    // Trigger validation for specific fields (dealType and productIds)
    const isValid = await form.trigger(arrOfFieldsToValidat);

    // console.log("Validation result:", isValid); // Logs whether validation passed

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length)); // Proceed to next step if valid
    } else {
      // console.log("Validation failed, not proceeding to the next step.");
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: DealFormValues) => {
    try {
      await axios.post("/api/deals", data);
      toast({ title: "Deal created successfully!" });
      router.push(`/store/${params.slug}/deals`);
      // Redirect to deals list
    } catch (error) {
      toast({
        title: "Error creating deal",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="flex flex-col gap-4 p-4 md:gap-0">
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">Deals</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage> Create Deal</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1 py-4">
        <CreateProduct id={params.slug} />
      </div> */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1 py-4">
        <div className="mb-8 flex justify-between">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep > index + 1
                    ? "bg-green-500 text-white"
                    : currentStep === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="w-16 h-1 bg-gray-200" />
              )}
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-bold mb-6">
          {steps[currentStep - 1].title}
        </h1>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {currentStep === 1 && (
            <Step1
              control={form.control}
              products={products}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              dealType={dealType}
              setDealType={setDealType}
              goNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <Step2
              control={form.control}
              dealType={dealType}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              startDate={startDate}
              form={form}
              endDate={endDate}
              goBack={handlePrev}
              goNext={handleNext}
            />
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrev}>
                  Back
                </Button>
                <Button type="submit">Create Deal</Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

export default UploadDeal;
