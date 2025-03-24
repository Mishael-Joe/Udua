import mongoose, { Schema, Document } from "mongoose";

/**
 * Interface representing a sub-order within an order.
 * A sub-order is linked to a specific store and contains its own products and tracking details.
 */
interface ISubOrder {
  store: mongoose.Schema.Types.ObjectId;
  products: IOrderProduct[];
  totalAmount: number;
  shippingMethod?: {
    name: string;
    price: number;
    estimatedDeliveryDays?: number;
    description?: string;
  };
  trackingNumber?: string;
  deliveryDate?: Date;
  deliveryStatus:
    | "Order Placed"
    | "Processing"
    | "Shipped"
    | "Out for Delivery"
    | "Delivered"
    | "Canceled"
    | "Returned"
    | "Failed Delivery"
    | "Refunded";
  payoutStatus: "Requested" | "Processing" | "Paid" | "Failed" | "";
}

/**
 * Interface representing a product in an order.
 * Can contain either a physical product or a digital product linked to a store.
 */
interface IOrderProduct {
  physicalProducts: mongoose.Schema.Types.ObjectId; // ID reference to the physical product
  digitalProducts: mongoose.Schema.Types.ObjectId; // ID reference to the digital product
  store: mongoose.Schema.Types.ObjectId; // Store associated with the product
  quantity: number; // Quantity of the product ordered
  price: number; // Price of the product
}

/**
 * Interface representing the main order document.
 * Contains user details, overall stores involved, sub-orders, and payment/shipping information.
 */
interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId; // ID reference to the user placing the order
  stores: mongoose.Schema.Types.ObjectId[]; // List of store IDs involved in the order
  subOrders: ISubOrder[]; // Array of sub-orders, each tied to a specific store
  totalAmount: number; // Total amount for the entire order (sum of sub-orders)
  status: string; // General status of the order
  createdAt: Date; // Timestamp for order creation
  updatedAt: Date; // Timestamp for the last update of the order
  postalCode: string; // Postal code for the shipping address
  shippingAddress?: string; // Shipping address for the order
  paymentMethod?: string; // Method used for payment (e.g., card, PayPal)
  paymentStatus?: string; // Payment status (e.g., paid, pending)
  notes?: string; // Optional notes attached to the order
  discount?: number; // Discount applied to the order, if any
  taxAmount?: number; // Tax amount calculated for the order
}

/**
 * Schema for an individual product within an order.
 * Products can be physical or digital and are linked to their respective stores.
 */
const OrderProductSchema = new Schema<IOrderProduct>({
  physicalProducts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "physicalproducts", // Reference to the PhysicalProduct model
  },
  digitalProducts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "digitalproducts", // Reference to the DigitalProduct model
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store", // Reference to the Store model
  },
  quantity: { type: Number, required: true }, // Quantity of this product
  price: { type: Number, required: true }, // Price of the product
});

/**
 * Schema representing a sub-order.
 * Each sub-order is linked to a store and contains products, total amount, shipping, and delivery information.
 */
const SubOrderSchema = new Schema<ISubOrder>({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store", // Reference to the Store model
    required: true, // Each sub-order must be linked to a store
  },
  products: [OrderProductSchema], // Array of products for this sub-order
  totalAmount: { type: Number, required: true }, // Total amount for the sub-order
  shippingMethod: {
    // Changed from String to Object
    name: { type: String },
    price: { type: Number },
    estimatedDeliveryDays: { type: Number },
    description: { type: String },
  }, // Optional shipping method for the sub-order
  trackingNumber: { type: String }, // Optional tracking number for the sub-order
  deliveryDate: { type: Date }, // Optional delivery date for the sub-order
  deliveryStatus: {
    type: String,
    enum: [
      "Order Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Canceled",
      "Returned",
      "Failed Delivery",
      "Refunded",
    ], // Enum of possible delivery statuses
    default: "Order Placed", // Default status when the sub-order is created
  },
  payoutStatus: {
    type: String,
    enum: ["Requested", "Processing", "Paid", "Failed", ""],
    default: "",
  },
});

/**
 * Schema representing the main order.
 * The main order can involve multiple stores and contains an array of sub-orders.
 * It tracks overall order details such as total amount, status, payment, and shipping.
 */
