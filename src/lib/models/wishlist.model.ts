import mongoose, { Schema, Document } from "mongoose";
/*
 *  All monetary values are stored in kobo so as to avoid Floating-Point Errors in JavaScript.
 */
// Interface should reflect the nested structure
export interface IWishlistItem {
  productId: mongoose.Types.ObjectId;
  productType: string;
}

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  products: IWishlistItem[];
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          refPath: "products.productType",
        },
        productType: {
          type: String,
          required: true,
          enum: ["physicalproducts", "digitalproducts"], // Match exact model names
        },
      },
    ],
  },
  { timestamps: true }
);

const Wishlist =
  mongoose.models.Wishlist ||
  mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;

// import mongoose, { Schema, Document } from "mongoose";

// interface IWishlist extends Document {
//   user: mongoose.Schema.Types.ObjectId;
//   products: mongoose.Schema.Types.ObjectId[];
// }

// const wishlistSchema = new Schema<IWishlist>(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       unique: true,
//     },
//     // products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
//     products: [{
//       productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         refPath: 'products.productType' // Dynamic reference
//       },
//       productType: {
//         type: String,
//         required: true,
//         enum: ["physicalproducts", "digitalproducts"] // Match actual model names
//       }
//     }]
//   },
//   { timestamps: true } // Adds createdAt and updatedAt automatically
// );

// const Wishlist =
//   mongoose.models.Wishlist ||
//   mongoose.model<IWishlist>("Wishlist", wishlistSchema);

// export default Wishlist;
