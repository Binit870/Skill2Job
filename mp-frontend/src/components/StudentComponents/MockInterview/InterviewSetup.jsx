import { useState } from "react";
import { generateQuestions } from "../../../services/mockInterviewService";
import { ChevronDown, AlertCircle, RefreshCw } from "lucide-react";

export default function InterviewSetup({ setRole, setQuestions, setStep, setLoading }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLocalLoading] = useState(false);
  const [error, setError] = useState(null);

  const startInterview = async () => {
    if (!selectedRole) {
      setError("Please select a role to continue.");
      return;
    }

    setError(null);

    try {
      setLocalLoading(true);
      setLoading(true);

      const data = await generateQuestions({ role: selectedRole, difficulty: "medium" });

      setRole(selectedRole);
      setQuestions(data.questions);
      setStep("interview");
    } catch (err) {
      setError("Failed to generate questions. Please check your connection and try again.");
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  };

  const roleGroups = [
    {
      label: "Development",
      options: ["Frontend Developer", "Backend Developer", "Full Stack Developer"]
    },
    {
      label: "Data & AI",
      options: ["Data Scientist", "Machine Learning Engineer"]
    },
    {
      label: "Infrastructure & Cloud",
      options: ["DevOps Engineer", "Cloud Engineer"]
    },
    {
      label: "Security & Database",
      options: ["Cybersecurity Analyst", "Database Administrator"]
    }
  ];

  return (
    <div style={{
      background: "#fff", borderRadius: 20, border: "1px solid #d1fae5",
      boxShadow: "0 4px 24px rgba(16,185,129,0.08)", padding: "48px 40px",
      maxWidth: 500, margin: "0 auto"
    }}>

      {/* Icon top */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#064e35", margin: 0, letterSpacing: "-0.4px" }}>
          Start Mock Interview
        </h2>
        <p style={{ color: "#6b7280", fontSize: 14, marginTop: 8, marginBottom: 0 }}>
          Select your target role and we'll generate tailored questions
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12,
          padding: "12px 16px", marginBottom: 20,
          display: "flex", alignItems: "flex-start", gap: 10
        }}>
          <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: "#b91c1c", margin: 0, fontWeight: 500 }}>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Select */}
      <div style={{ marginBottom: 16, position: "relative" }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
          Target Role
        </label>
        <div style={{ position: "relative" }}>
          <select
            value={selectedRole}
            onChange={(e) => { setSelectedRole(e.target.value); setError(null); }}
            style={{
              width: "100%", padding: "13px 44px 13px 16px",
              borderRadius: 12, border: "1.5px solid #d1fae5",
              background: "#f0fdf4", color: selectedRole ? "#064e35" : "#9ca3af",
              fontSize: 15, fontWeight: selectedRole ? 500 : 400,
              appearance: "none", outline: "none", cursor: "pointer",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#10b981"}
            onBlur={(e) => e.target.style.borderColor = "#d1fae5"}
          >
            <option value="" disabled hidden>Select a role...</option>
            {roleGroups.map(group => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown size={16} color="#6b7280" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>
      </div>

      {/* Difficulty badge */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {["Easy", "Medium", "Hard"].map(d => (
          <div key={d} style={{
            padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500,
            background: d === "Medium" ? "#d1fae5" : "#f9fafb",
            color: d === "Medium" ? "#065f46" : "#9ca3af",
            border: d === "Medium" ? "1px solid #6ee7b7" : "1px solid #e5e7eb",
            cursor: "pointer"
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Button */}
      <button
        onClick={startInterview}
        disabled={loading}
        style={{
          width: "100%", padding: "15px",
          borderRadius: 12, border: "none",
          background: loading ? "#a7f3d0" : "linear-gradient(135deg, #10b981, #059669)",
          color: "#fff", fontSize: 16, fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: loading ? "none" : "0 4px 14px rgba(16,185,129,0.4)",
          transition: "all 0.2s", letterSpacing: "-0.2px"
        }}
        onMouseEnter={(e) => { if (!loading) e.target.style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; }}
      >
        {loading ? (
          <>
            <RefreshCw size={16} style={{ animation: "spin 0.8s linear infinite" }} />
            Generating Questions...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </>
        ) : "Start Interview →"}
      </button>
    </div>
  );
}