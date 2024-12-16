"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Product from "../models/product.model";

import { CombinedProduct, DigitalProduct, Product as Products } from "@/types";
import Wishlist from "../models/wishlist.model";
import Store from "../models/store.model";
import bcryptjs from "bcryptjs";
import EBook from "../models/digital-product.model";

type Product = Omit<Products, "productPrice"> & {
  productPrice: string;
  storePassword: string;
};

type DigitalProducts = Omit<DigitalProduct, "price"> & {
  price: string;
  storePassword: string;
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

    const query: any = {}; // General visibility filter
    // const query: any = { isVisible: true };  // General visibility filter

    // Add category filter if provided
    if (categories && categories.length > 0) {
      query.category = { $in: categories };
    }

    // Add price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    // Add search filter
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } }, // For products
        { description: { $regex: search, $options: "i" } }, // For eBooks
      ];
    }

    // Add stock filter (only for physical products)
    const productQuery = { ...query }; // Clone for physical products
    if (inStock !== undefined) {
      productQuery.productQuantity = inStock ? { $gt: 0 } : 0;
    }

    // Add rating filter
    if (minRating !== undefined) {
      query.rating = { $gte: minRating };
    }

    // Add date filter
    if (dateFrom || dateTo) {
      query.updatedAt = {};
      if (dateFrom) query.updatedAt.$gte = dateFrom;
      if (dateTo) query.updatedAt.$lte = dateTo;
    }

    // Calculate the number of documents to fetch
    const totalLimit = page * limit;

    // Determine sorting options
    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    // Fetch both products and eBooks in parallel
    const [products, eBooks] = await Promise.all([
      Product.find(productQuery)
        .select("_id productName productPrice productImage productCategory")
        .sort(sortOptions)
        .limit(totalLimit),
      EBook.find(query)
        .select("_id title price coverIMG category") // Adjust fields for display
        .sort(sortOptions)
        .limit(totalLimit),
    ]);

    // Combine the results with an identifier to differentiate between products and eBooks
    const combinedResults = [
      ...products.map((product) => ({
        ...product._doc, // Extract the Mongoose document data
        type: "Physical Product",
      })),
      ...eBooks.map((eBook) => ({
        ...eBook._doc, // Extract the Mongoose document data
        type: "Digital Product",
      })),
    ];

    return combinedResults;
  } catch (error: any) {
    throw new Error(`Failed to fetch products and eBooks: ${error.message}`);
  }
}

export async function fetchProductData(id: string) {
  const cookieStore = cookies();
  const userID = cookieStore.get("userID")?.value;

  try {
    await connectToDB();

    // Declare productData with CombinedProduct | null
    let productData: CombinedProduct | null = null;

    // First, attempt to find the product by ID in the Product schema
    const foundProduct = await Product.findById(id).select(
      "_id productName productPrice productImage productSizes productQuantity productDescription productSpecification storeID productType"
    );

    if (foundProduct) {
      productData = foundProduct.toObject(); // Convert Mongoose Document to plain object
    }

    // If no product is found, attempt to find it in the EBook schema
    if (!productData) {
      const foundEBook = await EBook.findById(id).select(
        "_id title author description price fileType fileSize s3Key coverIMG storeID productType"
      );

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
