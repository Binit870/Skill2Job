import express from "express";
import {
  generateQuestions,
  submitAssessment
} from "../controllers/assessmentController.js";

const router = express.Router();

router.post("/generate", generateQuestions);

router.post("/submit", submitAssessment);

export default router;