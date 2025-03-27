import mongoose, { Schema, Document } from "mongoose";
/*
 *  All monetary values are stored in kobo so as to avoid Floating-Point Errors in JavaScript.
 */
interface IProductReview extends Document {
  product: mongoose.Schema.Types.ObjectId;
  productType: "physicalproducts" | "digitalproducts";
  buyer: mongoose.Schema.Types.ObjectId;
  rating: number;
  reviewText: string;
  createdAt: Date;
  order: mongoose.Schema.Types.ObjectId;
}

const ProductReviewSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "productType", // Dynamic reference based on productType
    },
    productType: {
      type: String,
      required: true,
      enum: ["physicalproducts", "digitalproducts"], // Can be either of these models
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// Ensure a user can only review a product once
ProductReviewSchema.index({ product: 1, buyer: 1 }, { unique: true });

const ProductReview =
  mongoose.models.ProductReview ||
  mongoose.model<IProductReview>("ProductReview", ProductReviewSchema);

export default ProductReview;
