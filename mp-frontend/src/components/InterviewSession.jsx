import { useState } from "react";
import VoiceRecorder from "./VoiceRecorder";
import QuestionCard from "./QuestionCard";
import { evaluateInterview } from "../services/mockInterviewService";

export default function InterviewSession({
  role,
  questions,
  responses,
  setResponses,
  setFeedback,
  setStep,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (answerText) => {
    const updated = [
      ...responses,
      {
        question: questions[currentIndex],
        student_answer: answerText,
      },
    ];

    setResponses(updated);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitInterview(updated);
    }
  };

  const submitInterview = async (allResponses) => {
    try {
      setLoading(true);
      const data = await evaluateInterview({
        role,
        responses: allResponses,
      });

      setFeedback(data);
      setStep("feedback");
    } catch (err) {
      alert("Evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <QuestionCard
        question={questions[currentIndex]}
        index={currentIndex}
      />

      <VoiceRecorder onAnswer={handleAnswer} />

      {loading && (
        <p className="text-center mt-6 text-gray-500">
          Evaluating your performance...
        </p>
      )}
    </div>
  );
}