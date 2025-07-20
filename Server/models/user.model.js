import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Define the schema for the User model
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"], // Name is mandatory
      minLength: [5, "Name must be at least 5 characters"], // Minimum length validation
      maxLength: [35, "Name must be less than 25 characters"], // Maximum length validation
      lowercase: true, // Store in lowercase
      trim: true, // Remove extra spaces
    },
    email: {
      type: String,
      required: [true, "Email is required"], // Email is mandatory
      lowercase: true,
      trim: true,
      unique: true, // Ensure unique emails
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, // Regex to validate email format
        "Please fill in a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"], // Password is mandatory
      minLength: [8, "Password must be at least 8 characters"], // Minimum length validation
      select: false, // Do not return password by default in queries
    },
    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"], // Restrict to defined roles
      default: "USER",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    subscription: {
      id: String,
      status: String,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Middleware to hash the password before saving it
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Skip if the password field is not modified
  }
  this.password = await bcrypt.hash(this.password, 10); // Hash the password with salt factor 10
});

// Instance methods for the User schema
userSchema.methods = {
  // Generate JWT token for authentication
  generateJWTToken: async function () {
    return await jwt.sign(
      {
        id: this._id,
        email: this.email,
        subscription: this.subscription,
        role: this.role,
      },
      process.env.JWT_SECRET, // Use the secret from environment variables
      { expiresIn: process.env.JWT_EXPIRY } // Set the token expiry from environment variables
    );
  },

  // Compare input password with hashed password
  comparePassword: async function (plainTextPassword) {
    return await bcrypt.compare(plainTextPassword, this.password);
  },

  // Generate a password reset token
  generatePasswordResetToken: async function () {
    // Generate a random token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash the token and set expiry for 15 minutes from now
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;

    return resetToken; // Return the plain token to send to the user
  },
};

// Create the User model using the schema
const User = model("User", userSchema);

export default User;
