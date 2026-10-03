import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  RadialBarChart, RadialBar, PolarAngleAxis,
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  HiOutlineChartBar,
  HiOutlineSparkles,
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineXCircle,
  HiOutlineTrendingUp,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineBadgeCheck,
} from "react-icons/hi";
import { MdOutlineAutoGraph } from "react-icons/md";
import API from "../../utils/api";

const auth = () => ({ Authorization: `Bearer ${sessionStorage.getItem("token")}` });

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      padding: "10px 16px",
      borderRadius: 10,
      fontSize: 12,
      border: "1px solid #CFE7DD",
      boxShadow: "0 4px 20px rgba(5,150,105,0.10)",
    }}>
      <p style={{ color: "#6b6f68", fontWeight: 500, margin: "0 0 4px" }}>
        {payload[0].payload.skill}
      </p>
      <p style={{ color: "#0E6B52", fontWeight: 700, fontSize: 15, margin: 0 }}>
        {payload[0].value}
        <span style={{ fontSize: 11, color: "#9a9e96", fontWeight: 500 }}> importance</span>
      </p>
    </div>
  );
};

/* ── Stat Mini Card ── */
const StatRow = ({ icon: Icon, label, value, color }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #E9F2EE",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: "#E9F2EE",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#0E6B52", flexShrink: 0,
      }}>
        <Icon size={16} />
      </div>
      <span style={{ fontSize: 13, color: "#6b6f68", fontWeight: 500 }}>{label}</span>
    </div>
    <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
  </div>
);

