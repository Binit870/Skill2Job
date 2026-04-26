import { useState, useEffect } from "react";
import {
  FaBullseye, FaClipboardList, FaChartBar, FaHistory,
} from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";
import {
  HiOutlineExclamationCircle, HiOutlineX,
  HiOutlineArrowLeft,
} from "react-icons/hi";

import AssessmentSetup   from "./AssessmentSetup";
import AssessmentSession from "./AssessmentSession";
import AssessmentResult  from "./AssessmentResult";
import AssessmentHistory from "./AssessmentHistory";
import API from "../../utils/api";

const STEPS = [
  { id:"setup",   label:"Setup",   Icon:FaBullseye },
  { id:"session", label:"Test",    Icon:FaClipboardList },
  { id:"result",  label:"Results", Icon:FaChartBar },
];

export default function MockAssessment() {
  const [step,            setStep]            = useState("setup");
  const [topic,           setTopic]           = useState("");
  const [questions,       setQuestions]       = useState([]);
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [result,          setResult]          = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState(null);
  const [showLeaveModal,  setShowLeaveModal]  = useState(false);

  useEffect(() => {
    if (step !== "session") return;
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setShowLeaveModal(true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [step]);

  const confirmLeave = () => { setShowLeaveModal(false); setStep("setup"); };
  const cancelLeave  = () => setShowLeaveModal(false);

  const handleReady = ({ topic:t, questions:q, timePerQuestion:tpq }) => {
    setTopic(t); setQuestions(q); setTimePerQuestion(tpq);
    setResult(null); setError(null); setLoading(false);
    setStep("session");
  };

  const handleComplete = async (responses, totalTimeTaken) => {
    setLoading(true); setError(null);
    try {
      const { data } = await API.post("/api/assessment/submit", { topic, responses, total_time_taken: totalTimeTaken });
      setResult(data); setLoading(false); setStep("result");
    } catch (err) {
      console.error("Submit error:", err?.response?.data || err.message);
      setError("Failed to submit assessment. Please try again.");
      setLoading(false);
    }
  };

  const currentIndex = ["setup","session","result"].indexOf(step);
  const showStepper  = step !== "history";
  const isInSession  = step === "session";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@1&display=swap');
        @keyframes spin     { to { transform:rotate(360deg); } }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes slideDown{ from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{
        minHeight:"100vh",
        background:"linear-gradient(160deg,#f0fdf4 0%,#ffffff 40%,#f9fafb 100%)",
        display:"flex", flexDirection:"column",
        overflowY:"auto",
        fontFamily:"'DM Sans',sans-serif",
      }}>

        {/* ── Leave modal ── */}
        {showLeaveModal && (
          <div style={{
            position:"fixed", inset:0, zIndex:50,
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:"0 16px",
          }}>
            {/* Backdrop */}
            <div
              onClick={cancelLeave}
              style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)", backdropFilter:"blur(4px)" }}
            />
            {/* Modal */}
            <div style={{
              position:"relative", zIndex:10,
              background:"#fff", borderRadius:20,
              border:"1px solid #e5e7eb",
              boxShadow:"0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)",
              padding:"clamp(24px,4vw,36px)",
              maxWidth:380, width:"100%",
              animation:"scaleIn .25s ease both",
            }}>
              {/* Close btn */}
              <button
                onClick={cancelLeave}
                style={{
                  position:"absolute", top:14, right:14,
                  width:28, height:28, borderRadius:8,
                  background:"#f3f4f6", border:"none", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"#9ca3af", transition:"background .15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background="#e5e7eb"}
                onMouseLeave={e => e.currentTarget.style.background="#f3f4f6"}
              >
                <HiOutlineX size={14} />
              </button>

              <div style={{ textAlign:"center", marginBottom:22 }}>
                <div style={{
                  width:56, height:56, borderRadius:16,
                  background:"#fffbeb", border:"2px solid #fde68a",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 14px", fontSize:24,
                }}>
                  ⚠️
                </div>
                <h3 style={{ fontSize:18, fontWeight:800, color:"#111827", margin:"0 0 8px" }}>
                  Leave the test?
                </h3>
                <p style={{ fontSize:13, color:"#6b7280", lineHeight:1.6, margin:0 }}>
                  Your progress will be <span style={{ fontWeight:700, color:"#dc2626" }}>lost</span> and you'll return to the setup screen.
                </p>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <button
                  onClick={cancelLeave}
                  style={{
                    padding:"11px", borderRadius:12,
                    border:"2px solid #bbf7d0", background:"#fff",
                    color:"#16a34a", fontWeight:700, fontSize:13,
                    fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
                    transition:"background .15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background="#f0fdf4"}
                  onMouseLeave={e => e.currentTarget.style.background="#fff"}
                >
                  Continue Test
                </button>
                <button
                  onClick={confirmLeave}
                  style={{
                    padding:"11px", borderRadius:12,
                    border:"none",
                    background:"linear-gradient(135deg,#f87171,#dc2626)",
                    color:"#fff", fontWeight:700, fontSize:13,
                    fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
                    boxShadow:"0 4px 12px rgba(220,38,38,0.25)",
                    transition:"opacity .15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity="0.9"}
                  onMouseLeave={e => e.currentTarget.style.opacity="1"}
                >
                  Leave Test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Header ── */}
        <header style={{
          position:"sticky", top:0, zIndex:30,
          background:"rgba(255,255,255,0.92)",
          backdropFilter:"blur(12px)",
          borderBottom:"1px solid #e5e7eb",
          boxShadow:"0 1px 6px rgba(0,0,0,0.04)",
        }}>
          <div style={{
            maxWidth:900, margin:"0 auto",
            padding:"0 clamp(16px,4vw,28px)",
            height:58,
            display:"flex", alignItems:"center", justifyContent:"space-between",
          }}>
            {/* Brand */}
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{
                width:34, height:34, borderRadius:10,
                background:"linear-gradient(135deg,#22c55e,#16a34a)",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 2px 8px rgba(22,163,74,0.30)",
              }}>
                <MdOutlineQuiz color="#fff" size={18} />
              </div>
              <span style={{ fontSize:15, fontWeight:800, color:"#052e16", letterSpacing:"-0.01em" }}>
                Mock Assessment
              </span>
            </div>

            {/* Right actions */}
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              {showStepper && !isInSession && (
                <span style={{
                  fontSize:11, fontWeight:700, color:"#16a34a",
                  background:"#f0fdf4", border:"1px solid #bbf7d0",
                  padding:"4px 12px", borderRadius:20,
                  display:"none",
                }}
                  className="sm-only"
                >
                  {step === "setup" ? "Setup" : "Complete"}
                </span>
              )}
              {!isInSession && (
                <button
                  onClick={() => { setStep("history"); setError(null); }}
                  style={{
                    display:"flex", alignItems:"center", gap:6,
                    fontSize:12, fontWeight:700, color:"#16a34a",
                    background:"#f0fdf4", border:"1px solid #bbf7d0",
                    borderRadius:20, padding:"7px 14px", cursor:"pointer",
                    fontFamily:"'DM Sans',sans-serif",
                    transition:"background .15s, border-color .15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background="#dcfce7"; e.currentTarget.style.borderColor="#4ade80"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="#f0fdf4"; e.currentTarget.style.borderColor="#bbf7d0"; }}
                >
                  <FaHistory size={11} />
                  <span>History</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ── Stepper ── */}
        {showStepper && (
          <div style={{
            background:"#fff",
            borderBottom:"1px solid #e5e7eb",
            animation:"slideDown .3s ease both",
          }}>
            <div style={{ maxWidth:900, margin:"0 auto", padding:"14px clamp(16px,4vw,28px)" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", maxWidth:280, margin:"0 auto", position:"relative" }}>
                {/* Connector line */}
                <div style={{
                  position:"absolute", top:18, left:"18%", right:"18%",
                  height:2, background:"#e5e7eb", zIndex:0, borderRadius:99,
                }}>
                  <div style={{
                    height:"100%", borderRadius:99,
                    background:"linear-gradient(90deg,#4ade80,#16a34a)",
                    width:`${(Math.max(0,currentIndex)/(STEPS.length-1))*100}%`,
                    transition:"width .5s ease",
                  }} />
                </div>

                {STEPS.map(({ id, label, Icon }, idx) => {
                  const done    = idx < currentIndex;
                  const active  = idx === currentIndex;
                  return (
                    <div key={id} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1, position:"relative", zIndex:1 }}>
                      <div style={{
                        width:36, height:36, borderRadius:"50%",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        background: done || active ? "linear-gradient(135deg,#22c55e,#16a34a)" : "#fff",
                        border: done || active ? "none" : "2px solid #e5e7eb",
                        boxShadow: active ? "0 0 0 4px rgba(22,163,74,0.15), 0 2px 8px rgba(22,163,74,0.20)" : "none",
                        transition:"all .3s ease",
                        color: done || active ? "#fff" : "#d1d5db",
                      }}>
                        <Icon size={14} />
                      </div>
                      <span style={{
                        fontSize:11, fontWeight:700, marginTop:6,
                        color: done || active ? "#16a34a" : "#d1d5db",
                        transition:"color .3s",
                      }}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Main content ── */}
        <main style={{ flex:1, width:"100%", maxWidth:900, margin:"0 auto", padding:"clamp(16px,4vw,28px)" }}>

          {/* Error banner */}
          {error && (
            <div style={{
              marginBottom:14,
              background:"#fef2f2", border:"1px solid #fecaca",
              color:"#dc2626", borderRadius:12,
              padding:"12px 16px", fontSize:13, fontWeight:600,
              display:"flex", alignItems:"center", justifyContent:"space-between",
              animation:"fadeUp .3s ease both",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <HiOutlineExclamationCircle size={15} />
                {error}
              </div>
              <button
                onClick={() => setError(null)}
                style={{ background:"none", border:"none", cursor:"pointer", color:"#f87171", fontSize:18, lineHeight:1, padding:0 }}
              >
                ×
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{
              display:"flex", flexDirection:"column", alignItems:"center",
              justifyContent:"center", padding:"100px 20px",
              animation:"fadeIn .3s ease both",
            }}>
              <div style={{
                width:48, height:48, borderRadius:"50%",
                border:"3px solid #d1fae5", borderTopColor:"#16a34a",
                animation:"spin .7s linear infinite", marginBottom:18,
              }} />
              <p style={{ color:"#9ca3af", fontSize:13, fontWeight:500 }}>
                {step === "setup" ? "Generating your questions…" : "Scoring your answers…"}
              </p>
            </div>
          )}

          {!loading && (
            <>
              {step==="setup"   && <AssessmentSetup onReady={handleReady} setLoading={setLoading} />}
              {step==="session" && (
                <AssessmentSession
                  topic={topic} questions={questions} timePerQuestion={timePerQuestion}
                  onComplete={handleComplete}
                  onLeaveRequest={() => setShowLeaveModal(true)}
                />
              )}
              {step==="result" && (
                <AssessmentResult
                  result={result} topic={topic}
                  onRestart={() => { setResult(null); setStep("setup"); }}
                  onViewHistory={() => setStep("history")}
                />
              )}
              {step==="history" && <AssessmentHistory onBack={() => setStep("setup")} />}
            </>
          )}
        </main>

        {/* ── Footer ── */}
        <footer style={{
          textAlign:"center", fontSize:11, color:"#d1d5db",
          padding:"14px 20px",
          borderTop:"1px solid #f0fdf4",
          background:"#fff",
        }}>
          © {new Date().getFullYear()} Mock Assessment · Built with ❤️ by Skill2Job
        </footer>

      </div>
    </>
  );
}