import mongoose, { Schema } from "mongoose";
/*
 *  All monetary values are stored in kobo so as to avoid Floating-Point Errors in JavaScript.
 */
// Settlement Schema
const settlementSchema = new Schema(
  {
    storeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "stores",
      required: true,
    },
    mainOrderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    subOrderID: {
      type: String, // SubOrder ID or index within the main order (could be a string or identifier)
      required: true, // Required to identify the specific sub-order
    },
    settlementAmount: {
      type: Number,
      required: true,
      min: [0, "Settlement amount must be positive"], // Ensure settlement amount is positive
    },
    payoutAccount: {
      type: new Schema({
        // payoutMethod: String,
        bankName: { type: String, required: true }, // Ensure all fields are required
        accountNumber: { type: String, required: true },
        accountHolderName: { type: String, required: true },
        bankCode: { type: Number, required: true },
        bankId: Number,
      }),
      required: true,
    },
    payoutStatus: {
      type: String,
      enum: ["Requested", "Processing", "Paid", "Failed"],
      default: "Requested",
    },
  },
  { timestamps: true }
);

const Settlement =
  mongoose.models.Settlement || mongoose.model("Settlement", settlementSchema);

export default Settlement;
