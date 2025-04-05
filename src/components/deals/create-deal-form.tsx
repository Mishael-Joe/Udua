"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createDeal } from "@/lib/actions/deal.actions";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/types";
import axios from "axios";

// Define the form schema
const formSchema = z.object({
  storeID: z.string().min(1, "Store ID is required"),
  storePassword: z.string().min(1, "Store password is required"),
  name: z.string().min(3, "Deal name must be at least 3 characters"),
  description: z.string().optional(),
  dealType: z.enum([
    "percentage",
    "fixed",
    "free_shipping",
    "flash_sale",
    "buy_x_get_y",
  ]),
  value: z.coerce.number().min(0, "Value must be a positive number"),
  productIds: z
    .array(z.string())
    .min(1, "At least one product must be selected"),
  categoryIds: z.array(z.string()).optional(),
  startDate: z
    .date()
    .refine((date) => date >= new Date(), "Start date must be in the future"),
  endDate: z
    .date()
    .refine((date) => date > new Date(), "End date must be in the future"),
  minCartValue: z.coerce.number().optional(),
  maxDiscountValue: z.coerce.number().optional(),
  usageLimit: z.coerce.number().optional(),
  autoApply: z.boolean().default(false),
  applyToSizes: z.array(z.string()).optional(),
  code: z.string().optional(),
  buyQuantity: z.coerce.number().optional(),
  getQuantity: z.coerce.number().optional(),
  getProductIds: z.array(z.string()).optional(),
  flashSaleQuantity: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Mock data for product selection - replace with actual data from your API
const mockProducts = [
  { id: "prod1", name: "Product 1" },
  { id: "prod2", name: "Product 2" },
  { id: "prod3", name: "Product 3" },
];

// Mock data for categories - replace with actual data from your API
const mockCategories = [
  { id: "cat1", name: "Category 1" },
  { id: "cat2", name: "Category 2" },
  { id: "cat3", name: "Category 3" },
];

// Mock data for sizes - replace with actual data from your API
const sizes = [
  { id: "xs", label: "XS" },
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
];

export default function CreateDealForm({ storeID }: { storeID: string }) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[] | []>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const { data } = await axios.post<{ products: Product[] }>(
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

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeID,
      storePassword: "",
      name: "",
      description: "",
      dealType: "percentage",
      value: 0,
      productIds: [],
      categoryIds: [],
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default to 7 days from now
      autoApply: true,
      applyToSizes: [],
    },
  });

  // Watch for changes to dealType to conditionally render fields
  const dealType = form.watch("dealType");

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createDeal({
        ...data,
        path: `/store/${storeID}/deals`, // Adjust this path as needed
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Deal created successfully",
        });
        router.push(`/store/${storeID}/deals`); // Redirect to deals page
        router.refresh(); // Refresh the page data
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create deal",
          variant: "destructive",
        });

        // Handle field-specific errors
        if (result.fieldErrors) {
          result.fieldErrors.forEach((error: any) => {
            form.setError(error.path as any, {
              message: error.message,
            });
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Deal</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Deal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deal Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Summer Sale" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dealType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deal Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select deal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">
                          Percentage Discount
                        </SelectItem>
                        <SelectItem value="fixed">
                          Fixed Amount Discount
                        </SelectItem>
                        <SelectItem value="free_shipping">
                          Free Shipping
                        </SelectItem>
                        <SelectItem value="flash_sale">Flash Sale</SelectItem>
                        <SelectItem value="buy_x_get_y">Buy X Get Y</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The type of deal determines how the discount is applied
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the deal for your customers"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deal Value */}
            {dealType !== "free_shipping" && (
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {dealType === "percentage"
                        ? "Discount Percentage"
                        : dealType === "fixed"
                        ? "Discount Amount (in kobo)"
                        : dealType === "flash_sale"
                        ? "Discount Percentage"
                        : "Discount Value"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={
                          dealType === "percentage" || dealType === "flash_sale"
                            ? "20"
                            : "5000"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {dealType === "percentage" || dealType === "flash_sale"
                        ? "Enter a percentage between 1-100"
                        : "Enter the discount amount in kobo (e.g., 5000 = ₦50)"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Product Selection */}
            <FormField
              control={form.control}
              name="productIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Select Products</FormLabel>
                    <FormDescription>
                      Choose which products this deal applies to
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {products.map((product) => (
                      <FormField
                        key={product._id}
                        control={form.control}
                        name="productIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={product._id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(product._id!)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          product._id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== product._id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {product.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Flash Sale Specific Fields */}
            {dealType === "flash_sale" && (
              <FormField
                control={form.control}
                name="flashSaleQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flash Sale Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormDescription>
                      The total number of items available at the flash sale
                      price
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Buy X Get Y Specific Fields */}
            {dealType === "buy_x_get_y" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="buyQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buy Quantity (X)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="2" {...field} />
                      </FormControl>
                      <FormDescription>
                        How many items the customer needs to buy
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="getQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Get Quantity (Y)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        How many items the customer gets at a discount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Additional Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minCartValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Cart Value (in kobo)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10000" {...field} />
                    </FormControl>
                    <FormDescription>
                      Minimum order amount required (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Limit</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum number of times this deal can be used (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {dealType === "percentage" && (
              <FormField
                control={form.control}
                name="maxDiscountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Discount Amount (in kobo)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50000" {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum discount amount for percentage discounts
                      (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Auto Apply Switch */}
            <FormField
              control={form.control}
              name="autoApply"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Auto Apply</FormLabel>
                    <FormDescription>
                      Automatically apply this deal when conditions are met
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Manual Code (if not auto-apply) */}
            {!form.watch("autoApply") && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Code</FormLabel>
                    <FormControl>
                      <Input placeholder="SUMMER2025" {...field} />
                    </FormControl>
                    <FormDescription>
                      Code customers will enter to apply this deal (3-20
                      alphanumeric characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Store Password for Authentication */}
            <FormField
              control={form.control}
              name="storePassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your store password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Required to authenticate this action
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-udua-blue-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Deal...
                </>
              ) : (
                "Create Deal"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
