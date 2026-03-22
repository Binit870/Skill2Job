import { useState } from "react";
import InterviewSetup from "./InterviewSetup";
import InterviewSession from "./InterviewSession";
import FeedbackReport from "./FeedbackReport";

export default function MockInterview() {
  const [step, setStep] = useState("setup");
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [feedback, setFeedback] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {step === "setup" && (
        <InterviewSetup
          setRole={setRole}
          setQuestions={setQuestions}
          setStep={setStep}
        />
      )}

      {step === "interview" && (
        <InterviewSession
          role={role}
          questions={questions}
          responses={responses}
          setResponses={setResponses}
          setFeedback={setFeedback}
          setStep={setStep}
        />
      )}

      {step === "feedback" && (
        <FeedbackReport feedback={feedback} setStep={setStep} />
      )}
    </div>
  );
}