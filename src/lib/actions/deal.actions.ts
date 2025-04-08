"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import Deal from "../models/deal.model";
import Store from "../models/store.model";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import Product from "../models/product.model";
import EBook from "../models/digital-product.model";

// Define validation schema using Zod
const dealSchema = z.object({
  storeID: z.string().min(1, "Store ID is required"),
  storePassword: z.string().min(1, "Store password is required"),
  name: z.string().min(3, "Deal name must be at least 3 characters"),
  description: z.string().optional(),
  dealType: z.enum([
    "percentage",
    "fixed",
    "free_shipping",
    "flash_sale",
    "buy_x_get_y",
  ]),
  value: z.number().min(0, "Value must be a positive number"),
  productIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  startDate: z
    .date()
    .refine((date) => date >= new Date(), "Start date must be in the future"),
  endDate: z
    .date()
    .refine((date) => date > new Date(), "End date must be in the future"),
  minCartValue: z.number().optional(),
  maxDiscountValue: z.number().optional(),
  usageLimit: z.number().optional(),
  autoApply: z.boolean().default(false),
  applyToSizes: z.array(z.string()).optional(),
  code: z.string().optional(),
  buyQuantity: z.number().optional(),
  getQuantity: z.number().optional(),
  getProductIds: z.array(z.string()).optional(),
  flashSaleQuantity: z.number().optional(),
  path: z.string().optional(),
});

// Type for the input to createDeal
type CreateDealInput = z.infer<typeof dealSchema>;

/**
 * Creates a new deal for a store
 *
 * This function handles the creation of various types of deals including:
 * - Percentage discounts
 * - Fixed amount discounts
 * - Free shipping
 * - Flash sales
 * - Buy X Get Y promotions
 *
 * It includes validations for:
 * - Store authentication
 * - Deal parameters
 * - Date ranges
 * - Overlapping flash sales
 *
 * @param dealData The deal data to create
 * @returns Object with success status and message or error
 */
export async function createDeal(dealData: CreateDealInput) {
  try {
    // Connect to the database
    await connectToDB();

    // Validate input data
    const validatedData = dealSchema.parse(dealData);

    const {
      storeID,
      storePassword,
      startDate,
      endDate,
      dealType,
      productIds = [],
      value,
      path,
      ...restData
    } = validatedData;

    // Find the store by ID
    const store = await Store.findById(storeID);
    if (!store) {
      return { success: false, error: "Store not found" };
    }

    // Authenticate store owner
    const validatePassword = await bcryptjs.compare(
      storePassword,
      store.password
    );
    if (!validatePassword) {
      return { success: false, error: "Invalid store password" };
    }

    // Additional validations based on deal type
    if (dealType === "percentage" && (value <= 0 || value > 100)) {
      return {
        success: false,
        error: "Percentage discount must be between 1 and 100",
      };
    }

    if (dealType === "fixed" && value <= 0) {
      return {
        success: false,
        error: "Fixed discount amount must be greater than 0",
      };
    }

    if (dealType === "flash_sale") {
      // Check for overlapping flash sales
      // @ts-ignore
      const overlappingDeals = await Deal.checkOverlappingFlashSales(
        storeID,
        productIds,
        startDate,
        endDate
      );

      if (overlappingDeals.length > 0) {
        return {
          success: false,
          error:
            "There are overlapping flash sales for some of the selected products during this time period",
        };
      }

      // Validate flash sale quantity
      if (!restData.flashSaleQuantity || restData.flashSaleQuantity <= 0) {
        return {
          success: false,
          error: "Flash sale quantity is required and must be greater than 0",
        };
      }
    }

    if (dealType === "buy_x_get_y") {
      // Validate buy_x_get_y specific fields
      if (!restData.buyQuantity || restData.buyQuantity <= 0) {
        return {
          success: false,
          error: "Buy quantity is required and must be greater than 0",
        };
      }

      if (!restData.getQuantity || restData.getQuantity <= 0) {
        return {
          success: false,
          error: "Get quantity is required and must be greater than 0",
        };
      }

      if (!restData.getProductIds || restData.getProductIds.length === 0) {
        return {
          success: false,
          error: "Get product IDs are required for Buy X Get Y deals",
        };
      }
    }

    // Validate date range
    if (startDate >= endDate) {
      return { success: false, error: "End date must be after start date" };
    }

    // Create the deal
    const newDeal = await Deal.create({
      storeID,
      dealType,
      value,
      productIds,
      startDate,
      endDate,
      ...restData,
    });

    // Revalidate the path if provided
    if (path) {
      revalidatePath(path);
    }

    return {
      success: true,
      message: "Deal created successfully",
      dealId: newDeal._id,
    };
  } catch (error: any) {
    console.error("Error creating deal:", error);

    // Handle Zod validation errors
    if (error.name === "ZodError") {
      const fieldErrors = error.errors.map((err: any) => ({
        path: err.path.join("."),
        message: err.message,
      }));

      return {
        success: false,
        error: "Validation failed",
        fieldErrors,
      };
    }

    return {
      success: false,
      error: `Failed to create deal: ${error.message}`,
    };
  }
}

