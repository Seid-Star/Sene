const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
  console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
};

module.exports = connectDB;
