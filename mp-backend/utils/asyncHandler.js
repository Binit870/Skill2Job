// utils/asyncHandler.js
// Wraps an async Express route handler so any thrown/rejected error is
// forwarded to next(), which routes it into the centralized error handler
// (middlewares/errorHandler.js) instead of needing a try/catch in every
// single controller function.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
