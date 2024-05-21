import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  accountId: { type: String, required: true },
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productSizes: { type: [String], required: true },
  productQuantity: { type: Number, required: true, default: 0 },
  productImage: { type: [String], default: [] },
  productDescription: { type: String, required: true },
  productSpecification: { type: String, required: true },
  productCategory: { type: [String], required: true },
  owner: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
