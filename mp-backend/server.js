import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/Db.js";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import jobfinderRoute from "./routes/jobfinderRoute.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import mockInterviewRoutes from "./routes/mockInterviewRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js"; 

dotenv.config();

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder for Uploads (Resume/Logos)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Routes Registration ---

app.use("/api/auth", authRoutes);           // Login/Register
app.use("/api/jobs", jobRoutes);           // Recruiter: Post/Delete/Update
app.use("/api/find-jobs", jobfinderRoute); // Student: Fetch all jobs ⭐
app.use("/api/applications", applicationRoutes); // Student: Apply to job
app.use("/api/resume", resumeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/mock", mockInterviewRoutes);

// Health check route
app.get("/", (req, res) => {
  res.status(200).send("Skill2Job API is Running Successfully...");
});

// 404 Error Handler (Agar koi route na mile)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);