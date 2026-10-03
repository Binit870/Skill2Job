import { useState, useEffect, useRef, useCallback } from "react";
import { Clock, LogOut, Timer, CheckCircle2 } from "lucide-react";

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
  const timerColor = perQPct > 50 ? "#0E6B52" : perQPct > 25 ? "#C99A3B" : "#dc2626";
  const globalColor= overallPct > 50 ? "#0E6B52" : overallPct > 25 ? "#C99A3B" : "#dc2626";
  const isTF       = current.type === "truefalse";
  const progress   = Math.round((currentIdx / totalQ) * 100);

  return (
    <div className="flex flex-col gap-3.5 pb-6">

      {/* Top bar */}
      <div className="bg-white rounded-2xl border border-mist shadow-card px-4 py-3 flex items-center gap-3">
        {/* Overall timer */}
        <div
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 shrink-0 border ${overallPct > 25 ? "bg-pine/8" : "bg-red-50"}`}
          style={{ borderColor: `${globalColor}30` }}
        >
          <Timer className="w-3.5 h-3.5" style={{ color: globalColor }} />
          <span className="text-xs font-extrabold tabular-nums" style={{ color: globalColor }}>
            {fmt(overallTime)}
          </span>
          <span className="text-[11px] text-ink/40">total</span>
        </div>

        {/* Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] font-bold text-pine uppercase tracking-wider">
              {topic.charAt(0).toUpperCase() + topic.slice(1)}
            </span>
            <span className="text-[11px] font-semibold text-ink/40">
              {currentIdx + 1} / {totalQ}
            </span>
          </div>
          <div className="h-1.5 bg-mist rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pine to-moss transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Type badge */}
        <span
          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0
            ${isTF ? "bg-gold/10 text-gold border-gold/25" : "bg-pine/8 text-pine border-pine/20"}`}
        >
          {isTF ? "T / F" : "MCQ"}
        </span>

        {/* Leave */}
        <button
          onClick={onLeaveRequest}
          title="Leave test"
          className="flex items-center gap-1.5 text-[11px] font-bold text-red-500 bg-red-50 border border-red-200 rounded-full px-2.5 py-1.5 shrink-0 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-2.5 h-2.5" />
          <span>Leave</span>
        </button>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-[20px] border border-mist shadow-md p-5 sm:p-8">

        {/* Circular per-Q timer */}
        <div className="flex justify-center mb-6">
          <div className="relative w-[72px] h-[72px]">
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" fill="none" stroke="#E7E4DA" strokeWidth="5" />
              <circle
                cx="36" cy="36" r="30" fill="none"
                stroke={timerColor} strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 30}`}
                strokeDashoffset={`${2 * Math.PI * 30 * (1 - perQPct / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
                style={{ transition: "stroke-dashoffset 1s linear, stroke .4s" }}
              />
            </svg>
            <div
              className="absolute inset-0 flex items-center justify-center text-lg font-extrabold tabular-nums"
              style={{ color: timerColor }}
            >
              {advancing
                ? <CheckCircle2 className="w-5.5 h-5.5 text-pine" />
                : perQTime
              }
            </div>
          </div>
        </div>

        {/* Time's up notice */}
        {advancing && !selectedOpt && (
          <div className="flex items-center justify-center gap-2 bg-gold/10 border border-gold/25 text-gold rounded-[10px] px-4 py-2.5 mb-4.5 text-[13px] font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Time's up — moving to next question</span>
          </div>
        )}

        {/* Question number chip */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold tracking-wider bg-pine/8 text-pine border border-pine/20 px-2.5 py-0.5 rounded-full">
            Q{currentIdx + 1} of {totalQ}
          </span>
        </div>

        {/* Question text */}
        <p className="text-[15px] sm:text-[17px] font-semibold text-ink leading-relaxed mb-5.5">
          {current.question}
        </p>

        {/* Options */}
        <div className={`flex gap-2.5 ${isTF ? "flex-row" : "flex-col"}`}>
          {current.options.map((option, i) => {
            const isSelected = selectedOpt === option;
            const dimmed = advancing && !isSelected;

            return (
              <button
                key={i}
                onClick={() => handleOption(option)}
                disabled={advancing}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-left w-full transition-all duration-150
                  ${isTF ? "flex-1 justify-center py-4.5 text-base" : ""}
                  ${isSelected
                    ? "border-2 border-pine bg-pine/8 text-moss shadow-[0_0_0_3px_rgba(14,107,82,0.12)]"
                    : dimmed
                      ? "border-[1.5px] border-mist bg-paper/60 text-ink/25 cursor-default"
                      : "border-[1.5px] border-mist bg-paper/60 text-ink/70 hover:border-pine/40 hover:bg-pine/8 hover:translate-x-0.5"
                  }`}
              >
                {!isTF && (
                  <span
                    className={`w-6.5 h-6.5 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-extrabold border-[1.5px] transition-colors
                      ${advancing && isSelected
                        ? "bg-pine/20 text-pine border-pine/40"
                        : "bg-pine/8 text-pine/60 border-pine/20"
                      }`}
                  >
                    {advancing && isSelected
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-pine" />
                      : String.fromCharCode(65 + i)
                    }
                  </span>
                )}
                {isTF && (
                  <span className="text-xl mr-1">{option === "True" ? "✅" : "❌"}</span>
                )}
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dot progress */}
      <div className="flex gap-1 justify-center flex-wrap px-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIdx ? "w-5.5" : "w-1.5"}`}
            style={{ background: i < currentIdx ? "#0E6B52" : i === currentIdx ? "#4ade80" : "#E7E4DA" }}
          />
        ))}
      </div>

      {/* Hint */}
      <p className="text-center text-[11px] text-ink/40 font-medium">
        Results &amp; explanations will be shown after all questions are answered
      </p>
    </div>
  );
}