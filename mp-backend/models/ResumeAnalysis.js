import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema({
  userId: String,
  atsScore: Number,
  placementProbability: Number,
  missingSkills: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
