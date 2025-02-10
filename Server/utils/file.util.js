import cloudinary from "cloudinary";
import fs from "fs";
import AppError from "./error.util.js";

const handleFileUpload = async (req, user) => {
  if (!req.file) return;

  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "lms",
      width: 250,
      height: 250,
      gravity: "faces",
      crop: "fill",
    });

    if (result) {
      user.avatar.public_id = result.public_id;
      user.avatar.secure_url = result.secure_url;

      // Remove file from server
      fs.rm(`uploads/${req.file.filename}`, { force: true }, (err) => {
        if (err) {
          console.error("Error removing file:", err.message);
        }
      });
    }
  } catch (err) {
    return next(
      new AppError(err || "File not uploaded, please try again", 500)
    );
  }
};

export default handleFileUpload;
