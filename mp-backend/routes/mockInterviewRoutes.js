import express from "express";
import {
  generateQuestions,
  evaluateInterview,
} from "../controllers/mockInterviewController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { mlLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// Previously fully public — anyone could hit these expensive ML-backed
// endpoints without logging in. Now requires auth like every other
// ML-backed feature in the app (resume analysis, assessments), and is
// rate-limited per-user since each call triggers real model inference.
router.post("/generate", protect, mlLimiter, generateQuestions);
router.post("/evaluate", protect, mlLimiter, evaluateInterview);

export default router;
