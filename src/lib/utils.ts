import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Currency utility using currency.js
 *
 * This file provides a configured instance of currency.js for handling
 * Nigerian Naira (₦) monetary values with proper formatting and precision.
 *
 * Values are stored in kobo (smallest unit) and converted for display.
 */

import currency from "currency.js";

/**
 * Converts kobo (smallest unit) to Naira for display
 * 1 Naira = 100 kobo
 */
export const koboToNaira = (kobo: number): number => {
  return kobo / 100;
};

/**
 * Converts Naira to kobo (smallest unit) for storage
 */
export const nairaToKobo = (naira: number): number => {
  return Math.round(naira * 100);
};

/**
 * Creates a currency.js instance configured for Naira
 * @param koboValue - The monetary value in kobo
 */
export const naira = (koboValue: number) =>
  currency(koboToNaira(koboValue), {
    symbol: "₦",
    precision: 2,
    separator: ",",
    decimal: ".",
    pattern: "! #",
    negativePattern: "-! #",
  });

/**
 * Formats a kobo value as Nigerian Naira
 * @param koboValue - The monetary value in kobo
 * @param options - Optional formatting options
 */
export const formatNaira = (
  koboValue: number,
  options?: {
    /** Whether to include the currency symbol */
    symbol?: boolean;
    /** Whether to include decimal places */
    showDecimals?: boolean;
  }
) => {
  const { symbol = true, showDecimals = false } = options || {};

  const config: currency.Options = {
    symbol: symbol ? "₦" : "",
    precision: showDecimals ? 2 : 0,
    separator: ",",
    decimal: ".",
    pattern: "! #",
    negativePattern: "-! #",
  };

  return currency(koboToNaira(koboValue), config).format();
};

/**
 * Performs currency operations with proper precision
 * All values are in kobo
 */
