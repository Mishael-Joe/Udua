"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { connectToDB } from "../mongoose";
import Product from "../models/product.model";

import { CombinedProduct, DigitalProduct, Product as Products } from "@/types";
import Wishlist from "../models/wishlist.model";
import Store from "../models/store.model";
import bcryptjs from "bcryptjs";
import EBook from "../models/digital-product.model";
import ProductReview from "../models/product-review.model";

type Product = Omit<Products, "price"> & {
  price: string;
  storePassword: string;
};

type DigitalProducts = Omit<DigitalProduct, "price"> & {
  price: string;
  storePassword: string;
};

export async function createProduct({
  name,
  price,
  sizes,
  productQuantity,
  images,
  description,
  specifications,
  category,
  subCategory,
  storeID,
  path,
  storePassword,
  productType,
}: Product) {
  try {
    // Await the connection if connectToDB is asynchronous
    await connectToDB();

    // Find the store by ID
    const store = await Store.findById(storeID);

    if (!store) {
      throw new Error(`Store not found: Invalid store ID (create product)`);
    }

    // Check if the password is correct
    const validatePassword = await bcryptjs.compare(
      storePassword,
      store.password
    );

    if (!validatePassword) {
      throw new Error(`Invalid store password (create product)`);
    }

    // Create the product
    const createdProduct = await Product.create({
      storeID,
      productType,
      name,
      price,
      sizes,
      productQuantity,
      images,
      description,
      specifications,
      category,
      subCategory,
      path,
    });

    // Update the store by pushing the new product to the products array
    await Store.findByIdAndUpdate(storeID, {
      $push: { products: createdProduct._id },
    });

    // Revalidate the path for any cache or static paths
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create product: ${error.message}`);
  }
}

export async function createDigitalProduct({
  storeID,
  title,
  author,
  description,
  category,
  subcategory,
  price,
  fileType,
  fileSize,
  s3Key,
  isbn,
  language,
  publisher,
  coverIMG,
  productType,
  storePassword,
}: DigitalProducts) {
  try {
    // Await the connection if connectToDB is asynchronous
    await connectToDB();

    // Find the store by ID
    const store = await Store.findById(storeID);

    if (!store) {
      throw new Error(`Store not found: Invalid store ID (create product)`);
    }

    // Check if the password is correct
    const validatePassword = await bcryptjs.compare(
      storePassword,
      store.password
    );

    if (!validatePassword) {
      throw new Error(`Invalid store password (create product)`);
    }

    // Create the digital product i.e, the E-book
    const createdProduct = await EBook.create({
      storeID,
      title,
      author,
      description,
      category,
      subcategory,
      price,
      fileType,
      fileSize,
      s3Key,
      isbn,
      language,
      publisher,
      coverIMG,
      productType,
    });

    // Update the store by pushing the new product to the products array
    await Store.findByIdAndUpdate(storeID, {
      $push: { ebooks: createdProduct._id },
    });

    // Revalidate the path for any cache or static paths
    // revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create digital product: ${error.message}`);
  }
}

