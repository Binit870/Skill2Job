import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  RadialBarChart, RadialBar, PolarAngleAxis,
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import API from "../../utils/api";

const auth = () => ({ Authorization: `Bearer ${sessionStorage.getItem("token")}` });

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0a1f12", color: "#a7f3d0", padding: "8px 14px",
      borderRadius: 10, fontSize: 12, fontWeight: 700,
      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
    }}>
      {payload[0].payload.skill}: <span style={{ color: "#34d399" }}>{payload[0].value}</span>
    </div>
  );
};

const Analytics = () => {
  const location = useLocation();
  const [data, setData]       = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (location.state) {
      const s = location.state;
      setData({
        atsScore: s.data?.atsScore ?? s.analysis?.ats_score ?? 0,
        placementProbability: s.data?.placementProbability ?? s.analysis?.placement_probability ?? 0,
        missingSkills: s.data?.missingSkills ?? s.analysis?.missing_skills ?? [],
        missingSkillsDetail: s.analysis?.missing_skills_detail ?? [],
        createdAt: s.data?.createdAt ?? new Date().toISOString(),
      });
    } else {
      fetchLatest();
    }
    fetchHistory();
  }, []);

  const fetchLatest = async () => {
    try {
      const res = await API.get("/api/resume/latest", { headers: auth() });
      setData(res.data.data);
    } catch (e) { console.error(e); }
  };

  const fetchHistory = async () => {
    try {
      const res = await API.get("/api/resume/history", { headers: auth() });
      setHistory(res.data.data || []);
    } catch (e) { console.error(e); }
  };

  if (!data) return (
    <div style={{
      minHeight: "100vh", background: "#f0fdf4",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          border: "3px solid #bbf7d0", borderTopColor: "#059669",
          animation: "spin 0.8s linear infinite", margin: "0 auto 14px",
        }} />
        <p style={{ color: "#065f46", fontWeight: 600, fontSize: 14 }}>Loading analysis…</p>
      </div>
    </div>
  );

  const ats  = Math.round(data.atsScore || 0);
  const prob = Math.round(data.placementProbability || 0);
  const missingSkillsDetail = data.missingSkillsDetail || [];
  const missingSkillsData   = (data.missingSkills || []).map(skill => {
    const detail = missingSkillsDetail.find(d => d.skill === skill);
    return { skill, value: detail?.importance || 60 };
  });

  const scoreColor = (v) => v >= 70 ? "#059669" : v >= 40 ? "#d97706" : "#dc2626";
  const scoreBg    = (v) => v >= 70 ? "#dcfce7" : v >= 40 ? "#fef3c7" : "#fee2e2";
  const scoreLabel = (v, type) => {
    if (type === "ats")   return v >= 70 ? "Great ATS compatibility" : v >= 40 ? "Needs improvement" : "Low ATS — revamp resume";
    if (type === "prob")  return v >= 70 ? "High placement chance"   : v >= 40 ? "Moderate — strengthen skills" : "Low — consider upskilling";
  };
  const scoreIcon = (v) => v >= 70 ? "✅" : v >= 40 ? "⚠️" : "❌";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes barGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes radialPop {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }

        .an-root * { box-sizing: border-box; }
        .an-root { font-family: 'DM Sans', sans-serif; }

        .an-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #d1fae5;
          box-shadow: 0 2px 12px rgba(5,120,60,0.06), 0 1px 3px rgba(0,0,0,0.04);
          overflow: hidden;
          animation: fadeUp 0.4s ease both;
        }
        .an-card:hover {
          box-shadow: 0 8px 32px rgba(5,120,60,0.10), 0 2px 8px rgba(0,0,0,0.05);
          border-color: #a7f3d0;
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .prog-bar {
          transform-origin: left;
          animation: barGrow 0.8s cubic-bezier(0.34,1.56,0.64,1) both;
          animation-delay: 0.3s;
        }

        .hist-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          background: #f0fdf4;
          border-radius: 12px;
          border: 1px solid #d1fae5;
          gap: 12px;
          flex-wrap: wrap;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .hist-row:hover {
          background: #dcfce7;
          border-color: #6ee7b7;
        }

        .score-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 11px;
          border-radius: 20px;
          border: 1.5px solid transparent;
        }

        /* Recharts override */
        .recharts-cartesian-grid-horizontal line,
        .recharts-cartesian-grid-vertical line {
          stroke: #d1fae5;
        }
        .recharts-bar-rectangle { transition: opacity 0.15s ease; }
        .recharts-bar-rectangle:hover { opacity: 0.82; }

        /* Responsive grid */
        .score-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 640px) {
          .score-grid { grid-template-columns: 1fr; }
        }

        .an-grid {
          display: grid;
          gap: 16px;
        }
      `}</style>

      <div
        className="an-root"
        style={{
          padding: "clamp(16px, 4vw, 36px)",
          background: "#f0fdf4",
          minHeight: "100vh",
        }}
      >
        {/* ── Page Header ── */}
        <div style={{ marginBottom: "clamp(18px, 3vw, 28px)", animation: "fadeUp 0.3s ease both" }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "#34d399", marginBottom: 6,
          }}>
            Resume Intelligence
          </p>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 400, color: "#052e16", margin: 0, lineHeight: 1.2,
          }}>
            Analytics Dashboard
          </h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 6, fontWeight: 500 }}>
            Analysed on {new Date(data.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* ── Score Cards ── */}
        <div className="score-grid" style={{ marginBottom: 16 }}>

          {/* ATS Score */}
          <div className="an-card" style={{ padding: "clamp(18px, 3vw, 28px)", animationDelay: "0.05s" }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6ee7b7", marginBottom: 16 }}>
              ATS Score
            </p>

            {/* Big score display */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 18 }}>
              <span style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(52px, 10vw, 72px)",
                fontWeight: 400,
                color: scoreColor(ats),
                lineHeight: 1,
              }}>
                {ats}
              </span>
              <span style={{ fontSize: 18, color: "#a7f3d0", fontWeight: 600, paddingBottom: 8 }}>/100</span>
            </div>

            {/* Progress bar */}
            <div style={{ height: 8, background: "#d1fae5", borderRadius: 99, overflow: "hidden", marginBottom: 14 }}>
              <div
                className="prog-bar"
                style={{
                  width: `${ats}%`, height: "100%",
                  background: `linear-gradient(90deg, ${scoreColor(ats)}88, ${scoreColor(ats)})`,
                  borderRadius: 99,
                }}
              />
            </div>

            {/* Status pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: scoreBg(ats), color: scoreColor(ats),
              fontSize: 12, fontWeight: 600,
              padding: "6px 12px", borderRadius: 99,
              border: `1.5px solid ${scoreColor(ats)}33`,
            }}>
              <span>{scoreIcon(ats)}</span>
              {scoreLabel(ats, "ats")}
            </div>
          </div>

          {/* Placement Probability */}
          <div className="an-card" style={{ padding: "clamp(18px, 3vw, 28px)", animationDelay: "0.1s" }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6ee7b7", marginBottom: 8 }}>
              Placement Probability
            </p>

            <div style={{ animation: "radialPop 0.5s ease 0.2s both" }}>
              <ResponsiveContainer width="100%" height={160}>
                <RadialBarChart
                  innerRadius="65%" outerRadius="95%"
                  data={[{ value: prob }]}
                  startAngle={180} endAngle={0}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    background={{ fill: "#d1fae5" }}
                    dataKey="value"
                    cornerRadius={12}
                    fill={scoreColor(prob)}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            {/* Centered % below chart */}
            <div style={{ textAlign: "center", marginTop: -12, marginBottom: 14 }}>
              <span style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(32px, 6vw, 44px)",
                color: scoreColor(prob), lineHeight: 1,
              }}>
                {prob}
              </span>
              <span style={{ fontSize: 16, color: "#a7f3d0", fontWeight: 600 }}>%</span>
            </div>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: scoreBg(prob), color: scoreColor(prob),
              fontSize: 12, fontWeight: 600,
              padding: "6px 12px", borderRadius: 99,
              border: `1.5px solid ${scoreColor(prob)}33`,
            }}>
              <span>{scoreIcon(prob)}</span>
              {scoreLabel(prob, "prob")}
            </div>
          </div>
        </div>

        {/* ── Missing Skills ── */}
        <div
          className="an-card"
          style={{ padding: "clamp(18px, 3vw, 28px)", marginBottom: 16, animationDelay: "0.15s" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6ee7b7", margin: 0 }}>
              Missing Skills
            </p>
            {missingSkillsData.length > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 700, color: "#dc2626",
                background: "#fee2e2", padding: "3px 10px", borderRadius: 20,
                border: "1.5px solid #fecaca",
              }}>
                {missingSkillsData.length} gap{missingSkillsData.length !== 1 ? "s" : ""} found
              </span>
            )}
          </div>

          {missingSkillsData.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              padding: "32px 16px", gap: 10,
            }}>
              <span style={{ fontSize: 40 }}>🎯</span>
              <p style={{ color: "#065f46", fontWeight: 600, fontSize: 14, margin: 0 }}>No major skill gaps detected</p>
              <p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Your resume covers all key requirements</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(200, missingSkillsData.length * 40 + 60)}>
              <BarChart data={missingSkillsData} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="skill"
                  tick={{ fontSize: 11, fontFamily: "'DM Sans',sans-serif", fill: "#374151", fontWeight: 600 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(5,150,105,0.06)" }} />
                <Bar
                  dataKey="value"
                  fill="#059669"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={52}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ── History ── */}
        <div
          className="an-card"
          style={{ padding: "clamp(18px, 3vw, 28px)", animationDelay: "0.2s" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6ee7b7", margin: 0 }}>
              Analysis History
            </p>
            {history.length > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 700, color: "#059669",
                background: "#dcfce7", padding: "3px 10px", borderRadius: 20,
                border: "1.5px solid #a7f3d0",
              }}>
                {history.length} scan{history.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 16px" }}>
              <span style={{ fontSize: 32 }}>📂</span>
              <p style={{ color: "#6b7280", fontSize: 13, marginTop: 8, fontWeight: 500 }}>No previous analyses found</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {history.map((h, i) => {
                const hAts  = Math.round(h.atsScore);
                const hProb = Math.round(h.placementProbability);
                return (
                  <div key={i} className="hist-row">
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 700, color: "#052e16", fontSize: 13, margin: 0 }}>
                        Analysis #{history.length - i}
                      </p>
                      <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2, fontWeight: 500 }}>
                        {new Date(h.createdAt).toLocaleString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span className="score-pill" style={{
                        background: hAts >= 70 ? "#dcfce7" : "#fef3c7",
                        color:      hAts >= 70 ? "#065f46" : "#854d0e",
                        borderColor: hAts >= 70 ? "#a7f3d0" : "#fde68a",
                      }}>
                        ATS {hAts}
                      </span>
                      <span className="score-pill" style={{
                        background: "#dbeafe", color: "#1e40af", borderColor: "#bfdbfe",
                      }}>
                        Placement {hProb}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default Analytics;