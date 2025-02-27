import mongoose, { Schema, Document } from "mongoose";

interface CartItem {
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
  productType: "physicalproducts" | "digitalproducts";
  selectedSize?: {
    size: string;
    price: number;
    quantity: number;
  };
}

interface Cart extends Document {
  user: mongoose.Schema.Types.ObjectId;
  items: CartItem[];
  updatedAt: Date;
}

const cartItemSchema = new Schema<CartItem>({
  product: {
    type: Schema.Types.ObjectId,
    refPath: "items.productType",
    required: true,
  },
  quantity: { type: Number, required: true },
  productType: {
    type: String,
    enum: ["physicalproducts", "digitalproducts"],
    required: true, // Helps to know whether to look in Product or EBook model
  },
  selectedSize: {
    size: { type: String }, // E.g., "S", "M", "L"
    price: { type: Number }, // Store the price for the selected size
    quantity: { type: Number }, // Optional field to track stock for selected size
  }, // Optional field for size-based products
});

const cartSchema = new Schema<Cart>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now },
});

const Cart = mongoose.models.Cart || mongoose.model<Cart>("Cart", cartSchema);

export default Cart;
