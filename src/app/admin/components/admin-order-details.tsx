"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useState } from "react";
import { Loader } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";

function AdminOrderDetails() {
  const [orderID, setOrderID] = useState("");
  const [order, setOrder] = useState<any | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (val: string, e: React.FormEvent) => {
    e.preventDefault();

    if (val === "requestOrderData") {
      try {
        setIsLoading(true);

        const response = await axios.get("/api/admin/order-details", {
          params: {
            orderID,
          },
        });
        // console.log(`response`, response);

        if (response.data.success === true || response.status === 200) {
          toast({
            title: `Success`,
            description: `Here is the seller details.`,
          });
          setOrder(response.data.data);
          setIsLoading(false);
        } else {
          toast({
            variant: `destructive`,
            title: `Error`,
            description: `There was an error fetching user data. Please try again.`,
          });
          setIsLoading(false);
        }
      } catch (error) {
        toast({
          variant: `destructive`,
          title: "Error",
          description: `There was an error fetching user data. Please try again.`,
        });
        setIsLoading(false);
      }
    }

    if (val === "verifyProduct") {
      try {
        setIsLoading(true);

        const response = await axios.post("/api/admin/verify-product", {
          orderID,
          type: "VerifyProduct",
        });
        // console.log(`response`, response);

        if (response.data.success === true || response.status === 200) {
          toast({
            title: `Success`,
            description: `This user is now a verified seller.`,
          });
          setOrder(response.data.data);
          setIsLoading(false);
        } else {
          toast({
            variant: `destructive`,
            title: `Error`,
            description: `There was an error fetching user data. Please try again.`,
          });
          setIsLoading(false);
        }
      } catch (error) {
        toast({
          variant: `destructive`,
          title: "Error",
          description: `There was an error fetching user data. Please try again.`,
        });
        setIsLoading(false);
      }
    }

    if (val === "UnVerifyProduct") {
      try {
        setIsLoading(true);

        const response = await axios.post("/api/admin/verify-product", {
          orderID,
          type: "UnVerifyProduct",
        });
        // console.log(`response`, response);

        if (response.data.success === true || response.status === 200) {
          toast({
            title: `Success`,
            description: `This user is now a verified seller.`,
          });
          setOrder(response.data.data);
          setIsLoading(false);
        } else {
          toast({
            variant: `destructive`,
            title: `Error`,
            description: `There was an error fetching user data. Please try again.`,
          });
          setIsLoading(false);
        }
      } catch (error) {
        toast({
          variant: `destructive`,
          title: "Error",
          description: `There was an error fetching user data. Please try again.`,
        });
        setIsLoading(false);
      }
    }
  };

  return (
    <section>
      <h3 className="my-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
        Order Details
      </h3>

      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 mb-6">
        <div className="px-6 py-4">
          <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
            Provide the Order Id.
          </p>

          <form
            onSubmit={(e) => handleSubmit("requestOrderData", e)}
            className="space-y-8 "
          >
            <input
              className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
              aria-label="ID"
              type="text"
              value={orderID}
              onChange={(e) => setOrderID(e.target.value)}
              placeholder="Order ID"
              required
            />
            <Button
              type="submit"
              className="items-end w-full bg-purple-500 hover:bg-purple-600"
            >
              {!isLoading && "Submit"}
              {isLoading && (
                <Loader className=" animate-spin w-5 h-5 mr-4" />
              )}{" "}
              {isLoading && "Please wait..."}
            </Button>
          </form>
        </div>
      </div>

      <div>
        {order && (
          <div className="py-6 border-t-2 flex flex-col justify-between gap-3">
            <CardTitle>Order</CardTitle>
            <Card>
              <CardHeader>
                <CardTitle>Order ID: {order._id}</CardTitle>
                <CardDescription>
                  Here's a summary for this order.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <h2>Order ID: {order._id}</h2>
                  <p>
                    Order Date: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p>Status: {order.status}</p>
                  <p>
                    Total Amount:
                    {formatNaira(order.totalAmount)}
                  </p>
                  <p>Shipping Address: {order.shippingAddress}</p>
                  <p>Shipping Method: {order.shippingMethod}</p>
                  {/* <p>Tracking Number: {orderDetails.trackingNumber}</p> */}
                  <p>Payment Method: {order.paymentMethod}</p>
                  <p>Payment Status: {order.paymentStatus}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Product{order.products.length > 1 && "s"} Purchased
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:gap-x-8">
                  {order.products.map((product: any) => (
                    <div
                      className="flex flex-col sm:flex-row gap-4 text-sm w-full"
                      key={product.productName}
                    >
                      <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
                        {product.product !== null ||
                          (product.product !== null && (
                            <Image
                              src={product.product.productImage[0]}
                              alt={product.productName}
                              width={300}
                              height={150}
                              className="h-full w-full object-cover object-center"
                              quality={90}
                            />
                          ))}
                      </div>

                      <div>
                        <h3 className="mt-4 font-medium">
                          Product Name:
                          {product.product && product.product.productName}
                        </h3>
                        <p className="mt-2 font-medium">
                          Quantity: {product.quantity && product.quantity}
                        </p>
                        {product.price && (
                          <p className="mt-2 font-medium">
                            Price: {formatNaira(product.price)}{" "}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminOrderDetails;
