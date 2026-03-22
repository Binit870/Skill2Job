import express from "express";
import fetch from "node-fetch";
import User from "../models/User.js";
import {
  getProfile,
  updateStudentProfile,
  updateRecruiterProfile,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { v2 as cloudinary } from "cloudinary";
const router = express.Router();

// ================= STUDENT PROFILE UPDATE =================
router.put(
  "/student",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateStudentProfile
);

// ================= RECRUITER PROFILE UPDATE =================
router.put(
  "/recruiter",
  protect,
  upload.fields([{ name: "companyLogo", maxCount: 1 }]),
  updateRecruiterProfile
);

// ================= GET PROFILE =================
router.get("/", protect, getProfile);

// ================= PROXY RESUME =================


router.get("/resume", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user?.resume)
      return res.status(404).json({ message: "No resume found" });

    const response = await fetch(user.resume);
    if (!response.ok)
      return res.status(response.status).json({ message: `Cloudinary returned ${response.status}` });

    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Resume proxy error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;