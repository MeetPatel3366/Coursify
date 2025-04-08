import path from "path";
import multer from "multer";

// Configure multer for handling file uploads
const upload = multer({
  // Set maximum file size limit to 50 MB
  limits: { fileSize: 50 * 1024 * 1024 },

  // Use disk storage to save files to the filesystem
  storage: multer.diskStorage({
    // Set the destination folder for uploaded files
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },

    // Generate a unique filename by prepending a timestamp to the original name
    filename: (_req, file, cb) => {
      cb(null, `${Date.now()}.${file.originalname}`);
    },
  }),

  // Filter allowed file types before accepting the upload
  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase(); // Normalize to lowercase

    // Allow only specific image and video file types
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".webp" &&
      ext !== ".png" &&
      ext !== ".mp4"
    ) {
      return cb(new Error(`Unsupported file type! ${ext}`), false); // Reject unsupported file types
    }

    // Accept the file if the extension is valid
    cb(null, true);
  },
});

export default upload;
