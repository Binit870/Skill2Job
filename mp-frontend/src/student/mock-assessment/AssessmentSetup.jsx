import { useState } from "react";
import {
  FaCalculator, FaBrain, FaBook, FaCode, FaRobot,
  FaPlay, FaClock, FaListOl, FaCheckCircle,
} from "react-icons/fa";
import { MdOutlineQuiz, MdTune } from "react-icons/md";
import { HiOutlineLightningBolt } from "react-icons/hi";
import API from "../../utils/api.js";

const TOPICS = [
  { id: "aptitude",  label: "Aptitude",           Icon: FaCalculator, desc: "Numbers, percentages, time & work",    accent: "#3b82f6", lightBg: "#eff6ff", border: "#bfdbfe" },
  { id: "reasoning", label: "Reasoning",          Icon: FaBrain,      desc: "Series, coding, logical deduction",    accent: "#8b5cf6", lightBg: "#f5f3ff", border: "#ddd6fe" },
  { id: "verbal",    label: "Verbal",              Icon: FaBook,       desc: "Grammar, vocabulary, comprehension",   accent: "#f59e0b", lightBg: "#fffbeb", border: "#fde68a" },
  { id: "technical", label: "Technical / Coding",  Icon: FaCode,       desc: "DSA, OS, DBMS, networking",            accent: "#16a34a", lightBg: "#f0fdf4", border: "#bbf7d0" },
  { id: "ml",        label: "Machine Learning",    Icon: FaRobot,      desc: "ML concepts, algorithms, metrics",     accent: "#ef4444", lightBg: "#fef2f2", border: "#fecaca" },
];

const Q_COUNTS  = [5, 10, 15, 20];
const TIME_OPTS = [{ v: 20, l: "20s" }, { v: 30, l: "30s" }, { v: 45, l: "45s" }, { v: 60, l: "60s" }];

