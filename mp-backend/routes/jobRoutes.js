import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  closeJob,
  getRecruiterJobs
} from "../controllers/jobController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createJob);

// Specific named routes first
router.get("/my", protect, getRecruiterJobs);

// General collection route
router.get("/", protect, getAllJobs);

// Dynamic routes after that
router.get("/:id", protect, getJobById);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

// More specific dynamic route LAST
router.patch("/:id/close", protect, closeJob);

export default router;
