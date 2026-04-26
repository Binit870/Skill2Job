import { Trophy, RotateCcw, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

export default function FeedbackReport({ feedback, role, responses, setStep }) {
  const score = feedback?.overall_score ?? 0;
  const results = feedback?.results ?? [];

  const getScoreColor = (s) => {
    if (s >= 8) return { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0", bar: "#16a34a" };
    if (s >= 6) return { bg: "#fffbeb", text: "#d97706", border: "#fde68a", bar: "#d97706" };
    return { bg: "#fff1f2", text: "#dc2626", border: "#fecaca", bar: "#dc2626" };
  };

  const getScoreLabel = (s) => {
    if (s >= 8) return "Excellent";
    if (s >= 6) return "Good";
    if (s >= 4) return "Fair";
    return "Needs work";
  };

  const scoreColors = getScoreColor(score);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 10) * circumference;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Header / Score card */}
      <div style={{
        background: "#fff",
        borderRadius: 16,
        border: "0.5px solid #e5e7eb",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        padding: "clamp(24px,5vw,40px) clamp(20px,5vw,36px)",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 52, height: 52, borderRadius: "50%",
          background: "#f0fdf4",
          border: "0.5px solid #bbf7d0",
          marginBottom: 16,
        }}>
          <Trophy size={22} color="#16a34a" />
        </div>

        <h2 style={{
          fontSize: "clamp(18px,3vw,22px)",
          fontWeight: 600, color: "#111827",
          margin: "0 0 6px", letterSpacing: "-0.3px",
        }}>
          Interview complete!
        </h2>
        <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 28px", lineHeight: 1.6 }}>
          Performance report for <strong style={{ color: "#374151", fontWeight: 600 }}>{role}</strong>
        </p>

        {/* Score ring */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <div style={{ position: "relative", width: 110, height: 110 }}>
            <svg width="110" height="110" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="8" />
              <circle
                cx="60" cy="60" r={radius}
                fill="none" stroke="#16a34a"
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 26, fontWeight: 600, color: "#111827", lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400 }}>/10</span>
            </div>
          </div>
        </div>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: scoreColors.bg, color: scoreColors.text,
          border: `0.5px solid ${scoreColors.border}`,
          padding: "6px 16px", borderRadius: 99, fontSize: 13, fontWeight: 500,
        }}>
          {score >= 6 ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
          {getScoreLabel(score)}
        </div>
      </div>

      {/* Per-question breakdown */}
      <div style={{
        background: "#fff",
        borderRadius: 16,
        border: "0.5px solid #e5e7eb",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        padding: "clamp(18px,4vw,32px) clamp(16px,4vw,32px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "#f0fdf4",
            border: "0.5px solid #bbf7d0",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <TrendingUp size={15} color="#16a34a" />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>
            Question breakdown
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {results.map((item, index) => {
            const c = getScoreColor(item.score);
            const barW = `${(item.score / 10) * 100}%`;
            return (
              <div key={index} style={{
                background: "#fafafa",
                borderRadius: 12,
                border: "0.5px solid #e5e7eb",
                padding: "clamp(12px,3vw,18px) clamp(12px,3vw,18px)",
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                  marginBottom: 10,
                  flexWrap: "wrap",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 500, color: "#9ca3af",
                      textTransform: "uppercase", letterSpacing: "0.08em",
                    }}>
                      Q{index + 1}
                    </span>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#374151", margin: "4px 0 0", lineHeight: 1.55 }}>
                      {item.question}
                    </p>
                  </div>
                  <div style={{
                    flexShrink: 0,
                    background: c.bg, color: c.text,
                    border: `0.5px solid ${c.border}`,
                    borderRadius: 8,
                    padding: "4px 12px",
                    fontSize: 13, fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}>
                    {item.score}/10
                  </div>
                </div>

                {/* Score bar */}
                <div style={{ height: 4, background: "#f0f0f0", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: barW,
                    background: c.bar,
                    borderRadius: 99,
                    transition: "width 0.8s ease",
                  }} />
                </div>

                {item.feedback && (
                  <p style={{ fontSize: 13, color: "#6b7280", margin: "8px 0 0", lineHeight: 1.65 }}>
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
          padding: "14px",
          borderRadius: 12,
          border: "0.5px solid #bbf7d0",
          background: "#f0fdf4",
          color: "#16a34a",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
          transition: "all 0.15s",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#dcfce7"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#f0fdf4"; }}
      >
        <RotateCcw size={15} />
        Take another interview
      </button>
    </div>
  );
}