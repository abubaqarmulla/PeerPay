const User = require('../models/userSchema');
const { extractTextFromImage, sendOTP } = require('../utils/verification');
const mongoose = require('mongoose');

async  function registerUser(req, res) {
    try {
      const {
        name,
        aadhaar,
        pan,
        dob,
        phone,
        email,
        address
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ aadhaar }, { pan }, { email }]
      });

      if (existingUser) {
        return res.status(400).json({
          message: "User already exists with given Aadhaar, PAN, or email"
        });
      }

      // Create new user
      const newUser = new User({
        name,
        aadhaar,
        pan,
        dob,
        phone,
        email,
        address
      });

      await newUser.save();
      res.status(201).json({
        message: "User registered successfully",
        userId: newUser._id
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error during registration" });
    }
  }


const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;  // Getting user id from the route parameter

    // Fetch the user from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

const getUsersByAmount = async (req, res) => {
  try {
    const { amount } = req.query;  // Amount passed as query parameter

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    // Fetch users whose Amount is greater than the provided amount
    const users = await User.find({
      Amount: { $gt: mongoose.Types.Decimal128.fromString(amount) },
      _id: { $ne: userId }
    });

    if (users.length === 0) {
      return res.json({ message: "No users found with specified amount" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users by amount" });
  }
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

// Function to get users within a specified distance
const getUsersByDistance = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from request parameters
    const { distance } = req.query; // Extract distance from query parameters

    if (!id || !distance) {
      return res.status(400).json({ message: "User ID and distance are required" });
    }

    // Fetch the user details for the provided ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { latitude, longitude } = user;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "User location details are missing" });
    }

    // Fetch all users
    const users = await User.find({_id: { $ne: userId }});

    // Filter users who are within the specified distance
    const nearbyUsers = users.filter((otherUser) => {
      if (!otherUser.latitude || !otherUser.longitude) return false;
      const userDistance = haversineDistance(latitude, longitude, otherUser.latitude, otherUser.longitude);
      return userDistance <= parseFloat(distance);
    });

    if (nearbyUsers.length === 0) {
      return res.status(404).json({ message: "No users found within the specified distance" });
    }

    res.status(200).json(nearbyUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users by distance" });
  }
};


const getallUser = async (req, res) => {
  try {
     // Getting user id from the route parameter

    // Fetch the user from the database
    const users = await User.find();

    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user" });
  }
};




  

module.exports = {registerUser, getUserById, getUsersByAmount, getUsersByDistance,getallUser};