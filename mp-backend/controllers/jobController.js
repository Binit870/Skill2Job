// controllers/jobController.js
import Job from "../models/Job.js";
import User from "../models/User.js";

/* =========================
   CREATE JOB
========================= */
export const createJob = async (req, res) => {
  try {
    console.log("Creating job - User:", req.user?._id);

    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can post jobs",
      });
    }

    // Fetch recruiter from DB
    const recruiter = await User.findById(req.user._id);

    if (!recruiter) {
      return res.status(404).json({ 
        success: false,
        message: "Recruiter not found" 
      });
    }

    // Process skills
    let skillsArray = req.body.skills;
    if (typeof req.body.skills === 'string') {
      skillsArray = req.body.skills.split(',').map(s => s.trim()).filter(s => s);
    }

    const jobData = {
      title: req.body.title,
      company: recruiter.companyName || req.body.company,
      companyWebsite: recruiter.companyWebsite || req.body.companyWebsite,
      companyDescription: recruiter.companyDescription || req.body.companyDescription,
      companyLogo: recruiter.companyLogo || req.body.companyLogo,
      location: req.body.location,
      jobType: req.body.jobType || 'Full-Time',
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
        phone: recruiter.phone || req.body.contactPhone
      },
      recruiter: recruiter._id,
      status: 'Active'
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      data: job,
      message: "Job posted successfully"
    });

  } catch (error) {
    console.error("CREATE JOB ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/* =========================
   GET ALL JOBS
========================= */
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Active" })
      .populate('recruiter', 'name email companyName companyLogo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error("GET JOBS ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/* =========================
   GET SINGLE JOB
========================= */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('recruiter', 'name email companyName companyLogo');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error("GET JOB BY ID ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/* =========================
   GET RECRUITER JOBS
========================= */
export const getRecruiterJobs = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const jobs = await Job.find({
      recruiter: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error("GET RECRUITER JOBS ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/* =========================
   UPDATE JOB
========================= */
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this job",
      });
    }

    if (req.body.skills && typeof req.body.skills === 'string') {
      req.body.skills = req.body.skills.split(',').map(s => s.trim());
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedJob,
      message: "Job updated successfully"
    });
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/* =========================
   DELETE JOB
========================= */
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this job",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/* =========================
   CLOSE JOB
========================= */
export const closeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    job.status = "Closed";
    await job.save();

    res.status(200).json({
      success: true,
      message: "Job closed successfully",
      data: job,
    });
  } catch (error) {
    console.error("CLOSE JOB ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};