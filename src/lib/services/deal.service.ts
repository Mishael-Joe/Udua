import type mongoose from "mongoose";
import Deal from "../models/deal.model";
import { currencyOperations } from "@/lib/utils";

/**
 * Interface for deal validation result
 */
interface DealValidationResult {
  isValid: boolean;
  error?: string;
  deal?: any;
}

/**
 * Service for deal-related operations
 * Handles validation, application, and analytics for deals
 */
export class DealService {
  /**
   * Validates if a deal is still applicable
   * Checks:
   * - Deal exists
   * - Deal is active
   * - Deal is within date range
   * - Usage limit not exceeded
   * - Flash sale inventory available
   * - Size eligibility
   *
   * @param dealId The ID of the deal to validate
   * @param quantity The quantity being ordered
   * @param size Optional size for size-specific deals
   * @param cartValue Optional cart value for minimum cart value deals
   */
  static async validateDeal(
    dealId: string,
    quantity: number,
    size?: string,
    cartValue?: number
  ): Promise<DealValidationResult> {
    try {
      // Find the deal
      const deal = await Deal.findById(dealId);

      if (!deal) {
        return { isValid: false, error: "Deal not found" };
      }

      // Check if deal is active
      if (!deal.isActive) {
        return { isValid: false, error: "Deal is no longer active" };
      }

      // Check date range
      const now = new Date();
      if (now < deal.startDate || now > deal.endDate) {
        return { isValid: false, error: "Deal is not within valid date range" };
      }

      // Check usage limit
      if (deal.usageLimit && deal.usageCount >= deal.usageLimit) {
        return { isValid: false, error: "Deal usage limit has been reached" };
      }

      // Check flash sale inventory
      if (
        deal.dealType === "flash_sale" &&
        deal.flashSaleRemaining !== undefined
      ) {
        if (deal.flashSaleRemaining < quantity) {
          return {
            isValid: false,
            error: `Flash sale has limited inventory. Available: ${deal.flashSaleRemaining}, Requested: ${quantity}`,
          };
        }
      }

      // Check size eligibility
      if (deal.applyToSizes && deal.applyToSizes.length > 0 && size) {
        if (!deal.applyToSizes.includes(size)) {
          return {
            isValid: false,
            error: `Deal does not apply to size ${size}`,
          };
        }
      }

      // Check minimum cart value
      if (deal.minCartValue && cartValue && cartValue < deal.minCartValue) {
        return {
          isValid: false,
          error: `Order total does not meet minimum cart value of ${deal.minCartValue}`,
        };
      }

      return { isValid: true, deal };
    } catch (error) {
      console.error("Error validating deal:", error);
      return { isValid: false, error: "Error validating deal" };
    }
  }

  /**
   * Updates deal analytics after a successful order
   *
   * @param dealId The ID of the deal to update
   * @param userId The ID of the user who used the deal
   * @param quantity The quantity of items purchased with the deal
   * @param discountAmount The total discount amount applied
   * @param orderTotal The total order amount after discount
   * @param session Optional MongoDB session for transactions
   */
  static async updateDealAnalytics(
    dealId: string,
    userId: string,
    quantity: number,
    discountAmount: number,
    orderTotal: number,
    session?: mongoose.ClientSession
  ): Promise<void> {
    try {
      const deal = await Deal.findById(dealId).session(session || null);

      if (!deal) {
        console.error(`Deal not found for analytics update: ${dealId}`);
        return;
      }

      // Increment usage count
      deal.usageCount += 1;

      // Update flash sale remaining inventory
      if (
        deal.dealType === "flash_sale" &&
        deal.flashSaleRemaining !== undefined
      ) {
        deal.flashSaleRemaining = Math.max(
          0,
          deal.flashSaleRemaining - quantity
        );
      }

      // Update analytics
      deal.analytics.redemptionCount += 1;
      deal.analytics.totalDiscountAmount = currencyOperations.add(
        deal.analytics.totalDiscountAmount,
        discountAmount
      );
      deal.analytics.revenueGenerated = currencyOperations.add(
        deal.analytics.revenueGenerated,
        orderTotal
      );

      // Add user to unique users if not already present
      if (!deal.analytics.uniqueUsersUsed.includes(userId)) {
        deal.analytics.uniqueUsersUsed.push(userId);
      }

      // Update average order value
      const totalOrders = deal.analytics.redemptionCount;
      const totalRevenue = deal.analytics.revenueGenerated;
      deal.analytics.averageOrderValue = Math.round(totalRevenue / totalOrders);

      // Update redemption dates
      deal.analytics.lastRedemptionDate = new Date();
      if (!deal.analytics.firstRedemptionDate) {
        deal.analytics.firstRedemptionDate = new Date();
      }

      await deal.save({ session: session || null });
    } catch (error) {
      console.error("Error updating deal analytics:", error);
      throw error;
    }
  }

  /**
   * Calculates the discount amount based on deal type and value
   *
   * @param dealType The type of deal
   * @param dealValue The value of the deal
   * @param originalPrice The original price before discount
   * @param maxDiscountValue Optional maximum discount value for percentage deals
   */
  static calculateDiscountAmount(
    dealType: string,
    dealValue: number,
    originalPrice: number,
    maxDiscountValue?: number
  ): number {
    let discountAmount = 0;

    switch (dealType) {
      case "percentage":
      case "flash_sale":
        // Calculate percentage discount
        discountAmount = Math.round((originalPrice * dealValue) / 100);

        // Apply maximum discount cap if specified
        if (maxDiscountValue && discountAmount > maxDiscountValue) {
          discountAmount = maxDiscountValue;
        }
        break;

      case "fixed":
        // Fixed amount discount
        discountAmount = dealValue;

        // Ensure discount doesn't exceed original price
        if (discountAmount > originalPrice) {
          discountAmount = originalPrice;
        }
        break;

      case "free_shipping":
        // Free shipping deals are handled separately
        discountAmount = 0;
        break;

      case "buy_x_get_y":
        // buy_x_get_y deals are more complex and handled separately
        discountAmount = 0;
        break;

      default:
        discountAmount = 0;
    }

    return discountAmount;
  }
}
