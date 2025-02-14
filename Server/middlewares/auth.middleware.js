import AppError from "../utils/error.util.js";
import jwt from "jsonwebtoken";

// Middleware to check if the user is authenticated
const isLoggedIn = async (req, res, next) => {
  // Extract token from cookies
  const { token } = req.cookies;

  // Check if the token is missing
  if (!token) {
    return next(new AppError("Unauthenticated, please login again", 401));
  }

  // Verify the token and extract user details
  const userDetail = await jwt.verify(token, process.env.JWT_SECRET);

  // Attach user details to the request object for further use
  req.user = userDetail;

  // Proceed to the next middleware or route handler
  next();
};

const authorizedRoles =
  (...roles) =>
  async (req, res, next) => {
    const currentUserRole = req.user.role;

    if (!roles.includes(currentUserRole)) {
      return next(
        new AppError("You do not have permission to access this route", 403)
      );
    }

    next();
  };

export { isLoggedIn, authorizedRoles };
