import  "./config/env.js";
import express from "express";
import cors from "cors";

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

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: [process.env.CLIENT_URL,"http://localhost:5173", "https://skill-2-job.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/mock", mockInterviewRoutes);
app.use("/api/assessment", asessmentRoutes);
// Register application routes
app.use("/api/applications", applicationRoutes);
 
// Serve uploaded files (resumes, profile images, logos) as static assets
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Test route
app.get("/", (req, res) => {
  res.send("Skill2Job API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});