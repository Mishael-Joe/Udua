import mongoose, { Schema, Document } from "mongoose";
/*
 *  All monetary values are stored in kobo so as to avoid Floating-Point Errors in JavaScript.
 */
interface IProduct extends Document {
  storeID: string;
  productType: "physicalproducts" | "digitalproducts";
  name: string;
  price?: number; // Optional if the product has sizes
  sizes?: {
    size: string; // E.g., "S", "M", "L"
    price: number; // Size-specific price
    quantity: number; // Stock for that size
  }[];
  productQuantity: number;
  images: string[];
  description: string;
  specifications: string[];
  category: string[];
  subCategory: string[];
  isVerifiedProduct: boolean;
  isVisible: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    storeID: { type: String, required: true },
    productType: {
      type: String,
      enum: ["physicalproducts", "digitalproducts"],
      default: "physicalproducts",
      required: true,
    },
    name: { type: String, required: true, index: true },
    price: {
      type: Number,
      required: function () {
        return !this.sizes || this.sizes.length === 0;
      },
    }, // Required if sizes are not provided
    sizes: [
      {
        size: { type: String }, // E.g., "S", "M", "L"
        price: { type: Number }, // Size-specific price
        quantity: { type: Number }, // Stock for that size
      },
    ],
    productQuantity: { type: Number },
    images: { type: [String], default: [] },
    description: { type: String, required: true, index: true },
    specifications: { type: [String], required: true },
    category: { type: [String], required: true, index: true },
    subCategory: { type: [String], required: true, index: true },
    isVerifiedProduct: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// Text index for searchability
productSchema.index(
  {
    name: "text",
    description: "text",
    category: "text",
    subCategory: "text",
  },
  {
    weights: {
      name: 10, // Higher weight for 'name' to prioritize it in searches
      description: 5, // Medium weight for 'description'
      category: 3, // Lower weight for 'category'
      subCategory: 1, // Lowest weight for 'subCategory'
    },
    name: "TextIndex", // Optionally, you can give the index a custom name
  }
);

const Product =
  mongoose.models.physicalproducts ||
  mongoose.model<IProduct>("physicalproducts", productSchema);

export default Product;
