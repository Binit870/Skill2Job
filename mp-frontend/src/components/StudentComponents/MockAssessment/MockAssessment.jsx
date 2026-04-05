import { useState } from "react";
import axios from "axios";
import { FaBullseye, FaClipboardList, FaChartBar, FaHistory } from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";

import AssessmentSetup   from "./AssessmentSetup";
import AssessmentSession from "./AssessmentSession";
import AssessmentResult  from "./AssessmentResult";
import AssessmentHistory from "./AssessmentHistory";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STEPS = [
  { id: "setup",   label: "Setup",   Icon: FaBullseye },
  { id: "session", label: "Test",    Icon: FaClipboardList },
  { id: "result",  label: "Results", Icon: FaChartBar },
];

export default function MockAssessment() {
  const [step,            setStep]            = useState("setup");
  const [topic,           setTopic]           = useState("");
  const [questions,       setQuestions]       = useState([]);
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [result,          setResult]          = useState(null);
  const [loading,         setLoading]         = useState(false);

  const handleReady = ({ topic: t, questions: q, timePerQuestion: tpq }) => {
    setTopic(t); setQuestions(q); setTimePerQuestion(tpq);
    setResult(null); setLoading(false); setStep("session");
  };

  const handleComplete = async (responses, totalTimeTaken) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/assessment/submit`, {
        topic, responses, total_time_taken: totalTimeTaken,
      });
      setResult(data);
      setStep("result");
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = ["setup", "session", "result"].indexOf(step);
  const showStepper  = step !== "history";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

      {/* Header */}
      <header className="bg-white border-b border-green-100 shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-sm">
            <MdOutlineQuiz color="white" size={18} />
          </div>
          <span className="text-lg font-extrabold text-green-900 tracking-tight">AI Assessment Pro</span>
        </div>

        <div className="flex items-center gap-2">
          {showStepper && (
            <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
              {step === "setup" ? "Setup" : step === "session" ? "In Progress" : "Complete"}
            </span>
          )}
          <button
            onClick={() => setStep("history")}
            className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-full transition-all cursor-pointer"
          >
            <FaHistory size={11} /> History
          </button>
        </div>
      </header>

      {/* Stepper */}
      {showStepper && (
        <div className="bg-white border-b border-green-100 px-6 py-4">
          <div className="max-w-sm mx-auto">
            <div className="flex items-center justify-between relative">
              {STEPS.map(({ id, label, Icon }, idx) => (
                <div key={id} className="flex flex-col items-center flex-1 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    idx <= currentIndex
                      ? "bg-green-500 text-white shadow-sm shadow-green-200"
                      : "bg-green-50 text-green-300 border-2 border-green-100"
                  }`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-xs mt-1.5 font-bold ${idx <= currentIndex ? "text-green-600" : "text-gray-400"}`}>
                    {label}
                  </span>
                </div>
              ))}
              {/* Connector */}
              <div className="absolute top-5 left-[15%] right-[15%] h-0.5 bg-green-100 z-0">
                <div
                  className="h-full bg-green-400 transition-all duration-500 rounded-full"
                  style={{ width: `${(Math.max(0, currentIndex) / (STEPS.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 flex justify-center items-start p-5">
        <div className="w-full max-w-xl">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
              <p className="text-gray-400 mt-4 text-sm">
                {step === "setup" ? "Generating questions…" : "Submitting answers…"}
              </p>
            </div>
          )}

          {!loading && (
            <>
              {step === "setup"   && <AssessmentSetup onReady={handleReady} setLoading={setLoading} />}
              {step === "session" && (
                <AssessmentSession
                  topic={topic}
                  questions={questions}
                  timePerQuestion={timePerQuestion}
                  onComplete={handleComplete}
                />
              )}
              {step === "result"  && (
                <AssessmentResult
                  result={result}
                  topic={topic}
                  onRestart={() => setStep("setup")}
                  onViewHistory={() => setStep("history")}
                />
              )}
              {step === "history" && <AssessmentHistory onBack={() => setStep("setup")} />}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-4 border-t border-green-50 bg-white">
        © {new Date().getFullYear()} AI Assessment Pro · Built for global talent
      </footer>
    </div>
  );
}