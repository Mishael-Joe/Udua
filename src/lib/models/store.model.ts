import mongoose, { Schema, Document } from "mongoose";

// Define Payout Account schema
const PayoutAccountSchema = new Schema(
  {
    payoutMethod: {
      type: String,
      enum: ["Bank Transfer"],
      required: true,
    },
    bankDetails: {
      bankName: {
        type: String,
        validate: {
          validator: function (this: any) {
            // If payout method is 'bank transfer', bankName is required
            return (
              this.payoutMethod !== "bank transfer" ||
              !!this.bankDetails.bankName
            );
          },
          message: "Bank name is required for bank transfer",
        },
      },
      accountNumber: {
        type: String,
        validate: {
          validator: function (this: any) {
            // If payout method is 'bank transfer', accountNumber is required
            return (
              this.payoutMethod !== "bank transfer" ||
              !!this.bankDetails.accountNumber
            );
          },
          message: "Account number is required for bank transfer",
        },
      },
      accountHolderName: {
        type: String,
        validate: {
          validator: function (this: any) {
            // If payout method is 'bank transfer', accountHolderName is required
            return (
              this.payoutMethod !== "bank transfer" ||
              !!this.bankDetails.accountHolderName
            );
          },
          message: "Account holder name is required for bank transfer",
        },
      },
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    lastPayoutDate: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
); // no need for separate _id for payout account

// Define Store schema with embedded payout accounts and payout history
const StoreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    storeOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storeEmail: { type: String, required: true, unique: true }, // use to contact this store
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Array of Products
    uniqueId: { type: String, unique: true, required: true }, // Unique store link ID
    description: { type: String },
    forgotpasswordToken: String,
    forgotpasswordTokenExpiry: Date,
    availableBalance: {
      type: Number,
      default: 0,
    },
    pendingBalance: {
      type: Number,
      default: 0,
    },
    platformFee: {
      type: Number,
      default: 0,
    },
    transactionFees: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    }, // TODO: update this model in the DB

    // Payout accounts associated with the store
    payoutAccounts: [PayoutAccountSchema],

    // Array of payout history entries
    // TODO: Add orderID associated with a payoutHistory
    payoutHistory: [
      {
        payoutAccount: {
          type: String,
          required: true, // either bank transfer or mobile wallet
        },
        amount: {
          type: Number,
          required: true,
        },
        payoutDate: {
          type: Date,
          default: Date.now, // timestamp for when the payout occurred
        },
        payoutMethodDetails: {
          bankDetails: {
            bankName: String,
            accountNumber: String,
          },
          mobileWallet: {
            walletProvider: String,
            walletId: String,
          },
        },
        status: {
          type: String,
          enum: ["pending", "completed", "failed"],
          default: "pending",
        },
        transactionFees: {
          type: Number,
          default: 0,
        },
        platformFee: {
          type: Number,
          default: 0,
        },
        taxes: {
          type: Number,
          default: 0,
        },
      },
    ], // Stores individual payout transactions
  },
  { timestamps: true }
);

const Store = mongoose.models.Store || mongoose.model("Store", StoreSchema);

export default Store;
