import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import Resume from "../models/Resume.js";

// ==========================================
// 1. ANALYZE RESUME (ML Service Integration)
// ==========================================
export const analyzeResume = async (req, res) => {
  try {
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
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    const saved = await ResumeAnalysis.create({
      userId: req.user.id,
      atsScore: result.ats_score || 0,
      placementProbability: result.placement_probability || 0,
      missingSkills: result.missing_skills || []
    });

    res.json({ success: true, data: saved, analysis: result });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("❌ Analysis Error:", error.message);
    res.status(500).json({ success: false, error: "ML service failed" });
  }
};

// ==========================================
// 2. GET LATEST ANALYSIS
// ==========================================
export const getLatest = async (req, res) => {
  try {
    const latest = await ResumeAnalysis.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    if (!latest) return res.status(404).json({ success: false, error: "No analysis found" });
    res.json({ success: true, data: latest });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch analysis" });
  }
};

// ==========================================
// 3. GET RESUME DATA
// ==========================================
export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) return res.status(404).json({ success: false, message: 'No resume found' });
    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// 4. CREATE OR UPDATE RESUME (FINAL LOGIC)
// ==========================================
export const createOrUpdateResume = async (req, res) => {
  try {
    const { 
      fullName, email, phone, address, summary, github, linkedin, portfolio, 
      education, experience, skillsCategorized, projects, 
      certifications, achievements, languagesKnown, leadership 
    } = req.body;

    // Validation
    if (!fullName?.trim() || !email?.trim()) {
      return res.status(400).json({ success: false, message: 'Name & Email required' });
    }

    const resumeData = {
      userId: req.user.id,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone?.trim() || "",
      address: address?.trim() || "",
      summary: summary?.trim() || "",
      github: github?.trim() || "",
      linkedin: linkedin?.trim() || "",
      portfolio: portfolio?.trim() || "",
      
      // Filter Objects to avoid saving empty entries
      education: Array.isArray(education) ? education.filter(e => e.institution?.trim()) : [],
      experience: Array.isArray(experience) ? experience.filter(exp => exp.company?.trim() || exp.role?.trim()) : [],
      
      skillsCategorized: skillsCategorized || {},
      
      // Fix for Object filtering (p.trim error fixed here)
      projects: Array.isArray(projects) 
        ? projects.filter(p => p.name && p.name.trim() !== "") 
        : [],
      
      certifications: Array.isArray(certifications) 
        ? certifications.filter(c => c.courseName && c.courseName.trim() !== "") 
        : [],
      
      achievements: Array.isArray(achievements) 
        ? achievements.filter(a => a.academic?.trim() || a.project?.trim() || a.technical?.trim() || a.leadership?.trim()) 
        : [],
      
      languagesKnown: Array.isArray(languagesKnown) ? languagesKnown.filter(l => l && l.trim() !== "") : [],
      leadership: Array.isArray(leadership) ? leadership.filter(l => l && l.trim() !== "") : [],
      updatedAt: new Date()
    };

    // returnDocument: 'after' replaces new: true (Mongoose v6+)
    const updatedResume = await Resume.findOneAndUpdate(
      { userId: req.user.id },
      { $set: resumeData },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Resume saved successfully! 🎉', 
      data: updatedResume 
    });

  } catch (error) {
    console.error('❌ Save Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. DELETE RESUME
// ==========================================
export const deleteResume = async (req, res) => {
  try {
    const result = await Resume.findOneAndDelete({ userId: req.user.id });
    if (!result) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};