// tracking-page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { Order, SubOrder } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import TrackingForm from "./tracking-form";
import OrderStatus from "./order-status";
import OrderDetails from "./order-details";

export default function TrackingPage({
  params,
}: {
  params: { order_Id: string };
}) {
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handles order search using tracking ID/order ID
   * @param trackingId - The order ID or tracking number to search
   */
  const handleSearch = async (trackingId: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/track-order/track-an-order`, {
        trackingId,
      });
      if (response.data.order) {
        setOrder(response.data.order);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Order not found",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch order details. Please try again later.",
      });
      console.error("Error fetching order data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <TrackingForm onSearch={handleSearch} params={params} />

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        )}

        {order && (
          <div className="space-y-6">
            {/* Display status for each sub-order */}
            {order.subOrders.map((subOrder: SubOrder) => (
              <OrderStatus
                key={subOrder._id}
                status={subOrder.deliveryStatus}
                createdAt={order.createdAt}
                updatedAt={order.updatedAt}
                deliveryDate={subOrder.deliveryDate}
                trackingNumber={subOrder.trackingNumber}
                storeName={subOrder.store}
              />
            ))}

            {/* Display products grouped by store */}
            <OrderDetails subOrders={order.subOrders} />
          </div>
        )}
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import TrackingForm from "./tracking-form";
// import OrderStatus from "./order-status";
// import OrderDetails from "./order-details";
// import axios from "axios";
// import { Order } from "@/types";
// import { useToast } from "@/components/ui/use-toast";

// export default function TrackingPage({
//   params,
// }: {
//   params: { order_Id: string };
// }) {
//   const { toast } = useToast();
//   const [order, setOrder] = useState<Order | null>(null); // Replace `any` with your order type if available
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async (trackingId: string) => {
//     setLoading(true);
//     try {
//       // Fetch order data from the API using the tracking ID
//       const response = await axios.post(`/api/track-order/track-an-order`, {
//         trackingId,
//       });
//       // console.log("response", response.data.order);
//       setOrder(response.data.order);
//     } catch (error) {
//       toast({
//         variant: "default",
//         title: "Error",
//         description:
//           "Please input a valid order ID. If this error still persists, please contact our support team.",
//       });
//       console.error("Error fetching order data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <TrackingForm onSearch={handleSearch} params={params} />
//       {loading && <p>Loading...</p>}
//       {order && (
//         <>
//           <OrderStatus
//             status={order.deliveryStatus}
//             createdAt={order.createdAt}
//             updatedAt={order.updatedAt}
//             deliveryDate={order.deliveryDate}
//             trackingNumber={order.trackingNumber}
//           />
//           <OrderDetails products={order.products} />
//         </>
//       )}
//     </div>
//   );
// }
