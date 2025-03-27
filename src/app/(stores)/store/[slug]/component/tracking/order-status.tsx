// order-status.tsx
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Order, SubOrder } from "@/types";

interface OrderStatusProps {
  status: SubOrder["deliveryStatus"];
  createdAt: Order["createdAt"];
  updatedAt: Order["updatedAt"];
  trackingNumber?: SubOrder["trackingNumber"];
  deliveryDate?: SubOrder["deliveryDate"];
  storeName: string;
}

const statusColors = {
  "Order Placed": "bg-blue-100 text-blue-800",
  Processing: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-indigo-100 text-indigo-800",
  "Out for Delivery": "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Canceled: "bg-red-100 text-red-800",
  Returned: "bg-pink-100 text-pink-800",
  "Failed Delivery": "bg-rose-100 text-rose-800",
  Refunded: "bg-gray-100 text-gray-800",
};

const OrderStatus: React.FC<OrderStatusProps> = ({
  status,
  updatedAt,
  createdAt,
  deliveryDate,
  trackingNumber,
  storeName,
}) => {
  /**
   * Formats date to localized string with time
   * @param date - Date object or string to format
   * @returns Formatted date string
   */
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h2 className="text-lg font-semibold">Store: {storeName}</h2>
        <Badge className={cn("capitalize", statusColors[status])}>
          {status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <p className="text-gray-600">Order Date</p>
          <p className="font-medium">{formatDate(createdAt)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-600">Last Updated</p>
          <p className="font-medium">{formatDate(updatedAt)}</p>
        </div>
        {trackingNumber && (
          <div className="space-y-1">
            <p className="text-gray-600">Tracking Number</p>
            <p className="font-medium break-all">{trackingNumber}</p>
          </div>
        )}
        {deliveryDate && (
          <div className="space-y-1">
            <p className="text-gray-600">Estimated Delivery</p>
            <p className="font-medium">{formatDate(deliveryDate)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;

// import { Order } from "@/types";

// interface OrderStatusProps {
//   createdAt: Order["createdAt"];
//   updatedAt: Order["updatedAt"];
//   status: Order["deliveryStatus"];
//   trackingNumber?: Order["trackingNumber"];
//   deliveryDate?: Order["deliveryDate"];
// }

// const OrderStatus: React.FC<OrderStatusProps> = ({
//   status,
//   updatedAt,
//   createdAt,
//   deliveryDate,
//   trackingNumber,
// }) => {
//   return (
//     <div className="bg-gray-100 p-4 rounded-lg shadow-md my-4">
//       <h2 className="text-xl font-semibold mb-2">Order Status</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-3">
//         <p className="text-gray-700">
//           Order Date:{" "}
//           <span className="font-medium">
//             {new Date(createdAt).toLocaleString()}
//           </span>
//         </p>
//         <p className="text-gray-700">
//           Last Updated:{" "}
//           <span className="font-medium">
//             {new Date(updatedAt).toLocaleString()}
//           </span>
//         </p>
//         <p className="text-gray-700">
//           Current Status: <span className="font-medium">{status}</span>
//         </p>
//         <p className="text-gray-700">
//           Tracking Number:{" "}
//           <span className="font-medium">
//             {trackingNumber ? trackingNumber : "Processing"}
//           </span>
//         </p>
//         {deliveryDate && (
//           <p className="text-gray-700">
//             Estimated Delivery:{" "}
//             <span className="font-medium">
//               {new Date(deliveryDate).toLocaleString()}
//             </span>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderStatus;