const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true, // User is required for each order
    },
    stores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store", // Reference to stores involved in the order
        required: true, // Stores are required for the order
      },
    ],
    subOrders: [SubOrderSchema], // Array of sub-orders, each related to a specific store
    totalAmount: { type: Number, required: true }, // Total amount for the entire order
    status: { type: String, required: true }, // Overall status of the order
    postalCode: { type: String, required: true }, // Postal code for shipping
    shippingAddress: { type: String }, // Optional shipping address for the order
    paymentMethod: { type: String }, // Optional payment method used
    paymentStatus: { type: String }, // Optional payment status (e.g., paid, pending)
    notes: { type: String }, // Optional notes for the order
    discount: { type: Number }, // Optional discount applied to the order
    taxAmount: { type: Number }, // Optional tax amount calculated for the order
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

/**
 * Order model that provides interaction with the 'orders' collection in MongoDB.
 * If the model already exists, it is used, otherwise, a new one is created.
 */
const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;

// import mongoose, { Schema, Document } from "mongoose";

// interface IOrderProduct {
//   physicalProducts: mongoose.Schema.Types.ObjectId;
//   digitalProducts: mongoose.Schema.Types.ObjectId;
//   store: mongoose.Schema.Types.ObjectId;
//   quantity: number;
//   price: number;
// }

// interface IOrder extends Document {
//   user: mongoose.Schema.Types.ObjectId;
//   stores: mongoose.Schema.Types.ObjectId[];
//   products: IOrderProduct[];
//   totalAmount: number;
//   status: string;
//   createdAt: Date;
//   updatedAt: Date;
//   postalCode: string;
//   shippingAddress?: string;
//   shippingMethod?: string;
//   trackingNumber?: string;
//   deliveryDate?: Date;
//   paymentMethod?: string;
//   paymentStatus?: string;
//   deliveryStatus?:
//     | "Order Placed"
//     | "Processing"
//     | "Shipped"
//     | "Out for Delivery"
//     | "Delivered"
//     | "Canceled"
//     | "Returned"
//     | "Failed Delivery"
//     | "Refunded";
//   notes?: string;
//   discount?: number;
//   taxAmount?: number;
// }

// // TODO: Add delivery status

// const OrderProductSchema = new Schema<IOrderProduct>({
//   physicalProducts: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "physicalproducts",
//   },
//   // Array of Products for stores that deals with physical products
//   digitalProducts: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "digitalproducts",
//   },

//   store: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Store",
//   },
//   quantity: { type: Number, required: true },
//   price: { type: Number, required: true },
// });

// const OrderSchema = new Schema<IOrder>(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     stores: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Store",
//         required: true,
//       },
//     ],
//     products: [OrderProductSchema],
//     totalAmount: { type: Number, required: true },
//     status: { type: String, required: true },
//     postalCode: { type: String, required: true },
//     shippingAddress: { type: String },
//     shippingMethod: { type: String },
//     trackingNumber: { type: String },
//     deliveryDate: { type: Date },
//     paymentMethod: { type: String },
//     paymentStatus: { type: String },
//     deliveryStatus: {
//       type: String,
//       enum: [
//         "Order Placed",
//         "Processing",
//         "Shipped",
//         "Out for Delivery",
//         "Delivered",
//         "Canceled",
//         "Returned",
//         "Failed Delivery",
//         "Refunded",
//       ],
//       default: "Order Placed",
//     },
//     // notes: { type: String },
//     // discount: { type: Number },
//     // taxAmount: { type: Number },
//   },
//   { timestamps: true }
// );

// const Order =
//   mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

// export default Order;

// Differences between OrderProductSchema and OrderSchema
// Purpose:

// OrderProductSchema: Defines the structure of a single product within an order.
// OrderSchema: Defines the structure of an entire order, which includes multiple products.

// Components:

// OrderProductSchema: Contains fields specific to an individual product (product ID, quantity, price).
// OrderSchema: Contains fields specific to an order (user ID, store ID, total amount, status) and an array of products that follows OrderProductSchema.

// Usage:

// OrderProductSchema: Used as a sub-schema within OrderSchema to represent the products array.
// OrderSchema: Used to create the Order model, which represents orders in the database.
