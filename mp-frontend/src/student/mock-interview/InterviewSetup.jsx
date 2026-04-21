import { useState } from "react";
import { generateQuestions } from "../../services/mockInterviewService";
import { ChevronDown, AlertCircle, RefreshCw } from "lucide-react";

export default function InterviewSetup({ onReady, setLoading }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState(null);

  const difficultyOptions = [
    { label: "Easy",   value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard",   value: "hard" },
  ];

  const getDifficultyStyle = (value) => {
    const active = difficulty === value;
    const colors = {
      easy:   { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7", activeBg: "#a7f3d0" },
      medium: { bg: "#fef9c3", text: "#713f12", border: "#fde047", activeBg: "#fef08a" },
      hard:   { bg: "#fee2e2", text: "#7f1d1d", border: "#fca5a5", activeBg: "#fecaca" },
    };
    const c = colors[value];
    return {
      flex: 1,
      padding: "9px 12px",
      borderRadius: 12,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      border: `1.5px solid ${active ? c.border : "#e5e7eb"}`,
      background: active ? c.bg : "#f9fafb",
      color: active ? c.text : "#9ca3af",
      transition: "all 0.18s ease",
      userSelect: "none",
      textAlign: "center",
    };
  };

  const startInterview = async () => {
    if (!selectedRole) {
      setError("Please select a role to continue.");
      return;
    }
    setError(null);
    try {
      setLocalLoading(true);
      setLoading(true);
      const data = await generateQuestions({ role: selectedRole, difficulty });
      onReady({ role: selectedRole, questions: data.questions });
    } catch (err) {
      setError("Failed to generate questions. Please check your connection and try again.");
      setLoading(false);
    } finally {
      setLocalLoading(false);
    }
  };

  const roleGroups = [
    { label: "Development",            options: ["Frontend Developer", "Backend Developer", "Full Stack Developer"] },
    { label: "Data & AI",              options: ["Data Scientist", "Machine Learning Engineer"] },
    { label: "Infrastructure & Cloud", options: ["DevOps Engineer", "Cloud Engineer"] },
    { label: "Security & Database",    options: ["Cybersecurity Analyst", "Database Administrator"] },
    { label: "HR & Management",        options: ["HR Manager"] },
  ];

  return (
    <div style={{
      background: "#fff",
      borderRadius: 24,
      border: "1px solid #d1fae5",
      boxShadow: "0 8px 32px rgba(16,185,129,0.1), 0 1px 3px rgba(0,0,0,0.04)",
      padding: "clamp(28px,5vw,52px) clamp(20px,5vw,44px)",
      maxWidth: 500,
      margin: "0 auto",
      width: "100%",
    }}>

      {/* Icon + title */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 68, height: 68, borderRadius: "50%",
          background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginBottom: 18,
          boxShadow: "0 4px 16px rgba(16,185,129,0.2)",
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 style={{ fontSize: "clamp(20px,3vw,24px)", fontWeight: 700, color: "#064e35", margin: "0 0 8px", letterSpacing: "-0.4px" }}>
          Start Mock Interview
        </h2>
        <p style={{ color: "#6b7280", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
          Select your target role and difficulty level
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 14,
          padding: "12px 16px", marginBottom: 20,
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <AlertCircle size={17} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, color: "#b91c1c", margin: 0, fontWeight: 500 }}>{error}</p>
        </div>
      )}

      {/* Role select */}
      <div style={{ marginBottom: 22 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8, letterSpacing: "0.02em" }}>
          Target Role
        </label>
        <div style={{ position: "relative" }}>
          <select
            value={selectedRole}
            onChange={(e) => { setSelectedRole(e.target.value); setError(null); }}
            style={{
              width: "100%",
              padding: "13px 44px 13px 16px",
              borderRadius: 14,
              border: `1.5px solid ${selectedRole ? "#10b981" : "#e5e7eb"}`,
              background: "#fff",
              color: selectedRole ? "#064e35" : "#9ca3af",
              fontSize: 15,
              fontWeight: selectedRole ? 600 : 400,
              appearance: "none",
              outline: "none",
              cursor: "pointer",
              transition: "border-color 0.2s",
              fontFamily: "inherit",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#10b981")}
            onBlur={(e)  => (e.target.style.borderColor = selectedRole ? "#10b981" : "#e5e7eb")}
          >
            <option value="" disabled hidden>Select a role...</option>
            {roleGroups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown size={16} color="#6b7280" style={{
            position: "absolute", right: 14, top: "50%",
            transform: "translateY(-50%)", pointerEvents: "none",
          }} />
        </div>
      </div>

      {/* Difficulty */}
      <div style={{ marginBottom: 32 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10, letterSpacing: "0.02em" }}>
          Difficulty
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          {difficultyOptions.map((d) => (
            <button key={d.value} onClick={() => setDifficulty(d.value)} style={getDifficultyStyle(d.value)}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={startInterview}
        disabled={localLoading}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: 14,
          border: "none",
          background: localLoading
            ? "#a7f3d0"
            : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "#fff",
          fontSize: 16,
          fontWeight: 700,
          cursor: localLoading ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: localLoading ? "none" : "0 4px 18px rgba(16,185,129,0.45)",
          transition: "all 0.2s",
          letterSpacing: "0.01em",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => { if (!localLoading) e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
      >
        {localLoading ? (
          <>
            <RefreshCw size={16} style={{ animation: "spin 0.8s linear infinite" }} />
            Generating Questions...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </>
        ) : (
          "Start Interview →"
        )}
      </button>
    </div>
  );
}