import mongoose, { Schema } from "mongoose";
/*
 *  All monetary values are stored in kobo so as to avoid Floating-Point Errors in JavaScript.
 */
const eBookSchema = new Schema(
  {
    storeID: { type: String, required: true },
    title: { type: String, required: true, index: true },
    author: { type: String, required: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, required: false, index: true },
    price: { type: Number, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    s3Key: { type: String, required: true },
    isbn: { type: String },
    publisher: { type: String },
    language: { type: String },
    coverIMG: { type: [String] },
    rating: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: false },
    productType: {
      type: String,
      enum: ["physicalproducts", "digitalproducts"],
      default: "digitalproducts",
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// Define text index for title or other searchable fields with weights
eBookSchema.index(
  {
    title: "text",
    description: "text",
    author: "text",
    category: "text",
    subcategory: "text",
  },
  {
    weights: {
      title: 10, // Highest weight for title
      description: 5, // Medium weight for description
      author: 8, // High weight for author
      category: 3, // Low weight for category
      subcategory: 1, // Lowest weight for subcategory
    },
    name: "eBookTextIndex", // Optional custom index name
  }
);

const EBook =
  mongoose.models.digitalproducts ||
  mongoose.model("digitalproducts", eBookSchema);

export default EBook;
