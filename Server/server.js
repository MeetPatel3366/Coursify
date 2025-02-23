import app from "./app.js";
import connectionToDB from "./config/dbConnection.js";
import cloudinary from "cloudinary";
import Razorpay from "razorpay";

const PORT = process.env.PORT || 5000;

// Cloudinary configuration for secure image storage
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize Razorpay instance with API credentials
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Start the server and establish a connection to the database
app.listen(PORT, async () => {
  await connectionToDB(); // Initialize the database connection
  console.log(`App is running at http:localhost:${PORT}`);
});
