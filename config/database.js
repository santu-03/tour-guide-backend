import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URL || process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URL (or MONGO_URI) is missing");

    await mongoose.connect(uri, { autoIndex: true });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
