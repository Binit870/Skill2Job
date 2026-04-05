import express from "express";
import {
  generateAssessment,
  submitAssessment,
  getAssessmentHistory,
  getAssessmentById,
} from "../controllers/mockAssessmentController.js";

const router = express.Router();

router.post("/generate",      generateAssessment);
router.post("/submit",        submitAssessment);
router.get("/history",        getAssessmentHistory);
router.get("/history/:id",    getAssessmentById);

export default router;