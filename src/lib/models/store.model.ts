import mongoose, { Schema, Document } from "mongoose";

// Define Shipping Method schema
const ShippingMethodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedDeliveryDays: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
    // For international shipping or region-specific rates
    applicableRegions: [
      {
        type: String,
      },
    ],
    // For weight-based or price-based shipping rates
    conditions: {
      minOrderValue: { type: Number },
      maxOrderValue: { type: Number },
      minWeight: { type: Number },
      maxWeight: { type: Number },
    },
  },
  { _id: false }
);

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
              this.payoutMethod !== "Bank Transfer" ||
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
              this.payoutMethod !== "Bank Transfer" ||
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
              this.payoutMethod !== "Bank Transfer" ||
              !!this.bankDetails.accountHolderName
            );
          },
          message: "Account holder name is required for bank transfer",
        },
      },
      bankCode: { type: Number, required: true },
      bankId: Number,
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
    physicalProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "physicalproducts" },
    ], // Array of Products for stores that deals with physical products
    digitalProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "digitalproducts" },
    ], // Array of E-books for stores that deals with digital products like e-books
    uniqueId: { type: String, unique: true, required: true }, // Unique store link ID
    recipientCode: { type: String }, // Recommended by PayStack. visit @ `https://paystack.com/docs/transfers/creating-transfer-recipients/#save-the-recipient-code` for more details.
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
    },
    // Add shipping methods
    shippingMethods: [ShippingMethodSchema],
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

const Store = mongoose.models.stores || mongoose.model("stores", StoreSchema);

export default Store;

// import mongoose, { Schema, Document } from "mongoose";

// // Define Payout Account schema
// const PayoutAccountSchema = new Schema(
//   {
//     payoutMethod: {
//       type: String,
//       enum: ["Bank Transfer"],
//       required: true,
//     },
//     bankDetails: {
//       bankName: {
//         type: String,
//         validate: {
//           validator: function (this: any) {
//             // If payout method is 'bank transfer', bankName is required
//             return (
//               this.payoutMethod !== "Bank Transfer" ||
//               !!this.bankDetails.bankName
//             );
//           },
//           message: "Bank name is required for bank transfer",
//         },
//       },
//       accountNumber: {
//         type: String,
//         validate: {
//           validator: function (this: any) {
//             // If payout method is 'bank transfer', accountNumber is required
//             return (
//               this.payoutMethod !== "Bank Transfer" ||
//               !!this.bankDetails.accountNumber
//             );
//           },
//           message: "Account number is required for bank transfer",
//         },
//       },
//       accountHolderName: {
//         type: String,
//         validate: {
//           validator: function (this: any) {
//             // If payout method is 'bank transfer', accountHolderName is required
//             return (
//               this.payoutMethod !== "Bank Transfer" ||
//               !!this.bankDetails.accountHolderName
//             );
//           },
//           message: "Account holder name is required for bank transfer",
//         },
//       },
//     },
//     totalEarnings: {
//       type: Number,
//       default: 0,
//     },
//     lastPayoutDate: {
//       type: Date,
//       default: null,
//     },
//   },
//   { _id: false }
// ); // no need for separate _id for payout account

// // Define Store schema with embedded payout accounts and payout history
// const StoreSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     password: { type: String, required: true },
//     storeOwner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     storeEmail: { type: String, required: true, unique: true }, // use to contact this store
//     physicalProducts: [
//       { type: mongoose.Schema.Types.ObjectId, ref: "physicalproducts" },
//     ], // Array of Products for stores that deals with physical products
//     digitalProducts: [
//       { type: mongoose.Schema.Types.ObjectId, ref: "digitalproducts" },
//     ], // Array of E-books for stores that deals with digital products like e-books
//     uniqueId: { type: String, unique: true, required: true }, // Unique store link ID
//     description: { type: String },
//     forgotpasswordToken: String,
//     forgotpasswordTokenExpiry: Date,
//     availableBalance: {
//       type: Number,
//       default: 0,
//     },
//     pendingBalance: {
//       type: Number,
//       default: 0,
//     },
//     platformFee: {
//       type: Number,
//       default: 0,
//     },
//     transactionFees: {
//       type: Number,
//       default: 0,
//     },
//     totalEarnings: {
//       type: Number,
//       default: 0,
//     }, // TODO: update this model in the DB

//     // Payout accounts associated with the store
//     payoutAccounts: [PayoutAccountSchema],

//     // Array of payout history entries
//     // TODO: Add orderID associated with a payoutHistory
//     payoutHistory: [
//       {
//         payoutAccount: {
//           type: String,
//           required: true, // either bank transfer or mobile wallet
//         },
//         amount: {
//           type: Number,
//           required: true,
//         },
//         payoutDate: {
//           type: Date,
//           default: Date.now, // timestamp for when the payout occurred
//         },
//         payoutMethodDetails: {
//           bankDetails: {
//             bankName: String,
//             accountNumber: String,
//           },
//           mobileWallet: {
//             walletProvider: String,
//             walletId: String,
//           },
//         },
//         status: {
//           type: String,
//           enum: ["pending", "completed", "failed"],
//           default: "pending",
//         },
//         transactionFees: {
//           type: Number,
//           default: 0,
//         },
//         platformFee: {
//           type: Number,
//           default: 0,
//         },
//         taxes: {
//           type: Number,
//           default: 0,
//         },
//       },
//     ], // Stores individual payout transactions
//   },
//   { timestamps: true }
// );

// const Store = mongoose.models.stores || mongoose.model("stores", StoreSchema);

// export default Store;
