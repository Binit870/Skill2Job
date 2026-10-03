import mongoose from "mongoose";

const assessmentResultSchema = new mongoose.Schema(
  {
    // Ties each result to the student who took it. Previously missing —
    // meant /api/assessment/history returned every user's results to
    // whoever called it, with no ownership check at all.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    topic:          { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    correct:        { type: Number, required: true },
    wrong:          { type: Number, required: true },
    scorePercent:   { type: Number, required: true },
    grade:          { type: String, required: true },
    gradeLabel:     { type: String, required: true },

    // MCQ vs True/False breakdown
    mcqTotal:       { type: Number, default: 0 },
    mcqCorrect:     { type: Number, default: 0 },
    tfTotal:        { type: Number, default: 0 },
    tfCorrect:      { type: Number, default: 0 },

    // Timing
    totalTimeTaken: { type: Number, default: 0 },  // total seconds for the whole test

    results: { type: Array, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("AssessmentResult", assessmentResultSchema);