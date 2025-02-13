import cloudinary from "cloudinary";
import fs from "fs";
import AppError from "./error.util.js";

// Handles file upload to Cloudinary and updates the specified entity's image information
const handleFileUpload = async (req, entity, propertyName) => {
  // Exit the function if no file is provided
  if (!req.file) return;

  try {
    // Upload the file to Cloudinary with specific transformation options
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "lms", // Cloudinary folder where the file will be stored
      width: 250, // Resize width
      height: 250, // Resize height
      gravity: "faces", // Focus on faces in the image if available
      crop: "fill", // Crop the image to fill the specified dimensions
    });

    if (result) {
      // Update the specified property (avatar/thumbnail) with the Cloudinary response
      entity[propertyName].public_id = result.public_id;
      entity[propertyName].secure_url = result.secure_url;

      // Remove the uploaded file from the local server to save storage
      fs.rm(`uploads/${req.file.filename}`, { force: true }, (err) => {
        if (err) {
          console.error("Error removing file:", err.message);
        }
      });
    }
  } catch (err) {
    // Handle errors and return a custom error message if file upload fails
    throw new AppError(
      err.message || "File not uploaded, please try again",
      500
    );
  }
};

export default handleFileUpload;
