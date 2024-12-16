import mongoose, { Schema, Document } from "mongoose";

const eBookSchema = new Schema({
  storeID: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: false },
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
    enum: ["Physical Product", "Digital Product"],
    default: "Digital Product",
    required: true,
  },
});

const EBook = mongoose.models.EBook || mongoose.model("EBook", eBookSchema);

export default EBook;
