import mongoose, { Schema, type Document } from "mongoose";
/*
 *  All monetary values are stored in kobo so as to avoid Floating-Point Errors in JavaScript.
 */

/**
 * Interface for deal information
 * Captures metadata about deals applied to products
 */
interface IDealInfo {
  dealId: mongoose.Schema.Types.ObjectId;
  dealType:
    | "percentage"
    | "fixed"
    | "free_shipping"
    | "flash_sale"
    | "buy_x_get_y";
  value: number;
  name: string;
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
  priceAtOrder: number; // Price of the product at time of order (after any discounts)
  originalPrice?: number; // Original price before any discounts
  selectedSize?: {
    size: string;
    price: number;
  };
  dealInfo?: IDealInfo; // Optional deal information
}

/**
 * Interface representing a sub-order within an order.
 * A sub-order is linked to a specific store and contains its own products and tracking details.
 */
interface ISubOrder {
  store: mongoose.Schema.Types.ObjectId;
  products: IOrderProduct[];
  totalAmount: number;
  originalSubtotal?: number; // Original subtotal before any discounts
  savings?: number; // Total savings from deals
  appliedDeals?: IDealInfo[]; // Deals applied to this sub-order
  shippingMethod?: {
    name: string;
    price: number;
    estimatedDeliveryDays?: string; // i.e "April 1st 2025 - April 3rd 2025"
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
 * Interface representing the main order document.
 * Contains user details, overall stores involved, sub-orders, and payment/shipping information.
 */
interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId; // ID reference to the user placing the order
  stores: mongoose.Schema.Types.ObjectId[]; // List of store IDs involved in the order
  subOrders: ISubOrder[]; // Array of sub-orders, each tied to a specific store
  totalAmount: number; // Total amount for the entire order (sum of sub-orders)
  totalSavings?: number; // Total savings from all deals
  status: string; // General status of the order
  createdAt: Date; // Timestamp for order creation
  updatedAt: Date; // Timestamp for the last update of the order
  postalCode: string; // Postal code for the shipping address
  shippingAddress?: string; // Shipping address for the order
  paymentMethod?: string; // Method used for payment (e.g., card, PayPal)
  paymentStatus?: string; // Payment status (e.g., paid, pending)
  paymentReference?: string; // Reference for the payment
  notes?: string; // Optional notes attached to the order
  discount?: number; // Discount applied to the order, if any
  taxAmount?: number; // Tax amount calculated for the order
}

/**
 * Schema for deal information
 */
const DealInfoSchema = new Schema({
  dealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deal",
  },
  dealType: {
    type: String,
    enum: ["percentage", "fixed", "free_shipping", "flash_sale", "buy_x_get_y"],
  },
  value: {
    type: Number,
  },
  name: {
    type: String,
  },
});

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
  priceAtOrder: { type: Number, required: true }, // Price of the product (after any discounts)
  originalPrice: { type: Number }, // Original price before any discounts
  selectedSize: {
    size: String,
    price: Number,
  },
  dealInfo: DealInfoSchema, // Optional deal information
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
  originalSubtotal: { type: Number }, // Original subtotal before any discounts
  savings: { type: Number, default: 0 }, // Total savings from deals
  appliedDeals: [DealInfoSchema], // Deals applied to this sub-order
  shippingMethod: {
    name: { type: String },
    price: { type: Number },
    estimatedDeliveryDays: { type: String }, // i.e "April 1st 2025 - April 3rd 2025"
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
    totalSavings: { type: Number, default: 0 }, // Total savings from all deals
    status: { type: String, required: true }, // Overall status of the order
    postalCode: { type: String, required: true }, // Postal code for shipping
    shippingAddress: { type: String }, // Optional shipping address for the order
    paymentMethod: { type: String }, // Optional payment method used
    paymentStatus: { type: String }, // Optional payment status (e.g., paid, pending)
    paymentReference: { type: String }, // Reference for the payment
    notes: { type: String }, // Optional notes for the order
    discount: { type: Number }, // Optional discount applied to the order
    taxAmount: { type: Number }, // Optional tax amount calculated for the order
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Add indexes for faster queries
OrderSchema.index({ user: 1 });
OrderSchema.index({ "subOrders.store": 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: 1 });

/**
 * Order model that provides interaction with the 'orders' collection in MongoDB.
 * If the model already exists, it is used, otherwise, a new one is created.
 */
const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;

// import mongoose, { Schema, Document } from "mongoose";
// /*
//  *  All monetary values are stored in kobo so as to avoid Floating-Point Errors in JavaScript.
//  */

// /**
//  * Interface representing a sub-order within an order.
//  * A sub-order is linked to a specific store and contains its own products and tracking details.
//  */
// interface ISubOrder {
//   store: mongoose.Schema.Types.ObjectId;
//   products: IOrderProduct[];
//   totalAmount: number;
//   shippingMethod?: {
//     name: string;
//     price: number;
//     estimatedDeliveryDays?: string; // i.e "April 1st 2025 - April 3rd 2025"
//     description?: string;
//   };
//   trackingNumber?: string;
//   deliveryDate?: Date;
//   deliveryStatus:
//     | "Order Placed"
//     | "Processing"
//     | "Shipped"
//     | "Out for Delivery"
//     | "Delivered"
//     | "Canceled"
//     | "Returned"
//     | "Failed Delivery"
//     | "Refunded";
//   payoutStatus: "Requested" | "Processing" | "Paid" | "Failed" | "";
// }

// /**
//  * Interface representing a product in an order.
//  * Can contain either a physical product or a digital product linked to a store.
//  */
// interface IOrderProduct {
//   physicalProducts: mongoose.Schema.Types.ObjectId; // ID reference to the physical product
//   digitalProducts: mongoose.Schema.Types.ObjectId; // ID reference to the digital product
//   store: mongoose.Schema.Types.ObjectId; // Store associated with the product
//   quantity: number; // Quantity of the product ordered
//   price: number; // Price of the product
// }

// /**
//  * Interface representing the main order document.
//  * Contains user details, overall stores involved, sub-orders, and payment/shipping information.
//  */
// interface IOrder extends Document {
//   user: mongoose.Schema.Types.ObjectId; // ID reference to the user placing the order
//   stores: mongoose.Schema.Types.ObjectId[]; // List of store IDs involved in the order
//   subOrders: ISubOrder[]; // Array of sub-orders, each tied to a specific store
//   totalAmount: number; // Total amount for the entire order (sum of sub-orders)
//   status: string; // General status of the order
//   createdAt: Date; // Timestamp for order creation
//   updatedAt: Date; // Timestamp for the last update of the order
//   postalCode: string; // Postal code for the shipping address
//   shippingAddress?: string; // Shipping address for the order
//   paymentMethod?: string; // Method used for payment (e.g., card, PayPal)
//   paymentStatus?: string; // Payment status (e.g., paid, pending)
//   notes?: string; // Optional notes attached to the order
//   discount?: number; // Discount applied to the order, if any
//   taxAmount?: number; // Tax amount calculated for the order
// }

// /**
//  * Schema for an individual product within an order.
//  * Products can be physical or digital and are linked to their respective stores.
//  */
// const OrderProductSchema = new Schema<IOrderProduct>({
//   physicalProducts: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "physicalproducts", // Reference to the PhysicalProduct model
//   },
//   digitalProducts: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "digitalproducts", // Reference to the DigitalProduct model
//   },
//   store: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Store", // Reference to the Store model
//   },
//   quantity: { type: Number, required: true }, // Quantity of this product
//   price: { type: Number, required: true }, // Price of the product
// });

// /**
//  * Schema representing a sub-order.
//  * Each sub-order is linked to a store and contains products, total amount, shipping, and delivery information.
//  */
// const SubOrderSchema = new Schema<ISubOrder>({
//   store: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Store", // Reference to the Store model
//     required: true, // Each sub-order must be linked to a store
//   },
//   products: [OrderProductSchema], // Array of products for this sub-order
//   totalAmount: { type: Number, required: true }, // Total amount for the sub-order
//   shippingMethod: {
//     // Changed from String to Object
//     name: { type: String },
//     price: { type: Number },
//     estimatedDeliveryDays: { type: Number }, // i.e "April 1st 2025 - April 3rd 2025"
//     description: { type: String },
//   }, // Optional shipping method for the sub-order
//   trackingNumber: { type: String }, // Optional tracking number for the sub-order
//   deliveryDate: { type: Date }, // Optional delivery date for the sub-order
//   deliveryStatus: {
//     type: String,
//     enum: [
//       "Order Placed",
//       "Processing",
//       "Shipped",
//       "Out for Delivery",
//       "Delivered",
//       "Canceled",
//       "Returned",
//       "Failed Delivery",
//       "Refunded",
//     ], // Enum of possible delivery statuses
//     default: "Order Placed", // Default status when the sub-order is created
//   },
//   payoutStatus: {
//     type: String,
//     enum: ["Requested", "Processing", "Paid", "Failed", ""],
//     default: "",
//   },
// });

// /**
//  * Schema representing the main order.
//  * The main order can involve multiple stores and contains an array of sub-orders.
//  * It tracks overall order details such as total amount, status, payment, and shipping.
//  */
// const OrderSchema = new Schema<IOrder>(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // Reference to the User model
//       required: true, // User is required for each order
//     },
//     stores: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Store", // Reference to stores involved in the order
//         required: true, // Stores are required for the order
//       },
//     ],
//     subOrders: [SubOrderSchema], // Array of sub-orders, each related to a specific store
//     totalAmount: { type: Number, required: true }, // Total amount for the entire order
//     status: { type: String, required: true }, // Overall status of the order
//     postalCode: { type: String, required: true }, // Postal code for shipping
//     shippingAddress: { type: String }, // Optional shipping address for the order
//     paymentMethod: { type: String }, // Optional payment method used
//     paymentStatus: { type: String }, // Optional payment status (e.g., paid, pending)
//     notes: { type: String }, // Optional notes for the order
//     discount: { type: Number }, // Optional discount applied to the order
//     taxAmount: { type: Number }, // Optional tax amount calculated for the order
//   },
//   { timestamps: true } // Automatically add createdAt and updatedAt fields
// );

// /**
//  * Order model that provides interaction with the 'orders' collection in MongoDB.
//  * If the model already exists, it is used, otherwise, a new one is created.
//  */
// const Order =
//   mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

// export default Order;
