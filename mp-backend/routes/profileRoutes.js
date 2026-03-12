import express from "express";
import {
  getProfile,
  updateStudentProfile,
  updateRecruiterProfile,
} from "../controllers/profileController.js";

import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// ================= STUDENT PROFILE UPDATE =================
router.put(
  "/student",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  updateStudentProfile
);

// ================= RECRUITER PROFILE UPDATE =================
router.put(
  "/recruiter",
  protect,
  upload.single("companyLogo"),
  updateRecruiterProfile
);

// ================= GET PROFILE =================
router.get("/", protect, getProfile);

export default router;