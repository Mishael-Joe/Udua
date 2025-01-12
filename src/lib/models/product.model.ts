import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  storeID: string;
  productType: "Physical Product" | "Digital Product";
  name: string;
  price: number;
  sizes?: string[];
  productQuantity: number;
  images: string[];
  description: string;
  specifications: string[];
  category: string[];
  subCategory: string[];
  isVerifiedProduct: boolean;
  isVisible: boolean;
} // NOTE: storeID serves as the store the product belongs to.

const productSchema = new Schema<IProduct>({
  storeID: { type: String, required: true }, // The store a product belongs to
  productType: {
    type: String,
    enum: ["Physical Product", "Digital Product"],
    default: "Physical Product",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  sizes: { type: [String] },
  productQuantity: { type: Number, required: true, default: 0 },
  images: { type: [String], default: [] },
  description: { type: String, required: true },
  specifications: { type: [String], required: true },
  category: { type: [String], required: true },
  subCategory: { type: [String], required: true },
  isVerifiedProduct: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
});

const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
