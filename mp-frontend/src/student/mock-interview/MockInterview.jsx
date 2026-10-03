import { useState } from "react";
import { Sparkles, Briefcase, MessageSquare, FileText } from "lucide-react";
import InterviewSetup from "./InterviewSetup";
import InterviewSession from "./InterviewSession";
import FeedbackReport from "./FeedbackReport";

const STEPS = [
  { id: "setup", label: "Setup", icon: Briefcase },
  { id: "interview", label: "Interview", icon: MessageSquare },
  { id: "feedback", label: "Feedback", icon: FileText },
];

export default function MockInterview() {
  const [step, setStep] = useState("setup");
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInterviewReady = ({ role: r, questions: q }) => {
    setRole(r);
    setQuestions(q);
    setResponses([]);
    setLoading(false);
    setStep("interview");
  };

  const currentIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* HEADER */}
      <header className="flex justify-between items-center px-4 sm:px-8 py-3.5 bg-white border-b border-mist">
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-lg bg-pine/8 border border-pine/20 flex items-center justify-center">
            <Sparkles size={16} className="text-pine" />
          </div>
          <span className="text-[15px] font-semibold text-ink tracking-tight">Mock Interview</span>
        </div>
        <span className="text-xs font-medium text-ink/50 bg-paper/60 px-3 py-1 rounded-full border border-mist">
          {currentIndex + 1} / {STEPS.length}
        </span>
      </header>

      {/* STEPPER */}
      <div className="bg-white border-b border-mist px-4 sm:px-8 py-4">
        <div className="max-w-[480px] mx-auto relative">
          <div className="absolute top-4 left-[12%] right-[12%] h-px bg-mist z-0">
            <div
              className="h-full bg-pine transition-all duration-500"
              style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          <div className="flex justify-between relative z-10">
            {STEPS.map((s, index) => {
              const done = index < currentIndex;
              const active = index === currentIndex;
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                      ${done || active ? "bg-pine/8 border border-pine/25 text-pine" : "bg-white border border-mist text-ink/25"}
                      ${active ? "ring-4 ring-pine/15" : ""}`}
                  >
                    <Icon size={15} />
                  </div>
                  <span className={`text-[11px] font-medium tracking-wide uppercase ${done || active ? "text-pine" : "text-ink/35"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className="flex-1 flex justify-center items-start px-3 sm:px-4 py-8 sm:py-9 bg-paper/60">
        <div className="w-full max-w-[720px]">

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-9 h-9 rounded-full border-2 border-mist border-t-pine animate-spin" />
              <p className="text-ink/50 mt-3.5 text-sm font-medium">Preparing your interview…</p>
            </div>
          )}

          {!loading && (
            <>
              {step === "setup" && (
                <InterviewSetup onReady={handleInterviewReady} setLoading={setLoading} />
              )}
              {step === "interview" && (
                <InterviewSession
                  role={role} questions={questions}
                  responses={responses} setResponses={setResponses}
                  setFeedback={setFeedback} setStep={setStep}
                />
              )}
              {step === "feedback" && (
                <FeedbackReport
                  feedback={feedback} role={role}
                  responses={responses} setStep={setStep}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-xs text-ink/35 px-4 py-3.5 border-t border-mist bg-white">
        © {new Date().getFullYear()} Mock Interview · Built with ♥ by Skill2Career
      </footer>
    </div>
  );
}