export async function fetchProductsAndEBooks(
  categories?: string[] | string,
  page: number = 1,
  limit: number = 30,
  minPrice?: number,
  maxPrice?: number,
  search?: string,
  sortBy?: string,
  sortOrder: "asc" | "desc" = "asc",
  inStock?: boolean,
  minRating?: number,
  dateFrom?: Date,
  dateTo?: Date
) {
  try {
    await connectToDB();

    // General visibility filter with correct product types
    const productQuery: any = {
      isVisible: true,
      productType: "physicalproducts",
    };
    const eBookQuery: any = {
      isVisible: false,
      productType: "digitalproducts",
    };

    // Add category filter if provided (handle both string and array)
    if (categories) {
      const categoryArray = Array.isArray(categories)
        ? categories
        : [categories];
      // console.log("categoryArray", categoryArray);
      if (categoryArray.length > 0) {
        productQuery.category = { $in: categoryArray };
        eBookQuery.category = { $in: categoryArray };
      }
    }

    // Add price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      productQuery.price = {};
      eBookQuery.price = {};
      if (minPrice !== undefined) {
        productQuery.price.$gte = minPrice;
        eBookQuery.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        productQuery.price.$lte = maxPrice;
        eBookQuery.price.$lte = maxPrice;
      }
    }

    // Add text search filter for both products and eBooks
    if (search) {
      productQuery.$text = { $search: search };
      eBookQuery.$text = { $search: search };
    }

    // Add stock filter (only for physical products)
    if (inStock !== undefined) {
      if (inStock) {
        productQuery.$or = [
          { sizes: { $elemMatch: { quantity: { $gt: 0 } } } },
          { $and: [{ sizes: { $size: 0 } }, { productQuantity: { $gt: 0 } }] },
          {
            $and: [
              { sizes: { $exists: false } },
              { productQuantity: { $gt: 0 } },
            ],
          },
        ];
      } else {
        productQuery.$or = [
          {
            $and: [
              { sizes: { $exists: true, $ne: [] } },
              { sizes: { $not: { $elemMatch: { quantity: { $gt: 0 } } } } },
            ],
          },
          {
            $and: [
              { $or: [{ sizes: { $size: 0 } }, { sizes: { $exists: false } }] },
              { productQuantity: 0 },
            ],
          },
        ];
      }
    }

    // Add rating filter
    if (minRating !== undefined) {
      const pipeline = [
        {
          $group: {
            _id: "$product",
            averageRating: { $avg: "$rating" },
          },
        },
        {
          $match: {
            averageRating: { $gte: Number(minRating) },
          },
        },
        { $project: { _id: 1 } },
      ];

      const productsWithMinRating = await ProductReview.aggregate(pipeline);

      const productIds = productsWithMinRating.map((item) => item._id);

      if (productIds.length > 0) {
        productQuery._id = { $in: productIds };
      } else {
        productQuery._id = { $in: [] };
      }

      // For eBooks - direct filter
      eBookQuery.rating = { $gte: minRating };
    }

    // Add date filter (for both)
    if (dateFrom || dateTo) {
      // Use createdAt if updatedAt doesn't exist in both schemas
      productQuery.createdAt = {};
      eBookQuery.createdAt = {};
      if (dateFrom) {
        productQuery.createdAt.$gte = dateFrom;
        eBookQuery.createdAt.$gte = dateFrom;
      }
      if (dateTo) {
        productQuery.createdAt.$lte = dateTo;
        eBookQuery.createdAt.$lte = dateTo;
      }
    }

    // Calculate skip value for proper pagination
    const skip = (page - 1) * limit;

    // Determine sorting options
    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    // If search is provided, sort by text score
    if (search) {
      sortOptions.score = { $meta: "textScore" };
    }

    // Fetch both products and eBooks in parallel
    const [products, eBooks] = await Promise.all([
      Product.find(productQuery)
        .select(
          "_id name price images sizes productType description specifications storeID"
        )
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean()
        .select(search ? { score: { $meta: "textScore" } } : {}),
      EBook.find(eBookQuery)
        .select(
          "_id title price coverIMG productType description specifications storeID"
        )
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean()
        .select(search ? { score: { $meta: "textScore" } } : {}),
    ]);

    // Combine the results
    let combinedResults = [...products, ...eBooks];

    // Sort combined results if needed
    if (sortBy && combinedResults.length > 0) {
      combinedResults.sort((a, b) => {
        // Handle different field names between products and eBooks
        const aValue = a[sortBy] || a[sortBy === "name" ? "title" : sortBy];
        const bValue = b[sortBy] || b[sortBy === "name" ? "title" : sortBy];

        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return combinedResults;
  } catch (error: any) {
    throw new Error(`Failed to fetch products and eBooks: ${error.message}`);
  }
}

// export async function fetchProductsAndEBooks(
//   categories?: string[] | string,
//   page: number = 1,
//   limit: number = 30,
//   minPrice?: number,
//   maxPrice?: number,
//   search?: string,
//   sortBy?: string,
//   sortOrder: "asc" | "desc" = "asc",
//   inStock?: boolean,
//   minRating?: number,
//   dateFrom?: Date,
//   dateTo?: Date
// ) {
//   try {
//     await connectToDB();

//     // General visibility filter
//     const productQuery: any = { isVisible: true }; // For physical products
//     const eBookQuery: any = { isVisible: false }; // For eBooks

//     // Add category filter if provided (handled separately for products and eBooks)
//     if (categories && categories.length > 0) {
//       // console.log("categories", categories);
//       productQuery.productCategory = { $in: categories };
//       eBookQuery.category = { $in: categories };
//     }

//     // Add price range filter
//     if (minPrice !== undefined || maxPrice !== undefined) {
//       productQuery.price = {};
//       eBookQuery.price = {};
//       if (minPrice !== undefined) {
//         productQuery.price.$gte = minPrice;
//         eBookQuery.price.$gte = minPrice;
//       }
//       if (maxPrice !== undefined) {
//         productQuery.price.$lte = maxPrice;
//         eBookQuery.price.$lte = maxPrice;
//       }
//     }

//     // Add text search filter for both products and eBooks
//     if (search) {
//       productQuery.$text = { $search: search }; // Perform text search on products
//       eBookQuery.$text = { $search: search }; // Perform text search on eBooks
//     }

//     // Add stock filter (only for physical products)
//     if (
//       inStock !== undefined &&
//       productQuery.productType === "physicalproducts"
//     ) {
//       if (inStock) {
//         // For in-stock products: either productQuantity > 0 OR at least one size has quantity > 0
//         productQuery.$or = [
//           { sizes: { $elemMatch: { quantity: { $gt: 0 } } } },
//           { $and: [{ sizes: { $size: 0 } }, { productQuantity: { $gt: 0 } }] },
//           {
//             $and: [
//               { sizes: { $exists: false } },
//               { productQuantity: { $gt: 0 } },
//             ],
//           },
//         ];
//       } else {
//         // For out-of-stock products: either productQuantity = 0 OR all sizes have quantity = 0
//         productQuery.$or = [
//           // Products with sizes where all sizes have quantity = 0
//           {
//             $and: [
//               { sizes: { $exists: true, $ne: [] } },
//               { sizes: { $not: { $elemMatch: { quantity: { $gt: 0 } } } } },
//             ],
//           },
//           // Products without sizes and productQuantity = 0
//           {
//             $and: [
//               { $or: [{ sizes: { $size: 0 } }, { sizes: { $exists: false } }] },
//               { productQuantity: 0 },
//             ],
//           },
//         ];
//       }
//     }

//     if (minRating !== undefined) {
//       // First, get product IDs with average rating >= minRating
//       const productsWithMinRating = await ProductReview.aggregate([
//         {
//           $group: {
//             _id: "$product",
//             averageRating: { $avg: "$rating" },
//           },
//         },
//         { $match: { averageRating: { $gte: minRating } } },
//         { $project: { _id: 1 } },
//       ]);

//       // Extract product IDs
//       const productIds = productsWithMinRating.map((item: any) => item._id);

//       // Add to query
//       if (productIds.length > 0) {
//         productQuery._id = { $in: productIds };
//         // Similar for eBookQuery if needed
//       } else {
//         // No products match the rating criteria
//         // Return empty result (you can handle this differently if needed)
//         productQuery._id = { $in: [] };
//         // Similar for eBookQuery if needed
//       }
//     }
//     // // Add rating filter for both
//     // if (minRating !== undefined) {
//     //   productQuery.rating = { $gte: minRating };
//     //   eBookQuery.rating = { $gte: minRating };
//     // }

//     // Add date filter (for both)
//     if (dateFrom || dateTo) {
//       productQuery.updatedAt = {};
//       eBookQuery.updatedAt = {};
//       if (dateFrom) {
//         productQuery.updatedAt.$gte = dateFrom;
//         eBookQuery.updatedAt.$gte = dateFrom;
//       }
//       if (dateTo) {
//         productQuery.updatedAt.$lte = dateTo;
//         eBookQuery.updatedAt.$lte = dateTo;
//       }
//     }

//     // Calculate the number of documents to fetch
//     const totalLimit = page * limit;

//     // Determine sorting options
//     const sortOptions: any = {};
//     if (sortBy) {
//       sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
//     }

//     // If search is provided, sort by text score to get the most relevant results first
//     if (search) {
//       sortOptions.score = { $meta: "textScore" };
//     }

//     // Fetch both products and eBooks in parallel
//     const [products, eBooks] = await Promise.all([
//       Product.find(productQuery)
//         .select("_id name price images sizes productType")
//         .sort(sortOptions)
//         .limit(totalLimit)
//         .lean()
//         .select(search ? { score: { $meta: "textScore" } } : {}), // Include text score if search is provided
//       EBook.find(eBookQuery)
//         .select("_id title price coverIMG category productType")
//         .sort(sortOptions)
//         .limit(totalLimit)
//         .lean()
//         .select(search ? { score: { $meta: "textScore" } } : {}), // Include text score if search is provided
//     ]);

//     // Combine the results with an identifier to differentiate between products and eBooks
//     const combinedResults = [
//       ...products.map((product) => ({ ...product, type: "physicalproducts" })),
//       ...eBooks.map((eBook) => ({ ...eBook, type: "digitalproducts" })),
//     ];

//     return combinedResults;
//   } catch (error: any) {
//     throw new Error(`Failed to fetch products and eBooks: ${error.message}`);
//   }
// }

export async function fetchProductData(id: string) {
  const cookieStore = await cookies();
  const userID = cookieStore.get("userID")?.value;

  try {
    await connectToDB();
    const ebook = await EBook.findOne().select("title");

    // Declare productData with CombinedProduct | null
    let productData: CombinedProduct | null = null;

    // First, attempt to find the product by ID in the Product schema
    const foundProduct = await Product.findById(id).select(
      "_id name price images sizes productQuantity description specifications storeID productType"
    );

    if (foundProduct) {
      productData = foundProduct.toObject(); // Convert Mongoose Document to plain object
    }

    // If no product is found, attempt to find it in the EBook schema
    if (!productData) {
      const foundEBook = await EBook.findById(id).select(
        "_id title author description price fileType fileSize publisher coverIMG language productType storeID"
      );

      // console.log("foundEBook", foundEBook);

      if (foundEBook) {
        productData = foundEBook.toObject(); // Convert Mongoose Document to plain object
      }
    }

    // If neither product nor eBook is found, throw an error
    if (!productData) {
      throw new Error("Product or eBook not found");
    }

    let isLikedProduct = false;
    if (userID) {
      const wishlist = await Wishlist.findOne({ user: userID });

      if (wishlist) {
        isLikedProduct = wishlist.products.includes(id);
      }
    }

    return { productData, isLikedProduct };
  } catch (error: any) {
    throw new Error(`Failed to fetch product data: ${error.message}`);
  }
}

export const addToWishlist = async (productId: string) => {
  const cookieStore = await cookies();
  const userID = cookieStore.get("userID")?.value;

  if (!userID) {
    const response = {
      status: 401,
      message: "User not authenticated",
    };
    return response;
  }

  try {
    let wishlist = await Wishlist.findOne({ user: userID });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userID, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const response = {
      status: 200,
      message: "Succesful",
      wishlist,
    };

    return response;
  } catch (error: any) {
    const response = {
      status: 401,
      message: error.message,
    };
    return response;
    // throw new Error(`Failed to add to wishlist: ${error.message}`);
  }
};

export const removeFromWishlist = async (productId: string) => {
  const cookieStore = await cookies();
  const userID = cookieStore.get("userID")?.value;

  if (!userID) {
    const response = {
      status: 401,
      message: "User not authenticated",
    };
    return response;
  }

  try {
    const wishlist = await Wishlist.findOne({ user: userID });

    if (!wishlist) {
      return wishlist;
    }

    wishlist.products = wishlist.products.filter(
      (id: string) => id.toString() !== productId
    );

    await wishlist.save();

    const response = {
      status: 200,
      message: "Succesful",
      wishlist,
    };

    return response;
  } catch (error: any) {
    const response = {
      status: 401,
      message: error.message,
    };

    return response;
  }
};
