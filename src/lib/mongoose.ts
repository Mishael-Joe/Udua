// import mongoose from "mongoose";

// const MONGODB_URL = process.env.MONGODB_URL;

// if (!MONGODB_URL) {
//   throw new Error(
//     "Please define the MONGODB_URL environment variable inside .env.local"
//   );
// }

// // Set strictQuery to true as in your original code
// mongoose.set("strictQuery", true);

// /**
//  * Global is used here to maintain a cached connection across hot reloads
//  * in development. This prevents connections growing exponentially
//  * during API Route usage.
//  */

// // @ts-ignore
// let cached = global.mongoose;

// if (!cached) {
//   // @ts-ignore
//   cached = global.mongoose = { conn: null, promise: null };
// }

// export async function connectToDB() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose.connect(MONGODB_URL!, opts).then((mongoose) => {
//       console.log("Connected to MongoDB");
//       return mongoose;
//     });
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     console.error("Error connecting to MongoDB:", e);
//     throw e;
//   }

//   return cached.conn;
// }

import mongoose from "mongoose";

let isConnected = false; // variable to check connection status;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL NOT FOUND");

  if (isConnected) return console.log("Already connected to MongoDB");

  try {
    await mongoose.connect(process.env.MONGODB_URL);

    isConnected = true;
    console.log("Connected to MongoDB");

    // Rename the collection if necessary
    // const db = mongoose.connection.db;
    // const collectionExists = await db
    //   .listCollections({ name: "ebooks" })
    //   .hasNext();

    // if (collectionExists) {
    //   console.log("Renaming collection 'ebooks' to 'digitalproducts'...");
    //   await db.renameCollection("ebooks", "digitalproducts");
    //   console.log("Collection renamed to 'digitalproducts'");
    // } else {
    //   console.log("'ebooks' collection does not exist, no renaming required.");
    // }
  } catch (error) {
    console.log(error);
  }
};
