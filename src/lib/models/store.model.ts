import mongoose, { Schema, Document } from "mongoose";

const StoreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    storeOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    storeEmail: { type: String, required: true, unique: true }, // use to contact this store
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Array of Products
    uniqueId: { type: String, unique: true, required: true }, // Unique store link ID
    description: { type: String },
}, { timestamps: true });

const Store = mongoose.models.Store || mongoose.model("Store", StoreSchema);

export default Store;

