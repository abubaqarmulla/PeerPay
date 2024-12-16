const bcrypt = require('bcrypt');
const User = require('../models/userSchema'); 
const crypto = require('crypto')// Assuming User model path

// Password setting route with bcrypt
async function setPassword(req, res) {
    try {
        const { userId, password } = req.body;

        // Validate password (8 digits)
        const passwordPattern = /^\d{8}$/;
        if (!passwordPattern.test(password)) {
            return res.status(400).json({
                message: "Password must be exactly 8 digits"
            });
        }

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check verification status
        if (!user.aadhaarVerified || !user.panVerified || !user.phoneVerified) {
            return res.status(400).json({ message: "Please verify Aadhaar, PAN, and phone number first" });
        }

        // Hash password with bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const secretKey = crypto.randomBytes(16).toString('hex');

        // Hash the secret key
        const hashedSecretKey = await bcrypt.hash(secretKey, saltRounds);

        // Set hashed password
        user.password = hashedPassword;
        user.secretKey = hashedSecretKey;
        await user.save();

        res.status(200).json({ message: "Password set successfully and successfully secret key generated",secretKey:secretKey });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

// Login route
async function loginUser(req, res) {
    try {
        const { userId, password } = req.body;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Optional: Generate JWT token for authentication
        // const token = generateJWTToken(user);

        res.status(200).json({ 
            message: "Login successful",
            // token: token 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login error" });
    }
}

module.exports = {
    setPassword,
    loginUser
};