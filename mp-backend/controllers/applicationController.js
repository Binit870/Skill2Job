// controllers/applicationController.js
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const studentId = req.user._id;

    // Check if job exists
    const job = await Job.findOne({ _id: jobId, status: "Active" });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or no longer active"
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ jobId, studentId });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    // Get student details
    const student = await User.findById(studentId);

    // Create application
    const application = await Application.create({
      jobId,
      studentId,
      recruiterId: job.recruiter,
      studentName: student.name,
      studentEmail: student.email,
      studentPhone: student.phone || "",
      studentCollege: student.college || "",
      studentBranch: student.branch || "",
      studentGraduationYear: student.graduationYear,
      studentCgpa: student.cgpa,
      studentSkills: student.skills || [],
      resume: student.resume || "",
      status: "pending"
    });

    // Increment applications count on job
    job.applications += 1;
    await job.save();

    res.status(201).json({
      success: true,
      data: application,
      message: "Application submitted successfully"
    });

  } catch (error) {
    console.error("APPLY ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getRecruiterApplications = async (req, res) => {
  try {
    const applications = await Application.find({ recruiterId: req.user._id })
      .populate('jobId', 'title company location')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error("GET APPLICATIONS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};