import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import connectDB from "./config/Db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import mockInterviewRoutes from "./routes/mockInterviewRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import applicationRoutes from "./routes/applicationRoutes.js";
import asessmentRoutes from "./routes/mockAssessmentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import recruiterAnalyticsRoutes from "./routes/recruiterAnalyticsRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

const app = express();

// Connect Database
connectDB();

// Security headers. crossOriginResourcePolicy is relaxed to "cross-origin"
// so /uploads/* (images, logos) can still be loaded by the frontend, which
// runs on a different origin.
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Gzip all responses
app.use(compression());

// Middleware
// .filter(Boolean) drops CLIENT_URL when it's unset in a given environment,
// instead of passing `undefined` into the allowed-origins array.
app.use(cors({
  origin: [process.env.CLIENT_URL, "http://localhost:5173", "https://skill-2-job.vercel.app"].filter(Boolean),
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10mb" }));

// Baseline rate limit across the whole API, blunt scraping/DoS attempts.
// Tighter limits (auth, ML endpoints) are applied per-route on top of this.
app.use("/api", apiLimiter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/mock", mockInterviewRoutes);
app.use("/api/assessment", asessmentRoutes);
// Register application routes
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/recruiter/analytics", recruiterAnalyticsRoutes);

// Serve uploaded files (resumes, profile images, logos) as static assets
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Test route
app.get("/", (req, res) => {
  res.send("Skill2Career API Running...");
});

// 404 handler — must come after all real routes
app.use(notFound);

// Centralized error handler — must be the LAST app.use(). Any error thrown
// inside an asyncHandler-wrapped controller ends up here instead of each
// controller leaking raw error.message to the client individually.
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});