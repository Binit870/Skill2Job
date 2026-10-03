import { callMLService } from "../services/mlService.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
// import MockInterview from "../models/MockInterview.js"; // optional

export const generateQuestions = asyncHandler(async (req, res) => {
  const { role, difficulty } = req.body;

  if (!role) throw new AppError("role is required", 400);

  const data = await callMLService("generate", { role, difficulty }, req.user._id);

  res.status(200).json(data);
});

export const evaluateInterview = asyncHandler(async (req, res) => {
  const { role, responses } = req.body;

  if (!role || !responses) {
    throw new AppError("role and responses are required", 400);
  }

  const data = await callMLService("evaluate", { role, responses }, req.user._id);

  // Optional DB save
  /*
  await MockInterview.create({
    user: req.user._id,
    role,
    responses,
    overallScore: data.overall_score,
    results: data.results,
  });
  */

  res.status(200).json(data);
});
