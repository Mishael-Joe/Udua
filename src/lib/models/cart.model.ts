import mongoose, { Schema, type Document } from "mongoose";
/*
 *  All monetary values are stored in kobo so as to avoid Floating-Point Errors in JavaScript.
 */

/**
 * Deal information stored with cart items
 * Captures metadata about the deal that was applied at the time of adding to cart
 */
interface DealInfo {
  dealId: mongoose.Schema.Types.ObjectId;
  dealType:
    | "percentage"
    | "fixed"
    | "free_shipping"
    | "flash_sale"
    | "buy_x_get_y";
  value: number;
  name: string;
  endDate: Date;
}

/**
 * Cart item schema
 * Represents a single product in the user's cart
 */
interface CartItem {
  product: mongoose.Schema.Types.ObjectId;
  storeID: mongoose.Schema.Types.ObjectId;
  quantity: number;
  productType: "physicalproducts" | "digitalproducts";
  selectedSize?: {
    size: string;
    price: number;
    quantity: number;
  };
  // New fields for deal-aware pricing
  priceAtAdd: number; // The effective price when the item was added (after any deal discounts)
  originalPrice: number; // The original price before any discounts
  dealInfo?: DealInfo; // Optional metadata about the applied deal
}

/**
 * Cart document interface
 * Represents a user's shopping cart
 */
interface Cart extends Document {
  user: mongoose.Schema.Types.ObjectId;
  items: CartItem[];
  updatedAt: Date;
}

// Schema for deal information
const dealInfoSchema = new Schema<DealInfo>({
  dealId: { type: Schema.Types.ObjectId, ref: "Deal", required: true },
  dealType: {
    type: String,
    enum: ["percentage", "fixed", "free_shipping", "flash_sale", "buy_x_get_y"],
    required: true,
  },
  value: { type: Number, required: true },
  name: { type: String, required: true },
  endDate: { type: Date, required: true },
});

// Schema for cart items
const cartItemSchema = new Schema<CartItem>({
  product: {
    type: Schema.Types.ObjectId,
    refPath: "items.productType",
    required: true,
  },
  storeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  quantity: { type: Number, required: true },
  productType: {
    type: String,
    enum: ["physicalproducts", "digitalproducts"],
    required: true,
  },
  selectedSize: {
    size: { type: String },
    price: { type: Number },
    quantity: { type: Number },
  },
  // New fields for deal-aware pricing
  priceAtAdd: {
    type: Number,
    required: true,
    comment:
      "The effective price when the item was added (after any deal discounts)",
  },
  originalPrice: {
    type: Number,
    required: true,
    comment: "The original price before any discounts",
  },
  dealInfo: {
    type: dealInfoSchema,
    required: false,
    comment: "Optional metadata about the applied deal",
  },
});

// Schema for the cart
const cartSchema = new Schema<Cart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema],
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model<Cart>("Cart", cartSchema);

export default Cart;

// import mongoose, { Schema, Document } from "mongoose";
// /*
//  *  All monetary values are stored in kobo so as to avoid Floating-Point Errors in JavaScript.
//  */
// interface CartItem {
//   product: mongoose.Schema.Types.ObjectId;
//   storeID: mongoose.Schema.Types.ObjectId; // New field to track store ID
//   quantity: number;
//   productType: "physicalproducts" | "digitalproducts";
//   selectedSize?: {
//     size: string;
//     price: number;
//     quantity: number;
//   };
// }

// interface Cart extends Document {
//   user: mongoose.Schema.Types.ObjectId;
//   items: CartItem[];
//   updatedAt: Date;
// }

// const cartItemSchema = new Schema<CartItem>({
//   product: {
//     type: Schema.Types.ObjectId,
//     refPath: "items.productType",
//     required: true,
//   },
//   storeID: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Store",
//     required: true, // Ensures we know which store this product belongs to
//   },
//   quantity: { type: Number, required: true },
//   productType: {
//     type: String,
//     enum: ["physicalproducts", "digitalproducts"],
//     required: true, // Helps to know whether to look in Product or EBook model
//   },
//   selectedSize: {
//     size: { type: String }, // E.g., "S", "M", "L"
//     price: { type: Number }, // Store the price for the selected size
//     quantity: { type: Number }, // Optional field to track stock for selected size
//   }, // Optional field for size-based products
// });

// const cartSchema = new Schema<Cart>(
//   {
//     user: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     items: [cartItemSchema],
//     updatedAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true } // Adds createdAt and updatedAt automatically
// );

// const Cart = mongoose.models.Cart || mongoose.model<Cart>("Cart", cartSchema);

// export default Cart;
