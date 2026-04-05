import mongoose from "mongoose";

const assessmentResultSchema = new mongoose.Schema(
  {
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