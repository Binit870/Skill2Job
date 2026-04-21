import { Trophy, RotateCcw, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

export default function FeedbackReport({ feedback, role, responses, setStep }) {
  const score = feedback?.overall_score ?? 0;
  const results = feedback?.results ?? [];

  const getScoreColor = (s) => {
    if (s >= 8) return { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7", bar: "#10b981" };
    if (s >= 6) return { bg: "#fef9c3", text: "#713f12", border: "#fde047", bar: "#f59e0b" };
    return { bg: "#fee2e2", text: "#7f1d1d", border: "#fca5a5", bar: "#ef4444" };
  };

  const getScoreLabel = (s) => {
    if (s >= 8) return "Excellent";
    if (s >= 6) return "Good";
    if (s >= 4) return "Fair";
    return "Needs Work";
  };

  const scoreColors = getScoreColor(score);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 10) * circumference;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header / Score card */}
      <div style={{
        background: "#fff",
        borderRadius: 24,
        border: "1px solid #d1fae5",
        boxShadow: "0 8px 32px rgba(16,185,129,0.1), 0 1px 3px rgba(0,0,0,0.04)",
        padding: "clamp(24px,5vw,44px) clamp(20px,5vw,40px)",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 60, height: 60, borderRadius: "50%",
          background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
          marginBottom: 18,
          boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
        }}>
          <Trophy size={26} color="#059669" />
        </div>

        <h2 style={{
          fontSize: "clamp(20px,3vw,26px)",
          fontWeight: 700, color: "#064e35",
          margin: "0 0 8px", letterSpacing: "-0.4px",
        }}>
          Interview Complete!
        </h2>
        <p style={{ color: "#6b7280", fontSize: 15, margin: "0 0 32px", lineHeight: 1.6 }}>
          Performance report for <strong style={{ color: "#059669" }}>{role}</strong>
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
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: "#064e35", lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>/10</span>
            </div>
          </div>
        </div>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: scoreColors.bg, color: scoreColors.text,
          border: `1px solid ${scoreColors.border}`,
          padding: "7px 20px", borderRadius: 99, fontSize: 14, fontWeight: 700,
        }}>
          {score >= 6 ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {getScoreLabel(score)}
        </div>
      </div>

      {/* Per-question breakdown */}
      <div style={{
        background: "#fff",
        borderRadius: 24,
        border: "1px solid #d1fae5",
        boxShadow: "0 8px 32px rgba(16,185,129,0.1), 0 1px 3px rgba(0,0,0,0.04)",
        padding: "clamp(20px,4vw,36px) clamp(16px,4vw,36px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "#d1fae5",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <TrendingUp size={18} color="#059669" />
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#064e35", margin: 0 }}>
            Question Breakdown
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {results.map((item, index) => {
            const c = getScoreColor(item.score);
            const barW = `${(item.score / 10) * 100}%`;
            return (
              <div key={index} style={{
                background: "#f9fafb",
                borderRadius: 16,
                border: "1px solid #f0fdf4",
                padding: "clamp(14px,3vw,20px) clamp(14px,3vw,20px)",
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                  marginBottom: 12,
                  flexWrap: "wrap",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 800, color: "#10b981",
                      textTransform: "uppercase", letterSpacing: "0.08em",
                    }}>
                      Q{index + 1}
                    </span>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#374151", margin: "5px 0 0", lineHeight: 1.55 }}>
                      {item.question}
                    </p>
                  </div>
                  <div style={{
                    flexShrink: 0,
                    background: c.bg, color: c.text,
                    border: `1px solid ${c.border}`,
                    borderRadius: 10,
                    padding: "5px 14px",
                    fontSize: 14, fontWeight: 800,
                    whiteSpace: "nowrap",
                  }}>
                    {item.score}/10
                  </div>
                </div>

                {/* Score bar */}
                <div style={{ height: 6, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: barW,
                    background: c.bar,
                    borderRadius: 99,
                    transition: "width 0.8s ease",
                  }} />
                </div>

                {item.feedback && (
                  <p style={{ fontSize: 13, color: "#6b7280", margin: "10px 0 0", lineHeight: 1.65 }}>
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
          width: "100%",
          padding: "16px",
          borderRadius: 16,
          border: "none",
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "#fff",
          fontSize: 16,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          boxShadow: "0 4px 18px rgba(16,185,129,0.4)",
          transition: "all 0.2s",
          fontFamily: "inherit",
          letterSpacing: "0.01em",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(16,185,129,0.5)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(16,185,129,0.4)"; }}
      >
        <RotateCcw size={18} />
        Take Another Interview
      </button>
    </div>
  );
}