import express from "express";
import { signup, login, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login",  login);

// ── Protected: returns full profile of logged-in user ──
// Used by ApplyModal to pre-fill the application form
router.get("/me", protect, getMe);

export default router;