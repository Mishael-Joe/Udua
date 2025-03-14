import { Order } from "@/types";

interface OrderStatusProps {
  createdAt: Order["createdAt"];
  updatedAt: Order["updatedAt"];
  status: Order["deliveryStatus"];
  trackingNumber?: Order["trackingNumber"];
  deliveryDate?: Order["deliveryDate"];
}

const OrderStatus: React.FC<OrderStatusProps> = ({
  status,
  updatedAt,
  createdAt,
  deliveryDate,
  trackingNumber,
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md my-4">
      <h2 className="text-xl font-semibold mb-2">Order Status</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-3">
        <p className="text-gray-700">
          Order Date:{" "}
          <span className="font-medium">
            {new Date(createdAt).toLocaleString()}
          </span>
        </p>
        <p className="text-gray-700">
          Last Updated:{" "}
          <span className="font-medium">
            {new Date(updatedAt).toLocaleString()}
          </span>
        </p>
        <p className="text-gray-700">
          Current Status: <span className="font-medium">{status}</span>
        </p>
        <p className="text-gray-700">
          Tracking Number:{" "}
          <span className="font-medium">
            {trackingNumber ? trackingNumber : "Processing"}
          </span>
        </p>
        {deliveryDate && (
          <p className="text-gray-700">
            Estimated Delivery:{" "}
            <span className="font-medium">
              {new Date(deliveryDate).toLocaleString()}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;
