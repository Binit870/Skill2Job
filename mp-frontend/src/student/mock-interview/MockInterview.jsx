import { useState } from "react";
import { Sparkles, Briefcase, MessageSquare, FileText } from "lucide-react";
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

  const handleInterviewReady = ({ role: r, questions: q }) => {
    setRole(r);
    setQuestions(q);
    setResponses([]);
    setLoading(false);
    setStep("interview");
  };

  const steps = [
    { id: "setup",     label: "Setup",     icon: <Briefcase size={15} /> },
    { id: "interview", label: "Interview", icon: <MessageSquare size={15} /> },
    { id: "feedback",  label: "Feedback",  icon: <FileText size={15} /> },
  ];

  const currentIndex = steps.findIndex((s) => s.id === step);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', 'DM Sans', 'Segoe UI', sans-serif",
    }}>

      {/* HEADER */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px clamp(16px, 4vw, 32px)",
        background: "#fff",
        borderBottom: "0.5px solid #e5e7eb",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "#f0fdf4",
            border: "0.5px solid #bbf7d0",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={16} color="#16a34a" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#111827", letterSpacing: "-0.2px" }}>
            Mock Interview
          </span>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 500, color: "#6b7280",
          background: "#f9fafb", padding: "4px 12px", borderRadius: 99,
          border: "0.5px solid #e5e7eb",
        }}>
          {currentIndex + 1} / {steps.length}
        </span>
      </header>

      {/* STEPPER */}
      <div style={{
        background: "#fff",
        borderBottom: "0.5px solid #e5e7eb",
        padding: "16px clamp(16px,4vw,32px)",
      }}>
        <div style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}>
          {/* connector track */}
          <div style={{
            position: "absolute", top: 16, left: "12%", right: "12%",
            height: "0.5px", background: "#e5e7eb", zIndex: 0,
          }}>
            <div style={{
              height: "100%",
              background: "#16a34a",
              width: `${(currentIndex / (steps.length - 1)) * 100}%`,
              transition: "width 0.5s ease",
            }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            {steps.map((s, index) => {
              const done = index < currentIndex;
              const active = index === currentIndex;
              return (
                <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: done ? "#f0fdf4" : active ? "#f0fdf4" : "#fff",
                    border: done || active ? "0.5px solid #bbf7d0" : "0.5px solid #e5e7eb",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: done || active ? "#16a34a" : "#d1d5db",
                    transition: "all 0.3s ease",
                    boxShadow: active ? "0 0 0 3px #dcfce7" : "none",
                  }}>
                    {s.icon}
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 500,
                    color: done || active ? "#16a34a" : "#9ca3af",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "clamp(16px,4vw,36px) clamp(12px,3vw,16px)",
        background: "#fafafa",
      }}>
        <div style={{ width: "100%", maxWidth: 720 }}>

          {loading && (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", padding: "80px 0",
            }}>
              <div style={{
                width: 36, height: 36,
                border: "2px solid #e5e7eb", borderTopColor: "#16a34a",
                borderRadius: "50%", animation: "spin 0.8s linear infinite",
              }} />
              <p style={{ color: "#6b7280", marginTop: 14, fontSize: 14, fontWeight: 500 }}>
                Preparing your interview...
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
      <footer style={{
        textAlign: "center", fontSize: 12, color: "#9ca3af",
        padding: "14px clamp(12px,3vw,16px)",
        borderTop: "0.5px solid #e5e7eb",
        background: "#fff",
      }}>
        © {new Date().getFullYear()} Mock Interview · Built with ♥ by Skill2Job
      </footer>
    </div>
  );
}