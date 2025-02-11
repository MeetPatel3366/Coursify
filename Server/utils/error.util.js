// Custom Error class to handle application-specific errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent class (Error) constructor with the error message

    this.statusCode = statusCode; // Store the status code for error response

    // Capture the current stack trace and associate it with this error instance
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError; // Export the custom error class for use across the application
