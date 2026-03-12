import User from "../models/User.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
// ================= GET PROFILE =================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE STUDENT PROFILE =================
export const updateStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
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

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;
    user.college = college ?? user.college;
    user.branch = branch ?? user.branch;
    user.graduationYear = graduationYear ?? user.graduationYear;
    user.cgpa = cgpa ?? user.cgpa;

    if (skills) {
      user.skills = Array.isArray(skills) ? skills : [skills];
    }

    // 🔥 Upload to Cloudinary
    // 🔥 Upload profile image
if (req.files?.profileImage) {
  const result = await uploadToCloudinary(
    req.files.profileImage[0].buffer,
    "student_profiles"
  );

  user.profileImage = result.secure_url;
}
    if (req.files?.resume) {

  const resumeFile = req.files.resume[0];
if (!resumeFile.originalname.toLowerCase().endsWith(".pdf")) {
    return res.status(400).json({
      message: "Only PDF resumes allowed"
    });
  }
  const fileExt = resumeFile.originalname.split(".").pop();

  const result = await uploadToCloudinary(
    resumeFile.buffer,
    "student_resumes",
    fileExt
  );

  user.resume = result.secure_url;
}
    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.json({
      message: "Student profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE RECRUITER PROFILE =================
export const updateRecruiterProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== "recruiter") {
      return res.status(403).json({ message: "Access denied" });
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
    user.companyDescription =
      companyDescription ?? user.companyDescription;
    user.industry = industry ?? user.industry;
    user.companyLocation =
      companyLocation ?? user.companyLocation;

    // 🔥 Cloudinary Logo
    if (req.file) {
      user.companyLogo = req.file.path;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.json({
      message: "Recruiter profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};