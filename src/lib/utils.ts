import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
