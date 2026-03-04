import express from "express";
import {
  generateQuestions,
  evaluateInterview,
} from "../controllers/mockInterviewController.js";

const router = express.Router();

router.post("/generate", generateQuestions);
router.post("/evaluate", evaluateInterview);

export default router;