import mongoose, { Schema, Document } from "mongoose";

interface IOrderProduct {
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  sellers: mongoose.Schema.Types.ObjectId[];
  products: IOrderProduct[];
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderProductSchema = new Schema<IOrderProduct>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    products: [OrderProductSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;

// Differences between OrderProductSchema and OrderSchema
// Purpose:

// OrderProductSchema: Defines the structure of a single product within an order.
// OrderSchema: Defines the structure of an entire order, which includes multiple products.

// Components:

// OrderProductSchema: Contains fields specific to an individual product (product ID, quantity, price).
// OrderSchema: Contains fields specific to an order (user ID, seller ID, total amount, status) and an array of products that follows OrderProductSchema.

// Usage:

// OrderProductSchema: Used as a sub-schema within OrderSchema to represent the products array.
// OrderSchema: Used to create the Order model, which represents orders in the database.
