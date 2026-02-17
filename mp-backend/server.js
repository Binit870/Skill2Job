import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/Db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/profile", profileRoutes);
// Health check route
app.get("/", (req, res) => {
  res.send("Skill2Job API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
