import express from "express";
import {
  generateAssessment,
  submitAssessment,
  getAssessmentHistory,
  getAssessmentById,
} from "../controllers/mockAssessmentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { mlLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// All assessment routes require login. Previously these were fully public,
// which allowed unauthenticated users to hit the expensive ML-backed
// generate/submit endpoints for free, and meant getAssessmentHistory had no
// user to scope results to (it returned every user's history — see the
// `user` field added to the AssessmentResult model).
router.post("/generate", protect, mlLimiter, generateAssessment);
router.post("/submit", protect, mlLimiter, submitAssessment);
router.get("/history", protect, getAssessmentHistory);
router.get("/history/:id", protect, getAssessmentById);

export default router;
