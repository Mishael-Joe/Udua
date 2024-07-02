import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  accountId: string;
  productName: string;
  productPrice: number;
  productSizes: string[];
  productQuantity: number;
  productImage: string[];
  productDescription: string;
  productSpecification: string;
  productCategory: string[];
  productSubCategory: string[],
  isVerifiedProduct: boolean;
} // NOTE: accountId serves as the owner of the product i.e ownerID

const productSchema = new Schema<IProduct>({
  accountId: { type: String, required: true },
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productSizes: { type: [String], required: true },
  productQuantity: { type: Number, required: true, default: 0 },
  productImage: { type: [String], default: [] },
  productDescription: { type: String, required: true },
  productSpecification: { type: String, required: true },
  productCategory: { type: [String], required: true },
  productSubCategory: { type: [String], required: true },
  isVerifiedProduct: { type: Boolean, default: false },
});

const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
