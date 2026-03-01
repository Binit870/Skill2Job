import User from "../models/User.js";

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
      phone,
      college,
      branch,
      graduationYear,
      cgpa,
      skills,
    } = req.body;

    user.phone = phone ?? user.phone;
    user.college = college ?? user.college;
    user.branch = branch ?? user.branch;
    user.graduationYear = graduationYear ?? user.graduationYear;
    user.cgpa = cgpa ?? user.cgpa;
    user.skills = skills ?? user.skills;

    // 🔥 Save uploaded image
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.json({
      message: "Student profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
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

    // 🔥 Save uploaded logo
    if (req.file) {
      user.companyLogo = `/uploads/${req.file.filename}`;
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