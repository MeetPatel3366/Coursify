// Error handling middleware for the application
const errorMiddleware = (err, req, res, next) => {
  // Set default status code to 500 (Internal Server Error) if not provided
  err.statusCode = err.statusCode || 500;

  // Set a default error message if not provided
  err.message = err.message || "Something went wrong!";

  // Send the error response as a JSON object
  res.status(err.statusCode).json({
    success: false, // Indicates that the operation failed
    message: err.message, // Error message
    stack: err.stack, // Stack trace for debugging (optional, may be hidden in production)
  });
};

export default errorMiddleware;
