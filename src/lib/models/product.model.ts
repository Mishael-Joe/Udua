import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  storeID: string;
  productName: string;
  productPrice: number;
  productSizes?: string[];
  productQuantity: number;
  productImage: string[];
  productDescription: string;
  productSpecification: string[];
  productCategory: string[];
  productSubCategory: string[];
  isVerifiedProduct: boolean;
  isVisible: boolean;
} // NOTE: storeID serves as the store the product belongs to.

const productSchema = new Schema<IProduct>({
  storeID: { type: String, required: true }, // The store a product belongs to
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productSizes: { type: [String] },
  productQuantity: { type: Number, required: true, default: 0 },
  productImage: { type: [String], default: [] },
  productDescription: { type: String, required: true },
  productSpecification: { type: [String], required: true },
  productCategory: { type: [String], required: true },
  productSubCategory: { type: [String], required: true },
  isVerifiedProduct: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
});

const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
