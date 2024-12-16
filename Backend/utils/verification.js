const Tesseract = require('tesseract.js');


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase


/**
 * Extracts text from an image using Tesseract.js
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<string>} - Extracted text from the image
 */
async function extractTextFromImage(imagePath) {
  try {
    const { data } = await Tesseract.recognize(imagePath, 'eng');
    return data.text;
  } catch (error) {
    console.error('Error during OCR with Tesseract.js:', error);
    throw error;
  }
}

/**
 * Sends an OTP using Firebase Authentication
 * @param {string} phoneNumber - The user's phone number in E.164 format
 * @returns {Promise} - A promise that resolves with a confirmation result
 */


module.exports = { extractTextFromImage };
