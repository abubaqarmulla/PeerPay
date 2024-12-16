const mongoose = require("mongoose");

const connectDB = async () => {
 
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/PeerPay');
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    // Exit the process with failure
  }
};

module.exports = connectDB;
