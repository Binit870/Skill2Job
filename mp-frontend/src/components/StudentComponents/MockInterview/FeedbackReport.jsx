import { Trophy, RotateCcw, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

export default function FeedbackReport({ feedback, role, responses, setStep }) {
  const score = feedback?.overall_score ?? 0;
  const results = feedback?.results ?? [];

  const getScoreColor = (s) => {
    if (s >= 8) return { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7" };
    if (s >= 6) return { bg: "#fef9c3", text: "#713f12", border: "#fde047" };
    return { bg: "#fee2e2", text: "#7f1d1d", border: "#fca5a5" };
  };

  const getScoreLabel = (s) => {
    if (s >= 8) return "Excellent";
    if (s >= 6) return "Good";
    if (s >= 4) return "Fair";
    return "Needs Work";
  };

  const scoreColors = getScoreColor(score);

  // Circumference for SVG ring
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 10) * circumference;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>

      {/* Header card */}
      <div style={{
        background: "#fff", borderRadius: 20, border: "1px solid #d1fae5",
        boxShadow: "0 4px 24px rgba(16,185,129,0.08)", padding: "40px",
        marginBottom: 20, textAlign: "center"
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", marginBottom: 16 }}>
          <Trophy size={26} color="#059669" />
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#064e35", margin: "0 0 6px", letterSpacing: "-0.4px" }}>
          Interview Complete!
        </h2>
        <p style={{ color: "#6b7280", fontSize: 15, margin: "0 0 32px" }}>
          Here's your performance report for <strong style={{ color: "#059669" }}>{role}</strong>
        </p>

        {/* Score ring */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ position: "relative", width: 120, height: 120 }}>
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#d1fae5" strokeWidth="10" />
              <circle
                cx="60" cy="60" r={radius}
                fill="none" stroke="url(#scoreGrad)"
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
            }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#064e35", lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 12, color: "#6b7280" }}>/10</span>
            </div>
          </div>
        </div>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: scoreColors.bg, color: scoreColors.text,
          border: `1px solid ${scoreColors.border}`,
          padding: "6px 18px", borderRadius: 20, fontSize: 14, fontWeight: 600
        }}>
          {score >= 6 ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {getScoreLabel(score)}
        </div>
      </div>

      {/* Per-question results */}
      <div style={{
        background: "#fff", borderRadius: 20, border: "1px solid #d1fae5",
        boxShadow: "0 4px 24px rgba(16,185,129,0.08)", padding: "32px 36px",
        marginBottom: 20
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <TrendingUp size={20} color="#059669" />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#064e35", margin: 0 }}>
            Question Breakdown
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {results.map((item, index) => {
            const c = getScoreColor(item.score);
            const barW = `${(item.score / 10) * 100}%`;
            return (
              <div key={index} style={{
                background: "#f9fafb", borderRadius: 14, border: "1px solid #f0fdf4",
                padding: "18px 20px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: "#10b981",
                      textTransform: "uppercase", letterSpacing: "0.06em"
                    }}>
                      Q{index + 1}
                    </span>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#374151", margin: "4px 0 0", lineHeight: 1.5 }}>
                      {item.question}
                    </p>
                  </div>
                  <div style={{
                    flexShrink: 0, minWidth: 60,
                    background: c.bg, color: c.text,
                    border: `1px solid ${c.border}`,
                    borderRadius: 10, padding: "4px 12px",
                    textAlign: "center", fontSize: 14, fontWeight: 700
                  }}>
                    {item.score}/10
                  </div>
                </div>

                {/* Score bar */}
                <div style={{ height: 5, background: "#e5e7eb", borderRadius: 3 }}>
                  <div style={{
                    height: "100%", width: barW,
                    background: item.score >= 8 ? "#10b981" : item.score >= 6 ? "#f59e0b" : "#ef4444",
                    borderRadius: 3, transition: "width 0.8s ease"
                  }} />
                </div>

                {/* Feedback text if available */}
                {item.feedback && (
                  <p style={{ fontSize: 13, color: "#6b7280", margin: "10px 0 0", lineHeight: 1.6 }}>
                    {item.feedback}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Retry button */}
      <button
        onClick={() => setStep("setup")}
        style={{
          width: "100%", padding: "16px",
          borderRadius: 14, border: "none",
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "#fff", fontSize: 16, fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 10,
          boxShadow: "0 4px 14px rgba(16,185,129,0.4)",
          transition: "all 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
      >
        <RotateCcw size={18} />
        Take Another Interview
      </button>
    </div>
  );
}