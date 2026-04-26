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

  const difficultyColors = {
    easy:   { activeBorder: "#bbf7d0", activeBg: "#f0fdf4", activeText: "#16a34a", inactiveText: "#9ca3af" },
    medium: { activeBorder: "#fde68a", activeBg: "#fffbeb", activeText: "#d97706", inactiveText: "#9ca3af" },
    hard:   { activeBorder: "#fecaca", activeBg: "#fff1f2", activeText: "#dc2626", inactiveText: "#9ca3af" },
  };

  const getDifficultyStyle = (value) => {
    const active = difficulty === value;
    const c = difficultyColors[value];
    return {
      flex: 1,
      padding: "9px 12px",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
      border: `0.5px solid ${active ? c.activeBorder : "#e5e7eb"}`,
      background: active ? c.activeBg : "#fff",
      color: active ? c.activeText : c.inactiveText,
      transition: "all 0.15s ease",
      userSelect: "none",
      textAlign: "center",
      fontFamily: "inherit",
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
      borderRadius: 16,
      border: "0.5px solid #e5e7eb",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      padding: "clamp(28px,5vw,48px) clamp(20px,5vw,40px)",
      maxWidth: 480,
      margin: "0 auto",
      width: "100%",
    }}>

      {/* Icon + title */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "#f0fdf4",
          border: "0.5px solid #bbf7d0",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 style={{ fontSize: "clamp(18px,3vw,22px)", fontWeight: 600, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.3px" }}>
          Start mock interview
        </h2>
        <p style={{ color: "#6b7280", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
          Select your target role and difficulty level
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          background: "#fff1f2", border: "0.5px solid #fecaca", borderRadius: 10,
          padding: "11px 14px", marginBottom: 20,
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <AlertCircle size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, color: "#b91c1c", margin: 0, fontWeight: 500 }}>{error}</p>
        </div>
      )}

      {/* Role select */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6b7280", marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Target role
        </label>
        <div style={{ position: "relative" }}>
          <select
            value={selectedRole}
            onChange={(e) => { setSelectedRole(e.target.value); setError(null); }}
            style={{
              width: "100%",
              padding: "11px 40px 11px 14px",
              borderRadius: 10,
              border: `0.5px solid ${selectedRole ? "#bbf7d0" : "#e5e7eb"}`,
              background: "#fff",
              color: selectedRole ? "#111827" : "#9ca3af",
              fontSize: 14,
              fontWeight: selectedRole ? 500 : 400,
              appearance: "none",
              outline: "none",
              cursor: "pointer",
              transition: "border-color 0.15s",
              fontFamily: "inherit",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#bbf7d0")}
            onBlur={(e)  => (e.target.style.borderColor = selectedRole ? "#bbf7d0" : "#e5e7eb")}
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
          <ChevronDown size={14} color="#9ca3af" style={{
            position: "absolute", right: 13, top: "50%",
            transform: "translateY(-50%)", pointerEvents: "none",
          }} />
        </div>
      </div>

      {/* Difficulty */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6b7280", marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>
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
          padding: "13px",
          borderRadius: 10,
          border: "0.5px solid #bbf7d0",
          background: localLoading ? "#f0fdf4" : "#f0fdf4",
          color: localLoading ? "#86efac" : "#16a34a",
          fontSize: 14,
          fontWeight: 600,
          cursor: localLoading ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          transition: "all 0.15s",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => { if (!localLoading) e.currentTarget.style.background = "#dcfce7"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#f0fdf4"; }}
      >
        {localLoading ? (
          <>
            <RefreshCw size={14} style={{ animation: "spin 0.8s linear infinite" }} />
            Generating questions...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </>
        ) : (
          "Start interview →"
        )}
      </button>
    </div>
  );
}