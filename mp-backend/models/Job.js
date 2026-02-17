import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    company: { type: String, required: true },

    companyWebsite: String,
    companyDescription: String,

    location: { type: String, required: true },

    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Remote"],
      default: "Full-Time",
    },

    experienceMin: {
      type: Number,
      default: 0,
    },

    experienceMax: {
      type: Number,
    },

    salaryMin: Number,
    salaryMax: Number,

    vacancies: {
      type: Number,
      default: 1,
    },

    skills: [String],

    description: {
      type: String,
      required: true,
    },

    deadline: Date,

    status: {
      type: String,
      enum: ["Active", "Closed"],
      default: "Active",
    },

    contact: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
