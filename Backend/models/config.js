require('dotenv').config({ path: '../.env' });


const mongoURI = process.env.MONGO_URI;
const mongoose = require("mongoose");
const connectDB = async () => {
 
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    // Exit the process with failure
  }
};

module.exports = connectDB;
