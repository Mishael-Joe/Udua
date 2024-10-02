import mongoose, { Schema, Document } from "mongoose";

interface IProductReview extends Document {
  product: mongoose.Schema.Types.ObjectId;
  buyer: mongoose.Schema.Types.ObjectId;
  rating: number;
  reviewText: string;
  createdAt: Date;
  order: mongoose.Schema.Types.ObjectId;
}

const ProductReviewSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  reviewText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  }
});

ProductReviewSchema.index({ product: 1, buyer: 1 }, { unique: true });

const ProductReview = 
  mongoose.models.ProductReview || mongoose.model<IProductReview>("ProductReview", ProductReviewSchema);

export default ProductReview;
