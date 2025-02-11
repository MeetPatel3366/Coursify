import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  getProfile,
  login,
  logout,
  register,
  resetPassword,
  updateUser,
} from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

// Route for user registration with avatar upload
router.post("/register", upload.single("avatar"), register);

// Route for user login
router.post("/login", login);

// Route to log out the user and clear authentication token
router.get("/logout", logout);

// Route to get logged-in user profile details
router.get("/me", isLoggedIn, getProfile);

// Route to request a password reset token
router.post("/forgot-password", forgotPassword);

// Route to reset the password using a valid reset token
router.post("/reset-password/:resetToken", resetPassword);

// Route to change the current password after authentication
router.post("/change-password", isLoggedIn, changePassword);

// Route to update user details, including avatar upload
router.put("/update", isLoggedIn, upload.single("avatar"), updateUser);

export default router;
