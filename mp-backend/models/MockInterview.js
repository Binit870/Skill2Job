import mongoose from "mongoose";

const mockInterviewSchema = new mongoose.Schema(
  {
    role: String,
    responses: Array,
    results: Array,
    overallScore: Number,
  },
  { timestamps: true }
);

export default mongoose.model("MockInterview", mockInterviewSchema);