/* ── Small shared components ── */
const SectionCard = ({ children, delay = 0 }) => (
  <div style={{
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    padding: "clamp(18px,3vw,26px)",
    animation: `fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
  }}>
    {children}
  </div>
);

const SectionLabel = ({ step, children, icon: Icon }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
    <div style={{
      width: 24, height: 24, borderRadius: 6,
      background: "linear-gradient(135deg,#22c55e,#16a34a)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0,
    }}>
      {step}
    </div>
    {Icon && <Icon size={13} color="#16a34a" />}
    <span style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "0.13em",
      textTransform: "uppercase", color: "#16a34a",
    }}>
      {children}
    </span>
  </div>
);

export default function AssessmentSetup({ onReady, setLoading }) {
  const [topic,    setTopic]    = useState(null);
  const [numQ,     setNumQ]     = useState(10);
  const [timePerQ, setTimePerQ] = useState(30);
  const [tfRatio,  setTfRatio]  = useState(30);

  const nTF   = Math.round(numQ * tfRatio / 100);
  const nMCQ  = numQ - nTF;
  const estMin = Math.ceil((numQ * timePerQ) / 60);
  const sel    = TOPICS.find(t => t.id === topic);

  const handleStart = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const { data } = await API.post("api/assessment/generate", {
        topic, num_questions: numQ, time_per_question: timePerQ, tf_ratio: tfRatio / 100,
      });
      onReady({ topic, questions: data.questions, timePerQuestion: data.time_per_question });
    } catch (err) {
      console.error("Generate error:", err?.response?.data || err.message);
      alert("Failed to generate questions. Check that both servers are running.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@1&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

        .setup-root { font-family:'DM Sans',sans-serif; display:flex; flex-direction:column; gap:16px; padding-bottom:24px; }

        .topic-card {
          border-radius: 14px;
          border: 1.5px solid #e5e7eb;
          background: #fafafa;
          padding: 16px;
          cursor: pointer;
          transition: border-color .18s, background .18s, transform .18s, box-shadow .18s;
          text-align: left;
          position: relative;
          font-family: 'DM Sans', sans-serif;
        }
        .topic-card:hover {
          border-color: #86efac;
          background: #f0fdf4;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(22,163,74,0.10);
        }
        .topic-card.active {
          background: var(--act-bg);
          border-color: var(--act-border);
          border-width: 2px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        }

        .seg-btn {
          flex: 1;
          padding: 10px 0;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          border: 1.5px solid #e5e7eb;
          background: #fafafa;
          color: #6b7280;
          cursor: pointer;
          transition: all .15s;
          font-family: 'DM Sans', sans-serif;
        }
        .seg-btn:hover { border-color: #86efac; color: #16a34a; background: #f0fdf4; }
        .seg-btn.active {
          background: linear-gradient(135deg,#22c55e,#16a34a);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 2px 8px rgba(22,163,74,0.30);
        }

        input[type=range] {
          width: 100%; height: 6px; border-radius: 99px;
          accent-color: #16a34a; cursor: pointer;
          background: linear-gradient(90deg,#bbf7d0,#dcfce7);
        }
      `}</style>

      <div className="setup-root">

        {/* ── Hero banner ── */}
        <div style={{
          borderRadius: 20,
          background: "linear-gradient(130deg,#166534 0%,#16a34a 50%,#22c55e 100%)",
          padding: "clamp(22px,4vw,36px)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          animation: "fadeUp .35s ease both",
          boxShadow: "0 8px 32px rgba(22,163,74,0.30)",
        }}>
          {/* decorative circles */}
          <div style={{ position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.06)", pointerEvents:"none" }} />
          <div style={{ position:"absolute",bottom:-40,right:60,width:90,height:90,borderRadius:"50%",background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />

          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12, position:"relative" }}>
            <div style={{
              width:40, height:40, borderRadius:12,
              background:"rgba(255,255,255,0.18)",
              display:"flex", alignItems:"center", justifyContent:"center",
              backdropFilter:"blur(6px)",
            }}>
              <MdOutlineQuiz size={22} color="#fff" />
            </div>
            <div>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", opacity:0.7, marginBottom:2 }}>
                Skill Assessment
              </p>
              <h1 style={{
                fontFamily:"'Instrument Serif',serif",
                fontSize:"clamp(20px,4vw,28px)",
                fontWeight:400, margin:0, lineHeight:1.1, fontStyle:"italic",
              }}>
                Mock Assessment
              </h1>
            </div>
          </div>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.75)", margin:0, maxWidth:420, lineHeight:1.6, position:"relative" }}>
            Pick a topic, configure your test, then tackle a timed mix of MCQ and True/False questions.
          </p>
        </div>

        {/* ── Topic Selection ── */}
        <SectionCard delay={0.05}>
          <SectionLabel step="1" icon={HiOutlineLightningBolt}>Select Topic</SectionLabel>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10 }}>
            {TOPICS.map(({ id, label, Icon, desc, accent, lightBg, border }) => {
              const active = topic === id;
              return (
                <button
                  key={id}
                  onClick={() => setTopic(id)}
                  className={`topic-card ${active ? "active" : ""}`}
                  style={active ? { "--act-bg": lightBg, "--act-border": border } : {}}
                >
                  {active && (
                    <FaCheckCircle size={13} color="#16a34a" style={{ position:"absolute", top:12, right:12 }} />
                  )}
                  <div style={{
                    width:32, height:32, borderRadius:8, marginBottom:10,
                    background: active ? `${accent}18` : "#f3f4f6",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    transition:"background .18s",
                  }}>
                    <Icon size={15} color={active ? accent : "#9ca3af"} />
                  </div>
                  <p style={{ fontSize:13, fontWeight:700, color: active ? "#111827" : "#374151", marginBottom:3 }}>
                    {label}
                  </p>
                  <p style={{ fontSize:11, color:"#9ca3af", lineHeight:1.45 }}>{desc}</p>
                </button>
              );
            })}
          </div>
        </SectionCard>

        {/* ── Configure Test ── */}
        <SectionCard delay={0.1}>
          <SectionLabel step="2" icon={MdTune}>Configure Test</SectionLabel>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            {/* Question count */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12 }}>
                <FaListOl size={12} color="#16a34a" />
                <span style={{ fontSize:11, fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em" }}>
                  Questions
                </span>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {Q_COUNTS.map(n => (
                  <button key={n} onClick={() => setNumQ(n)} className={`seg-btn${numQ===n?" active":""}`}>{n}</button>
                ))}
              </div>
            </div>

            {/* Time per question */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12 }}>
                <FaClock size={12} color="#16a34a" />
                <span style={{ fontSize:11, fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em" }}>
                  Time / Question
                </span>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {TIME_OPTS.map(({ v, l }) => (
                  <button key={v} onClick={() => setTimePerQ(v)} className={`seg-btn${timePerQ===v?" active":""}`}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Mix slider */}
          <div style={{ marginTop:24 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <MdTune size={14} color="#16a34a" />
                <span style={{ fontSize:11, fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em" }}>
                  Question Mix
                </span>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <span style={{ fontSize:11, fontWeight:700, background:"#f0fdf4", color:"#16a34a", padding:"3px 10px", borderRadius:20, border:"1px solid #bbf7d0" }}>
                  {nMCQ} MCQ
                </span>
                <span style={{ fontSize:11, fontWeight:700, background:"#fffbeb", color:"#d97706", padding:"3px 10px", borderRadius:20, border:"1px solid #fde68a" }}>
                  {nTF} T/F
                </span>
              </div>
            </div>
            <input
              type="range" min={0} max={60} step={10} value={tfRatio}
              onChange={e => setTfRatio(Number(e.target.value))}
            />
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
              {["All MCQ","Equal mix","60% T/F"].map(l => (
                <span key={l} style={{ fontSize:11, color:"#9ca3af" }}>{l}</span>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* ── CTA / Summary ── */}
        {topic ? (
          <div style={{
            background:"#fff",
            borderRadius:16,
            border:"1.5px solid #bbf7d0",
            padding:"clamp(16px,3vw,24px)",
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between",
            flexWrap:"wrap",
            gap:16,
            boxShadow:"0 2px 12px rgba(22,163,74,0.08)",
            animation:"fadeUp .4s ease .15s both",
          }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                <div style={{ width:20, height:20, borderRadius:5, background:"linear-gradient(135deg,#22c55e,#16a34a)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:9, fontWeight:800, color:"#fff" }}>3</span>
                </div>
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.13em", textTransform:"uppercase", color:"#16a34a" }}>
                  Ready to start
                </span>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {[
                  { label: sel?.label, bg:"#f0fdf4", color:"#16a34a", border:"#bbf7d0" },
                  { label: `${nMCQ} MCQ + ${nTF} T/F`, bg:"#f9fafb", color:"#374151", border:"#e5e7eb" },
                  { label: `${timePerQ}s / question`, bg:"#f9fafb", color:"#374151", border:"#e5e7eb" },
                  { label: `~${estMin} min total`, bg:"#f9fafb", color:"#374151", border:"#e5e7eb" },
                ].map(({ label, bg, color, border }) => (
                  <span key={label} style={{ fontSize:12, fontWeight:600, background:bg, color, border:`1px solid ${border}`, padding:"4px 12px", borderRadius:20 }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={handleStart}
              style={{
                display:"flex", alignItems:"center", gap:8,
                background:"linear-gradient(135deg,#22c55e,#16a34a)",
                color:"#fff", fontFamily:"'DM Sans',sans-serif",
                fontSize:14, fontWeight:700,
                padding:"12px 28px", borderRadius:12, border:"none",
                cursor:"pointer", flexShrink:0,
                boxShadow:"0 4px 16px rgba(22,163,74,0.35)",
                transition:"transform .15s, box-shadow .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(22,163,74,0.40)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 4px 16px rgba(22,163,74,0.35)"; }}
            >
              <FaPlay size={11} /> Start Assessment
            </button>
          </div>
        ) : (
          <div style={{
            background:"#fafafa", borderRadius:16, border:"1.5px dashed #d1d5db",
            padding:"28px 20px", textAlign:"center",
            color:"#9ca3af", fontSize:13, fontWeight:500,
            animation:"fadeUp .4s ease .15s both",
          }}>
            Select a topic above to continue
          </div>
        )}
      </div>
    </>
  );
}