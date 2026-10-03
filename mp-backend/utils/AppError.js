// utils/AppError.js
// Use this for any error you want to surface to the client with a specific
// status code and a message that is safe to show publicly, e.g.:
//   throw new AppError("Job not found", 404);
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes "expected" errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
