import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import handleFileUpload from "../utils/file.util.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";

// Cookie configuration options
const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true, // Prevents client-side script access
  secure: true, // Ensures cookies are only sent over HTTPS
};

/*
 -> Handles user registration by creating a new user.
 -> Validates required fields, checks for existing email, and handles optional file upload.
*/
const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if required fields are provided
    if (!fullName || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return next(new AppError("Email already exists", 400));
    }

    // Create a new user with default avatar
    const user = await User.create({
      fullName,
      email,
      password,
      avatar: {
        public_id: email,
        secure_url:
          "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg",
      },
    });

    if (!user) {
      return next(
        new AppError("User registration failed, please try again", 400)
      );
    }

    // Handle optional file upload for avatar
    if (req.file) {
      await handleFileUpload(req, user, "avatar");
    }

    await user.save();

    // Remove password from the response
    user.password = undefined;

    // Generate JWT token
    const token = await user.generateJWTToken();

    // Set cookie with token
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

/*
 -> Handles user login by validating credentials and generating JWT token.
*/
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if required fields are provided
    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    // Find user by email and include password for validation
    const user = await User.findOne({ email }).select("+password");

    // Validate user existence and password
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Email or Password does not match", 400));
    }

    // Generate JWT token
    const token = await user.generateJWTToken();

    // Remove password from the response
    user.password = undefined;

    // Set cookie with token
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

/*
 -> Handles user logout by clearing the authentication cookie.
*/
const logout = (req, res) => {
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

/*
 -> Fetches the profile details of the logged-in user.
*/
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Remove password from the response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "User details",
      user,
    });
  } catch (err) {
    return next(new AppError("Fail to fetch profile detail", 500));
  }
};

/*
 -> Sends a password reset link to the user's email.
*/
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("Email not registered", 400));
  }

  const resetToken = await user.generatePasswordResetToken();

  await user.save();

  const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `<p>You can reset your password by clicking the following link:</p><a href="${resetPasswordURL}" target="_blank">Reset your password</a><p>If the above link does not work for some reason, copy and paste this link in a new tab:</p><p>${resetPasswordURL}</p><p>If you have not requested this, kindly ignore this email.</p>`;

  const subject = "Reset Password";
  try {
    await sendEmail(email, subject, message);

    res.status(200).json({
      success: true,
      message: `Reset Password token has been sent to ${email} successfully`,
    });
  } catch (err) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();
    return next(new AppError(err.message, 500));
  }
};

/*
 -> Resets the user's password using the reset token.
*/
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    if (!password) {
      return next(new AppError("Password is required", 400));
    }

    const forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      forgotPasswordToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new AppError("Token is invalid or expired, please try again", 400)
      );
    }

    // Update the password and clear the reset token
    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

/*
 -> Changes the user's password after validating the old password.
*/
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;

    if (!oldPassword || !newPassword) {
      return next(new AppError("All fields are required", 400));
    }

    const user = await User.findById(id).select("+password");

    if (!user) {
      return next(new AppError("User does not exist", 400));
    }

    // Validate the old password
    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
      return next(new AppError("Invalid old password", 400));
    }

    // Update the password
    user.password = newPassword;

    await user.save();

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

/*
 -> Updates user profile details including optional avatar upload.
*/
const updateUser = async (req, res, next) => {
  try {
    const { fullName } = req.body;
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("User does not exist", 400));
    }

    if (fullName) {
      user.fullName = fullName;
    }

    if (req.file) {
      // Delete the old avatar from Cloudinary
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      // Upload the new avatar
      await handleFileUpload(req, user, "avatar");
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User details updated successfully",
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

export {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser,
};
