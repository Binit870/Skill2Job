import express from "express";
import { signup, login, getMe, forgotPassword, resetPassword } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// Rate limited to blunt brute-force login attempts and signup/email abuse
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password/:token", authLimiter, resetPassword);
// ── Protected: returns full profile of logged-in user ──
// Used by ApplyModal to pre-fill the application form
router.get("/me", protect, getMe);

export default router;