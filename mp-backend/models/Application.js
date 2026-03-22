import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Snapshot of student profile at submission time ──────────────────
    applicantSnapshot: {
      name:           { type: String },
      email:          { type: String },
      phone:          { type: String },
      college:        { type: String },
      branch:         { type: String },
      graduationYear: { type: Number },
      cgpa:           { type: Number },
      skills:         [{ type: String }],
      profileImage:   { type: String },
    },

    // ── Application-specific fields (student can edit before submit) ────
    phone:        { type: String,  default: "" },
    portfolioUrl: { type: String,  default: "" },
    coverLetter:  { type: String,  default: "" },

    // ── Resume: local file path or profile URL ──────────────────────────
    resume: {
      url:          { type: String },           // /uploads/resumes/filename or profile URL
      originalName: { type: String },
      source:       { type: String, enum: ["profile", "uploaded"], default: "profile" },
    },

    // ── Recruiter-managed fields ────────────────────────────────────────
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"],
      default: "Pending",
    },
    recruiterNote:   { type: String,  default: "" },
    seenByRecruiter: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One application per student per job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;