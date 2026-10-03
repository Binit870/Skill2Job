// middlewares/rateLimiter.js
import rateLimit from "express-rate-limit";

// Shared JSON error shape so rate-limit responses match the rest of the API.
const jsonHandler = (req, res, _next, options) => {
  res.status(options.statusCode).json({
    success: false,
    message: options.message,
  });
};

// ── Auth endpoints ──────────────────────────────────────────────────────
// Brute-force / credential-stuffing protection on login, and abuse
// protection on signup + forgot-password (which sends real emails).
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many attempts. Please try again in a few minutes.",
  handler: jsonHandler,
});

// ── ML-backed endpoints ─────────────────────────────────────────────────
// Resume analysis, mock interviews, and mock assessments all proxy to the
// ML service, which is slow and expensive to run (sentence-transformers
// inference). Without this, one logged-in user hammering these endpoints
// could degrade the ML service for everyone.
export const mlLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: "You've hit the hourly limit for this feature. Please try again later.",
  handler: jsonHandler,
  // Rate-limit per logged-in user rather than per IP where possible, so
  // users behind the same NAT/office network don't share a bucket.
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
});

// ── General API ──────────────────────────────────────────────────────────
// A generous baseline across the whole API to blunt scraping/DoS attempts
// without affecting normal usage.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests. Please slow down.",
  handler: jsonHandler,
});
