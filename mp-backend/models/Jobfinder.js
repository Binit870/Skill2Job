import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Remote"],
      default: "Full-Time",
    },
    experienceMin: { type: Number, default: 0 },
    experienceMax: { type: Number },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    vacancies: { type: Number, default: 1 },
    skills: [{ type: String }],
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Active", "Closed"],
      default: "Active", // Isse student ko jobs dikhengi
    },
    contact: {
      email: { type: String, required: true },
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// File name ke hisaab se export
export default mongoose.model("Jobfinder", jobSchema);