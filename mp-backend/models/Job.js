// models/Job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
    },
    companyWebsite: {
      type: String,
    },
    companyDescription: {
      type: String,
    },
    companyLogo: {
      type: String,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Remote", "Contract"],
      default: "Full-Time",
    },
    experienceMin: {
      type: Number,
      default: 0,
    },
    experienceMax: {
      type: Number,
    },
    salaryMin: {
      type: Number,
    },
    salaryMax: {
      type: Number,
    },
    vacancies: {
      type: Number,
      default: 1,
    },
    skills: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    deadline: {
      type: Date,
    },
    contact: {
      email: {
        type: String,
        required: [true, "Contact email is required"],
      },
      phone: String,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Closed", "Draft"],
      default: "Active",
    },
    applications: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Text index for search
jobSchema.index({ title: "text", company: "text", description: "text" });

const Job = mongoose.model("Job", jobSchema);
export default Job;