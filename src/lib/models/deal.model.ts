import mongoose, { Schema, Document, Model } from "mongoose";
/*
 *  All monetary values are stored in kobo so as to avoid Floating-Point Errors in JavaScript.
 */

// Define the interface for the static methods
interface IDealModel extends Model<IDeal> {
  checkOverlappingFlashSales(
    storeID: string,
    productIds: string[],
    startDate: Date,
    endDate: Date,
    dealId?: string
  ): Promise<IDeal[]>;
}

export interface IDeal extends Document {
  storeID: string;
  name: string; // Added name field for better identification
  description?: string; // Added description field
  dealType:
    | "percentage"
    | "fixed"
    | "free_shipping"
    | "flash_sale"
    | "buy_x_get_y";
  value: number; // e.g., 20 (for 20% off or $20 off)
  productIds: string[]; // Specific products for the deal
  categoryIds?: string[]; // Added category-based deals
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  minCartValue?: number; // Minimum cart total to activate the deal
  maxDiscountValue?: number; // Maximum discount amount (for percentage deals)
  usageLimit?: number; // Max number of uses (optional)
  usageCount: number; // Current usage count
  autoApply: boolean; // Does it apply automatically?
  applyToSizes?: string[]; // e.g., ["L", "XL"]
  code?: string; // Optional code for manual application

  // Buy X Get Y specific fields
  buyQuantity?: number; // Buy X quantity
  getQuantity?: number; // Get Y quantity
  getProductIds?: string[]; // Products eligible for the "get" part

  // Flash sale–specific field
  flashSaleQuantity?: number;
  flashSaleRemaining?: number; // Track remaining inventory

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

const dealSchema = new Schema<IDeal, IDealModel>(
  {
    storeID: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    dealType: {
      type: String,
      enum: [
        "percentage",
        "fixed",
        "free_shipping",
        "flash_sale",
        "buy_x_get_y",
      ],
      required: true,
    },
    value: { type: Number, required: true },
    productIds: { type: [String], default: [] },
    categoryIds: { type: [String], default: [] },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    minCartValue: { type: Number },
    maxDiscountValue: { type: Number },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
    autoApply: { type: Boolean, default: false },
    applyToSizes: { type: [String] },
    // Fix the duplicate index issue by removing index from field definition
    code: { type: String, sparse: true, trim: true, uppercase: true },

    // Buy X Get Y specific fields
    buyQuantity: { type: Number },
    getQuantity: { type: Number },
    getProductIds: { type: [String] },

    // Flash sale specific fields
    flashSaleQuantity: { type: Number },
    flashSaleRemaining: { type: Number },

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

// Add index for faster lookups
dealSchema.index({ storeID: 1, isActive: 1 });
// Define the code index with unique and sparse options
dealSchema.index({ code: 1 }, { unique: true, sparse: true });
dealSchema.index({ startDate: 1, endDate: 1 });

// Add validation for code format if provided
dealSchema.path("code").validate(function (value) {
  if (!value) return true; // Skip validation if no code
  return /^[A-Z0-9_-]{3,20}$/.test(value); // Alphanumeric, 3-20 chars
}, "Deal code must be 3-20 alphanumeric characters");

// Pre-save hook to ensure flashSaleRemaining is set properly
dealSchema.pre("save", function (next) {
  if (this.isNew && this.dealType === "flash_sale" && this.flashSaleQuantity) {
    this.flashSaleRemaining = this.flashSaleQuantity;
  }
  next();
});

// Static method to check for overlapping flash sales
dealSchema.statics.checkOverlappingFlashSales = async function (
  storeID: string,
  productIds: string[],
  startDate: Date,
  endDate: Date,
  dealId?: string
) {
  const query: any = {
    storeID,
    dealType: "flash_sale",
    isActive: true,
    productIds: { $in: productIds },
    $or: [
      // New deal starts during an existing deal
      { startDate: { $lte: startDate }, endDate: { $gte: startDate } },
      // New deal ends during an existing deal
      { startDate: { $lte: endDate }, endDate: { $gte: endDate } },
      // New deal completely contains an existing deal
      { startDate: { $gte: startDate }, endDate: { $lte: endDate } },
    ],
  };

  // Exclude the current deal when updating
  if (dealId) {
    query._id = { $ne: dealId };
  }

  const overlappingDeals = await this.find(query);
  return overlappingDeals;
};

const Deal =
  mongoose.models.Deal || mongoose.model<IDeal, IDealModel>("Deal", dealSchema);
export default Deal;
