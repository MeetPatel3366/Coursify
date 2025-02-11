import path from "path";
import multer from "multer";

// Configure multer for file upload settings
const upload = multer({
  // Directory where files will be temporarily stored
  dest: "uploads/",

  // Limit the file size to 50 MB
  limits: { fileSize: 50 * 1024 * 1024 },

  // Storage configuration to specify destination and file naming
  storage: multer.diskStorage({
    // Directory for storing uploaded files
    destination: "uploads/",

    // Preserve the original filename for uploaded files
    filename: (_req, file, cb) => {
      cb(null, file.originalname);
    },
  }),

  // File type validation to accept only specific formats
  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname);

    // Restrict to only specific file types (images and video)
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".webp" &&
      ext !== ".png" &&
      ext !== ".mp4"
    ) {
      cb(new Error(`Unsupported file type! ${ext}`), false); // Reject unsupported file types
    }

    // Accept the file if the type is valid
    cb(null, true);
  },
});

export default upload;
