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
  const [responses,    setResponses]    = useState([]);

  const perQRef        = useRef(null);
  const overallRef     = useRef(null);
  const startRef       = useRef(Date.now());
  const advanceLock    = useRef(false);
  const overallTimeRef = useRef(totalSeconds);
  const completedRef   = useRef(false);        // ← one-way gate: fires onComplete exactly once
  const commitRef      = useRef(null);         // stable ref to latest commitAnswer

  useEffect(() => { overallTimeRef.current = overallTime; }, [overallTime]);

  // Guarded onComplete — can never fire twice
  const safeComplete = useCallback((resps, elapsed) => {
    if (completedRef.current) return;
    completedRef.current = true;
    clearInterval(overallRef.current);
    clearInterval(perQRef.current);
    onComplete(resps, elapsed);
  }, [onComplete]);

  // Overall countdown — mount once
  useEffect(() => {
    overallRef.current = setInterval(() => {
      setOverallTime(t => {
        if (t <= 1) {
          clearInterval(overallRef.current);
          setResponses(prev => {
            const filled = [...prev];
            for (let i = filled.length; i < totalQ; i++) {
              filled.push({
                question: questions[i].question, type: questions[i].type,
                selected_option: "", correct_answer: questions[i].answer,
                explanation: questions[i].explanation || "", time_taken: 0, timed_out: true,
              });
            }
            setTimeout(() => safeComplete(filled, totalSeconds), 50);
            return filled;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(overallRef.current);
  }, []); // eslint-disable-line

  // Per-question countdown — reset on new question
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

  const commitAnswer = useCallback((option, timedOut) => {
    clearInterval(perQRef.current);
    const timeTaken = Math.round((Date.now() - startRef.current) / 1000);
    const q = questions[currentIdx];
    if (!q) return;

    setSelectedOpt(option);
    setShowFeedback(true);

    setResponses(prev => {
      const updated = [...prev, {
        question: q.question, type: q.type,
        selected_option: option || "", correct_answer: q.answer,
        explanation: q.explanation || "", time_taken: timeTaken, timed_out: timedOut,
      }];
      setTimeout(() => {
        setShowFeedback(false);
        if (currentIdx + 1 >= totalQ) {
          safeComplete(updated, totalSeconds - overallTimeRef.current);
        } else {
          setCurrentIdx(i => i + 1);
        }
      }, 1600);
      return updated;
    });
  }, [currentIdx, totalQ, totalSeconds, questions, safeComplete]);

  commitRef.current = commitAnswer;

  const handleOption = (option) => {
    if (showFeedback) return;
    clearInterval(perQRef.current);
    advanceLock.current = true;
    commitAnswer(option, false);
  };

  // Safe early-return AFTER all hooks
  const current = questions[currentIdx];
  if (!current) return null;

  const perQPct    = (perQTime / timePerQuestion) * 100;
  const overallPct = (overallTime / totalSeconds) * 100;
  const timerColor = perQPct > 50 ? "#16a34a" : perQPct > 25 ? "#d97706" : "#dc2626";
  const overallColor = overallPct > 50 ? "#16a34a" : overallPct > 25 ? "#d97706" : "#dc2626";

  const isCorrect  = showFeedback && !!selectedOpt && selectedOpt === current.answer;
  const isTimedOut = showFeedback && !selectedOpt;
  const isWrong    = showFeedback && !!selectedOpt && selectedOpt !== current.answer;
  const isTF       = current.type === "truefalse";
  const progress   = Math.round((currentIdx / totalQ) * 100);

  return (
    <div className="flex flex-col gap-4">

      {/* Top bar */}
      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-green-100 flex items-center gap-3">

        {/* Overall timer */}
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1.5 shrink-0 border"
          style={{
            background: overallPct > 25 ? "#f0fdf4" : "#fef2f2",
            borderColor: overallColor + "50",
          }}
        >
          <MdOutlineTimer style={{ color: overallColor }} size={15} />
          <span className="text-xs font-black tabular-nums" style={{ color: overallColor }}>{fmt(overallTime)}</span>
          <span className="text-xs text-gray-400">total</span>
        </div>

        {/* Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-bold text-green-700 uppercase tracking-wide truncate">{topic}</span>
            <span className="text-gray-400 font-semibold shrink-0 ml-2">{currentIdx + 1}/{totalQ}</span>
          </div>
          <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Type badge */}
        <span
          className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${
            isTF
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-green-50 text-green-700 border-green-200"
          }`}
        >
          {isTF ? "T / F" : "MCQ"}
        </span>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">

        {/* Per-question circular timer */}
        <div className="flex justify-center mb-5">
          <div className="relative w-16 h-16">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="27" fill="none" stroke="#dcfce7" strokeWidth="5" />
              <circle
                cx="32" cy="32" r="27" fill="none"
                stroke={timerColor} strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 27}`}
                strokeDashoffset={`${2 * Math.PI * 27 * (1 - perQPct / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 32 32)"
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.4s" }}
              />
            </svg>
            <div
              className="absolute inset-0 flex items-center justify-center text-base font-black tabular-nums"
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
                         "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {isCorrect  ? <FaCheckCircle size={15} /> : isTimedOut ? <FaClock size={15} /> : <FaTimesCircle size={15} />}
            {isCorrect  ? "Correct!" :
             isTimedOut ? "Time's up!" :
                          `Wrong — Correct: ${current.answer}`}
          </div>
        )}

        {/* Question */}
        <p className="text-base font-bold text-gray-800 mb-5 leading-relaxed">{current.question}</p>

        {/* Options */}
        <div className={`flex flex-col ${isTF ? "gap-3" : "gap-2"}`}>
          {current.options.map((option, i) => {
            const isSelected  = selectedOpt === option;
            const isCorrectOp = option === current.answer;

            let cls = "bg-gray-50 border-gray-200 text-gray-700";
            if (showFeedback) {
              if (isCorrectOp)    cls = "bg-green-50 border-green-400 text-green-800";
              else if (isSelected) cls = "bg-red-50 border-red-400 text-red-700";
            }

            return (
              <button
                key={i}
                onClick={() => handleOption(option)}
                disabled={showFeedback}
                className={`flex items-center gap-3 border-2 rounded-xl transition-all duration-150 font-semibold
                  ${isTF ? "py-4 justify-center text-base" : "px-4 py-3 text-sm"}
                  ${cls}
                  ${!showFeedback ? "hover:border-green-400 hover:bg-green-50 cursor-pointer" : "cursor-default"}
                `}
              >
                {/* MCQ letter badge */}
                {!isTF && (
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    showFeedback && isCorrectOp ? "bg-green-200 text-green-800" :
                    showFeedback && isSelected  ? "bg-red-200 text-red-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {showFeedback && isCorrectOp ? "✓" :
                     showFeedback && isSelected  ? "✗" :
                     String.fromCharCode(65 + i)}
                  </span>
                )}
                {/* T/F emoji */}
                {isTF && <span className="text-xl">{option === "True" ? "✅" : "❌"}</span>}
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dot progress */}
      <div className="flex gap-1 justify-center flex-wrap">
        {questions.map((q, i) => (
          <div
            key={i}
            title={q.type === "truefalse" ? "T/F" : "MCQ"}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === currentIdx ? 18 : 7,
              background: i < currentIdx
                ? (responses[i]?.is_correct === false ? "#dc2626" : "#16a34a")
                : i === currentIdx ? "#4ade80"
                : "#e5e7eb",
            }}
          />
        ))}
      </div>
    </div>
  );
}