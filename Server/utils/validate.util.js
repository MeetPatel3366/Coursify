import mongoose from "mongoose";

// Utility function to validate ObjectId format
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
