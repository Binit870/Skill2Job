// middlewares/errorHandler.js
// Centralized error handler. Must be registered LAST in server.js, after
// all routes. Any error passed to next(err) — including ones thrown inside
// asyncHandler-wrapped controllers — ends up here.
//
// Why this exists: previously every controller did
//   res.status(500).json({ message: error.message })
// which leaks raw internal error text (stack traces, DB error strings,
// file paths) straight to the client. This middleware logs the full error
// server-side and only ever sends a safe, generic message to the client
// unless the error was explicitly marked "operational" (via AppError) with
// its own safe message.

const isProd = process.env.NODE_ENV === "production";

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // Always log the full error server-side for debugging.
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  let statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  let message = err.isOperational ? err.message : "Something went wrong. Please try again.";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Mongo duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    message = `That ${field} is already in use`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired, please log in again";
  }

  // Multer file-size/type errors
  if (err.name === "MulterError") {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only ever include stack/detail outside production, and only for
    // genuinely unexpected (non-operational) errors.
    ...(!isProd && !err.isOperational ? { stack: err.stack } : {}),
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
