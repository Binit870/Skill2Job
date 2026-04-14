import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  RadialBarChart, RadialBar, PolarAngleAxis,
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

const API = "http://localhost:5000/api/resume";
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

const Analytics = () => {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Normalize location.state into flat data
    if (location.state) {
      const s = location.state;
      // Controller sends { success, data: savedDB, analysis: mlResult }
      setData({
        atsScore: s.data?.atsScore ?? s.analysis?.ats_score ?? 0,
        placementProbability: s.data?.placementProbability ?? s.analysis?.placement_probability ?? 0,
        missingSkills: s.data?.missingSkills ?? s.analysis?.missing_skills ?? [],
        createdAt: s.data?.createdAt ?? new Date().toISOString(),
      });
    } else {
      fetchLatest();
    }
    fetchHistory();
  }, []);

  const fetchLatest = async () => {
    try {
      const res = await axios.get(`${API}/latest`, { headers: auth() });
      setData(res.data.data); // { atsScore, placementProbability, missingSkills }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/history`, { headers: auth() });
      setHistory(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  if (!data) return <p style={{ padding: 40 }}>Loading analysis...</p>;

  const ats = Math.round(data.atsScore || 0);
  const prob = Math.round(data.placementProbability || 0);
  const missingSkillsData = (data.missingSkills || []).map(skill => ({ skill, value: 1 }));

  const atsColor = ats >= 70 ? "#22c55e" : ats >= 40 ? "#f59e0b" : "#ef4444";
  const probColor = prob >= 70 ? "#22c55e" : prob >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ padding: "2rem", background: "#f4f8f5", minHeight: "100vh", fontFamily: "Sora, sans-serif" }}>
      <h2 style={{ marginBottom: "1.5rem", color: "#0a1f12" }}>Resume Analytics Dashboard</h2>

      {/* ── Scores ── */}
      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>

        {/* ATS Score */}
        <div style={card}>
          <p style={label}>ATS Score</p>
          <h1 style={{ fontSize: "3rem", color: atsColor, margin: "0.5rem 0" }}>{ats}<span style={{ fontSize: "1.2rem", color: "#7a9984" }}>/100</span></h1>
          <div style={{ height: 10, background: "#e5e7eb", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ width: `${ats}%`, background: atsColor, height: "100%", borderRadius: 8, transition: "width .6s" }} />
          </div>
          <p style={hint}>{ats >= 70 ? "✅ Great ATS compatibility" : ats >= 40 ? "⚠️ Needs improvement" : "❌ Low ATS score — revamp your resume"}</p>
        </div>

        {/* Placement Probability */}
        <div style={card}>
          <p style={label}>Placement Probability</p>
          <ResponsiveContainer width="100%" height={180}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: prob }]} startAngle={180} endAngle={0}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={10} fill={probColor} />
            </RadialBarChart>
          </ResponsiveContainer>
          <h2 style={{ textAlign: "center", color: probColor, marginTop: "-1rem" }}>{prob}%</h2>
          <p style={hint}>{prob >= 70 ? "✅ High placement chance" : prob >= 40 ? "⚠️ Moderate — strengthen skills" : "❌ Low — consider upskilling"}</p>
        </div>
      </div>

      {/* ── Missing Skills ── */}
      <div style={{ ...card, marginBottom: "1.5rem" }}>
        <p style={label}>Missing Skills</p>
        {missingSkillsData.length === 0 ? (
          <p style={{ color: "#34523e" }}>No major skill gaps detected 🎯</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={missingSkillsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── History ── */}
      <div style={card}>
        <p style={label}>Analysis History</p>
        {history.length === 0 ? (
          <p style={{ color: "#7a9984", fontSize: ".88rem" }}>No previous analyses found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            {history.map((h, i) => (
              <div key={i} style={histRow}>
                <div>
                  <p style={{ fontWeight: 600, color: "#0a1f12", fontSize: ".9rem" }}>
                    Analysis #{history.length - i}
                  </p>
                  <p style={{ fontSize: ".75rem", color: "#7a9984" }}>
                    {new Date(h.createdAt).toLocaleString()}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <span style={{ ...badge, background: h.atsScore >= 70 ? "#dcfce7" : "#fef9c3", color: h.atsScore >= 70 ? "#166534" : "#854d0e" }}>
                    ATS: {Math.round(h.atsScore)}
                  </span>
                  <span style={{ ...badge, background: "#dbeafe", color: "#1e40af" }}>
                    Placement: {Math.round(h.placementProbability)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Styles ──
const card = {
  flex: 1, minWidth: 280, background: "#fff", padding: "1.5rem",
  borderRadius: 16, boxShadow: "0 4px 18px rgba(10,31,18,.08)",
};
const label = {
  fontSize: ".65rem", fontWeight: 700, letterSpacing: ".12em",
  textTransform: "uppercase", color: "#7a9984", marginBottom: ".5rem",
};
const hint = { fontSize: ".78rem", color: "#34523e", marginTop: ".6rem" };
const histRow = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: ".85rem 1rem", background: "#f4f8f5", borderRadius: 10, flexWrap: "wrap", gap: ".5rem",
};
const badge = { fontSize: ".75rem", fontWeight: 700, padding: "4px 10px", borderRadius: 20 };

export default Analytics;