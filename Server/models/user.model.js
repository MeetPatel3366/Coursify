import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: "String",
      required: [true, "Name is required"],
      minLength: [5, "Name must be atleast 5 character"],
      maxLength: [35, "Name must be less than 25 character"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: "String",
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        "Please fill in a valid email address",
      ],
    },
    password: {
      type: "String",
      required: [true, "Password is required"],
      minLength: [8, "Password must be atleast 8 character"],
      select: false,
    },
    avatar: {
      type: "String",
      public_id: {
        type: "String",
      },
      secure_url: {
        type: "String",
      },
    },
    role: {
      type: "String",
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    forgotPasswordToken: {
      type: "String",
    },
    forgotPasswordExpiry: {
      type: "Date",
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
