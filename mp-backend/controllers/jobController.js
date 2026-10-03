// controllers/jobController.js
import Job from "../models/Job.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// Fields a recruiter is allowed to change via updateJob. Anything outside
// this list (e.g. `recruiter`, `status`, `views`, `applications`, `_id`)
// is silently ignored instead of being trusted from the request body.
const UPDATABLE_JOB_FIELDS = [
  "title",
  "company",
  "companyWebsite",
  "companyDescription",
  "companyLogo",
  "location",
  "jobType",
  "experienceMin",
  "experienceMax",
  "salaryMin",
  "salaryMax",
  "vacancies",
  "skills",
  "description",
  "deadline",
  "contact",
];

const pickUpdatableFields = (body) => {
  const update = {};
  for (const key of UPDATABLE_JOB_FIELDS) {
    if (body[key] !== undefined) update[key] = body[key];
  }
  return update;
};

/* =========================
   CREATE JOB
========================= */
export const createJob = asyncHandler(async (req, res) => {
  if (req.user.role !== "recruiter") {
    throw new AppError("Only recruiters can post jobs", 403);
  }

  const recruiter = await User.findById(req.user._id);
  if (!recruiter) throw new AppError("Recruiter not found", 404);

  // Process skills
  let skillsArray = req.body.skills;
  if (typeof req.body.skills === "string") {
    skillsArray = req.body.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const jobData = {
    title: req.body.title,
    company: recruiter.companyName || req.body.company,
    companyWebsite: recruiter.companyWebsite || req.body.companyWebsite,
    companyDescription: recruiter.companyDescription || req.body.companyDescription,
    companyLogo: recruiter.companyLogo || req.body.companyLogo,
    location: req.body.location,
    jobType: req.body.jobType || "Full-Time",
    experienceMin: req.body.experienceMin || 0,
    experienceMax: req.body.experienceMax,
    salaryMin: req.body.salaryMin,
    salaryMax: req.body.salaryMax,
    vacancies: req.body.vacancies || 1,
    skills: skillsArray,
    description: req.body.description,
    deadline: req.body.deadline,
    contact: {
      email: recruiter.email || req.body.contactEmail,
      phone: recruiter.phone || req.body.contactPhone,
    },
    recruiter: recruiter._id,
    status: "Active",
  };

  const job = await Job.create(jobData);

  res.status(201).json({
    success: true,
    data: job,
    message: "Job posted successfully",
  });
});

/* =========================
   GET ALL JOBS
========================= */
export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ status: "Active" })
    .populate("recruiter", "name email companyName companyLogo")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: jobs.length, data: jobs });
});

/* =========================
   GET SINGLE JOB
========================= */
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate(
    "recruiter",
    "name email companyName companyLogo"
  );

  if (!job) throw new AppError("Job not found", 404);

  // Increment views atomically — avoids a lost-update race under concurrent hits
  await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

  res.status(200).json({ success: true, data: job });
});

/* =========================
   GET RECRUITER JOBS
========================= */
export const getRecruiterJobs = asyncHandler(async (req, res) => {
  if (req.user.role !== "recruiter") {
    throw new AppError("Access denied", 403);
  }

  const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: jobs.length, data: jobs });
});

/* =========================
   UPDATE JOB
========================= */
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new AppError("Job not found", 404);

  if (job.recruiter.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to update this job", 403);
  }

  const update = pickUpdatableFields(req.body);

  if (typeof update.skills === "string") {
    update.skills = update.skills.split(",").map((s) => s.trim()).filter(Boolean);
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: updatedJob,
    message: "Job updated successfully",
  });
});

/* =========================
   DELETE JOB
========================= */
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new AppError("Job not found", 404);

  if (job.recruiter.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to delete this job", 403);
  }

  await job.deleteOne();

  res.status(200).json({ success: true, message: "Job deleted successfully" });
});

/* =========================
   CLOSE JOB
========================= */
export const closeJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new AppError("Job not found", 404);

  if (job.recruiter.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized", 403);
  }

  job.status = "Closed";
  await job.save();

  res.status(200).json({ success: true, message: "Job closed successfully", data: job });
});

/* =========================
   REOPEN JOB
========================= */
export const reopenJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new AppError("Job not found", 404);

  if (job.recruiter.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized", 403);
  }

  job.status = "Active";
  await job.save();

  res.status(200).json({ success: true, message: "Job reopened successfully", data: job });
});

/* =========================
   SAVED JOBS  (student)
========================= */
export const getSavedJobs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "savedJobs",
    populate: { path: "recruiter", select: "name email companyName companyLogo" },
  });

  res.status(200).json({ success: true, count: user.savedJobs.length, data: user.savedJobs });
});

export const toggleSaveJob = asyncHandler(async (req, res) => {
  if (req.user.role !== "student") throw new AppError("Only students can save jobs", 403);

  const job = await Job.findById(req.params.id);
  if (!job) throw new AppError("Job not found", 404);

  const user = await User.findById(req.user._id);
  const alreadySaved = user.savedJobs.some((id) => id.toString() === job._id.toString());

  if (alreadySaved) {
    user.savedJobs = user.savedJobs.filter((id) => id.toString() !== job._id.toString());
  } else {
    user.savedJobs.push(job._id);
  }
  await user.save();

  res.status(200).json({ success: true, saved: !alreadySaved });
});
