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

    user.phone = phone;
    user.college = college;
    user.branch = branch;
    user.graduationYear = graduationYear;
    user.cgpa = cgpa;
    user.skills = skills;

    await user.save();

    res.json({
      message: "Student profile updated successfully",
      user,
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

    user.companyName = companyName;
    user.companyWebsite = companyWebsite;
    user.companyDescription = companyDescription;
    user.industry = industry;
    user.companyLocation = companyLocation;

    await user.save();

    res.json({
      message: "Recruiter profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
