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
