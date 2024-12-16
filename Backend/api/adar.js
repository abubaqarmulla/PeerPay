const fs = require('fs');
const User = require('../models/userSchema');
const { extractTextFromImage } = require('../utils/verification');

async function verifyAadhaar(req, res) {
  let filePath = null;
  try {
    const { userId } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Find user and validate
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Check if already verified
    if (user.aadhaarVerified) {
      return res.status(401).json({ 
        success: false,
        message: "Aadhaar already verified" 
      });
    }

    // Validate file upload
    if (!req.file || !req.file.path) {
      return res.status(400).json({ 
        success: false,
        message: "Aadhaar image file is required" ,
        
      });
    }

    filePath = req.file.path;

    console.log(filePath);
    // Extract text from Aadhaar image
    const extractedText = await extractTextFromImage(filePath);
    if (!extractedText) {
      return res.status(400).json({ 
        success: false,
        message: "Failed to extract text from image" 
      });
    }

    console.log('Extracted text:', extractedText);
    // Verification logic
    const verificationResults = {
      aadhaarMatch: false,
      phoneMatch: false
    };

    // Aadhaar number verification
    const aadhaarRegex = new RegExp(user.aadhaar.replace(/\s/g, ''), 'g');
    const cleanedExtractedText = extractedText.replace(/\s/g, '');

    console.log('Extracted text:', cleanedExtractedText);
    
    if (aadhaarRegex.test(cleanedExtractedText)) {
      verificationResults.aadhaarMatch = true;
    }

    // Phone number verification
    const phoneRegex = new RegExp(user.phone, 'g');
    if (phoneRegex.test(cleanedExtractedText)) {
      verificationResults.phoneMatch = true;
    }

    // Comprehensive verification check
    if (!verificationResults.aadhaarMatch || !verificationResults.phoneMatch) {
      return res.status(400).json({
        success: false,
        message: "Verification failed",
        details: {
          aadhaarMatch: verificationResults.aadhaarMatch,
          phoneMatch: verificationResults.phoneMatch
        }
      });
    }

    // Update user verification status
    user.aadhaarVerified = true;
    user.phoneVerified = true;
    user.aadhaarVerificationDate = new Date();
    await user.save();

    // Successful verification response
    return res.json({
      success: true,
      message: "Aadhaar verification successful",
      data: {
        aadhaarVerified: true,
        phoneVerified: true,
        verificationDate: user.aadhaarVerificationDate
      }
    });

  } catch (error) {
    console.error('Aadhaar verification error:', error);
    
    return res.status(500).json({
      success: false,
      message: "Error during Aadhaar verification",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    // Clean up uploaded file
    if (filePath) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filePath}:`, err);
        }
      });
    }
  }
}

module.exports = verifyAadhaar;