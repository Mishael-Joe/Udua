import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
// import cloudinary from "@/lib/cloudinaryConfig";
import { v2 as cloudinary } from "cloudinary";

const extractPublicId = (url: string): string => {
  const regex =
    /upload\/(?:v\d+\/)?(?:[^\/]+\/)*([^\.]+)\.(?:jpg|jpeg|png|gif|bmp|tiff|webp)/;
  const match = url.match(regex);
  return match ? match[1] : "";
};

export async function DELETE(request: NextRequest) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    await connectToDB();
    const sellerId = await getUserDataFromToken(request);

    if (!sellerId) {
      return NextResponse.json(
        { error: "Seller ID is required" },
        { status: 400 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findOne({
      _id: productId,
      accountId: sellerId.toString(),
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found or not authorized" },
        { status: 404 }
      );
    }

    // Delete product images from Cloudinary
    for (const imageUrl of product.productImage) {
      const publicId = extractPublicId(imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { invalidate: true });
      }
    }

    // Now delete the product from the database
    await Product.deleteOne({
      _id: productId,
      accountId: sellerId.toString(),
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error deleting product: ${error.message}` },
      { status: 500 }
    );
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { connectToDB } from "@/lib/mongoose";
// import Product from "@/lib/models/product.model";
// import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";

// export async function DELETE(request: NextRequest) {
//   try {
//     await connectToDB();
//     const sellerId = await getUserDataFromToken(request);

//     if (!sellerId) {
//       return NextResponse.json(
//         { error: "Seller ID is required" },
//         { status: 400 }
//       );
//     }

//     const { productId } = await request.json();

//     if (!productId) {
//       return NextResponse.json(
//         { error: "Product ID is required" },
//         { status: 400 }
//       );
//     }

//     const product = await Product.findOneAndDelete({
//       _id: productId,
//       accountId: sellerId.toString(),
//     });

//     if (!product) {
//       return NextResponse.json(
//         { error: "Product not found or not authorized" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Product deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: `Error deleting product: ${error.message}` },
//       { status: 500 }
//     );
//   }
// }
