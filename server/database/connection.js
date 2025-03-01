import mongoose from "mongoose";

async function connect() {
  try {
    // Connection URI for local MongoDB
    const uri = "mongodb://localhost:27017/login_app";

    // Set Mongoose options
    mongoose.set("strictQuery", true);

    // Connect to the local MongoDB instance
    const db = await mongoose.connect(uri);

    console.log("Connected to MongoDB at localhost:27017, Database: login_app");
    return db;
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1); 
  }
}

export default connect;
