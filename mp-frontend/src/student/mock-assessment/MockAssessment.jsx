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
  const [error,           setError]           = useState(null);

  const handleReady = ({ topic: t, questions: q, timePerQuestion: tpq }) => {
    setTopic(t);
    setQuestions(q);
    setTimePerQuestion(tpq);
    setResult(null);
    setError(null);
    setLoading(false);  // clear loader BEFORE switching step
    setStep("session");
  };

  const handleComplete = async (responses, totalTimeTaken) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${API}/api/assessment/submit`, {
        topic,
        responses,
        total_time_taken: totalTimeTaken,
      });
      setResult(data);
      setLoading(false);  // clear loader BEFORE switching step — prevents spinner covering result
      setStep("result");
    } catch (err) {
      console.error("Submit error:", err?.response?.data || err.message);
      setError("Failed to submit assessment. Please try again.");
      setLoading(false);
    }
  };

  const currentIndex = ["setup", "session", "result"].indexOf(step);
  const showStepper  = step !== "history";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-green-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-sm shadow-green-200">
              <MdOutlineQuiz color="white" size={18} />
            </div>
            <span className="text-base sm:text-lg font-extrabold text-green-900 tracking-tight">
              AI Assessment Pro
            </span>
          </div>

          <div className="flex items-center gap-2">
            {showStepper && (
              <span className="hidden sm:inline text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                {step === "setup" ? "Setup" : step === "session" ? "In Progress" : "Complete"}
              </span>
            )}
            <button
              onClick={() => { setStep("history"); setError(null); }}
              className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 active:bg-green-200 border border-green-200 px-3 py-1.5 rounded-full transition-all cursor-pointer"
            >
              <FaHistory size={11} />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Stepper ─────────────────────────────────────────────────────── */}
      {showStepper && (
        <div className="bg-white border-b border-green-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between relative max-w-xs mx-auto">
              {STEPS.map(({ id, label, Icon }, idx) => (
                <div key={id} className="flex flex-col items-center flex-1 relative z-10">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    idx <= currentIndex
                      ? "bg-green-500 text-white shadow-md shadow-green-200"
                      : "bg-white text-green-300 border-2 border-green-100"
                  }`}>
                    <Icon size={15} />
                  </div>
                  <span className={`text-xs mt-1.5 font-bold ${idx <= currentIndex ? "text-green-600" : "text-gray-400"}`}>
                    {label}
                  </span>
                </div>
              ))}
              {/* connector line */}
              <div className="absolute top-[18px] sm:top-5 left-[20%] right-[20%] h-0.5 bg-green-100 z-0">
                <div
                  className="h-full bg-green-400 transition-all duration-500 rounded-full"
                  style={{ width: `${(Math.max(0, currentIndex) / (STEPS.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6">

        {/* Error banner */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-xl flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-4 text-lg leading-none cursor-pointer">×</button>
          </div>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-14 h-14 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
            <p className="text-gray-400 mt-5 text-sm font-medium">
              {step === "setup" ? "Generating your questions…" : "Scoring your answers…"}
            </p>
          </div>
        )}

        {!loading && (
          <>
            {step === "setup"   && <AssessmentSetup   onReady={handleReady} setLoading={setLoading} />}
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
                onRestart={() => { setResult(null); setStep("setup"); }}
                onViewHistory={() => setStep("history")}
              />
            )}
            {step === "history" && <AssessmentHistory onBack={() => setStep("setup")} />}
          </>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="text-center text-xs text-gray-400 py-4 border-t border-green-50 bg-white">
        © {new Date().getFullYear()} AI Assessment Pro · Built for global talent
      </footer>
    </div>
  );
}