export const currencyOperations = {
  /**
   * Add two or more monetary values (in kobo)
   */
  add: (a: number, b: number, ...rest: number[]): number => {
    let result = a + b;
    rest.forEach((value) => {
      result += value;
    });
    return result;
  },

  /**
   * Subtract one or more monetary values (in kobo)
   */
  subtract: (a: number, b: number, ...rest: number[]): number => {
    let result = a - b;
    rest.forEach((value) => {
      result -= value;
    });
    return result;
  },

  /**
   * Multiply a monetary value (in kobo) by a factor
   */
  multiply: (koboValue: number, factor: number): number => {
    return Math.round(koboValue * factor);
  },

  /**
   * Divide a monetary value (in kobo) by a divisor
   */
  divide: (koboValue: number, divisor: number): number => {
    return Math.round(koboValue / divisor);
  },

  /**
   * Calculate percentage of a monetary value (in kobo)
   */
  percentage: (koboValue: number, percent: number): number => {
    return Math.round(koboValue * (percent / 100));
  },
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates transaction commission and settlement amount based on Udua's fee structure.
 *
 * This function implements the following fee structure:
 * - Base fee: 8.25% of transaction amount
 * - Flat fee: ₦200 (20000 kobo) for transactions ≥ ₦2500 (250000 kobo)
 * - Maximum fee cap: ₦3000 (300000 kobo)
 *
 * All monetary values are in kobo (1 Naira = 100 kobo) to avoid floating-point errors.
 *
 * @param amountInKobo - The transaction amount in kobo
 * @returns An object containing the commission amount and settlement amount in kobo
 */
export const calculateCommission = (amountInKobo: number) => {
  // Fee constants (converted to kobo)
  const FEE_PERCENTAGE = 8.25 / 100;
  const FLAT_FEE_KOBO = 20000; // ₦200 in kobo
  const FEE_CAP_KOBO = 300000; // ₦3000 in kobo
  const FLAT_FEE_THRESHOLD_KOBO = 250000; // ₦2500 in kobo

  // Calculate the percentage-based fee component
  const percentageFee = Math.round(amountInKobo * FEE_PERCENTAGE);

  // Determine if the flat fee should be applied
  // The flat fee is waived for transactions less than ₦2500 (250000 kobo)
  const shouldApplyFlatFee = amountInKobo >= FLAT_FEE_THRESHOLD_KOBO;

  // Calculate the total transaction fee (percentage fee + flat fee if applicable)
  const transactionFee = shouldApplyFlatFee
    ? percentageFee + FLAT_FEE_KOBO
    : percentageFee;

  // Apply the fee cap - commission cannot exceed ₦3000 (300000 kobo)
  const commission = Math.min(transactionFee, FEE_CAP_KOBO);

  // Calculate the final settlement amount (original amount minus commission)
  const settleAmount = amountInKobo - commission;

  return {
    commission,
    settleAmount,
    // Include additional details for transparency and debugging
    details: {
      percentageFee,
      flatFeeApplied: shouldApplyFlatFee ? FLAT_FEE_KOBO : 0,
      feeCapApplied: transactionFee > FEE_CAP_KOBO,
    },
  };
};

/**
 * Adds a specified number of business days to a given date.
 * Sundays are not counted as business days.
 *
 * @param date - The starting Date.
 * @param daysToAdd - The number of business days to add.
 * @returns A new Date that is the result of adding the business days.
 */
function addBusinessDays(date: Date, daysToAdd: number): Date {
  const result = new Date(date);
  while (daysToAdd > 0) {
    // Move to the next day
    result.setDate(result.getDate() + 1);
    // Only count the day if it is not a Sunday (0 represents Sunday)
    if (result.getDay() !== 0) {
      daysToAdd--;
    }
  }
  return result;
}

/**
 * Calculates an estimated delivery date range for a product.
 * The function takes the shipping days required (excluding processing days)
 * and calculates the lower bound by adding that many business days (skipping Sundays)
 * to the order date. It then calculates an upper bound by adding 2 additional business days.
 *
 * @param shippingDays - The number of shipping days (business days) required.
 * @returns A string representing the estimated delivery date range in the format "DD MMMM YYYY - DD MMMM YYYY".
 *
 * @example
 * // If today is March 18, 2025 and shippingDays is 5:
 * // lower bound: March 23, 2025, upper bound: March 25, 2025,
 * // so the function returns "23 March 2025 - 25 March 2025".
 */
export function calculateEstimatedDeliveryDays(shippingDays: number): string {
  // Get the current date (order date)
  const orderDate = new Date(Date.now());

  // Calculate the lower bound by adding shippingDays business days (skipping Sundays)
  const lowerBound = addBusinessDays(orderDate, shippingDays);

  // Calculate the upper bound by adding 2 additional business days to the lower bound
  const upperBound = addBusinessDays(lowerBound, 2);

  // Format the dates to "DD MMMM YYYY" (e.g., "23 March 2025")
  const formatDate = (date: Date): string =>
    date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // Return the estimated delivery range as a string
  return `${formatDate(lowerBound)} - ${formatDate(upperBound)}`;
}

export function getSizeName(value: string) {
  switch (value) {
    case "xs":
      return "X-Small";
    case "s":
      return "Small";
    case "m":
      return "Medium";
    case "l":
      return "Large";
    case "xl":
      return "X-Large";
    case "one-size":
      return "One Size";
  }
}

export const getStatusClassName = (status: string) => {
  switch (status) {
    case "Order Placed":
      return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
    case "Processing":
      return "bg-muted text-muted-foreground hover:bg-muted/80";
    case "Shipped":
      return "bg-blue-500 text-white hover:bg-blue-600";
    case "Out for Delivery":
      return "bg-amber-500 text-white hover:bg-amber-600";
    case "Delivered":
      return "bg-green-500 text-white hover:bg-green-600";
    case "Canceled":
      return "bg-destructive text-destructive-foreground hover:bg-destructive/80";
    case "Returned":
      return "bg-red-500 text-white hover:bg-red-600";
    case "Failed Delivery":
      return "bg-red-500 text-white hover:bg-red-600";
    case "Refunded":
      return "bg-yellow-500 text-white hover:bg-yellow-600";
    default:
      return "bg-muted text-muted-foreground hover:bg-muted/80";
  }
};

export const uploadImagesToCloudinary = async (images: File[]) => {
  try {
    // Fetch the timestamp and signature from the server
    const {
      data: { timestamp, signature },
    } = await axios.post("/api/cloudinaryImages");

    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
    const uploadedImageUrls = [];

    for (let image of images) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);

      try {
        const uploadResponse = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        uploadedImageUrls.push(uploadResponse.data.secure_url);
      } catch (uploadError) {
        console.error(`Error uploading image ${image.name}:`, uploadError);
        throw new Error(`Error uploading image ${image.name}: ${uploadError}`);
      }
    }

    return uploadedImageUrls;
  } catch (error: any) {
    console.error("Error uploading images to Cloudinary:", error);
    throw new Error(`Error uploading images to Cloudinary: ${error.message}`);
  }
};

/**
 * Formats a date string or Date object into a human-readable format.
 * @param date - The date to format (can be a string, number, or Date object).
 * @param options - Optional formatting options.
 * @returns A formatted date string.
 */
export function formatDate(
  date: string | number | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }
): string {
  // Convert the input to a Date object if it isn't already
  const parsedDate = new Date(date);

  // Check if the date is valid
  if (isNaN(parsedDate.getTime())) {
    console.error("Invalid date provided:", date);
    return "Invalid Date";
  }

  // Format the date using Intl.DateTimeFormat for localization
  return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
}

/**
 * Helper function to calculate time remaining until a date
 */
export function getTimeRemaining(endDateStr: string): string {
  const endDate = new Date(endDateStr);
  const now = new Date();

  const diffMs = endDate.getTime() - now.getTime();

  if (diffMs <= 0) return "Ended";

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ${diffHours} hour${
      diffHours > 1 ? "s" : ""
    }`;
  }

  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ${diffMinutes} min${
      diffMinutes > 1 ? "s" : ""
    }`;
  }

  return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
}
