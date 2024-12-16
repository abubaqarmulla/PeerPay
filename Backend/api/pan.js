const User = require('../models/userSchema');
const { extractTextFromImage } = require('../utils/verification');
const fs = require('fs').promises; // Use promise-based API for fs


async function verifyPAN(req, res) {
  let filePath;

  try {
    const { userId } = req.body;

    // Input validation
    if (!userId) {
      return res.status(400).json({ message: "Missing userId or PAN number" });
    }

    // Check if user exists and Aadhaar is verified
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const panNumber = user.pan;

    if (!user.aadhaarVerified) {
      return res.status(400).json({ message: "Please verify Aadhaar first" });
    }

    if (user.panVerified) {
      return res.status(400).json({ message: "PAN already verified" });
    }

    // Validate file upload
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "PAN image file is required" });
    }

    filePath = req.file.path; // Save the file path to clean up later

    // Extract text from uploaded PAN image
    const extractedText = await extractTextFromImage(filePath);
    console.log("Extracted Text:", extractedText);

    // Normalize PAN number for comparison
    const normalizedPan = panNumber.trim().toUpperCase();
    const extractedNormalizedText = extractedText.replace(/\s+/g, '').toUpperCase();

    // Use regex to find PAN in the extracted text
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]/;
    const matchedPAN = extractedNormalizedText.match(panRegex);

    if (!matchedPAN || matchedPAN[0] !== normalizedPan) {
      return res.status(400).json({ message: "PAN number not found or mismatched" });
    }

    // Update user record
    user.panVerified = true;
    await user.save();

    res.json({
      message: "PAN verified successfully",
    });

  } catch (error) {
    console.error("PAN verification error:", error);
    console.error("Stack trace:", error.stack);  // Log stack trace for better debugging
    res.status(500).json({ message: "Error during PAN verification" });
  } finally {
    // Clean up uploaded file if it exists
    if (filePath) {
      try {
        await fs.unlink(filePath);
        console.log(`File ${filePath} deleted successfully.`);
      } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      }
    }
  }
}

module.exports = verifyPAN;
