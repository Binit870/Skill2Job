import express from "express";
import multer from "multer";
import { protect } from "../middlewares/authMiddleware.js";

import { analyzeResume, getLatest } from "../controllers/resumeController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/analyze",protect, upload.single("resume"), analyzeResume);
router.get("/latest",protect, getLatest);

export default router;