const Analytics = () => {
  const location = useLocation();
  const [data, setData]       = useState(null);
  const [history, setHistory] = useState([]);

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

  /* ── Loading ── */
  if (!data) return (
    <div style={{
      minHeight: "100vh", background: "#ffffff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 40, height: 40, margin: "0 auto 16px",
          border: "3px solid #CFE7DD", borderTopColor: "#0E6B52",
          borderRadius: "50%", animation: "spin 0.7s linear infinite",
        }} />
        <p style={{ color: "#9a9e96", fontWeight: 500, fontSize: 13, letterSpacing: "0.04em" }}>
          Loading analysis…
        </p>
      </div>
    </div>
  );

  /* ── Derived values ── */
  const ats  = Math.round(data.atsScore || 0);
  const prob = Math.round(data.placementProbability || 0);
  const missingSkillsDetail = data.missingSkillsDetail || [];
  const missingSkillsData   = (data.missingSkills || []).map(skill => {
    const detail = missingSkillsDetail.find(d => d.skill === skill);
    return { skill, value: detail?.importance || 60 };
  });

  const scoreColor  = (v) => v >= 70 ? "#0E6B52" : v >= 40 ? "#C99A3B" : "#dc2626";
  const scoreBg     = (v) => v >= 70 ? "#E9F2EE" : v >= 40 ? "#FBF3E1" : "#fef2f2";
  const scoreBorder = (v) => v >= 70 ? "#BBDACE" : v >= 40 ? "#E9D4A3" : "#fecaca";
  const scoreGrad   = (v) =>
    v >= 70 ? "linear-gradient(90deg,#6FA98D,#0E6B52)" :
    v >= 40 ? "linear-gradient(90deg,#D9B65C,#C99A3B)" :
              "linear-gradient(90deg,#fca5a5,#dc2626)";
  const scoreLabel  = (v, type) => {
    if (type === "ats")  return v >= 70 ? "Excellent Match"    : v >= 40 ? "Needs Improvement" : "Low — Revamp Needed";
    if (type === "prob") return v >= 70 ? "High Probability"   : v >= 40 ? "Moderate Chance"   : "Low — Upskill Required";
  };
  const ScoreIcon = ({ v }) => {
    if (v >= 70) return <HiOutlineCheckCircle size={15} />;
    if (v >= 40) return <HiOutlineExclamationCircle size={15} />;
    return <HiOutlineXCircle size={15} />;
  };
  const scoreTag = (v) => v >= 70 ? "STRONG" : v >= 40 ? "AVERAGE" : "WEAK";

  return (
    <>
      <style>{`

        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes barGrow  { from { transform:scaleX(0); } to { transform:scaleX(1); } }
        @keyframes numPop   { from { opacity:0; transform:scale(0.85) translateY(6px); } to { opacity:1; transform:scale(1) translateY(0); } }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .an-root {
          font-family: 'Inter', sans-serif;
          background: #F7F5EF;
          min-height: 100vh;
          padding: clamp(20px, 4vw, 44px);
          color: #0D1512;
        }

        /* ─ Card ─ */
        .card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #E7E4DA;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 2px 12px rgba(0,0,0,0.03);
          overflow: hidden;
          position: relative;
          animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
          transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
        }
        .card:hover {
          box-shadow: 0 4px 20px rgba(5,150,105,0.1), 0 1px 6px rgba(0,0,0,0.05);
          border-color: #6FA98D;
          transform: translateY(-2px);
        }

        /* ─ Card top accent bar ─ */
        .card-accent {
          height: 3px;
          background: linear-gradient(90deg, #3FA37F 0%, #0E6B52 100%);
          width: 100%;
        }

        /* ─ Card inner padding ─ */
        .card-body { padding: clamp(20px, 3vw, 28px); }

        /* ─ Section label ─ */
        .label {
          display: flex; align-items: center; gap: 7px;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #0E6B52; margin-bottom: 18px;
        }
        .label-icon {
          width: 26px; height: 26px; border-radius: 6px;
          background: #E9F2EE;
          display: flex; align-items: center; justify-content: center;
          color: #0E6B52; flex-shrink: 0;
        }

        /* ─ Score number ─ */
        .score-num {
          font-family: 'Inter Tight', sans-serif;
          line-height: 1;
          font-weight: 700;
          animation: numPop 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.15s both;
        }

        /* ─ Score tag badge ─ */
        .score-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 4px 10px; border-radius: 6px;
          border: 1px solid;
        }

        /* ─ Progress ─ */
        .prog-track {
          height: 7px; border-radius: 99px;
          background: #F1EFE7; overflow: hidden;
          border: 1px solid #E7E4DA;
        }
        .prog-fill {
          height: 100%; border-radius: 99px;
          transform-origin: left;
          animation: barGrow 1s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
        }

        /* ─ Status chip ─ */
        .status-chip {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 500;
          padding: 6px 13px; border-radius: 8px; border: 1px solid;
        }

        /* ─ Divider ─ */
        .divider {
          height: 1px; background: #E9F2EE; margin: 16px 0;
        }

        /* ─ History row ─ */
        .hist-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 13px 16px; border-radius: 12px;
          border: 1px solid #E9F2EE; gap: 12px; flex-wrap: wrap;
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
          cursor: default;
          animation: fadeIn 0.4s ease both;
        }
        .hist-row:hover {
          background: #E9F2EE;
          border-color: #6FA98D;
          transform: translateX(3px);
        }

        /* ─ Pill ─ */
        .pill {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 600;
          padding: 4px 10px; border-radius: 6px; border: 1px solid;
        }

        /* ─ Grid ─ */
        .score-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 620px) {
          .score-grid { grid-template-columns: 1fr; }
        }

        /* Recharts */
        .recharts-cartesian-grid-horizontal line { stroke: #E9F2EE; }
        .recharts-cartesian-grid-vertical   line { stroke: transparent; }
        .recharts-text { font-family: 'Inter', sans-serif !important; }
      `}</style>

      <div className="an-root">

        {/* ── Header ── */}
        <header style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
          marginBottom: "clamp(20px, 3vw, 36px)",
          animation: "fadeUp 0.3s ease both",
        }}>
          <div>
            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#E9F2EE", border: "1px solid #BBDACE",
              borderRadius: 6, padding: "4px 10px", marginBottom: 12,
            }}>
              <MdOutlineAutoGraph size={13} color="#0E6B52" />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0E6B52" }}>
                Resume Intelligence
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: "clamp(24px, 4.5vw, 36px)",
              fontWeight: 700,
              color: "#0D1512",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}>
              Analytics Dashboard
            </h1>
            <p style={{ fontSize: 13, color: "#9a9e96", marginTop: 6, fontWeight: 400 }}>
              Resume score breakdown &amp; hiring insights
            </p>
          </div>

          {/* Date badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#fff", border: "1px solid #E7E4DA",
            borderRadius: 10, padding: "10px 16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            alignSelf: "flex-start",
          }}>
            <HiOutlineCalendar size={15} color="#0E6B52" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#2B322D" }}>
              {new Date(data.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* ── Score Cards ── */}
        <div className="score-grid" style={{ marginBottom: 16 }}>

          {/* ATS Score */}
          <div className="card" style={{ animationDelay: "0.05s" }}>
            <div className="card-accent" />
            <div className="card-body">

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div className="label" style={{ marginBottom: 0 }}>
                  <span className="label-icon"><HiOutlineShieldCheck size={14} /></span>
                  ATS Score
                </div>
                <span className="score-badge" style={{
                  background: scoreBg(ats), color: scoreColor(ats), borderColor: scoreBorder(ats),
                }}>
                  <ScoreIcon v={ats} />
                  {scoreTag(ats)}
                </span>
              </div>

              {/* Big number */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 18 }}>
                <span className="score-num" style={{
                  fontSize: "clamp(54px, 10vw, 76px)",
                  color: scoreColor(ats),
                }}>
                  {ats}
                </span>
                <span style={{ fontSize: 20, color: "#D6D3C7", fontWeight: 500, paddingBottom: 10 }}>/100</span>
              </div>

              {/* Progress */}
              <div className="prog-track" style={{ marginBottom: 18 }}>
                <div className="prog-fill" style={{ width: `${ats}%`, background: scoreGrad(ats) }} />
              </div>

              {/* Status */}
              <span className="status-chip" style={{
                background: scoreBg(ats), color: scoreColor(ats), borderColor: scoreBorder(ats),
              }}>
                <ScoreIcon v={ats} />
                {scoreLabel(ats, "ats")}
              </span>

              <div className="divider" />

              {/* Mini stats */}
              <StatRow icon={HiOutlineLightningBolt} label="Keyword Match" value={`${ats}%`} color={scoreColor(ats)} />
              <StatRow icon={HiOutlineBadgeCheck}    label="Format Score"  value={ats >= 50 ? "Good" : "Weak"} color={ats >= 50 ? "#0E6B52" : "#dc2626"} />
            </div>
          </div>

          {/* Placement Probability */}
          <div className="card" style={{ animationDelay: "0.1s" }}>
            <div className="card-accent" />
            <div className="card-body">

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div className="label" style={{ marginBottom: 0 }}>
                  <span className="label-icon"><HiOutlineTrendingUp size={14} /></span>
                  Placement Probability
                </div>
                <span className="score-badge" style={{
                  background: scoreBg(prob), color: scoreColor(prob), borderColor: scoreBorder(prob),
                }}>
                  <ScoreIcon v={prob} />
                  {scoreTag(prob)}
                </span>
              </div>

              {/* Radial chart */}
              <div style={{ animation: "fadeIn 0.5s ease 0.2s both" }}>
                <ResponsiveContainer width="100%" height={140}>
                  <RadialBarChart
                    innerRadius="68%" outerRadius="94%"
                    data={[{ value: prob }]}
                    startAngle={180} endAngle={0}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar
                      background={{ fill: "#F1EFE7" }}
                      dataKey="value"
                      cornerRadius={8}
                      fill={scoreColor(prob)}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ textAlign: "center", marginTop: -6, marginBottom: 16 }}>
                <span className="score-num" style={{ fontSize: "clamp(32px, 6vw, 46px)", color: scoreColor(prob) }}>
                  {prob}
                </span>
                <span style={{ fontSize: 18, color: "#D6D3C7", fontWeight: 500 }}>%</span>
              </div>

              <span className="status-chip" style={{
                background: scoreBg(prob), color: scoreColor(prob), borderColor: scoreBorder(prob),
              }}>
                <ScoreIcon v={prob} />
                {scoreLabel(prob, "prob")}
              </span>

              <div className="divider" />
              <StatRow icon={HiOutlineChartBar}  label="Market Fit"       value={prob >= 70 ? "Strong" : prob >= 40 ? "Moderate" : "Low"}  color={scoreColor(prob)} />
              <StatRow icon={HiOutlineSparkles}  label="Role Alignment"   value={`${prob}%`} color={scoreColor(prob)} />
            </div>
          </div>
        </div>

        {/* ── Missing Skills ── */}
        <div className="card" style={{ marginBottom: 16, animationDelay: "0.15s" }}>
          <div className="card-accent" />
          <div className="card-body">

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
              <div className="label" style={{ marginBottom: 0 }}>
                <span className="label-icon"><HiOutlineClipboardList size={14} /></span>
                Missing Skills
              </div>
              {missingSkillsData.length > 0 && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: 11, fontWeight: 700, color: "#b45309",
                  background: "#FBF3E1", padding: "5px 12px", borderRadius: 6,
                  border: "1px solid #E9D4A3",
                }}>
                  <HiOutlineExclamationCircle size={13} />
                  {missingSkillsData.length} gap{missingSkillsData.length !== 1 ? "s" : ""} detected
                </span>
              )}
            </div>

            {missingSkillsData.length === 0 ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "32px 16px", gap: 10,
                background: "#F7F5EF", borderRadius: 12,
                border: "1px dashed #CFE7DD",
              }}>
                <HiOutlineCheckCircle size={36} color="#0E6B52" />
                <p style={{ color: "#0D1512", fontWeight: 700, fontSize: 14 }}>All skills covered</p>
                <p style={{ color: "#9a9e96", fontSize: 12 }}>Your resume matches all key requirements</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(200, missingSkillsData.length * 44 + 60)}>
                <BarChart data={missingSkillsData} margin={{ top: 4, right: 8, left: -24, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="skill"
                    tick={{ fontSize: 11, fontFamily: "'Inter', sans-serif", fill: "#6b6f68", fontWeight: 600 }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(5,150,105,0.04)", radius: 6 }} />
                  <Bar dataKey="value" fill="#0E6B52" radius={[6, 6, 0, 0]} maxBarSize={52} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── History ── */}
        <div className="card" style={{ animationDelay: "0.2s" }}>
          <div className="card-accent" />
          <div className="card-body">

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <div className="label" style={{ marginBottom: 0 }}>
                <span className="label-icon"><HiOutlineClock size={14} /></span>
                Analysis History
              </div>
              {history.length > 0 && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: 11, fontWeight: 700, color: "#0E6B52",
                  background: "#E9F2EE", padding: "5px 12px", borderRadius: 6,
                  border: "1px solid #BBDACE",
                }}>
                  <HiOutlineChartBar size={12} />
                  {history.length} scan{history.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {history.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "28px 16px",
                background: "#F7F5EF", borderRadius: 12,
                border: "1px dashed #E7E4DA",
              }}>
                <HiOutlineClipboardList size={32} color="#D6D3C7" style={{ margin: "0 auto 10px", display: "block" }} />
                <p style={{ color: "#9a9e96", fontSize: 13, fontWeight: 500 }}>No previous analyses found</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {history.map((h, i) => {
                  const hAts  = Math.round(h.atsScore);
                  const hProb = Math.round(h.placementProbability);
                  return (
                    <div key={i} className="hist-row" style={{ animationDelay: `${0.05 * i}s` }}>
                      {/* Left */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                          background: "#E9F2EE", border: "1px solid #BBDACE",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 700, color: "#0E6B52",
                        }}>
                          {history.length - i}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: "#0D1512", fontSize: 13 }}>
                            Analysis #{history.length - i}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                            <HiOutlineCalendar size={11} color="#9a9e96" />
                            <p style={{ fontSize: 11, color: "#9a9e96", fontWeight: 400 }}>
                              {new Date(h.createdAt).toLocaleString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right pills */}
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                        <span className="pill" style={{
                          background: hAts >= 70 ? "#E9F2EE" : "#FBF3E1",
                          color:      hAts >= 70 ? "#065f46" : "#92400e",
                          borderColor: hAts >= 70 ? "#BBDACE" : "#E9D4A3",
                        }}>
                          <HiOutlineShieldCheck size={11} />
                          ATS {hAts}
                        </span>
                        <span className="pill" style={{
                          background: "#eff6ff", color: "#1d4ed8", borderColor: "#bfdbfe",
                        }}>
                          <HiOutlineTrendingUp size={11} />
                          {hProb}% placed
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

      </div>
    </>
  );
};

export default Analytics;