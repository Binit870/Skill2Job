import User from "../models/User.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ================= GET PROFILE =================
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) throw new AppError("User not found", 404);

  res.json(user);
});

// ================= UPDATE STUDENT PROFILE =================
export const updateStudentProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user || user.role !== "student") {
    throw new AppError("Access denied", 403);
  }

  const {
    name,
    email,
    phone,
    college,
    branch,
    graduationYear,
    cgpa,
    skills,
  } = req.body;

  if (email !== undefined && email !== user.email) {
    if (!EMAIL_REGEX.test(email)) {
      throw new AppError("Please provide a valid email address", 400);
    }
    const emailTaken = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
    if (emailTaken) throw new AppError("That email is already in use", 409);
    user.email = email.toLowerCase();
  }

  user.name = name ?? user.name;
  user.phone = phone ?? user.phone;
  user.college = college ?? user.college;
  user.branch = branch ?? user.branch;
  user.graduationYear = graduationYear ?? user.graduationYear;
  user.cgpa = cgpa ?? user.cgpa;

  if (skills) {
    user.skills = Array.isArray(skills) ? skills : [skills];
  }

  // Upload profile image to Cloudinary
  if (req.files?.profileImage) {
    const result = await uploadToCloudinary(req.files.profileImage[0].buffer, "student_profiles");
    user.profileImage = result.secure_url;
  }

  if (req.files?.resume) {
    const resumeFile = req.files.resume[0];
    if (!resumeFile.originalname.toLowerCase().endsWith(".pdf")) {
      throw new AppError("Only PDF resumes allowed", 400);
    }
    const fileExt = resumeFile.originalname.split(".").pop();

    const result = await uploadToCloudinary(resumeFile.buffer, "student_resumes", fileExt);
    user.resume = result.secure_url;
  }

  await user.save();

  const updatedUser = await User.findById(user._id).select("-password");

  res.json({
    success: true,
    message: "Student profile updated successfully",
    user: updatedUser,
  });
});

// ================= UPDATE RECRUITER PROFILE =================
export const updateRecruiterProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user || user.role !== "recruiter") {
    throw new AppError("Access denied", 403);
  }

  const {
    companyName,
    companyWebsite,
    companyDescription,
    industry,
    companyLocation,
  } = req.body;

  user.companyName = companyName ?? user.companyName;
  user.companyWebsite = companyWebsite ?? user.companyWebsite;
  user.companyDescription = companyDescription ?? user.companyDescription;
  user.industry = industry ?? user.industry;
  user.companyLocation = companyLocation ?? user.companyLocation;

  if (req.files?.companyLogo) {
    const result = await uploadToCloudinary(req.files.companyLogo[0].buffer, "recruiter_logos");
    user.companyLogo = result.secure_url;
  }

  await user.save();

  const updatedUser = await User.findById(user._id).select("-password");

  res.json({
    success: true,
    message: "Recruiter profile updated successfully",
    user: updatedUser,
  });
});
