// controllers/applicationController.js
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import Notification from "../models/Notification.js";
import { sendApplicationStatusEmail, sendNewApplicationEmail } from "../utils/sendEmail.js";

/* ═══════════════════════════════════════════════════════════
   APPLY FOR A JOB  (student)
   - Pulls full profile as snapshot
   - Supports profile resume OR newly uploaded file
═══════════════════════════════════════════════════════════ */
export const applyForJob = asyncHandler(async (req, res) => {
  if (req.user.role !== "student") {
    throw new AppError("Only students can apply for jobs", 403);
  }

  const { jobId, coverLetter, phone, portfolioUrl, useProfileResume } = req.body;

  if (!jobId) throw new AppError("jobId is required", 400);

  const [job, student] = await Promise.all([
    Job.findById(jobId),
    User.findById(req.user._id),
  ]);

  if (!job) throw new AppError("Job not found", 404);
  if (!student) throw new AppError("Student not found", 404);
  if (job.status !== "Active") {
    throw new AppError("This job is no longer accepting applications", 400);
  }

  // Duplicate check (also enforced by unique index)
  const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
  if (existing) {
    throw new AppError("You have already applied for this job", 409);
  }

  // ── Build resume field ──────────────────────────────────────────────
  // NOTE: uploadResume (middlewares/uploadMiddleware.js) uses multer's
  // memoryStorage, so req.file only ever has a `.buffer` — never a
  // `.filename` or `.path`. The previous version of this code referenced
  // req.file.filename, which was always undefined, silently breaking every
  // "upload a new resume with this application" submission. Fixed by
  // uploading the buffer to Cloudinary, exactly like resumes are handled
  // everywhere else in the app (see profileController.js).
  let resumeData = null;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "application_resumes", "pdf");
    resumeData = {
      url: result.secure_url,
      originalName: req.file.originalname,
      source: "uploaded",
    };
  } else if (useProfileResume === "true" && student.resume) {
    resumeData = {
      url: student.resume,
      originalName: "Profile Resume",
      source: "profile",
    };
  }

  const application = await Application.create({
    job: jobId,
    applicant: req.user._id,
    recruiter: job.recruiter,

    // Snapshot of profile at submission time
    applicantSnapshot: {
      name: student.name,
      email: student.email,
      phone: student.phone,
      college: student.college,
      branch: student.branch,
      graduationYear: student.graduationYear,
      cgpa: student.cgpa,
      skills: student.skills,
      profileImage: student.profileImage,
    },

    // Editable fields from the apply modal
    phone: phone || student.phone || "",
    portfolioUrl: portfolioUrl || "",
    coverLetter: coverLetter || "",
    resume: resumeData,
  });

  // Increment applications counter on the job
  await Job.findByIdAndUpdate(jobId, { $inc: { applications: 1 } });

  // Notify + email the recruiter (fire-and-forget — never blocks the
  // response, and sendEmail already fails soft on its own).
  Notification.create({
    user: job.recruiter,
    type: "application_submitted",
    title: "New application received",
    message: `${student.name} applied for ${job.title}`,
    link: "/recruiter/candidates-applications",
    relatedJob: job._id,
    relatedApplication: application._id,
  }).catch((err) => console.error("Failed to create notification:", err.message));

  User.findById(job.recruiter).then((recruiter) => {
    if (!recruiter) return;
    sendNewApplicationEmail({
      to: recruiter.email,
      recruiterName: recruiter.name,
      applicantName: student.name,
      jobTitle: job.title,
    });
  }).catch((err) => console.error("Failed to load recruiter for email:", err.message));

  res.status(201).json({
    success: true,
    data: application,
    message: "Application submitted successfully",
  });
});

/* ═══════════════════════════════════════════════════════════
   GET MY APPLICATIONS  (student)
═══════════════════════════════════════════════════════════ */
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate("job", "title company companyLogo location jobType salaryMin salaryMax deadline status")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: applications.length, data: applications });
});

/* ═══════════════════════════════════════════════════════════
   WITHDRAW APPLICATION  (student)
   - Blocked for Shortlisted / Hired
═══════════════════════════════════════════════════════════ */
export const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) throw new AppError("Application not found", 404);

  if (application.applicant.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized", 403);
  }
  if (["Shortlisted", "Hired"].includes(application.status)) {
    throw new AppError("Cannot withdraw a shortlisted or hired application", 400);
  }

  await application.deleteOne();
  await Job.findByIdAndUpdate(application.job, { $inc: { applications: -1 } });

  res.status(200).json({ success: true, message: "Application withdrawn successfully" });
});

