import axios from "axios";
import FormData from "form-data";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import Resume from "../models/Resume.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// ==========================================
// 1. ANALYZE RESUME (ML Service Integration)
// ==========================================

export const analyzeResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("No file uploaded", 400);

  const formData = new FormData();
  formData.append("file", req.file.buffer, {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
  });

  let response;
  try {
    response = await axios.post(`${process.env.ML_SERVICE_URL}/analyze`, formData, {
      headers: {
        ...formData.getHeaders(),
        // Shared secret so the ML service only accepts calls from this
        // backend, not from anyone who finds its public URL directly.
        "X-Internal-Api-Key": process.env.ML_INTERNAL_API_KEY,
        // Lets the ML service's rate limiter key on the actual end user.
        "X-User-Id": req.user.id.toString(),
      },
      timeout: 30000,
    });
  } catch (err) {
    console.error("ML service /analyze failed:", err.message);
    throw new AppError("Resume analysis service is currently unavailable. Please try again shortly.", 502);
  }

  const result = response.data;

  const saved = await ResumeAnalysis.create({
    userId: req.user.id,
    atsScore: result.ats_score || 0,
    placementProbability: result.placement_probability || 0,
    missingSkills: result.missing_skills || [],
  });

  res.json({
    success: true,
    data: saved,
    analysis: {
      ...result,
      missing_skills_detail: result.missing_skills_detail || [],
    },
  });
});

// ==========================================
// 2. GET LATEST ANALYSIS
// ==========================================

export const getLatest = asyncHandler(async (req, res) => {
  const latest = await ResumeAnalysis.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
  if (!latest) throw new AppError("No analysis found", 404);
  res.json({ success: true, data: latest });
});

// ==========================================
// 3. GET RESUME DATA
// ==========================================

export const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ userId: req.user.id });
  if (!resume) throw new AppError("No resume found", 404);
  res.status(200).json({ success: true, data: resume });
});

// ==========================================
// 4. CREATE OR UPDATE RESUME
// ==========================================

export const createOrUpdateResume = asyncHandler(async (req, res) => {
  const {
    fullName, email, phone, address, summary, github, linkedin, portfolio,
    education, experience, skillsCategorized, projects,
    certifications, achievements, languagesKnown, leadership,
  } = req.body;

  if (!fullName?.trim() || !email?.trim()) {
    throw new AppError("Name & Email required", 400);
  }

  const resumeData = {
    userId: req.user.id,
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone?.trim() || "",
    address: address?.trim() || "",
    summary: summary?.trim() || "",
    github: github?.trim() || "",
    linkedin: linkedin?.trim() || "",
    portfolio: portfolio?.trim() || "",

    education: Array.isArray(education) ? education.filter((e) => e.institution?.trim()) : [],
    experience: Array.isArray(experience)
      ? experience.filter((exp) => exp.company?.trim() || exp.role?.trim())
      : [],

    skillsCategorized: skillsCategorized || {},

    projects: Array.isArray(projects) ? projects.filter((p) => p.name && p.name.trim() !== "") : [],

    certifications: Array.isArray(certifications)
      ? certifications.filter((c) => c.courseName && c.courseName.trim() !== "")
      : [],

    achievements: Array.isArray(achievements)
      ? achievements.filter(
          (a) => a.academic?.trim() || a.project?.trim() || a.technical?.trim() || a.leadership?.trim()
        )
      : [],

    languagesKnown: Array.isArray(languagesKnown) ? languagesKnown.filter((l) => l && l.trim() !== "") : [],
    leadership: Array.isArray(leadership) ? leadership.filter((l) => l && l.trim() !== "") : [],
    updatedAt: new Date(),
  };

  const updatedResume = await Resume.findOneAndUpdate(
    { userId: req.user.id },
    { $set: resumeData },
    { returnDocument: "after", upsert: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Resume saved successfully",
    data: updatedResume,
  });
});

// ==========================================
// 5. DELETE RESUME
// ==========================================

export const deleteResume = asyncHandler(async (req, res) => {
  const result = await Resume.findOneAndDelete({ userId: req.user.id });
  if (!result) throw new AppError("Resume not found", 404);
  res.status(200).json({ success: true, message: "Resume deleted successfully" });
});

export const getHistory = asyncHandler(async (req, res) => {
  const history = await ResumeAnalysis.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(10);
  res.json({ success: true, data: history });
});
