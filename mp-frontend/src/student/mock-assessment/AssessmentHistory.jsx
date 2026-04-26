import { useState, useEffect } from "react";
import {
  FaCheckCircle, FaTimesCircle, FaClock,
  FaChevronRight, FaArrowLeft, FaInbox,
} from "react-icons/fa";
import {
  HiOutlineClipboardList, HiOutlineClock,
  HiOutlineChartBar, HiOutlineShieldCheck,
} from "react-icons/hi";
import { MdOutlineQuiz } from "react-icons/md";
import AssessmentResult from "./AssessmentResult";
import API from "../../utils/api.js";

const TOPIC_ICONS = { aptitude:"🧮", reasoning:"🧩", verbal:"📖", technical:"💻", ml:"🤖" };

const GRADE_CFG = {
  "A+": { text:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0" },
  "A":  { text:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0" },
  "B":  { text:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
  "C":  { text:"#d97706", bg:"#fffbeb", border:"#fde68a" },
  "D":  { text:"#ea580c", bg:"#fff7ed", border:"#fed7aa" },
  "F":  { text:"#dc2626", bg:"#fef2f2", border:"#fecaca" },
};

const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", {
  day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit",
});
const fmtTime = (s) => !s ? "—" : s >= 60 ? `${Math.floor(s/60)}m ${s%60}s` : `${s}s`;

export default function AssessmentHistory({ onBack }) {
  const [history, setHistory]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [detail,  setDetail]            = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [fetchError, setFetchError]     = useState(null);

  useEffect(() => {
    API.get("/api/assessment/history")
      .then(r => setHistory(r.data))
      .catch(e => { console.error(e); setFetchError("Could not load history."); })
      .finally(() => setLoading(false));
  }, []);

  const handleView = async (id) => {
    setDetailLoading(true);
    try {
      const r = await API.get(`/api/assessment/history/${id}`);
      setDetail(r.data);
    } catch (e) { console.error(e); }
    finally { setDetailLoading(false); }
  };

  if (detail) return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <button
        onClick={() => setDetail(null)}
        style={{
          display:"inline-flex", alignItems:"center", gap:7, alignSelf:"flex-start",
          fontSize:12, fontWeight:700, color:"#16a34a",
          background:"#f0fdf4", border:"1px solid #bbf7d0",
          borderRadius:10, padding:"8px 14px", cursor:"pointer",
          fontFamily:"'DM Sans',sans-serif", transition:"background .15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background="#dcfce7"}
        onMouseLeave={e => e.currentTarget.style.background="#f0fdf4"}
      >
        <FaArrowLeft size={10} /> Back to History
      </button>
      <AssessmentResult
        result={detail}
        topic={detail.topic}
        onRestart={onBack}
        onViewHistory={() => setDetail(null)}
      />
    </div>
  );

  if (detailLoading) return (
    <div style={{ display:"flex", justifyContent:"center", padding:"80px 0" }}>
      <div style={{ width:40, height:40, border:"3px solid #d1fae5", borderTopColor:"#16a34a", borderRadius:"50%", animation:"spin .7s linear infinite" }} />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }

        .hist-root { font-family:'DM Sans',sans-serif; display:flex; flex-direction:column; gap:14px; padding-bottom:24px; }

        .hist-item {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          padding: 16px 18px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          transition: border-color .18s, box-shadow .18s, transform .18s;
          animation: fadeUp .35s ease both;
        }
        .hist-item:hover {
          border-color: #86efac;
          box-shadow: 0 4px 18px rgba(22,163,74,0.09);
          transform: translateY(-1px);
        }
        .hist-item:hover .chevron { color: #4ade80 !important; }
      `}</style>

      <div className="hist-root">

        {/* Header */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10,
          animation:"fadeUp .3s ease both",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:36, height:36, borderRadius:10,
              background:"linear-gradient(135deg,#22c55e,#16a34a)",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <MdOutlineQuiz size={18} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize:16, fontWeight:800, color:"#111827", margin:0 }}>Assessment History</h2>
              {history.length > 0 && (
                <p style={{ fontSize:11, color:"#9ca3af", fontWeight:500, margin:0, marginTop:1 }}>
                  {history.length} assessment{history.length !== 1 ? "s" : ""} completed
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onBack}
            style={{
              display:"flex", alignItems:"center", gap:7,
              fontSize:12, fontWeight:700, color:"#16a34a",
              background:"#f0fdf4", border:"1px solid #bbf7d0",
              borderRadius:10, padding:"9px 16px", cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif", transition:"background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background="#dcfce7"}
            onMouseLeave={e => e.currentTarget.style.background="#f0fdf4"}
          >
            <FaArrowLeft size={10} /> New Test
          </button>
        </div>

        {/* Error */}
        {fetchError && (
          <div style={{
            background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626",
            borderRadius:12, padding:"12px 16px", fontSize:13, fontWeight:600,
            display:"flex", alignItems:"center", gap:8,
          }}>
            <FaTimesCircle size={13} /> {fetchError}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display:"flex", justifyContent:"center", padding:"60px 0" }}>
            <div style={{ width:40, height:40, border:"3px solid #d1fae5", borderTopColor:"#16a34a", borderRadius:"50%", animation:"spin .7s linear infinite" }} />
          </div>
        )}

        {/* Empty */}
        {!loading && history.length === 0 && !fetchError && (
          <div style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            padding:"56px 20px", textAlign:"center",
            background:"#fafafa", borderRadius:16,
            border:"1.5px dashed #e5e7eb",
          }}>
            <div style={{
              width:56, height:56, borderRadius:16,
              background:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center",
              marginBottom:14,
            }}>
              <FaInbox size={22} color="#d1d5db" />
            </div>
            <p style={{ fontWeight:700, color:"#374151", fontSize:15, marginBottom:6 }}>No assessments yet</p>
            <p style={{ fontSize:13, color:"#9ca3af" }}>Complete a test to see your results here.</p>
          </div>
        )}

        {/* List */}
        {!loading && history.length > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {history.map((h, idx) => {
              const grade = h.grade || "F";
              const gc    = GRADE_CFG[grade] || GRADE_CFG["F"];
              return (
                <button
                  key={h._id}
                  className="hist-item"
                  onClick={() => handleView(h._id)}
                  style={{ animationDelay:`${idx * 0.04}s` }}
                >
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                    {/* Left */}
                    <div style={{ flex:1, minWidth:0 }}>
                      {/* Topic + date */}
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                        <span style={{
                          width:28, height:28, borderRadius:8, flexShrink:0,
                          background:"#f0fdf4", border:"1px solid #d1fae5",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:14,
                        }}>
                          {TOPIC_ICONS[h.topic] || "📋"}
                        </span>
                        <div>
                          <p style={{ fontSize:13, fontWeight:700, color:"#111827", margin:0 }}>
                            {h.topic?.charAt(0).toUpperCase() + h.topic?.slice(1)}
                          </p>
                          <p style={{ fontSize:11, color:"#9ca3af", margin:0, display:"flex", alignItems:"center", gap:4 }}>
                            <HiOutlineClock size={10} /> {fmtDate(h.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8 }}>
                        {[
                          { label:`${h.totalQuestions} Qs`, bg:"#f3f4f6", color:"#6b7280", border:"#e5e7eb" },
                          { label:`MCQ ${h.mcqCorrect}/${h.mcqTotal}`, bg:"#f0fdf4", color:"#16a34a", border:"#bbf7d0" },
                          { label:`T/F ${h.tfCorrect}/${h.tfTotal}`, bg:"#fffbeb", color:"#d97706", border:"#fde68a" },
                          { label:fmtTime(h.totalTimeTaken), bg:"#f3f4f6", color:"#6b7280", border:"#e5e7eb" },
                        ].map(({ label, bg, color, border }) => (
                          <span key={label} style={{ fontSize:11, fontWeight:600, background:bg, color, border:`1px solid ${border}`, padding:"3px 9px", borderRadius:20 }}>
                            {label}
                          </span>
                        ))}
                      </div>

                      {/* Mini progress */}
                      <div style={{ marginTop:12, height:4, background:"#f3f4f6", borderRadius:99, overflow:"hidden" }}>
                        <div style={{
                          height:"100%", borderRadius:99,
                          width:`${h.scorePercent}%`,
                          background: h.scorePercent>=70 ? "linear-gradient(90deg,#4ade80,#16a34a)" : h.scorePercent>=40 ? "#fbbf24" : "#f87171",
                          transition:"width .8s ease",
                        }} />
                      </div>
                    </div>

                    {/* Grade + chevron */}
                    <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                      <div style={{
                        display:"flex", flexDirection:"column", alignItems:"center",
                        background:gc.bg, border:`1.5px solid ${gc.border}`,
                        borderRadius:12, padding:"8px 12px",
                        minWidth:50,
                      }}>
                        <span style={{ fontSize:20, fontWeight:800, color:gc.text, lineHeight:1 }}>{grade}</span>
                        <span style={{ fontSize:10, color:"#9ca3af", fontWeight:600, marginTop:3 }}>{h.scorePercent}%</span>
                      </div>
                      <FaChevronRight size={11} color="#d1d5db" className="chevron" style={{ transition:"color .15s" }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}