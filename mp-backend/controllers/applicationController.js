import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

/* ═══════════════════════════════════════════════════════════
   APPLY FOR A JOB  (student)
   - Pulls full profile as snapshot
   - Supports profile resume OR newly uploaded file
═══════════════════════════════════════════════════════════ */
export const applyForJob = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can apply for jobs" });
    }

    const { jobId, coverLetter, phone, portfolioUrl, useProfileResume } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: "jobId is required" });
    }

    const [job, student] = await Promise.all([
      Job.findById(jobId),
      User.findById(req.user._id),
    ]);

    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    if (job.status !== "Active") {
      return res.status(400).json({ success: false, message: "This job is no longer accepting applications" });
    }

    // Duplicate check (also enforced by unique index)
    const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existing) {
      return res.status(409).json({ success: false, message: "You have already applied for this job" });
    }

    // ── Build resume field ──────────────────────────────────────────────
    let resumeData = null;

    if (req.file) {
      // Fresh file uploaded — store relative server path
      resumeData = {
        url: `/uploads/resumes/${req.file.filename}`,
        originalName: req.file.originalname,
        source: "uploaded",
      };
    } else if (useProfileResume === "true" && student.resume) {
      // Use whatever URL is already on the profile
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

    res.status(201).json({
      success: true,
      data: application,
      message: "Application submitted successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "You have already applied for this job" });
    }
    console.error("APPLY ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════
   GET MY APPLICATIONS  (student)
═══════════════════════════════════════════════════════════ */
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title company companyLogo location jobType salaryMin salaryMax deadline status")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    console.error("GET MY APPLICATIONS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════
   WITHDRAW APPLICATION  (student)
   - Blocked for Shortlisted / Hired
═══════════════════════════════════════════════════════════ */
export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    if (["Shortlisted", "Hired"].includes(application.status)) {
      return res.status(400).json({ success: false, message: "Cannot withdraw a shortlisted or hired application" });
    }

    await application.deleteOne();
    await Job.findByIdAndUpdate(application.job, { $inc: { applications: -1 } });

    res.status(200).json({ success: true, message: "Application withdrawn successfully" });
  } catch (error) {
    console.error("WITHDRAW ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════
   CHECK IF ALREADY APPLIED  (student)
═══════════════════════════════════════════════════════════ */
export const checkApplied = async (req, res) => {
  try {
    const application = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });
    res.status(200).json({ success: true, applied: !!application, data: application || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════
   GET ALL APPLICATIONS ACROSS RECRUITER'S JOBS  (recruiter)
═══════════════════════════════════════════════════════════ */
export const getRecruiterApplications = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

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
  } catch (error) {
    console.error("GET RECRUITER APPLICATIONS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════
   GET APPLICATIONS FOR A SPECIFIC JOB  (recruiter)
═══════════════════════════════════════════════════════════ */
export const getJobApplications = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
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
  } catch (error) {
    console.error("GET JOB APPLICATIONS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════
   UPDATE APPLICATION STATUS + NOTE  (recruiter)
═══════════════════════════════════════════════════════════ */
export const updateApplicationStatus = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { status, recruiterNote } = req.body;
    const validStatuses = ["Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    if (application.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this application" });
    }

    application.status = status;
    if (recruiterNote !== undefined) application.recruiterNote = recruiterNote;
    await application.save();

    res.status(200).json({ success: true, data: application, message: `Status updated to ${status}` });
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════
   GET SINGLE APPLICATION  (student who applied OR recruiter)
═══════════════════════════════════════════════════════════ */
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("applicant", "name email profileImage phone skills college branch graduationYear cgpa")
      .populate("job", "title company companyLogo location jobType salaryMin salaryMax");

    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    const isApplicant = application.applicant._id.toString() === req.user._id.toString();
    const isRecruiter = application.recruiter.toString() === req.user._id.toString();
    if (!isApplicant && !isRecruiter) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error("GET APPLICATION ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};