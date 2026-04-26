import { useState, useEffect, useRef, useCallback } from "react";
import { FaClock, FaSignOutAlt } from "react-icons/fa";
import { MdOutlineTimer } from "react-icons/md";
import { HiOutlineCheckCircle } from "react-icons/hi";

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function AssessmentSession({
  topic, questions, timePerQuestion,
  onComplete, onLeaveRequest,
}) {
  const totalQ       = questions.length;
  const totalSeconds = totalQ * timePerQuestion;

  const [currentIdx,  setCurrentIdx]  = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [perQTime,    setPerQTime]    = useState(timePerQuestion);
  const [overallTime, setOverallTime] = useState(totalSeconds);
  const [advancing,   setAdvancing]   = useState(false);

  const perQRef        = useRef(null);
  const overallRef     = useRef(null);
  const startRef       = useRef(Date.now());
  const advanceLock    = useRef(false);
  const completedRef   = useRef(false);
  const overallTimeRef = useRef(totalSeconds);
  const responsesRef   = useRef([]);
  const advanceTimer   = useRef(null);
  const commitRef      = useRef(null);

  useEffect(() => { overallTimeRef.current = overallTime; }, [overallTime]);

  const safeComplete = useCallback((elapsed) => {
    if (completedRef.current) return;
    completedRef.current = true;
    clearInterval(overallRef.current);
    clearInterval(perQRef.current);
    clearTimeout(advanceTimer.current);
    onComplete(responsesRef.current, Math.max(0, elapsed));
  }, [onComplete]);

  useEffect(() => {
    overallRef.current = setInterval(() => {
      setOverallTime(t => {
        if (t <= 1) {
          clearInterval(overallRef.current);
          const filled = [...responsesRef.current];
          for (let i = filled.length; i < totalQ; i++) {
            filled.push({
              question: questions[i].question, type: questions[i].type,
              selected_option: "", correct_answer: questions[i].answer,
              explanation: questions[i].explanation || "", time_taken: 0, timed_out: true,
            });
          }
          responsesRef.current = filled;
          setTimeout(() => safeComplete(totalSeconds), 50);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(overallRef.current);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (advancing) return;
    advanceLock.current = false;
    setPerQTime(timePerQuestion);
    setSelectedOpt(null);
    startRef.current = Date.now();
    perQRef.current = setInterval(() => {
      setPerQTime(t => {
        if (t <= 1) {
          clearInterval(perQRef.current);
          if (!advanceLock.current) { advanceLock.current = true; commitRef.current?.(null, true); }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(perQRef.current);
  }, [currentIdx]); // eslint-disable-line

  const commitAnswer = useCallback((option, timedOut) => {
    clearInterval(perQRef.current);
    clearTimeout(advanceTimer.current);
    const q = questions[currentIdx];
    if (!q) return;
    const timeTaken = Math.round((Date.now() - startRef.current) / 1000);
    responsesRef.current = [...responsesRef.current, {
      question: q.question, type: q.type,
      selected_option: option || "", correct_answer: q.answer,
      explanation: q.explanation || "", time_taken: timeTaken, timed_out: timedOut,
    }];
    setSelectedOpt(option);
    setAdvancing(true);
    const nextIdx = currentIdx + 1;
    const isLastQ = nextIdx >= totalQ;
    advanceTimer.current = setTimeout(() => {
      setAdvancing(false);
      if (isLastQ) {
        const elapsed = totalSeconds - overallTimeRef.current;
        safeComplete(elapsed);
      } else {
        setCurrentIdx(nextIdx);
      }
    }, 800);
  }, [currentIdx, totalQ, totalSeconds, questions, safeComplete]);

  commitRef.current = commitAnswer;

  const handleOption = (option) => {
    if (advancing) return;
    clearInterval(perQRef.current);
    advanceLock.current = true;
    commitAnswer(option, false);
  };

  const current    = questions[currentIdx];
  if (!current) return null;

  const perQPct    = (perQTime / timePerQuestion) * 100;
  const overallPct = (overallTime / totalSeconds) * 100;
  const timerColor = perQPct > 50 ? "#16a34a" : perQPct > 25 ? "#d97706" : "#dc2626";
  const globalColor= overallPct > 50 ? "#16a34a" : overallPct > 25 ? "#d97706" : "#dc2626";
  const isTF       = current.type === "truefalse";
  const progress   = Math.round((currentIdx / totalQ) * 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.5} }

        .session-root { font-family:'DM Sans',sans-serif; display:flex; flex-direction:column; gap:14px; padding-bottom:24px; }

        .opt-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          background: #fafafa;
          padding: 13px 16px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: #374151;
          cursor: pointer;
          text-align: left;
          transition: border-color .15s, background .15s, transform .12s, box-shadow .15s;
          width: 100%;
        }
        .opt-btn:hover:not(:disabled) {
          border-color: #86efac;
          background: #f0fdf4;
          transform: translateX(3px);
          box-shadow: 0 2px 10px rgba(22,163,74,0.08);
        }
        .opt-btn.selected {
          border-color: #16a34a;
          background: #f0fdf4;
          color: #15803d;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.12);
        }
        .opt-btn.dimmed {
          background: #f9fafb;
          border-color: #f3f4f6;
          color: #d1d5db;
          cursor: default;
        }
        .opt-btn.tf {
          flex: 1;
          justify-content: center;
          padding: 18px;
          font-size: 16px;
        }
      `}</style>

      <div className="session-root">

        {/* ── Top bar ── */}
        <div style={{
          background:"#fff", borderRadius:16, border:"1px solid #e5e7eb",
          boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
          padding:"12px 16px",
          display:"flex", alignItems:"center", gap:12,
          animation:"fadeUp .3s ease both",
        }}>
          {/* Overall timer */}
          <div style={{
            display:"flex", alignItems:"center", gap:6,
            background: overallPct > 25 ? "#f0fdf4" : "#fef2f2",
            border:`1px solid ${globalColor}30`,
            borderRadius:20, padding:"6px 12px", flexShrink:0,
          }}>
            <MdOutlineTimer size={14} color={globalColor} />
            <span style={{ fontSize:12, fontWeight:800, fontVariantNumeric:"tabular-nums", color:globalColor }}>
              {fmt(overallTime)}
            </span>
            <span style={{ fontSize:11, color:"#9ca3af" }}>total</span>
          </div>

          {/* Progress */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <span style={{ fontSize:11, fontWeight:700, color:"#16a34a", textTransform:"uppercase", letterSpacing:"0.1em" }}>
                {topic.charAt(0).toUpperCase() + topic.slice(1)}
              </span>
              <span style={{ fontSize:11, fontWeight:600, color:"#9ca3af" }}>
                {currentIdx + 1} / {totalQ}
              </span>
            </div>
            <div style={{ height:6, background:"#e5e7eb", borderRadius:99, overflow:"hidden" }}>
              <div style={{
                height:"100%", width:`${progress}%`,
                background:"linear-gradient(90deg,#4ade80,#16a34a)",
                borderRadius:99, transition:"width .3s ease",
              }} />
            </div>
          </div>

          {/* Type badge */}
          <span style={{
            fontSize:11, fontWeight:700,
            padding:"5px 10px", borderRadius:8,
            background: isTF ? "#fffbeb" : "#f0fdf4",
            color:      isTF ? "#d97706" : "#16a34a",
            border:     `1px solid ${isTF ? "#fde68a" : "#bbf7d0"}`,
            flexShrink:0,
          }}>
            {isTF ? "T / F" : "MCQ"}
          </span>

          {/* Leave */}
          <button
            onClick={onLeaveRequest}
            title="Leave test"
            style={{
              display:"flex", alignItems:"center", gap:6,
              fontSize:11, fontWeight:700, color:"#ef4444",
              background:"#fef2f2", border:"1px solid #fecaca",
              borderRadius:20, padding:"6px 11px", cursor:"pointer", flexShrink:0,
              fontFamily:"'DM Sans',sans-serif",
              transition:"background .15s",
            }}
          >
            <FaSignOutAlt size={10} />
            <span>Leave</span>
          </button>
        </div>

        {/* ── Question card ── */}
        <div style={{
          background:"#fff", borderRadius:20, border:"1px solid #e5e7eb",
          boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
          padding:"clamp(20px,4vw,32px)",
          animation:"fadeUp .35s ease .05s both",
        }}>

          {/* Circular per-Q timer */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
            <div style={{ position:"relative", width:72, height:72 }}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="30" fill="none" stroke="#e5e7eb" strokeWidth="5" />
                <circle
                  cx="36" cy="36" r="30" fill="none"
                  stroke={timerColor} strokeWidth="5"
                  strokeDasharray={`${2*Math.PI*30}`}
                  strokeDashoffset={`${2*Math.PI*30*(1-perQPct/100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 36 36)"
                  style={{ transition:"stroke-dashoffset 1s linear, stroke .4s" }}
                />
              </svg>
              <div style={{
                position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:18, fontWeight:800, color:timerColor, fontVariantNumeric:"tabular-nums",
              }}>
                {advancing
                  ? <HiOutlineCheckCircle size={22} color="#16a34a" />
                  : perQTime
                }
              </div>
            </div>
          </div>

          {/* Time's up notice */}
          {advancing && !selectedOpt && (
            <div style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              background:"#fffbeb", border:"1px solid #fde68a", color:"#d97706",
              borderRadius:10, padding:"10px 16px", marginBottom:18,
              fontSize:13, fontWeight:600,
            }}>
              <FaClock size={13} />
              <span>Time's up — moving to next question</span>
            </div>
          )}

          {/* Question number chip */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
            <span style={{
              fontSize:10, fontWeight:700, letterSpacing:"0.1em",
              background:"#f0fdf4", color:"#16a34a",
              border:"1px solid #bbf7d0", padding:"3px 9px", borderRadius:20,
            }}>
              Q{currentIdx+1} of {totalQ}
            </span>
          </div>

          {/* Question text */}
          <p style={{
            fontSize:"clamp(15px,2.5vw,17px)", fontWeight:600, color:"#111827",
            lineHeight:1.65, marginBottom:22,
          }}>
            {current.question}
          </p>

          {/* Options */}
          <div style={{ display:"flex", flexDirection: isTF ? "row" : "column", gap:10 }}>
            {current.options.map((option, i) => {
              const isSelected = selectedOpt === option;
              let cls = "opt-btn";
              if (isTF) cls += " tf";
              if (advancing) cls += isSelected ? " selected" : " dimmed";
              return (
                <button key={i} onClick={() => handleOption(option)} disabled={advancing} className={cls}>
                  {!isTF && (
                    <span style={{
                      width:26, height:26, borderRadius:8, flexShrink:0,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:11, fontWeight:800,
                      background: advancing && isSelected ? "#dcfce7" : "#f0fdf4",
                      color:      advancing && isSelected ? "#16a34a" : "#4ade80",
                      border:     advancing && isSelected ? "1.5px solid #86efac" : "1.5px solid #d1fae5",
                      transition:"all .15s",
                    }}>
                      {advancing && isSelected
                        ? <HiOutlineCheckCircle size={14} color="#16a34a" />
                        : String.fromCharCode(65 + i)
                      }
                    </span>
                  )}
                  {isTF && (
                    <span style={{ fontSize:20, marginRight:4 }}>{option === "True" ? "✅" : "❌"}</span>
                  )}
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Dot progress ── */}
        <div style={{ display:"flex", gap:4, justifyContent:"center", flexWrap:"wrap", padding:"0 8px" }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              height:5, borderRadius:99, transition:"all .3s ease",
              width: i===currentIdx ? 22 : 6,
              background: i < currentIdx ? "#16a34a" : i===currentIdx ? "#4ade80" : "#e5e7eb",
            }} />
          ))}
        </div>

        {/* Hint */}
        <p style={{ textAlign:"center", fontSize:11, color:"#9ca3af", fontWeight:500 }}>
          Results &amp; explanations will be shown after all questions are answered
        </p>

      </div>
    </>
  );
}