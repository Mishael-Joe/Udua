import mongoose, { Schema, Document } from "mongoose";

// In your settlement schema or payout history
const settlementSchema = new Schema(
  {
    storeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    orderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    settlementAmount: { type: Number, required: true },
    payoutAccount: {
      type: new Schema({
        // payoutMethod: String,
        bankName: String,
        accountNumber: String,
        accountHolderName: String,
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
