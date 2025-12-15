import mongoose from "mongoose";

/* Database Connection */
const db_connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection error", error);
  }
};

export default db_connection;
