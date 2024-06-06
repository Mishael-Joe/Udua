"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Product from "../models/product.model";

import { Product as Products } from "@/types";

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

    const query: any = { isVerifiedProduct: false };

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
  try {
    await connectToDB();

    const productData = await Product.findById(id).select(
      "_id productName productPrice productImage productSizes productQuantity productDescription productSpecification"
    );

    return productData;
  } catch (error: any) {
    throw new Error(`Failed to fetch productData: ${error.message}`);
  }
}
