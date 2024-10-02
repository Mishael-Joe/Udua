import mongoose, { Schema, Document } from "mongoose";

interface IStoreReview extends Document {
  store: mongoose.Schema.Types.ObjectId;
  buyer: mongoose.Schema.Types.ObjectId;
  rating: number;
  reviewText: string;
  createdAt: Date;
  order: mongoose.Schema.Types.ObjectId;
}

const StoreReviewSchema = new Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
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

StoreReviewSchema.index({ store: 1, buyer: 1 }, { unique: true });

const StoreReview = 
  mongoose.models.StoreReview || mongoose.model<IStoreReview>("StoreReview", StoreReviewSchema);

export default StoreReview;
