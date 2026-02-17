import Job from "../models/Job.js";

/* =========================
   CREATE JOB
========================= */
export const createJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can post jobs",
      });
    }

    const job = await Job.create({
      ...req.body,
      recruiter: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET ALL JOBS
========================= */
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Active" })
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("GET JOBS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET SINGLE JOB
========================= */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("GET JOB BY ID ERROR:", error);
    res.status(500).json({ message: error.message });
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
        message: "Job not found",
      });
    }

    // Only the recruiter who created it can update
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this job",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);
    res.status(500).json({ message: error.message });
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
        message: "Job not found",
      });
    }

    // Only the recruiter who created it can delete
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this job",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   CLOSE JOB (Optional)
========================= */
export const closeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    job.status = "Closed";
    await job.save();

    res.status(200).json({
      message: "Job closed successfully",
      job,
    });
  } catch (error) {
    console.error("CLOSE JOB ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
/* =========================
   GET RECRUITER JOBS
========================= */
export const getRecruiterJobs = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const jobs = await Job.find({
      recruiter: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("GET RECRUITER JOBS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
