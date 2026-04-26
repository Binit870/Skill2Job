import { useState } from "react";
import {
  FaCheckCircle, FaTimesCircle, FaClock,
  FaRedo, FaHistory, FaTrophy,
} from "react-icons/fa";
import {
  HiOutlineChartBar, HiOutlineLightningBolt,
  HiOutlineClipboardList, HiOutlineCheckCircle,
} from "react-icons/hi";

function normalise(raw) {
  if (!raw) return null;
  return {
    topic:            raw.topic ?? "",
    score_percent:    raw.score_percent    ?? raw.scorePercent    ?? 0,
    grade:            raw.grade            ?? "F",
    grade_label:      raw.grade_label      ?? raw.gradeLabel      ?? "",
    correct:          raw.correct          ?? 0,
    wrong:            raw.wrong            ?? 0,
    total_questions:  raw.total_questions  ?? raw.totalQuestions  ?? 0,
    mcq_total:        raw.mcq_total        ?? raw.mcqTotal        ?? 0,
    mcq_correct:      raw.mcq_correct      ?? raw.mcqCorrect      ?? 0,
    tf_total:         raw.tf_total         ?? raw.tfTotal         ?? 0,
    tf_correct:       raw.tf_correct       ?? raw.tfCorrect       ?? 0,
    total_time_taken: raw.total_time_taken ?? raw.totalTimeTaken  ?? 0,
    results:          raw.results          ?? [],
  };
}

