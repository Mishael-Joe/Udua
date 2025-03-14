"use client";

import { useState } from "react";
import TrackingForm from "./tracking-form";
import OrderStatus from "./order-status";
import OrderDetails from "./order-details";
import axios from "axios";
import { Order } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export default function TrackingPage({
  params,
}: {
  params: { order_Id: string };
}) {
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null); // Replace `any` with your order type if available
  const [loading, setLoading] = useState(false);

  const handleSearch = async (trackingId: string) => {
    setLoading(true);
    try {
      // Fetch order data from the API using the tracking ID
      const response = await axios.post(`/api/track-order/track-an-order`, {
        trackingId,
      });
      // console.log("response", response.data.order);
      setOrder(response.data.order);
    } catch (error) {
      toast({
        variant: "default",
        title: "Error",
        description:
          "Please input a valid order ID. If this error still persists, please contact our support team.",
      });
      console.error("Error fetching order data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <TrackingForm onSearch={handleSearch} params={params} />
      {loading && <p>Loading...</p>}
      {order && (
        <>
          <OrderStatus
            status={order.deliveryStatus}
            createdAt={order.createdAt}
            updatedAt={order.updatedAt}
            deliveryDate={order.deliveryDate}
            trackingNumber={order.trackingNumber}
          />
          <OrderDetails products={order.products} />
        </>
      )}
    </div>
  );
}
