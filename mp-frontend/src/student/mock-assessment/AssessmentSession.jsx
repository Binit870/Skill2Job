import { useState, useEffect, useRef, useCallback } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { MdOutlineTimer } from "react-icons/md";

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function AssessmentSession({ topic, questions, timePerQuestion, onComplete }) {
  const totalQ       = questions.length;
  const totalSeconds = totalQ * timePerQuestion;

  const [currentIdx,   setCurrentIdx]   = useState(0);
  const [selectedOpt,  setSelectedOpt]  = useState(null);
  const [perQTime,     setPerQTime]     = useState(timePerQuestion);
  const [overallTime,  setOverallTime]  = useState(totalSeconds);
  const [showFeedback, setShowFeedback] = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const perQRef        = useRef(null);
  const overallRef     = useRef(null);
  const startRef       = useRef(Date.now());
  const advanceLock    = useRef(false);          // blocks double per-Q timeout
  const completedRef   = useRef(false);          // one-way gate: onComplete fires once
  const overallTimeRef = useRef(totalSeconds);   // live copy for elapsed calc
  const responsesRef   = useRef([]);             // accumulates responses (no stale closure)
  const advanceTimer   = useRef(null);           // holds the 1.5s feedback setTimeout
  const commitRef      = useRef(null);           // stable pointer to latest commitAnswer

  // keep overallTimeRef current
  useEffect(() => { overallTimeRef.current = overallTime; }, [overallTime]);

  // ── safeComplete — fires onComplete exactly once ──────────────────────────
  const safeComplete = useCallback((elapsed) => {
    if (completedRef.current) return;
    completedRef.current = true;
    clearInterval(overallRef.current);
    clearInterval(perQRef.current);
    clearTimeout(advanceTimer.current);
    onComplete(responsesRef.current, Math.max(0, elapsed));
  }, [onComplete]);

  // ── Overall countdown (mount once) ────────────────────────────────────────
  useEffect(() => {
    overallRef.current = setInterval(() => {
      setOverallTime(t => {
        if (t <= 1) {
          clearInterval(overallRef.current);
          // fill any unanswered questions then complete
          const filled = [...responsesRef.current];
          for (let i = filled.length; i < totalQ; i++) {
            filled.push({
              question: questions[i].question,
              type: questions[i].type,
              selected_option: "",
              correct_answer: questions[i].answer,
              explanation: questions[i].explanation || "",
              time_taken: 0,
              timed_out: true,
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

  // ── Per-question countdown (resets on new question) ───────────────────────
  useEffect(() => {
    if (showFeedback) return;
    advanceLock.current = false;
    setPerQTime(timePerQuestion);
    setSelectedOpt(null);
    startRef.current = Date.now();

    perQRef.current = setInterval(() => {
      setPerQTime(t => {
        if (t <= 1) {
          clearInterval(perQRef.current);
          if (!advanceLock.current) {
            advanceLock.current = true;
            commitRef.current?.(null, true);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(perQRef.current);
  }, [currentIdx]); // eslint-disable-line

  // ── commitAnswer ──────────────────────────────────────────────────────────
  // IMPORTANT: No side effects inside setResponses updater.
  // We accumulate into responsesRef directly, then schedule advance via a ref'd setTimeout.
  const commitAnswer = useCallback((option, timedOut) => {
    clearInterval(perQRef.current);
    clearTimeout(advanceTimer.current);    // cancel any pending advance from before

    const q = questions[currentIdx];
    if (!q) return;

    const timeTaken = Math.round((Date.now() - startRef.current) / 1000);

    // Push to ref (not state) — avoids the setResponses updater firing twice in Strict Mode
    responsesRef.current = [
      ...responsesRef.current,
      {
        question:        q.question,
        type:            q.type,
        selected_option: option || "",
        correct_answer:  q.answer,
        explanation:     q.explanation || "",
        time_taken:      timeTaken,
        timed_out:       timedOut,
      },
    ];

    setSelectedOpt(option);
    setShowFeedback(true);

    const nextIdx    = currentIdx + 1;
    const isLastQ    = nextIdx >= totalQ;

    // Schedule advance — runs exactly once because we clear it above on re-entry
    advanceTimer.current = setTimeout(() => {
      setShowFeedback(false);
      if (isLastQ) {
        const elapsed = totalSeconds - overallTimeRef.current;
        safeComplete(elapsed);
      } else {
        setCurrentIdx(nextIdx);
      }
    }, 1500);

  }, [currentIdx, totalQ, totalSeconds, questions, safeComplete]);

  commitRef.current = commitAnswer;

  const handleOption = (option) => {
    if (showFeedback) return;
    clearInterval(perQRef.current);
    advanceLock.current = true;
    commitAnswer(option, false);
  };

  // ── Guard (safe after all hooks) ──────────────────────────────────────────
  const current = questions[currentIdx];
  if (!current) return null;

  // ── Render values ─────────────────────────────────────────────────────────
  const perQPct     = (perQTime / timePerQuestion) * 100;
  const overallPct  = (overallTime / totalSeconds) * 100;
  const timerColor  = perQPct > 50 ? "#16a34a" : perQPct > 25 ? "#d97706" : "#dc2626";
  const globalColor = overallPct > 50 ? "#16a34a" : overallPct > 25 ? "#d97706" : "#dc2626";

  const isCorrect  = showFeedback && !!selectedOpt && selectedOpt === current.answer;
  const isTimedOut = showFeedback && !selectedOpt;
  const isTF       = current.type === "truefalse";
  const progress   = Math.round((currentIdx / totalQ) * 100);

  return (
    <div className="flex flex-col gap-4 pb-6">

      {/* ── Top bar ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-green-100 flex items-center gap-3">

        {/* Overall timer pill */}
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 shrink-0 border"
          style={{ background: overallPct > 25 ? "#f0fdf4" : "#fef2f2", borderColor: globalColor + "40" }}
        >
          <MdOutlineTimer size={14} style={{ color: globalColor }} />
          <span className="text-xs font-black tabular-nums" style={{ color: globalColor }}>
            {fmt(overallTime)}
          </span>
          <span className="text-xs text-gray-400 hidden sm:inline">total</span>
        </div>

        {/* Progress bar */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-green-700 uppercase tracking-wide truncate">
              {topic.charAt(0).toUpperCase() + topic.slice(1)}
            </span>
            <span className="text-xs text-gray-400 font-semibold shrink-0 ml-2">
              {currentIdx + 1} / {totalQ}
            </span>
          </div>
          <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Type badge */}
        <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${
          isTF ? "bg-amber-50 text-amber-700 border-amber-200"
               : "bg-green-50 text-green-700 border-green-200"
        }`}>
          {isTF ? "T / F" : "MCQ"}
        </span>
      </div>

      {/* ── Question card ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-green-100">

        {/* Per-question circular timer */}
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            <svg width="100%" height="100%" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" fill="none" stroke="#dcfce7" strokeWidth="5" />
              <circle
                cx="36" cy="36" r="30" fill="none"
                stroke={timerColor} strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 30}`}
                strokeDashoffset={`${2 * Math.PI * 30 * (1 - perQPct / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.4s" }}
              />
            </svg>
            <div
              className="absolute inset-0 flex items-center justify-center text-lg sm:text-xl font-black tabular-nums"
              style={{ color: timerColor }}
            >
              {perQTime}
            </div>
          </div>
        </div>

        {/* Feedback banner */}
        {showFeedback && (
          <div className={`flex items-center gap-2 justify-center rounded-xl px-4 py-2.5 mb-4 text-sm font-bold ${
            isCorrect  ? "bg-green-50 text-green-700 border border-green-200" :
            isTimedOut ? "bg-amber-50 text-amber-700 border border-amber-200" :
                         "bg-red-50 text-red-600 border border-red-200"
          }`}>
            {isCorrect  ? <FaCheckCircle size={14} /> :
             isTimedOut ? <FaClock size={14} /> :
                          <FaTimesCircle size={14} />}
            <span>
              {isCorrect  ? "Correct!" :
               isTimedOut ? "Time's up — moving on" :
               `Wrong — Correct: ${current.answer}`}
            </span>
          </div>
        )}

        {/* Question text */}
        <p className="text-base sm:text-lg font-bold text-gray-800 mb-5 leading-relaxed">
          {current.question}
        </p>

        {/* Options */}
        <div className={`flex flex-col ${isTF ? "gap-3 sm:flex-row" : "gap-2"}`}>
          {current.options.map((option, i) => {
            const isSelected  = selectedOpt === option;
            const isCorrectOp = option === current.answer;

            let cls = "bg-gray-50 border-gray-200 text-gray-700";
            if (showFeedback) {
              cls = isCorrectOp
                ? "bg-green-50 border-green-400 text-green-800"
                : isSelected
                ? "bg-red-50 border-red-400 text-red-700"
                : "bg-gray-50 border-gray-200 text-gray-400";
            }

            return (
              <button
                key={i}
                onClick={() => handleOption(option)}
                disabled={showFeedback}
                className={`flex items-center gap-3 border-2 rounded-xl font-semibold transition-all duration-150
                  ${isTF ? "flex-1 py-4 sm:py-5 justify-center text-base sm:text-lg"
                          : "px-4 py-3 text-sm sm:text-base"}
                  ${cls}
                  ${!showFeedback ? "hover:border-green-400 hover:bg-green-50 cursor-pointer active:scale-[0.98]"
                                  : "cursor-default"}`}
              >
                {!isTF && (
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    showFeedback && isCorrectOp ? "bg-green-200 text-green-800" :
                    showFeedback && isSelected  ? "bg-red-200   text-red-700"   :
                    "bg-green-100 text-green-700"
                  }`}>
                    {showFeedback && isCorrectOp ? "✓" :
                     showFeedback && isSelected  ? "✗" :
                     String.fromCharCode(65 + i)}
                  </span>
                )}
                {isTF && (
                  <span className="text-2xl">{option === "True" ? "✅" : "❌"}</span>
                )}
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Dot progress ──────────────────────────────────────────────── */}
      <div className="flex gap-1 justify-center flex-wrap px-2">
        {questions.map((q, i) => {
          const resp = responsesRef.current[i];
          return (
            <div
              key={i}
              title={`Q${i + 1} · ${q.type === "truefalse" ? "T/F" : "MCQ"}`}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === currentIdx ? 20 : 7,
                background:
                  i < currentIdx
                    ? (resp?.timed_out
                        ? "#f59e0b"
                        : resp?.selected_option === resp?.correct_answer
                        ? "#16a34a"
                        : "#dc2626")
                    : i === currentIdx
                    ? "#4ade80"
                    : "#e5e7eb",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}