const GRADE_CFG = {
  "A+": { bar:"#16a34a", text:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0" },
  "A":  { bar:"#16a34a", text:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0" },
  "B":  { bar:"#3b82f6", text:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
  "C":  { bar:"#f59e0b", text:"#d97706", bg:"#fffbeb", border:"#fde68a" },
  "D":  { bar:"#f97316", text:"#ea580c", bg:"#fff7ed", border:"#fed7aa" },
  "F":  { bar:"#ef4444", text:"#dc2626", bg:"#fef2f2", border:"#fecaca" },
};

const fmt = (s) => !s ? "—" : s >= 60 ? `${Math.floor(s/60)}m ${s%60}s` : `${s}s`;

const StatCard = ({ label, value, color, bg, border, icon: Icon, delay=0 }) => (
  <div style={{
    background:bg, border:`1px solid ${border}`, borderRadius:14,
    padding:"16px", textAlign:"center",
    animation:`fadeUp .4s ease ${delay}s both`,
  }}>
    {Icon && <Icon size={16} color={color} style={{ margin:"0 auto 6px", display:"block" }} />}
    <p style={{ fontSize:22, fontWeight:800, color, lineHeight:1 }}>{value}</p>
    <p style={{ fontSize:11, color:"#9ca3af", fontWeight:600, marginTop:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</p>
  </div>
);

export default function AssessmentResult({ result: raw, topic, onRestart, onViewHistory }) {
  const [tab, setTab] = useState("all");
  const result = normalise(raw);

  if (!result) return (
    <div style={{ textAlign:"center", padding:"60px 20px", color:"#9ca3af", fontFamily:"'DM Sans',sans-serif" }}>
      <p style={{ fontSize:40, marginBottom:12 }}>😕</p>
      <p style={{ fontWeight:600, fontSize:15 }}>No result data found.</p>
      <button onClick={onRestart} style={{ marginTop:16, color:"#16a34a", fontWeight:700, background:"none", border:"none", cursor:"pointer", textDecoration:"underline", fontFamily:"'DM Sans',sans-serif" }}>
        Try again
      </button>
    </div>
  );

  const {
    score_percent, grade, grade_label,
    correct, wrong, total_questions,
    mcq_total, mcq_correct, tf_total, tf_correct,
    total_time_taken, results,
  } = result;

  const gc = GRADE_CFG[grade] || GRADE_CFG["C"];
  const filtered =
    tab === "mcq" ? results.filter(r => r.type === "mcq") :
    tab === "tf"  ? results.filter(r => r.type === "truefalse") :
    results;

  const R    = 44;
  const circ = 2 * Math.PI * R;
  const dash = circ * (score_percent / 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@1&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }

        .result-root { font-family:'DM Sans',sans-serif; display:flex; flex-direction:column; gap:16px; padding-bottom:24px; }

        .tab-btn {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          border: 1.5px solid #e5e7eb;
          background: #fafafa;
          color: #6b7280;
          cursor: pointer;
          transition: all .15s;
          font-family: 'DM Sans', sans-serif;
        }
        .tab-btn.active {
          background: #16a34a;
          border-color: #16a34a;
          color: #fff;
          box-shadow: 0 2px 8px rgba(22,163,74,0.25);
        }
        .tab-btn:not(.active):hover {
          border-color: #86efac;
          color: #16a34a;
          background: #f0fdf4;
        }

        .q-card {
          border-radius: 14px;
          border: 1.5px solid;
          padding: 16px;
          display: flex;
          gap: 12px;
          animation: fadeUp .3s ease both;
        }
      `}</style>

      <div className="result-root">

        {/* ── Hero ── */}
        <div style={{
          borderRadius:20,
          background:"linear-gradient(130deg,#166534 0%,#16a34a 55%,#22c55e 100%)",
          padding:"clamp(22px,4vw,36px)",
          color:"#fff",
          position:"relative",
          overflow:"hidden",
          animation:"scaleIn .4s ease both",
          boxShadow:"0 8px 32px rgba(22,163,74,0.30)",
        }}>
          <div style={{ position:"absolute",top:-20,right:-20,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.06)", pointerEvents:"none" }} />
          <div style={{ position:"absolute",bottom:-30,right:80,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />

          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:20, position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
              {/* Score ring */}
              <div style={{ position:"relative", width:112, height:112, flexShrink:0 }}>
                <svg width="112" height="112" viewBox="0 0 112 112">
                  <circle cx="56" cy="56" r={R} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                  <circle
                    cx="56" cy="56" r={R} fill="none"
                    stroke="white" strokeWidth="8"
                    strokeDasharray={`${circ}`}
                    strokeDashoffset={`${circ - dash}`}
                    strokeLinecap="round"
                    transform="rotate(-90 56 56)"
                    style={{ transition:"stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <div style={{
                  position:"absolute", inset:0, display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center",
                }}>
                  <span style={{ fontSize:28, fontWeight:800, lineHeight:1 }}>{grade}</span>
                  <span style={{ fontSize:13, fontWeight:700, opacity:0.85 }}>{score_percent}%</span>
                </div>
              </div>

              <div>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", opacity:0.65, marginBottom:6 }}>
                  {((topic || result.topic)).charAt(0).toUpperCase() + ((topic || result.topic)).slice(1)} · Complete
                </p>
                <h2 style={{
                  fontFamily:"'Instrument Serif',serif",
                  fontSize:"clamp(20px,4vw,28px)",
                  fontWeight:400, fontStyle:"italic",
                  margin:"0 0 8px", lineHeight:1.15,
                }}>
                  {grade_label}
                </h2>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.75)", margin:0 }}>
                  {correct} of {total_questions} correct · finished in {fmt(total_time_taken)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
          <StatCard label="Correct"    value={correct}              color="#16a34a" bg="#f0fdf4" border="#bbf7d0" delay={0.05} />
          <StatCard label="Wrong"      value={wrong}                color="#dc2626" bg="#fef2f2" border="#fecaca" delay={0.08} />
          <StatCard label="MCQ"        value={`${mcq_correct}/${mcq_total}`} color="#2563eb" bg="#eff6ff" border="#bfdbfe" delay={0.11} />
          <StatCard label="True/False" value={`${tf_correct}/${tf_total}`}  color="#d97706" bg="#fffbeb" border="#fde68a" delay={0.14} />
        </div>

        {/* ── Score bar ── */}
        <div style={{
          background:"#fff", borderRadius:16, border:"1px solid #e5e7eb",
          boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
          padding:"clamp(16px,3vw,24px)",
          animation:"fadeUp .4s ease .1s both",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <HiOutlineChartBar size={14} color="#16a34a" />
              <span style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em" }}>
                Overall Score
              </span>
            </div>
            <span style={{ fontSize:15, fontWeight:800, color:gc.text }}>{score_percent}%</span>
          </div>
          <div style={{ height:10, background:"#f3f4f6", borderRadius:99, overflow:"hidden", border:"1px solid #e5e7eb" }}>
            <div style={{
              height:"100%", borderRadius:99,
              background:`linear-gradient(90deg,${gc.bar}aa,${gc.bar})`,
              width:`${score_percent}%`,
              transition:"width 1s cubic-bezier(0.34,1.56,0.64,1)",
            }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
            {["0%","50%","100%"].map(l => (
              <span key={l} style={{ fontSize:10, color:"#d1d5db" }}>{l}</span>
            ))}
          </div>
        </div>

        {/* ── Question breakdown ── */}
        <div style={{
          background:"#fff", borderRadius:16, border:"1px solid #e5e7eb",
          boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
          padding:"clamp(16px,3vw,24px)",
          animation:"fadeUp .4s ease .15s both",
        }}>
          {/* Header + tabs */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <HiOutlineClipboardList size={14} color="#16a34a" />
              <span style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em" }}>
                Question Review
              </span>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {[
                { id:"all", label:`All (${total_questions})` },
                { id:"mcq", label:`MCQ (${mcq_total})` },
                { id:"tf",  label:`T/F (${tf_total})` },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`tab-btn${tab===t.id?" active":""}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p style={{ textAlign:"center", color:"#9ca3af", fontSize:13, padding:"28px 0" }}>
              No questions in this category.
            </p>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {filtered.map((r, i) => {
                const isCorrect = r.is_correct;
                const isTimeout = r.timed_out;
                const cardBg     = isCorrect ? "#f0fdf4" : isTimeout ? "#fffbeb" : "#fef2f2";
                const cardBorder = isCorrect ? "#bbf7d0" : isTimeout ? "#fde68a" : "#fecaca";
                return (
                  <div key={i} className="q-card" style={{ background:cardBg, borderColor:cardBorder, animationDelay:`${i*0.03}s` }}>
                    <div style={{ flexShrink:0, marginTop:2 }}>
                      {isCorrect
                        ? <FaCheckCircle size={15} color="#16a34a" />
                        : isTimeout
                        ? <FaClock size={15} color="#d97706" />
                        : <FaTimesCircle size={15} color="#ef4444" />
                      }
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                        <span style={{
                          fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:6,
                          background: r.type==="truefalse" ? "#fffbeb" : "#f0fdf4",
                          color:      r.type==="truefalse" ? "#d97706" : "#16a34a",
                          border:     `1px solid ${r.type==="truefalse" ? "#fde68a" : "#bbf7d0"}`,
                        }}>
                          {r.type==="truefalse" ? "T/F" : "MCQ"}
                        </span>
                        <span style={{ fontSize:10, fontWeight:600, color:"#9ca3af", background:"#f3f4f6", padding:"2px 8px", borderRadius:6 }}>
                          {r.time_taken}s
                        </span>
                      </div>
                      <p style={{ fontSize:13, fontWeight:600, color:"#1f2937", lineHeight:1.55, marginBottom:8 }}>
                        {r.question}
                      </p>
                      {isCorrect ? (
                        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                          <HiOutlineCheckCircle size={13} color="#16a34a" />
                          <p style={{ fontSize:12, color:"#16a34a", fontWeight:600 }}>
                            {r.selected_option}
                          </p>
                        </div>
                      ) : (
                        <div style={{ display:"flex", flexWrap:"wrap", gap:16 }}>
                          <p style={{ fontSize:12, color:"#6b7280" }}>
                            Your answer:{" "}
                            <span style={{ fontWeight:700, color: isTimeout ? "#d97706" : "#dc2626" }}>
                              {isTimeout ? "Timed out" : (r.selected_option || "—")}
                            </span>
                          </p>
                          <p style={{ fontSize:12, color:"#6b7280" }}>
                            Correct:{" "}
                            <span style={{ fontWeight:700, color:"#16a34a" }}>{r.correct_answer}</span>
                          </p>
                        </div>
                      )}
                      {r.explanation && (
                        <p style={{ fontSize:11, color:"#9ca3af", marginTop:8, fontStyle:"italic", lineHeight:1.55, borderTop:"1px solid rgba(0,0,0,0.05)", paddingTop:8 }}>
                          💡 {r.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Actions ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, animation:"fadeUp .4s ease .2s both" }}>
          <button
            onClick={onRestart}
            style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              background:"linear-gradient(135deg,#22c55e,#16a34a)",
              color:"#fff", fontFamily:"'DM Sans',sans-serif",
              fontSize:14, fontWeight:700,
              padding:"14px", borderRadius:14, border:"none", cursor:"pointer",
              boxShadow:"0 4px 16px rgba(22,163,74,0.30)",
              transition:"transform .15s, box-shadow .15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(22,163,74,0.40)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 4px 16px rgba(22,163,74,0.30)"; }}
          >
            <FaRedo size={12} /> Try Again
          </button>
          <button
            onClick={onViewHistory}
            style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              background:"#fff",
              color:"#16a34a", fontFamily:"'DM Sans',sans-serif",
              fontSize:14, fontWeight:700,
              padding:"14px", borderRadius:14,
              border:"2px solid #bbf7d0", cursor:"pointer",
              transition:"background .15s, border-color .15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background="#f0fdf4"; e.currentTarget.style.borderColor="#4ade80"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor="#bbf7d0"; }}
          >
            <FaHistory size={12} /> View History
          </button>
        </div>

      </div>
    </>
  );
}