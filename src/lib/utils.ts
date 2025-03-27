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

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN", // Change currency to NGN for Naira
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function addCommasToNumber(number: number) {
  if (typeof number !== "number") {
    return number; // Return unchanged if it's not a number
  }

  const numberStr = number.toString();
  const parts = numberStr.split(".");

  // Split the number into its integer and decimal parts
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimalPart = parts[1] ? "." + parts[1] : "";

  // Combine the integer and decimal parts
  return integerPart + decimalPart;
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
