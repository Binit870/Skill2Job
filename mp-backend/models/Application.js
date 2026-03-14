// models/Application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
    },
    studentPhone: String,
    studentCollege: String,
    studentBranch: String,
    studentGraduationYear: Number,
    studentCgpa: Number,
    studentSkills: [String],
    resume: {
      type: String,
      default: "",
    },
    coverLetter: String,
    status: {
      type: String,
      enum: ["pending", "reviewed", "shortlisted", "rejected", "hired"],
      default: "pending",
    },
    recruiterNotes: String,
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ensure one student can apply only once per job
applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;