const axios = require('axios');
require('dotenv').config({ path: '../.env' });
// Use the OpenCage API key directly or via environment variable
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY || '2c6e54fbe99f457da1b69c17337db3f6';  // Fallback to hardcoded key if not in environment variable

async function getCoordinates(address) {
  const baseUrl = 'https://api.opencagedata.com/geocode/v1/json';

  // Construct the address string
  const addressString = `${address.street}, ${address.city}, ${address.state}, ${address.pincode}`;

  try {
    // Make the request to OpenCage API
    const response = await axios.get(baseUrl, {
      params: {
        q: addressString,
        key: OPENCAGE_API_KEY,  // Use the API key here
      },
    });

    // Log the response for debugging
    console.log(response.data);

    if (response.data.results && response.data.results.length > 0) {
      // Extract coordinates from the response
      const location = response.data.results[0].geometry;
      return {
        lat: location.lat,
        lon: location.lng,
      };
    } else {
      throw new Error("No coordinates found for the provided address.");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    throw new Error("Error fetching coordinates: " + error.message);
  }
}

module.exports = getCoordinates;
