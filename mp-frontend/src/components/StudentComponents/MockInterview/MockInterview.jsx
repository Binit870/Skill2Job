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

  const steps = [
    { id: "setup", label: "Setup", icon: <Briefcase size={18} /> },
    { id: "interview", label: "Interview", icon: <MessageSquare size={18} /> },
    { id: "feedback", label: "Feedback", icon: <FileText size={18} /> },
  ];

  const currentIndex = steps.findIndex((s) => s.id === step);

  return (
    <div style={{ minHeight: "100vh", background: "#f0faf5", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* HEADER */}
      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 32px", background: "#fff",
        borderBottom: "1px solid #d1ead9", boxShadow: "0 1px 4px rgba(16,130,72,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "10px",
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#064e35", letterSpacing: "-0.3px" }}>
            AI Interview Pro
          </span>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 600, color: "#059669",
          background: "#d1fae5", padding: "4px 12px", borderRadius: 20,
          border: "1px solid #a7f3d0"
        }}>
          Step {currentIndex + 1} / {steps.length}
        </span>
      </header>

      {/* STEPPER */}
      <div style={{ background: "#fff", borderBottom: "1px solid #d1ead9", padding: "20px 32px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
            {steps.map((s, index) => (
              <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: index <= currentIndex ? "linear-gradient(135deg, #10b981, #059669)" : "#f0fdf4",
                  border: index <= currentIndex ? "none" : "2px solid #a7f3d0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: index <= currentIndex ? "#fff" : "#6ee7b7",
                  boxShadow: index <= currentIndex ? "0 4px 12px rgba(16,185,129,0.35)" : "none",
                  transition: "all 0.3s ease"
                }}>
                  {s.icon}
                </div>
                <span style={{
                  fontSize: 12, marginTop: 6, fontWeight: 600,
                  color: index <= currentIndex ? "#059669" : "#9ca3af"
                }}>
                  {s.label}
                </span>
              </div>
            ))}
            {/* connector line */}
            <div style={{ position: "absolute", top: 22, left: "10%", right: "10%", height: 2, background: "#d1fae5", zIndex: 0 }}>
              <div style={{
                height: "100%", background: "linear-gradient(90deg, #10b981, #059669)",
                width: `${(currentIndex / (steps.length - 1)) * 100}%`,
                transition: "width 0.5s ease", borderRadius: 2
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "32px 16px" }}>
        <div style={{ width: "100%", maxWidth: 720 }}>

          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
              <div style={{
                width: 52, height: 52, border: "4px solid #d1fae5",
                borderTopColor: "#10b981", borderRadius: "50%",
                animation: "spin 0.8s linear infinite"
              }} />
              <p style={{ color: "#6b7280", marginTop: 16, fontSize: 15 }}>Preparing your interview...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {!loading && (
            <>
              {step === "setup" && (
                <InterviewSetup setRole={setRole} setQuestions={setQuestions} setStep={setStep} setLoading={setLoading} />
              )}
              {step === "interview" && (
                <InterviewSession
                  role={role} questions={questions}
                  responses={responses} setResponses={setResponses}
                  setFeedback={setFeedback} setStep={setStep}
                />
              )}
              {step === "feedback" && (
                <FeedbackReport feedback={feedback} role={role} responses={responses} setStep={setStep} />
              )}
            </>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ textAlign: "center", fontSize: 13, color: "#9ca3af", padding: "16px", borderTop: "1px solid #d1ead9", background: "#fff" }}>
        © {new Date().getFullYear()} AI Interview Pro • Built for global talent
      </footer>
    </div>
  );
}