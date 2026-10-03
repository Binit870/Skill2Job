import { callMLService } from "../services/mlService.js";
import AssessmentResult from "../models/AssessmentResult.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

/**
 * POST /api/assessment/generate
 * Body: { topic, num_questions?, time_per_question?, tf_ratio? }
 */
export const generateAssessment = asyncHandler(async (req, res) => {
  const {
    topic,
    num_questions = 10,
    time_per_question = 30,
    tf_ratio = 0.3,
  } = req.body;

  if (!topic) throw new AppError("topic is required", 400);

  const data = await callMLService("assessment/generate", {
    topic,
    num_questions,
    time_per_question,
    tf_ratio,
  }, req.user._id);

  res.status(200).json(data);
});

/**
 * POST /api/assessment/submit
 * Body: {
 *   topic,
 *   responses: [{ question, type, selected_option, correct_answer, explanation, time_taken, timed_out }],
 *   total_time_taken: number   ← overall session timer value in seconds
 * }
 */
export const submitAssessment = asyncHandler(async (req, res) => {
  const { topic, responses, total_time_taken = 0 } = req.body;

  if (!topic || !responses) {
    throw new AppError("topic and responses are required", 400);
  }

  const data = await callMLService("assessment/evaluate", {
    topic,
    responses,
    total_time_taken,
  }, req.user._id);

  const saved = await AssessmentResult.create({
    user: req.user._id, // tie the result to whoever took the test
    topic: data.topic,
    totalQuestions: data.total_questions,
    correct: data.correct,
    wrong: data.wrong,
    scorePercent: data.score_percent,
    grade: data.grade,
    gradeLabel: data.grade_label,
    mcqTotal: data.mcq_total,
    mcqCorrect: data.mcq_correct,
    tfTotal: data.tf_total,
    tfCorrect: data.tf_correct,
    totalTimeTaken: data.total_time_taken,
    results: data.results,
  });

  res.status(200).json({ ...data, _id: saved._id, createdAt: saved.createdAt });
});

/**
 * GET /api/assessment/history
 * Previously returned EVERY user's assessment history with no filtering
 * at all — fixed to scope strictly to the logged-in user.
 */
export const getAssessmentHistory = asyncHandler(async (req, res) => {
  const history = await AssessmentResult.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select(
      "topic totalQuestions correct wrong scorePercent grade gradeLabel mcqTotal mcqCorrect tfTotal tfCorrect totalTimeTaken createdAt"
    )
    .limit(50);

  res.status(200).json(history);
});

/**
 * GET /api/assessment/history/:id
 * Previously had no ownership check — any logged-in user could read any
 * other user's assessment result by guessing/incrementing the ID.
 */
export const getAssessmentById = asyncHandler(async (req, res) => {
  const result = await AssessmentResult.findById(req.params.id);
  if (!result) throw new AppError("Assessment not found", 404);

  if (!result.user || result.user.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to view this assessment", 403);
  }

  res.status(200).json(result);
});
