// models/Deal.ts
import mongoose, { Schema, Document } from "mongoose";

interface IDeal extends Document {
  storeID: string;
  dealType: "percentage" | "fixed" | "free_shipping" | "flash_sale";
  value: number; // e.g., 20 (for 20% off or $20 off)
  productIds?: string[]; // Specific products for the deal
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  minCartValue?: number; // Minimum cart total to activate the deal
  usageLimit?: number; // Max number of uses (optional)
  autoApply: boolean; // Does it apply automatically?
  applyToSizes?: string[]; // e.g., ["L", "XL"]

  // Optional: Flash sale–specific field (if you need to track flash sale inventory separately)
  flashSaleQuantity?: number;

  // Analytics for tracking performance
  analytics: {
    viewCount: number;
    clickCount: number;
    redemptionCount: number;
    totalDiscountAmount: number;
    revenueGenerated: number;
    uniqueUsersUsed: string[];
    averageOrderValue: number;
    firstRedemptionDate?: Date;
    lastRedemptionDate?: Date;
  };
}

const dealSchema = new Schema<IDeal>(
  {
    storeID: { type: String, required: true },
    dealType: {
      type: String,
      enum: ["percentage", "fixed", "free_shipping", "flash_sale"],
      required: true,
    },
    value: { type: Number, required: true },
    productIds: { type: [String], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    minCartValue: { type: Number },
    usageLimit: { type: Number },
    autoApply: { type: Boolean, default: false },
    applyToSizes: { type: [String] },
    flashSaleQuantity: { type: Number }, // Optional field for flash sale stock

    analytics: {
      viewCount: { type: Number, default: 0 },
      clickCount: { type: Number, default: 0 },
      redemptionCount: { type: Number, default: 0 },
      totalDiscountAmount: { type: Number, default: 0 },
      revenueGenerated: { type: Number, default: 0 },
      uniqueUsersUsed: { type: [String], default: [] },
      averageOrderValue: { type: Number, default: 0 },
      firstRedemptionDate: { type: Date },
      lastRedemptionDate: { type: Date },
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

const Deal = mongoose.models.Deal || mongoose.model<IDeal>("Deal", dealSchema);
export default Deal;
