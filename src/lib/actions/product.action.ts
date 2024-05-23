"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Product from "../models/product.model";

interface Product {
  productName: string;
  productPrice: string;
  productSizes: string;
  productQuantity: string;
  productImage: string[];
  productDescription: string;
  productSpecification: string;
  productCategory: string;
  accountId: string;
  path: string;
}

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

export async function fetchProducts() {
  try {
    await connectToDB();

    const products = await Product.find({}).select(
      "_id productName productPrice productImage"
    ); // Fetch all products

    return products;
  } catch (error: any) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
}

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
