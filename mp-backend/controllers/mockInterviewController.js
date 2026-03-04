import { callMLService } from "../services/mlService.js";
// import MockInterview from "../models/MockInterview.js"; // optional

export const generateQuestions = async (req, res) => {
  try {
    const { role, difficulty } = req.body;

    const data = await callMLService("generate", {
      role,
      difficulty,
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate questions" });
  }
};

export const evaluateInterview = async (req, res) => {
  try {
    const { role, responses } = req.body;

    const data = await callMLService("evaluate", {
      role,
      responses,
    });

    // Optional DB save
    /*
    await MockInterview.create({
      role,
      responses,
      overallScore: data.overall_score,
      results: data.results,
    });
    */

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to evaluate interview" });
  }
};