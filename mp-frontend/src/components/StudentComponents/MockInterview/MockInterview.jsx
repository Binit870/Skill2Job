// import { useState } from "react";
// import InterviewSetup from "./InterviewSetup";
// import InterviewSession from "./InterviewSession";
// import FeedbackReport from "./FeedbackReport";

// export default function MockInterview() {
//   const [step, setStep] = useState("setup");
//   const [role, setRole] = useState("");
//   const [questions, setQuestions] = useState([]);
//   const [responses, setResponses] = useState([]);
//   const [feedback, setFeedback] = useState(null);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {step === "setup" && (
//         <InterviewSetup
//           setRole={setRole}
//           setQuestions={setQuestions}
//           setStep={setStep}
//         />
//       )}

//       {step === "interview" && (
//         <InterviewSession
//           role={role}
//           questions={questions}
//           responses={responses}
//           setResponses={setResponses}
//           setFeedback={setFeedback}
//           setStep={setStep}
//         />
//       )}

//       {step === "feedback" && (
//         <FeedbackReport feedback={feedback} setStep={setStep} />
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import {
  Briefcase,
  MessageSquare,
  FileText,
  Sparkles,
} from "lucide-react";

import InterviewSetup from "./InterviewSetup";
import InterviewSession from "./InterviewSession";
import FeedbackReport from "./FeedbackReport";

export default function MockInterview() {
  const [step, setStep] = useState("setup");
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: "setup", label: "Setup", icon: <Briefcase size={18} /> },
    { id: "interview", label: "Interview", icon: <MessageSquare size={18} /> },
    { id: "feedback", label: "Feedback", icon: <FileText size={18} /> },
  ];

  const currentIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">

      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-5 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Sparkles className="text-blue-600" />
          <h1 className="text-lg font-semibold tracking-wide">
            AI Interview Pro
          </h1>
        </div>

        <div className="text-sm text-gray-500">
          Step {currentIndex + 1} of {steps.length}
        </div>
      </header>

      {/* STEPS */}
      <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          {steps.map((s, index) => (
            <div key={s.id} className="flex-1 flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all
                ${
                  index <= currentIndex
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white border border-gray-300 text-gray-400"
                }`}
              >
                {s.icon}
              </div>
              <span
                className={`text-xs mt-2 ${
                  index <= currentIndex
                    ? "text-blue-600 font-medium"
                    : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* PROGRESS BAR */}
        <div className="h-1 mt-4 bg-gray-200 rounded-full max-w-4xl mx-auto">
          <div
            className="h-1 bg-blue-600 rounded-full transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* MAIN */}
      <main className="flex-1 flex justify-center items-start px-4 py-8 bg-gray-50">
        <div className="w-full max-w-4xl rounded-xl bg-white border border-gray-200 shadow-lg p-8 transition-all">

          {/* LOADING */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">
                Preparing your interview...
              </p>
            </div>
          )}

          {!loading && (
            <>
              {step === "setup" && (
                <InterviewSetup
                  setRole={setRole}
                  setQuestions={setQuestions}
                  setStep={setStep}
                  setLoading={setLoading}
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
                <FeedbackReport
                  feedback={feedback}
                  role={role}
                  responses={responses}
                  setStep={setStep}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 py-4 border-t border-gray-200">
        © {new Date().getFullYear()} AI Interview Pro • Built for global talent
      </footer>
    </div>
  );
}