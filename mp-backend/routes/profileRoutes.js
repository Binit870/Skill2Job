import express from "express";
import {
  getProfile,
  updateStudentProfile,
  updateRecruiterProfile,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get logged-in user's profile
router.get("/", protect, getProfile);

// Update student profile
router.put("/student", protect, updateStudentProfile);

// Update recruiter profile
router.put("/recruiter", protect, updateRecruiterProfile);

export default router;
