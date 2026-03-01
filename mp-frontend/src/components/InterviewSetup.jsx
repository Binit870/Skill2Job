import { useState } from "react";
import { generateQuestions } from "../services/mockInterviewService";

export default function InterviewSetup({ setRole, setQuestions, setStep }) {
  const [selectedRole, setSelectedRole] = useState("Frontend Developer");
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    try {
      setLoading(true);
      const data = await generateQuestions({
        role: selectedRole,
        difficulty: "medium",
      });

      setRole(selectedRole);
      setQuestions(data.questions);
      setStep("interview");
    } catch (err) {
      alert("Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Start Mock Interview
      </h2>

      <select
        className="w-full border p-3 rounded-lg mb-6"
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
      >
        <option>Frontend Developer</option>
        <option>Backend Developer</option>
        <option>Data Analyst</option>
        <option>Machine Learning Engineer</option>
      </select>

      <button
        onClick={startInterview}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Generating..." : "Start Interview"}
      </button>
    </div>
  );
}