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
    { id: "setup",     label: "Setup",     icon: <Briefcase size={18} /> },
    { id: "interview", label: "Interview", icon: <MessageSquare size={18} /> },
    { id: "feedback",  label: "Feedback",  icon: <FileText size={18} /> },
  ];

  const currentIndex = steps.findIndex((s) => s.id === step);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f0faf5 0%, #e8f5f0 100%)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>

      {/* HEADER */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px clamp(16px, 4vw, 32px)",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #d1ead9",
        position: "sticky",
        top: 0,
        zIndex: 50,
        
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(16,185,129,0.35)",
          }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <span style={{ fontSize: "clamp(15px,2vw,18px)", fontWeight: 700, color: "#064e35", letterSpacing: "-0.3px" }}>
            Mock Interview
          </span>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 700, color: "#059669",
          background: "#d1fae5", padding: "5px 14px", borderRadius: 20,
          border: "1px solid #a7f3d0", letterSpacing: "0.02em",
        }}>
          {currentIndex + 1} / {steps.length}
        </span>
      </header>

      {/* STEPPER */}
      <div style={{
        background: "rgba(255,255,255,0.7)",
        borderBottom: "1px solid #d1ead9",
        padding: "18px clamp(16px,4vw,32px)",
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}>
          {/* connector track */}
          <div style={{
            position: "absolute", top: 20, left: "10%", right: "10%",
            height: 2, background: "#d1fae5", zIndex: 0, borderRadius: 2,
          }}>
            <div style={{
              height: "100%",
              background: "linear-gradient(90deg, #10b981, #059669)",
              width: `${(currentIndex / (steps.length - 1)) * 100}%`,
              transition: "width 0.5s ease", borderRadius: 2,
            }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            {steps.map((s, index) => {
              const done = index < currentIndex;
              const active = index === currentIndex;
              return (
                <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: done || active
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : "#fff",
                    border: done || active ? "none" : "2px solid #a7f3d0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: done || active ? "#fff" : "#6ee7b7",
                    boxShadow: active ? "0 4px 14px rgba(16,185,129,0.4)" : "none",
                    transition: "all 0.3s ease",
                  }}>
                    {s.icon}
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: done || active ? "#059669" : "#9ca3af",
                    letterSpacing: "0.04em",
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
      }}>
        <div style={{ width: "100%", maxWidth: 720 }}>

          {loading && (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", padding: "80px 0",
            }}>
              <div style={{
                width: 48, height: 48,
                border: "3px solid #d1fae5", borderTopColor: "#10b981",
                borderRadius: "50%", animation: "spin 0.8s linear infinite",
              }} />
              <p style={{ color: "#6b7280", marginTop: 16, fontSize: 15 }}>
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
        borderTop: "1px solid #d1ead9",
        background: "rgba(255,255,255,0.7)",
      }}>
        © {new Date().getFullYear()} Mock Interview · Built with ♥ by Skill2Job
      </footer>
    </div>
  );
}