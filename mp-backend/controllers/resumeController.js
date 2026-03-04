import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import Resume from "../models/Resume.js";

// ============= PDF ANALYSIS =============
export const analyzeResume = async (req, res) => {
  try {
    console.log("📥 Resume analysis started for user:", req.user.id);
    console.log("📁 File received:", req.file?.originalname);

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    const response = await axios.post(
      "http://localhost:8000/analyze",
      formData,
      { headers: formData.getHeaders(), timeout: 30000 }
    );

    const result = response.data;
    fs.unlinkSync(req.file.path);

    const saved = await ResumeAnalysis.create({
      userId: req.user.id,
      atsScore: result.ats_score || 0,
      placementProbability: result.placement_probability || 0,
      missingSkills: result.missing_skills || []
    });

    res.json({ success: true, data: saved, analysis: result });
  } catch (error) {
    console.error("❌ ML service failed:", error.message);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, error: "ML service failed" });
  }
};

export const getLatest = async (req, res) => {
  try {
    const latest = await ResumeAnalysis.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    if (!latest) return res.status(404).json({ success: false, error: "No analysis found" });
    res.json({ success: true, data: latest });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch analysis" });
  }
};

// ============= RESUME BUILDER =============
export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) return res.status(404).json({ success: false, message: 'No resume found' });
    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    console.error('❌ Get Resume Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createOrUpdateResume = async (req, res) => {
  try {
    console.log("📥 Received resume data for user:", req.user.id);
    const { fullName, email, phone, address, summary, github, linkedin, portfolio, education, experience, skills, projects, achievements, leadership } = req.body;

    if (!fullName?.trim() || !email?.trim()) {
      return res.status(400).json({ success: false, message: 'Name & Email required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    const resumeData = {
      userId: req.user.id,
      fullName: fullName?.trim() || "",
      email: email?.trim() || "",
      phone: phone?.trim() || "",
      address: address?.trim() || "",
      summary: summary?.trim() || "",
      github: github?.trim() || "",
      linkedin: linkedin?.trim() || "",
      portfolio: portfolio?.trim() || "",
      education: Array.isArray(education) ? education.filter(e => e.institution?.trim()) : [],
      experience: Array.isArray(experience) ? experience.filter(e => e?.trim()) : [],
      skills: Array.isArray(skills) ? skills.filter(s => s?.trim()) : [],
      projects: Array.isArray(projects) ? projects.filter(p => p?.trim()) : [],
      achievements: Array.isArray(achievements) ? achievements.filter(a => a?.trim()) : [],
      leadership: Array.isArray(leadership) ? leadership.filter(l => l?.trim()) : [],
      updatedAt: new Date()
    };

    let resume = await Resume.findOne({ userId: req.user.id });
    if (resume) {
      resume = await Resume.findOneAndUpdate({ userId: req.user.id }, resumeData, { new: true });
      return res.status(200).json({ success: true, message: 'Resume updated successfully! 🎉', data: resume });
    } else {
      resumeData.createdAt = new Date();
      resume = new Resume(resumeData);
      await resume.save();
      return res.status(201).json({ success: true, message: 'Resume created successfully! 🎉', data: resume });
    }
  } catch (error) {
    console.error('❌ Create/Update Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const result = await Resume.findOneAndDelete({ userId: req.user.id });
    if (!result) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('❌ Delete Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};