/* ═══════════════════════════════════════════════════════════
   CHECK IF ALREADY APPLIED  (student)
═══════════════════════════════════════════════════════════ */
export const checkApplied = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    job: req.params.jobId,
    applicant: req.user._id,
  });
  res.status(200).json({ success: true, applied: !!application, data: application || null });
});

/* ═══════════════════════════════════════════════════════════
   GET ALL APPLICATIONS ACROSS RECRUITER'S JOBS  (recruiter)
═══════════════════════════════════════════════════════════ */
export const getRecruiterApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== "recruiter") throw new AppError("Access denied", 403);

  const { status } = req.query;
  const query = { recruiter: req.user._id };
  if (status && status !== "All") query.status = status;

  const applications = await Application.find(query)
    .populate("applicant", "name email profileImage phone skills college branch graduationYear cgpa")
    .populate("job", "title company companyLogo location jobType")
    .sort({ createdAt: -1 });

  // Build per-status counts in one aggregation
  const counts = await Application.aggregate([
    { $match: { recruiter: req.user._id } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const statusCounts = { All: applications.length };
  counts.forEach((c) => { statusCounts[c._id] = c.count; });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
    statusCounts,
  });
});

/* ═══════════════════════════════════════════════════════════
   GET APPLICATIONS FOR A SPECIFIC JOB  (recruiter)
═══════════════════════════════════════════════════════════ */
export const getJobApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== "recruiter") throw new AppError("Access denied", 403);

  const job = await Job.findById(req.params.jobId);
  if (!job) throw new AppError("Job not found", 404);
  if (job.recruiter.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized", 403);
  }

  const { status } = req.query;
  const query = { job: req.params.jobId };
  if (status && status !== "All") query.status = status;

  const applications = await Application.find(query)
    .populate("applicant", "name email profileImage phone skills college branch graduationYear cgpa")
    .sort({ createdAt: -1 });

  // Mark all as seen
  await Application.updateMany(
    { job: req.params.jobId, seenByRecruiter: false },
    { seenByRecruiter: true }
  );

  res.status(200).json({ success: true, count: applications.length, data: applications });
});

/* ═══════════════════════════════════════════════════════════
   UPDATE APPLICATION STATUS + NOTE  (recruiter)
═══════════════════════════════════════════════════════════ */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== "recruiter") throw new AppError("Access denied", 403);

  const { status, recruiterNote } = req.body;
  const validStatuses = ["Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"];
  if (!validStatuses.includes(status)) {
    throw new AppError("Invalid status value", 400);
  }

  const application = await Application.findById(req.params.id);
  if (!application) throw new AppError("Application not found", 404);
  if (application.recruiter.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to update this application", 403);
  }

  const statusChanged = application.status !== status;

  application.status = status;
  if (recruiterNote !== undefined) application.recruiterNote = recruiterNote;
  if (status === "Hired" && !application.hiredAt) {
    application.hiredAt = new Date();
  }
  await application.save();

  // Notify + email the student, but only when the status actually changed
  // (avoids spamming them if a recruiter re-saves the same status with a
  // new note).
  if (statusChanged) {
    const [job, student] = await Promise.all([
      Job.findById(application.job),
      User.findById(application.applicant),
    ]);

    if (job && student) {
      Notification.create({
        user: student._id,
        type: "application_status",
        title: "Application status updated",
        message: `Your application for ${job.title} is now "${status}"`,
        link: "/student/my-applications",
        relatedJob: job._id,
        relatedApplication: application._id,
      }).catch((err) => console.error("Failed to create notification:", err.message));

      sendApplicationStatusEmail({
        to: student.email,
        studentName: student.name,
        jobTitle: job.title,
        company: job.company,
        status,
      });
    }
  }

  res.status(200).json({ success: true, data: application, message: `Status updated to ${status}` });
});

/* ═══════════════════════════════════════════════════════════
   GET SINGLE APPLICATION  (student who applied OR recruiter)
═══════════════════════════════════════════════════════════ */
export const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate("applicant", "name email profileImage phone skills college branch graduationYear cgpa")
    .populate("job", "title company companyLogo location jobType salaryMin salaryMax");

  if (!application) throw new AppError("Application not found", 404);

  const isApplicant = application.applicant._id.toString() === req.user._id.toString();
  const isRecruiter = application.recruiter.toString() === req.user._id.toString();
  if (!isApplicant && !isRecruiter) {
    throw new AppError("Not authorized", 403);
  }

  res.status(200).json({ success: true, data: application });
});
