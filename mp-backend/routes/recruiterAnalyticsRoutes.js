import express from "express";
import { getOverview } from "../controllers/recruiterAnalyticsController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/overview", protect, authorize("recruiter"), getOverview);

export default router;
