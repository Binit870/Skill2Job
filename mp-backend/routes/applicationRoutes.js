import express from "express";
import {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  checkApplied,
  getRecruiterApplications,
  getJobApplications,
  updateApplicationStatus,
  getApplicationById,
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { uploadResume } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// ── Student routes ────────────────────────────────────────────────────────
router.post("/", protect, authorize("student"), uploadResume, applyForJob);
router.get("/my", protect, authorize("student"), getMyApplications);
router.get("/check/:jobId", protect, authorize("student"), checkApplied);
router.delete("/:id", protect, authorize("student"), withdrawApplication);

// ── Recruiter routes ──────────────────────────────────────────────────────
router.get("/recruiter", protect, authorize("recruiter"), getRecruiterApplications);
router.get("/job/:jobId", protect, authorize("recruiter"), getJobApplications);
router.patch("/:id/status", protect, authorize("recruiter"), updateApplicationStatus);

// ── Shared ────────────────────────────────────────────────────────────────
router.get("/:id", protect, getApplicationById);

export default router;