"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Trash } from "lucide-react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  estimatedDeliveryDays: z.number().min(1).optional(),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
  applicableRegions: z.array(z.string()).optional(),
  conditions: z
    .object({
      minOrderValue: z.number().min(0).optional(),
      maxOrderValue: z.number().min(0).optional(),
      minWeight: z.number().min(0).optional(),
      maxWeight: z.number().min(0).optional(),
    })
    .optional(),
});

interface ShippingMethod {
  name: string;
  price: number;
  estimatedDeliveryDays?: number;
  isActive: boolean;
  description?: string;
  applicableRegions?: string[];
  conditions?: {
    minOrderValue?: number;
    maxOrderValue?: number;
    minWeight?: number;
    maxWeight?: number;
  };
}

export default function ShippingMethodForm() {
  const { toast } = useToast();
  const [regions, setRegions] = useState<string[]>([]);
  const [newRegion, setNewRegion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<ShippingMethod | null>(
    null
  );
  const MAX_METHODS = 3;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: true,
      conditions: {},
    },
  });

  // Fetch existing shipping methods on component mount
  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const response = await axios.get("/api/store/shipping-methods");
        setShippingMethods(response.data.shippingMethods);
      } catch (error) {
        console.error("Error fetching shipping methods:", error);
        toast({
          title: "Error",
          description: "Failed to load shipping methods",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchShippingMethods();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Check maximum methods limit
      if (shippingMethods.length >= MAX_METHODS) {
        toast({
          title: "Limit Reached",
          description: `Maximum of ${MAX_METHODS} shipping methods allowed`,
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      const fullValues = { ...values, applicableRegions: regions };

      const response = await axios.post("/api/store/shipping-methods", {
        fullValues,
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: `Shipping method added`,
        });
        form.reset();
        setRegions([]);
        // Refresh the methods list
        const refreshResponse = await axios.get("/api/store/shipping-methods");
        setShippingMethods(refreshResponse.data.shippingMethods);
      }
    } catch (error: any) {
      const { response } = error;
      console.log("response", response);
      if (response.status === 409) {
        toast({
          title: "Error",
          description:
            response.data.error ||
            `Shipping method '${values.name}' already exists`,
        });
      } else {
        toast({
          title: "Error",
          description: `Error adding shipping method`,
        });
      }
      console.error("Error adding shipping method:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleEditMethod = (method: ShippingMethod) => {
    setIsEditing(true);
    setCurrentMethod(method);
    form.reset({
      ...method,
      conditions: method.conditions || {},
    });
    setRegions(method.applicableRegions || []);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentMethod(null);
    form.reset();
    setRegions([]);
  };

  const addRegion = () => {
    if (newRegion.trim()) {
      setRegions([...regions, newRegion.trim()]);
      setNewRegion("");
    }
  };

  const removeRegion = (index: number) => {
    setRegions(regions.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Existing Methods Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center justify-between">
            <span>Shipping Methods</span>
            <Badge variant="outline">
              {shippingMethods.length}/{MAX_METHODS}
            </Badge>
          </CardTitle>
          <CardDescription>
            Manage your store's shipping methods and configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
              ))}
            </div>
          ) : shippingMethods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shippingMethods.map((method, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{method.name}</h3>
                      <Badge
                        variant={method.isActive ? "default" : "secondary"}
                      >
                        {method.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span>₦{(method.price / 100).toFixed(2)}</span>
                      </div>
                      {method.estimatedDeliveryDays && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Delivery Days:
                          </span>
                          <span>{method.estimatedDeliveryDays}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleEditMethod(method)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Method
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No shipping methods configured
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Method Form */}
      <Card
        className={
          shippingMethods.length >= MAX_METHODS && !isEditing
            ? "opacity-50 pointer-events-none"
            : ""
        }
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isEditing ? `Edit ${currentMethod?.name}` : "Add Shipping Method"}
          </CardTitle>
          <CardDescription>
            {shippingMethods.length >= MAX_METHODS && !isEditing
              ? "Maximum methods reached. Remove existing methods to add new ones."
              : "Configure new shipping method for your store"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Keep existing form fields */}
              {/* Basic Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Method Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Standard Shipping" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedDeliveryDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Delivery Days</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="3-5 business days"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2">
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Regions Section */}
              <div className="space-y-4">
                <FormLabel>Applicable Regions</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    placeholder="Add region (e.g., US, EU)"
                  />
                  <Button type="button" onClick={addRegion} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Region
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {regions.map((region, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-muted px-3 py-1 rounded-full"
                    >
                      <span>{region}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2 p-1 h-auto"
                        onClick={() => removeRegion(index)}
                      >
                        <Trash className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conditions Section */}
              <div className="space-y-6">
                <h3 className="font-medium">Conditions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="conditions.minOrderValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Order Value</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="No minimum"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="conditions.maxOrderValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Order Value</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="No maximum"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="conditions.minWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="No minimum"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="conditions.maxWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="No maximum"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional information about this shipping method"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-500 hover:bg-udua-blue-primary"
                >
                  {isSubmitting
                    ? "Saving..."
                    : isEditing
                    ? "Update Method"
                    : "Create Method"}
                </Button>

                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={cancelEdit}
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
