import { useState } from "react";
import { generateQuestions } from "../../services/mockInterviewService";
import { ChevronDown, AlertCircle, RefreshCw } from "lucide-react";

// ✅ FIX: receives onReady({ role, questions }) instead of setRole/setQuestions/setStep separately.
// This ensures MockInterview sets all state atomically before switching to "interview" step.
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
      easy:   { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7" },
      medium: { bg: "#fef9c3", text: "#713f12", border: "#fde047" },
      hard:   { bg: "#fee2e2", text: "#7f1d1d", border: "#fca5a5" },
    };
    return {
      padding: "7px 20px",
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      border: `1.5px solid ${active ? colors[value].border : "#e5e7eb"}`,
      background: active ? colors[value].bg : "#f9fafb",
      color: active ? colors[value].text : "#9ca3af",
      transition: "all 0.18s ease",
      userSelect: "none",
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
      setLoading(true); // show spinner in parent

      const data = await generateQuestions({ role: selectedRole, difficulty });

      // ✅ FIX: call onReady with everything at once — parent sets all state
      // atomically then switches step, so InterviewSession always sees
      // a fully populated questions array on first render
      onReady({
        role: selectedRole,
        questions: data.questions,
      });

    } catch (err) {
      setError("Failed to generate questions. Please check your connection and try again.");
      setLoading(false); // hide spinner on error
    } finally {
      setLocalLoading(false);
    }
  };

  const roleGroups = [
    { label: "Development",            options: ["Frontend Developer", "Backend Developer", "Full Stack Developer"] },
    { label: "Data & AI",              options: ["Data Scientist", "Machine Learning Engineer"] },
    { label: "Infrastructure & Cloud", options: ["DevOps Engineer", "Cloud Engineer"] },
    { label: "Security & Database",    options: ["Cybersecurity Analyst", "Database Administrator"] },
    { label: "HR & Management",    options: ["HR Manager"] },
  ];

  return (
    <div style={{
      background: "#fff", borderRadius: 20, border: "1px solid #d1fae5",
      boxShadow: "0 4px 24px rgba(16,185,129,0.08)", padding: "48px 40px",
      maxWidth: 500, margin: "0 auto",
    }}>

      {/* Icon + title */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16,
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#064e35", margin: 0, letterSpacing: "-0.4px" }}>
          Start Mock Interview
        </h2>
        <p style={{ color: "#6b7280", fontSize: 14, marginTop: 8, marginBottom: 0 }}>
          Select your target role and difficulty level
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12,
          padding: "12px 16px", marginBottom: 20,
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, color: "#b91c1c", margin: 0, fontWeight: 500 }}>{error}</p>
        </div>
      )}

      {/* Role select */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
          Target Role
        </label>
        <div style={{ position: "relative" }}>
          <select
            value={selectedRole}
            onChange={(e) => { setSelectedRole(e.target.value); setError(null); }}
            style={{
              width: "100%", padding: "13px 44px 13px 16px",
              borderRadius: 12, border: "1.5px solid #10b981",
              background: "white", color: selectedRole ? "#000" : "#9ca3af",
              fontSize: 15, fontWeight: selectedRole ? 500 : 400,
              appearance: "none", outline: "none", cursor: "pointer",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#10b981")}
            onBlur={(e)  => (e.target.style.borderColor = "#d1fae5")}
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

      {/* Difficulty selector */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>
          Difficulty
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          {difficultyOptions.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              style={getDifficultyStyle(d.value)}
            >
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
          width: "100%", padding: "15px",
          borderRadius: 12, border: "none",
          background: localLoading ? "#a7f3d0" : "linear-gradient(135deg, #10b981, #059669)",
          color: "#fff", fontSize: 16, fontWeight: 600,
          cursor: localLoading ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: localLoading ? "none" : "0 4px 14px rgba(16,185,129,0.4)",
          transition: "all 0.2s",
        }}
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