import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model"; // Adjust the model import per your file structure
import EBook from "@/lib/models/digital-product.model";

export async function GET(request: NextRequest) {
  try {
    // Get search parameters from the request URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") as string;
    const category = searchParams.get("category") as string;
    const type = searchParams.get("type") as
      | "physicalproducts"
      | "digitalproducts";

    // Validate that the required parameters are provided
    if (!id || !category || !type) {
      return NextResponse.json(
        { error: "Missing required query parameters: id, category, or type." },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDB();
    let relatedProducts;
    if (type === "physicalproducts") {
      relatedProducts = await Product.find({
        _id: { $ne: id }, // Exclude the product with the matching id.
        category: category,
        productType: type,
      })
        .select("_id name images price productType sizes")
        .limit(12);
    } else if (type === "digitalproducts") {
      relatedProducts = await EBook.find({
        _id: { $ne: id }, // Exclude the product with the matching id.
        category: category,
      })
        .select("_id title coverIMG price productType")
        .limit(12);
    }

    if (!relatedProducts || relatedProducts.length === 0) {
      return NextResponse.json(
        { message: "No related products found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Related products found", relatedProducts },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { error: `Error fetching related products: ${error.message}` },
      { status: 500 }
    );
  }
}
