import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: "string", required: true },
  userName: { type: "string", required: true, unique: true },
  name: { type: "string", required: true },
  image: String,
  bio: String,
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
});

const Product =
  mongoose.models.User || mongoose.model("products", productSchema);

export default Product;
