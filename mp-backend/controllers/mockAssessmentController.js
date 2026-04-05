import { callMLService } from "../services/mlService.js";
import AssessmentResult from "../models/AssessmentResult.js";

/**
 * POST /api/assessment/generate
 * Body: { topic, num_questions?, time_per_question?, tf_ratio? }
 */
export const generateAssessment = async (req, res) => {
  try {
    const {
      topic,
      num_questions   = 10,
      time_per_question = 30,
      tf_ratio        = 0.3,
    } = req.body;

    if (!topic) return res.status(400).json({ message: "topic is required" });

    const data = await callMLService("assessment/generate", {
      topic,
      num_questions,
      time_per_question,
      tf_ratio,
    });

    res.status(200).json(data);
  } catch (err) {
    console.error("generateAssessment error:", err.message);
    res.status(500).json({ message: "Failed to generate assessment" });
  }
};

/**
 * POST /api/assessment/submit
 * Body: {
 *   topic,
 *   responses: [{ question, type, selected_option, correct_answer, explanation, time_taken, timed_out }],
 *   total_time_taken: number   ← overall session timer value in seconds
 * }
 */
export const submitAssessment = async (req, res) => {
  try {
    const { topic, responses, total_time_taken = 0 } = req.body;

    if (!topic || !responses)
      return res.status(400).json({ message: "topic and responses are required" });

    const data = await callMLService("assessment/evaluate", {
      topic,
      responses,
      total_time_taken,
    });

    const saved = await AssessmentResult.create({
      topic:          data.topic,
      totalQuestions: data.total_questions,
      correct:        data.correct,
      wrong:          data.wrong,
      scorePercent:   data.score_percent,
      grade:          data.grade,
      gradeLabel:     data.grade_label,
      mcqTotal:       data.mcq_total,
      mcqCorrect:     data.mcq_correct,
      tfTotal:        data.tf_total,
      tfCorrect:      data.tf_correct,
      totalTimeTaken: data.total_time_taken,
      results:        data.results,
    });

    res.status(200).json({ ...data, _id: saved._id, createdAt: saved.createdAt });
  } catch (err) {
    console.error("submitAssessment error:", err.message);
    res.status(500).json({ message: "Failed to submit assessment" });
  }
};

/**
 * GET /api/assessment/history
 */
export const getAssessmentHistory = async (req, res) => {
  try {
    const history = await AssessmentResult.find()
      .sort({ createdAt: -1 })
      .select(
        "topic totalQuestions correct wrong scorePercent grade gradeLabel mcqTotal mcqCorrect tfTotal tfCorrect totalTimeTaken createdAt"
      )
      .limit(50);

    res.status(200).json(history);
  } catch (err) {
    console.error("getAssessmentHistory error:", err.message);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

/**
 * GET /api/assessment/history/:id
 */
export const getAssessmentById = async (req, res) => {
  try {
    const result = await AssessmentResult.findById(req.params.id);
    if (!result) return res.status(404).json({ message: "Assessment not found" });
    res.status(200).json(result);
  } catch (err) {
    console.error("getAssessmentById error:", err.message);
    res.status(500).json({ message: "Failed to fetch assessment" });
  }
};