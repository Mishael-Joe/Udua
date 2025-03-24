import { Schema, model } from "mongoose";

// Udua Business Tracking Model
const UduaStatsSchema = new Schema(
  {
    totalRevenue: { type: Number, default: 0 }, // Tracks total revenue since inception
    totalPayouts: { type: Number, default: 0 }, // Total payouts to sellers
    totalOrders: { type: Number, default: 0 }, // Total number of orders (both successful and failed)
    averageOrderValue: { type: Number, default: 0 }, // Average revenue per order
    averagePlatformFeePercentage: { type: Number, default: 0 }, // Avg fee percentage
    totalRefunds: { type: Number, default: 0 }, // Total refunds issued
    returnRate: { type: Number, default: 0 }, // Percentage of sales that resulted in returns
    totalVisitors: { type: Number, default: 0 }, // Total unique visitors
    conversionRate: { type: Number, default: 0 }, // Visitors to customers conversion rate

    monthlyRevenue: [
      {
        month: { type: String, required: true }, // 'YYYY-MM'
        revenue: { type: Number, default: 0 },
      },
    ],

    monthlySales: [
      {
        month: { type: String, required: true }, // 'YYYY-MM'
        sales: { type: Number, default: 0 },
      },
    ],

    monthlyPlatformFees: [
      {
        month: { type: String, required: true }, // 'YYYY-MM'
        fees: { type: Number, default: 0 },
      },
    ],

    monthlyRefunds: [
      {
        month: { type: String, required: true }, // 'YYYY-MM'
        refunds: { type: Number, default: 0 },
      },
    ],

    totalSales: { type: Number, default: 0 }, // Total number of completed sales
    totalRegisteredUsers: { type: Number, default: 0 }, // Total registered users
    totalActiveStores: { type: Number, default: 0 }, // Total active stores

    averageDeliveryTime: { type: Number, default: 0 }, // Average delivery time for products
    onTimeDeliveryRate: { type: Number, default: 0 }, // Percentage of on-time deliveries
    failedDeliveries: { type: Number, default: 0 }, // Number of failed deliveries

    customerRetentionRate: { type: Number, default: 0 }, // Percentage of returning customers
    customerAcquisitionCost: { type: Number, default: 0 }, // Avg cost to acquire a customer

    topPerformingSellers: [
      {
        sellerId: { type: Schema.Types.ObjectId, ref: "Store" }, // Top seller reference
        totalSales: { type: Number, default: 0 },
      },
    ],

    topSellingProducts: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" }, // Top product reference
        totalSales: { type: Number, default: 0 },
      },
    ],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const UduaStats = model("UduaStats", UduaStatsSchema);
