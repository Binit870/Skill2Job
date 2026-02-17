import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import ResumeAnalysis from "../models/ResumeAnalysis.js";

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    const response = await axios.post(
      "http://localhost:8000/analyze",
      formData,
      { headers: formData.getHeaders() }
    );

    const result = response.data;

    // Delete uploaded file after sending to ML
    fs.unlinkSync(req.file.path);

    const saved = await ResumeAnalysis.create({
      userId: req.user.id,
      atsScore: result.ats_score,
      placementProbability: result.placement_probability,
      missingSkills: result.missing_skills || []
    });

    // Return ML result directly
    res.json(saved);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ML service failed" });
  }
};

export const getLatest = async (req, res) => {
  try {
    const latest = await ResumeAnalysis.findOne({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analysis" });
  }
};
