const mongoose = require("mongoose");
const moment = require("moment");
const getCoordinates = require("./getCoordinates.js"); // Assuming you have this function to get coordinates
const { stringify } = require("uuid");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aadhaar: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{4} \d{4} \d{4}$/, "Aadhaar number must be in the format XXXX XXXX XXXX"],
  },
  pan: {
    type: String,
    required: true,
    unique: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format"],
  },
  dob: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return moment().diff(moment(value), "years") >= 18; // User must be at least 18
      },
      message: "User must be at least 18 years old",
    },
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Phone number must be 10 digits long"],
  },
  adar_phoneno: {
    type: String,
    match: [/^\d{10}$/, "Phone number must be 10 digits long"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format",
    ],
  },
  aadhaarVerified: { type: Boolean, default: false },
  panVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, "Pincode must be a 6-digit number"],
    },
  },
  latitude: { type: Number },  // Added field for latitude
  longitude: { type: Number }, // Added field for longitude
  password: {
    type: String,
    
  },
  secretKey:{
    type:String,
  },
  Amount:{
    type: mongoose.Types.Decimal128,
    default:2000,

  },
  interest_rate:{
    type: mongoose.Types.Decimal128,
  
 }
  
});

// Pre-save hook to set latitude and longitude before saving the user

userSchema.pre("save", async function (next) {
  if (this.isModified("address")) {
    try {
      // Fetch the coordinates based on the user's address
      const coordinates = await getCoordinates({
        street: this.address.street,
        city: this.address.city,
        state: this.address.state,
        pincode: this.address.pincode,
      });

      // Set the latitude and longitude fields
      this.latitude = coordinates.lat;
      this.longitude = coordinates.lon;

      
      // Call next() to proceed with saving the user

      next();
    } catch (error) {
      // Handle any errors, for example, log the error or pass it to the next middleware
      return next(error);
    }
  } else {
    // If the address is not modified, just proceed
    next();
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
