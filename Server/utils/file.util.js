import cloudinary from "cloudinary";
import fs from "fs";
import AppError from "./error.util.js";

const handleFileUpload = async (req, entity, propertyName, fileType = "image") => {
  if (!req.file) return;

  try {
    // Base upload options
    const uploadOptions = { folder: "lms", resource_type: fileType };

    // Adjust options based on file type
    if (fileType === "image") {
      Object.assign(uploadOptions, {
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill"
      });
    } else if (fileType === "video") {
      Object.assign(uploadOptions, {
        format: "mp4",
        transformation: [
          { width: 720, height: 480, crop: "limit" },
          { quality: "auto" },
          { bit_rate: "800k" }
        ]
      });
    }

    // Upload the file
    const result = await cloudinary.v2.uploader.upload(req.file.path, uploadOptions);

    if (result) {
      // Update entity with upload details
      entity[propertyName] = {
        public_id: result.public_id,
        secure_url: result.secure_url
      };

      // Delete local file
      fs.rm(`uploads/${req.file.filename}`, { force: true }, (err) => {
        if (err) console.error("Failed to delete file:", err.message);
      });
    }
  } catch (err) {
    throw new AppError(err.message || "File upload failed, please try again.", 500);
  }
};

export default handleFileUpload;
