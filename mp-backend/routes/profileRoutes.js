import express from "express";
import {
  getProfile,
  updateStudentProfile,
  updateRecruiterProfile,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

import upload from "../middlewares/uploadMiddleware.js";
const router = express.Router();
// Update student profile
router.put(
  "/student",
  protect,
  upload.single("profileImage"),protect,
  updateStudentProfile
);
// Update recruiter profile
router.put(
  "/recruiter",
  protect,
  upload.single("companyLogo"),protect,
  updateRecruiterProfile
);
// Get logged-in user's profile
router.get("/", protect, getProfile);


// router.put("/student", protect, updateStudentProfile);


// router.put("/recruiter", protect, updateRecruiterProfile);

export default router;
