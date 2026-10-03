import { useState, useEffect } from "react";
import { Target, ClipboardList, BarChart3, History, AlertCircle, X, Heart } from "lucide-react";

import AssessmentSetup from "./AssessmentSetup";
import AssessmentSession from "./AssessmentSession";
import AssessmentResult from "./AssessmentResult";
import AssessmentHistory from "./AssessmentHistory";
import API from "../../utils/api";

const STEPS = [
  { id: "setup", label: "Setup", Icon: Target },
  { id: "session", label: "Test", Icon: ClipboardList },
  { id: "result", label: "Results", Icon: BarChart3 },
];

export default function MockAssessment() {
  const [step, setStep] = useState("setup");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    if (step !== "session") return;
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setShowLeaveModal(true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [step]);

  const confirmLeave = () => { setShowLeaveModal(false); setStep("setup"); };
  const cancelLeave = () => setShowLeaveModal(false);

  const handleReady = ({ topic: t, questions: q, timePerQuestion: tpq }) => {
    setTopic(t); setQuestions(q); setTimePerQuestion(tpq);
    setResult(null); setError(null); setLoading(false);
    setStep("session");
  };

  const handleComplete = async (responses, totalTimeTaken) => {
    setLoading(true); setError(null);
    try {
      const { data } = await API.post("/api/assessment/submit", { topic, responses, total_time_taken: totalTimeTaken });
      setResult(data); setLoading(false); setStep("result");
    } catch (err) {
      console.error("Submit error:", err?.response?.data || err.message);
      setError("Failed to submit assessment. Please try again.");
      setLoading(false);
    }
  };

  const currentIndex = ["setup", "session", "result"].indexOf(step);
  const showStepper = step !== "history";
  const isInSession = step === "session";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pine/5 via-white to-paper/60 flex flex-col overflow-y-auto">

      {/* Leave modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div onClick={cancelLeave} className="absolute inset-0 bg-ink/35 backdrop-blur-sm" />
          <div className="relative z-10 bg-white rounded-[20px] border border-mist shadow-2xl px-6 sm:px-9 py-7 sm:py-9 max-w-[380px] w-full">
            <button
              onClick={cancelLeave}
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg bg-ink/5 hover:bg-ink/10 flex items-center justify-center text-ink/40 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="text-center mb-5.5">
              <div className="w-14 h-14 rounded-2xl bg-gold/10 border-2 border-gold/30 flex items-center justify-center mx-auto mb-3.5">
                <AlertCircle className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-lg font-extrabold text-ink mb-2">Leave the test?</h3>
              <p className="text-[13px] text-ink/55 leading-relaxed">
                Your progress will be <span className="font-bold text-red-500">lost</span> and you'll return to the setup screen.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={cancelLeave}
                className="py-2.5 rounded-xl border-2 border-pine/25 bg-white text-pine font-bold text-[13px] hover:bg-pine/8 transition-colors"
              >
                Continue Test
              </button>
              <button
                onClick={confirmLeave}
                className="py-2.5 rounded-xl bg-gradient-to-br from-red-400 to-red-600 text-white font-bold text-[13px] shadow-md shadow-red-500/25 hover:opacity-90 transition-opacity"
              >
                Leave Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-mist shadow-sm">
        <div className="max-w-[900px] mx-auto px-4 sm:px-7 h-[58px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-[10px] bg-gradient-to-br from-pine to-moss flex items-center justify-center shadow-md shadow-pine/30">
              <ClipboardList className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-[15px] font-extrabold text-ink tracking-tight">
              Mock Assessment
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isInSession && (
              <button
                onClick={() => { setStep("history"); setError(null); }}
                className="flex items-center gap-1.5 text-xs font-bold text-pine bg-pine/8 border border-pine/20 rounded-full px-3.5 py-1.5 hover:bg-pine/15 hover:border-pine/35 transition-colors"
              >
                <History className="w-3 h-3" />
                <span>History</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Stepper */}
      {showStepper && (
        <div className="bg-white border-b border-mist">
          <div className="max-w-[900px] mx-auto px-4 sm:px-7 py-3.5">
            <div className="flex items-center justify-center max-w-[280px] mx-auto relative">
              <div className="absolute top-[18px] left-[18%] right-[18%] h-0.5 bg-mist z-0 rounded-full">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pine to-moss transition-all duration-500"
                  style={{ width: `${(Math.max(0, currentIndex) / (STEPS.length - 1)) * 100}%` }}
                />
              </div>

              {STEPS.map(({ id, label, Icon }, idx) => {
                const done = idx < currentIndex;
                const active = idx === currentIndex;
                return (
                  <div key={id} className="flex flex-col items-center flex-1 relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300
                        ${done || active
                          ? "bg-gradient-to-br from-pine to-moss text-white shadow-md shadow-pine/25"
                          : "bg-white border-2 border-mist text-ink/25"
                        }
                        ${active ? "ring-4 ring-pine/15" : ""}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-[11px] font-bold mt-1.5 transition-colors ${done || active ? "text-pine" : "text-ink/25"}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 w-full max-w-[900px] mx-auto px-4 sm:px-7 py-4 sm:py-7">

        {error && (
          <div className="mb-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-[13px] font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 px-5">
            <div className="w-12 h-12 rounded-full border-[3px] border-pine/20 border-t-pine animate-spin mb-4.5" />
            <p className="text-ink/40 text-[13px] font-medium">
              {step === "setup" ? "Generating your questions…" : "Scoring your answers…"}
            </p>
          </div>
        )}

        {!loading && (
          <>
            {step === "setup" && <AssessmentSetup onReady={handleReady} setLoading={setLoading} />}
            {step === "session" && (
              <AssessmentSession
                topic={topic} questions={questions} timePerQuestion={timePerQuestion}
                onComplete={handleComplete}
                onLeaveRequest={() => setShowLeaveModal(true)}
              />
            )}
            {step === "result" && (
              <AssessmentResult
                result={result} topic={topic}
                onRestart={() => { setResult(null); setStep("setup"); }}
                onViewHistory={() => setStep("history")}
              />
            )}
            {step === "history" && <AssessmentHistory onBack={() => setStep("setup")} />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-ink/30 px-5 py-3.5 border-t border-mist bg-white flex items-center justify-center gap-1">
        <span>© {new Date().getFullYear()} Mock Assessment · Built with</span>
        <Heart className="w-2.5 h-2.5 fill-current" />
        <span>by Skill2Career</span>
      </footer>
    </div>
  );
}
