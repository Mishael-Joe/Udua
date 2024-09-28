"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Product from "../models/product.model";

import { Product as Products } from "@/types";
import Wishlist from "../models/wishlist.model";

type Product = Omit<Products, "productPrice"> & {
  productPrice: string;
};

export async function createProduct({
  productName,
  productPrice,
  productSizes,
  productQuantity,
  productImage,
  productDescription,
  productSpecification,
  productCategory,
  productSubCategory,
  accountId,
  path,
}: Product) {
  try {
    connectToDB();

    const createdProduct = await Product.create({
      accountId,
      productName,
      productPrice,
      productSizes,
      productQuantity,
      productImage,
      productDescription,
      productSpecification,
      productCategory,
      productSubCategory,
      path,
    });

    // Update User model
    await User.findByIdAndUpdate(accountId, {
      $push: { userProducts: createdProduct._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create product: ${error.message}`);
  }
}

export async function fetchProducts(
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

    const query: any = { isVerifiedProduct: true };

    // Add category filter to the query if categories are provided
    if (categories && categories.length > 0) {
      query.productCategory = { $in: categories };
    }

    // Add price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.productPrice = {};
      if (minPrice !== undefined) query.productPrice.$gte = minPrice;
      if (maxPrice !== undefined) query.productPrice.$lte = maxPrice;
    }

    // Add search filter
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { productDescription: { $regex: search, $options: "i" } },
      ];
    }

    // Add stock availability filter
    if (inStock !== undefined) {
      query.productQuantity = inStock ? { $gt: 0 } : 0;
    }

    // Add rating filter
    if (minRating !== undefined) {
      query.productRating = { $gte: minRating };
    }

    // Add date range filter
    if (dateFrom || dateTo) {
      query.updatedAt = {};
      if (dateFrom) query.updatedAt.$gte = dateFrom;
      if (dateTo) query.updatedAt.$lte = dateTo;
    }

    // Calculate the number of documents to fetch
    const totalLimit = page * limit;

    // Determine sorting
    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    const products = await Product.find(query)
      .select("_id productName productPrice productImage")
      .sort(sortOptions)
      .limit(totalLimit);

    return products;
  } catch (error: any) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
}

// export async function fetchProducts() {
//   try {
//     await connectToDB();

//     const products = await Product.find({}).select(
//       "_id productName productPrice productImage"
//     ); // Fetch all products

//     return products;
//   } catch (error: any) {
//     throw new Error(`Failed to fetch products: ${error.message}`);
//   }
// }

export async function fetchProductData(id: string) {
  const cookieStore = cookies();
  const userID = cookieStore.get("userID")?.value;

  try {
    await connectToDB();

    const productData = await Product.findById(id).select(
      "_id productName productPrice productImage productSizes productQuantity productDescription productSpecification"
    );

    if (!productData) {
      throw new Error("Product not found");
    }

    if (userID) {
      const wishlist = await Wishlist.findOne({ user: userID });

      if (wishlist) {
        const isLikedProduct = wishlist.products.includes(id);
        return {
          productData,
          isLikedProduct,
        };
      }
    }

    return { productData, isLikedProduct: false };
  } catch (error: any) {
    throw new Error(`Failed to fetch product data: ${error.message}`);
  }
}

export const addToWishlist = async (productId: string) => {
  const cookieStore = cookies();
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
  const cookieStore = cookies();
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
