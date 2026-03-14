import express from "express";

import {
  analyzeResume,
  getLatest,
  getResume,
  createOrUpdateResume,
  deleteResume
} from "../controllers/resumeController.js";

import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/* TEST ROUTE */
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Resume route working"
  });
});

/* ANALYZE RESUME */
router.post("/analyze", protect, upload.single("resume"), analyzeResume);


router.get("/latest", protect, getLatest);


router.get("/", protect, getResume);


router.post("/create", protect, createOrUpdateResume);


router.delete("/", protect, deleteResume);

export default router;