/**
 * Gets all active deals for a store
 *
 * @param storeID The store ID to get deals for
 * @returns Array of active deals
 */
export async function getStoreDeals(storeID: string) {
  try {
    await connectToDB();

    const deals = await Deal.find({
      storeID,
      isActive: true,
      endDate: { $gte: new Date() },
    }).sort({ startDate: 1 });

    return { success: true, deals };
  } catch (error: any) {
    console.error("Error fetching store deals:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Gets all active deals for specific products
 *
 * @param productIds Array of product IDs
 * @returns Array of active deals for the products
 */
export async function getProductDeals(productIds: string[]) {
  try {
    await connectToDB();

    const now = new Date();

    const deals = await Deal.find({
      productIds: { $in: productIds },
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    return { success: true, deals };
  } catch (error: any) {
    console.error("Error fetching product deals:", error);
    return { success: false, error: error.message };
  }
}

// Update the getActiveDeals function to include sizes field
export async function getActiveDeals(limit = 6) {
  try {
    await connectToDB();

    const now = new Date();

    // Find active deals
    const deals = await Deal.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .sort({ endDate: 1 }) // Sort by end date (soonest ending first)
      .limit(limit);

    // Get all product IDs from the deals
    const productIds = deals.reduce((ids: string[], deal) => {
      if (deal.productIds && deal.productIds.length > 0) {
        return [...ids, ...deal.productIds];
      }
      return ids;
    }, []);

    // Fetch all products in a single query - include sizes field
    const products = await Product.find({ _id: { $in: productIds } }).select(
      "_id name price images productType sizes"
    );

    // Fetch all digital products in a single query
    const digitalProducts = await EBook.find({
      _id: { $in: productIds },
    }).select("_id title price coverIMG productType");

    // Combine products and digital products
    const allProducts = [...products, ...digitalProducts];

    // Create a map for quick lookup
    const productMap = allProducts.reduce((map: any, product) => {
      map[product._id.toString()] = product;
      return map;
    }, {});

    // Attach products to each deal
    const dealsWithProducts = deals.map((deal) => {
      const dealObj = deal.toObject();

      // Attach products to the deal
      dealObj.products = (deal.productIds || [])
        .map((id: string) => productMap[id.toString()])
        .filter(Boolean); // Remove any undefined products

      return dealObj;
    });

    return { successs: true, deals: dealsWithProducts };
  } catch (error: any) {
    console.error("Error fetching active deals:", error);
    return { success: false, error: error.message };
  }
}

// Update the getDealById function to include analytics data
export async function getDealById(dealId: string) {
  try {
    await connectToDB();

    // Find the deal
    const deal = await Deal.findById(dealId);

    if (!deal) {
      return { success: false, error: "Deal not found" };
    }

    // Get product IDs from the deal
    const productIds = deal.productIds || [];

    // Fetch products - include sizes field
    const products = await Product.find({ _id: { $in: productIds } }).select(
      "_id name price images productType sizes"
    );

    // Fetch digital products
    const digitalProducts = await EBook.find({
      _id: { $in: productIds },
    }).select("_id title price coverIMG productType");

    // Combine products and digital products
    const allProducts = [...products, ...digitalProducts];

    // Create deal object with products
    const dealObj = deal.toObject();
    dealObj.products = allProducts;

    // Ensure analytics object exists with default values
    if (!dealObj.analytics) {
      dealObj.analytics = {
        viewCount: 0,
        clickCount: 0,
        redemptionCount: 0,
        totalDiscountAmount: 0,
        revenueGenerated: 0,
        uniqueUsersUsed: [],
        averageOrderValue: 0,
      };
    }

    return { success: true, deal: dealObj };
  } catch (error: any) {
    console.error("Error fetching deal by ID:", error);
    return { success: false, error: error.message };
  }
}

// "use server";

// import { revalidatePath } from "next/cache";
// import { connectToDB } from "../mongoose";
// import Deal from "../models/deal.model";
// import Store from "../models/store.model";
// import bcryptjs from "bcryptjs";
// import { z } from "zod";
// import Product from "../models/product.model";
// import EBook from "../models/digital-product.model";

// // Define validation schema using Zod
// const dealSchema = z.object({
//   storeID: z.string().min(1, "Store ID is required"),
//   storePassword: z.string().min(1, "Store password is required"),
//   name: z.string().min(3, "Deal name must be at least 3 characters"),
//   description: z.string().optional(),
//   dealType: z.enum([
//     "percentage",
//     "fixed",
//     "free_shipping",
//     "flash_sale",
//     "buy_x_get_y",
//   ]),
//   value: z.number().min(0, "Value must be a positive number"),
//   productIds: z.array(z.string()).optional(),
//   categoryIds: z.array(z.string()).optional(),
//   startDate: z
//     .date()
//     .refine((date) => date >= new Date(), "Start date must be in the future"),
//   endDate: z
//     .date()
//     .refine((date) => date > new Date(), "End date must be in the future"),
//   minCartValue: z.number().optional(),
//   maxDiscountValue: z.number().optional(),
//   usageLimit: z.number().optional(),
//   autoApply: z.boolean().default(false),
//   applyToSizes: z.array(z.string()).optional(),
//   code: z.string().optional(),
//   buyQuantity: z.number().optional(),
//   getQuantity: z.number().optional(),
//   getProductIds: z.array(z.string()).optional(),
//   flashSaleQuantity: z.number().optional(),
//   path: z.string().optional(),
// });

// // Type for the input to createDeal
// type CreateDealInput = z.infer<typeof dealSchema>;

// /**
//  * Creates a new deal for a store
//  *
//  * This function handles the creation of various types of deals including:
//  * - Percentage discounts
//  * - Fixed amount discounts
//  * - Free shipping
//  * - Flash sales
//  * - Buy X Get Y promotions
//  *
//  * It includes validations for:
//  * - Store authentication
//  * - Deal parameters
//  * - Date ranges
//  * - Overlapping flash sales
//  *
//  * @param dealData The deal data to create
//  * @returns Object with success status and message or error
//  */
// export async function createDeal(dealData: CreateDealInput) {
//   try {
//     // Connect to the database
//     await connectToDB();

//     // Validate input data
//     const validatedData = dealSchema.parse(dealData);

//     const {
//       storeID,
//       storePassword,
//       startDate,
//       endDate,
//       dealType,
//       productIds = [],
//       value,
//       path,
//       ...restData
//     } = validatedData;

//     // Find the store by ID
//     const store = await Store.findById(storeID);
//     if (!store) {
//       return { success: false, error: "Store not found" };
//     }

//     // Authenticate store owner
//     const validatePassword = await bcryptjs.compare(
//       storePassword,
//       store.password
//     );
//     if (!validatePassword) {
//       return { success: false, error: "Invalid store password" };
//     }

//     // Additional validations based on deal type
//     if (dealType === "percentage" && (value <= 0 || value > 100)) {
//       return {
//         success: false,
//         error: "Percentage discount must be between 1 and 100",
//       };
//     }

//     if (dealType === "fixed" && value <= 0) {
//       return {
//         success: false,
//         error: "Fixed discount amount must be greater than 0",
//       };
//     }

//     if (dealType === "flash_sale") {
//       // Check for overlapping flash sales
//       // @ts-ignore
//       const overlappingDeals = await Deal.checkOverlappingFlashSales(
//         storeID,
//         productIds,
//         startDate,
//         endDate
//       );

//       if (overlappingDeals.length > 0) {
//         return {
//           success: false,
//           error:
//             "There are overlapping flash sales for some of the selected products during this time period",
//         };
//       }

//       // Validate flash sale quantity
//       if (!restData.flashSaleQuantity || restData.flashSaleQuantity <= 0) {
//         return {
//           success: false,
//           error: "Flash sale quantity is required and must be greater than 0",
//         };
//       }
//     }

//     if (dealType === "buy_x_get_y") {
//       // Validate buy_x_get_y specific fields
//       if (!restData.buyQuantity || restData.buyQuantity <= 0) {
//         return {
//           success: false,
//           error: "Buy quantity is required and must be greater than 0",
//         };
//       }

//       if (!restData.getQuantity || restData.getQuantity <= 0) {
//         return {
//           success: false,
//           error: "Get quantity is required and must be greater than 0",
//         };
//       }

//       if (!restData.getProductIds || restData.getProductIds.length === 0) {
//         return {
//           success: false,
//           error: "Get product IDs are required for Buy X Get Y deals",
//         };
//       }
//     }

//     // Validate date range
//     if (startDate >= endDate) {
//       return { success: false, error: "End date must be after start date" };
//     }

//     // Create the deal
//     const newDeal = await Deal.create({
//       storeID,
//       dealType,
//       value,
//       productIds,
//       startDate,
//       endDate,
//       ...restData,
//     });

//     // Revalidate the path if provided
//     if (path) {
//       revalidatePath(path);
//     }

//     return {
//       success: true,
//       message: "Deal created successfully",
//       dealId: newDeal._id,
//     };
//   } catch (error: any) {
//     console.error("Error creating deal:", error);

//     // Handle Zod validation errors
//     if (error.name === "ZodError") {
//       const fieldErrors = error.errors.map((err: any) => ({
//         path: err.path.join("."),
//         message: err.message,
//       }));

//       return {
//         success: false,
//         error: "Validation failed",
//         fieldErrors,
//       };
//     }

//     return {
//       success: false,
//       error: `Failed to create deal: ${error.message}`,
//     };
//   }
// }

// /**
//  * Gets all active deals for a store
//  *
//  * @param storeID The store ID to get deals for
//  * @returns Array of active deals
//  */
// export async function getStoreDeals(storeID: string) {
//   try {
//     await connectToDB();

//     const deals = await Deal.find({
//       storeID,
//       isActive: true,
//       endDate: { $gte: new Date() },
//     }).sort({ startDate: 1 });

//     return { success: true, deals };
//   } catch (error: any) {
//     console.error("Error fetching store deals:", error);
//     return { success: false, error: error.message };
//   }
// }

// /**
//  * Gets all active deals for specific products
//  *
//  * @param productIds Array of product IDs
//  * @returns Array of active deals for the products
//  */
// export async function getProductDeals(productIds: string[]) {
//   try {
//     await connectToDB();

//     const now = new Date();

//     const deals = await Deal.find({
//       productIds: { $in: productIds },
//       isActive: true,
//       startDate: { $lte: now },
//       endDate: { $gte: now },
//     });

//     return { success: true, deals };
//   } catch (error: any) {
//     console.error("Error fetching product deals:", error);
//     return { success: false, error: error.message };
//   }
// }

// // Update the getActiveDeals function to include sizes field
// export async function getActiveDeals(limit = 6) {
//   try {
//     await connectToDB();

//     const now = new Date();

//     // Find active deals
//     const deals = await Deal.find({
//       isActive: true,
//       startDate: { $lte: now },
//       endDate: { $gte: now },
//     })
//       .sort({ endDate: 1 }) // Sort by end date (soonest ending first)
//       .limit(limit);

//     // Get all product IDs from the deals
//     const productIds = deals.reduce((ids: string[], deal) => {
//       if (deal.productIds && deal.productIds.length > 0) {
//         return [...ids, ...deal.productIds];
//       }
//       return ids;
//     }, []);

//     // Fetch all products in a single query - include sizes field
//     const products = await Product.find({ _id: { $in: productIds } }).select(
//       "_id name price images productType sizes"
//     );

//     // Fetch all digital products in a single query
//     const digitalProducts = await EBook.find({
//       _id: { $in: productIds },
//     }).select("_id title price coverIMG productType");

//     // Combine products and digital products
//     const allProducts = [...products, ...digitalProducts];

//     // Create a map for quick lookup
//     const productMap = allProducts.reduce((map: any, product) => {
//       map[product._id.toString()] = product;
//       return map;
//     }, {});

//     // Attach products to each deal
//     const dealsWithProducts = deals.map((deal) => {
//       const dealObj = deal.toObject();

//       // Attach products to the deal
//       dealObj.products = (deal.productIds || [])
//         .map((id: string) => productMap[id.toString()])
//         .filter(Boolean); // Remove any undefined products

//       return dealObj;
//     });

//     return { success: true, deals: dealsWithProducts };
//   } catch (error: any) {
//     console.error("Error fetching active deals:", error);
//     return { success: false, error: error.message };
//   }
// }

// // Update the getDealById function to include sizes field
// export async function getDealById(dealId: string) {
//   try {
//     await connectToDB();

//     // Find the deal
//     const deal = await Deal.findById(dealId);

//     if (!deal) {
//       return { success: false, error: "Deal not found" };
//     }

//     // Get product IDs from the deal
//     const productIds = deal.productIds || [];

//     // Fetch products - include sizes field
//     const products = await Product.find({ _id: { $in: productIds } }).select(
//       "_id name price images productType sizes"
//     );

//     // Fetch digital products
//     const digitalProducts = await EBook.find({
//       _id: { $in: productIds },
//     }).select("_id title price coverIMG productType");

//     // Combine products and digital products
//     const allProducts = [...products, ...digitalProducts];

//     // Create deal object with products
//     const dealObj = deal.toObject();
//     dealObj.products = allProducts;

//     return { success: true, deal: dealObj };
//   } catch (error: any) {
//     console.error("Error fetching deal by ID:", error);
//     return { success: false, error: error.message };
//   }
// }
