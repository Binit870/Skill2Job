import { useState } from "react";
import {
  CheckCircle2, XCircle, Clock, RotateCcw, History, BarChart3,
  ClipboardList, Lightbulb,
} from "lucide-react";

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
  "A+": { bar: "#0E6B52", text: "#0E6B52", bg: "#E9F2EE", border: "#BBDACE" },
  "A":  { bar: "#0E6B52", text: "#0E6B52", bg: "#E9F2EE", border: "#BBDACE" },
  "B":  { bar: "#3b82f6", text: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  "C":  { bar: "#C99A3B", text: "#C99A3B", bg: "#FBF3E1", border: "#E9D4A3" },
  "D":  { bar: "#f97316", text: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
  "F":  { bar: "#ef4444", text: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

const fmt = (s) => !s ? "—" : s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;

const StatCard = ({ label, value, color, bg, border, icon: Icon }) => (
  <div className="rounded-2xl p-4 text-center border" style={{ background: bg, borderColor: border }}>
    {Icon && <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color }} />}
    <p className="text-[22px] font-extrabold leading-none" style={{ color }}>{value}</p>
    <p className="text-[11px] text-ink/40 font-semibold mt-1.5 uppercase tracking-wider">{label}</p>
  </div>
);

const TabButton = ({ active, ...props }) => (
  <button
    {...props}
    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors border
      ${active
        ? "bg-pine border-pine text-white shadow-sm shadow-pine/25"
        : "bg-paper/60 border-mist text-ink/50 hover:border-pine/40 hover:text-pine hover:bg-pine/8"
      }`}
  />
);

export default function AssessmentResult({ result: raw, topic, onRestart, onViewHistory }) {
  const [tab, setTab] = useState("all");
  const result = normalise(raw);

  if (!result) return (
    <div className="text-center py-16 px-5 text-ink/40">
      <p className="text-4xl mb-3">😕</p>
      <p className="font-semibold text-[15px]">No result data found.</p>
      <button onClick={onRestart} className="mt-4 text-pine font-bold underline">
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
    <div className="flex flex-col gap-4 pb-6">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-moss via-pine to-pine p-6 sm:p-9 text-white shadow-lg shadow-pine/30">
        <div className="absolute -top-5 -right-5 w-[140px] h-[140px] rounded-full bg-white/[0.06] pointer-events-none" />
        <div className="absolute -bottom-7 right-20 w-20 h-20 rounded-full bg-white/[0.04] pointer-events-none" />

        <div className="relative flex flex-col items-start gap-5">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="relative w-28 h-28 shrink-0">
              <svg width="112" height="112" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r={R} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                <circle
                  cx="56" cy="56" r={R} fill="none"
                  stroke="white" strokeWidth="8"
                  strokeDasharray={`${circ}`}
                  strokeDashoffset={`${circ - dash}`}
                  strokeLinecap="round"
                  transform="rotate(-90 56 56)"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[28px] font-extrabold leading-none">{grade}</span>
                <span className="text-[13px] font-bold opacity-85">{score_percent}%</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase opacity-65 mb-1.5">
                {((topic || result.topic)).charAt(0).toUpperCase() + ((topic || result.topic)).slice(1)} · Complete
              </p>
              <h2 className="font-display text-xl sm:text-[28px] font-normal italic mb-2 leading-tight">
                {grade_label}
              </h2>
              <p className="text-[13px] text-white/75">
                {correct} of {total_questions} correct · finished in {fmt(total_time_taken)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Correct"    value={correct}                      color="#0E6B52" bg="#E9F2EE" border="#BBDACE" />
        <StatCard label="Wrong"      value={wrong}                        color="#dc2626" bg="#fef2f2" border="#fecaca" />
        <StatCard label="MCQ"        value={`${mcq_correct}/${mcq_total}`} color="#2563eb" bg="#eff6ff" border="#bfdbfe" />
        <StatCard label="True/False" value={`${tf_correct}/${tf_total}`}   color="#C99A3B" bg="#FBF3E1" border="#E9D4A3" />
      </div>

      {/* Score bar */}
      <div className="bg-white rounded-2xl border border-mist shadow-card p-5 sm:p-6">
        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-pine" />
            <span className="text-[11px] font-bold text-ink/50 uppercase tracking-wider">
              Overall Score
            </span>
          </div>
          <span className="text-[15px] font-extrabold" style={{ color: gc.text }}>{score_percent}%</span>
        </div>
        <div className="h-2.5 bg-ink/5 rounded-full overflow-hidden border border-mist">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ background: `linear-gradient(90deg, ${gc.bar}aa, ${gc.bar})`, width: `${score_percent}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          {["0%", "50%", "100%"].map((l) => (
            <span key={l} className="text-[10px] text-ink/25">{l}</span>
          ))}
        </div>
      </div>

      {/* Question breakdown */}
      <div className="bg-white rounded-2xl border border-mist shadow-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2.5">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-3.5 h-3.5 text-pine" />
            <span className="text-[11px] font-bold text-ink/50 uppercase tracking-wider">
              Question Review
            </span>
          </div>
          <div className="flex gap-1.5">
            {[
              { id: "all", label: `All (${total_questions})` },
              { id: "mcq", label: `MCQ (${mcq_total})` },
              { id: "tf",  label: `T/F (${tf_total})` },
            ].map((t) => (
              <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
                {t.label}
              </TabButton>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-ink/40 text-[13px] py-7">
            No questions in this category.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((r, i) => {
              const isCorrect = r.is_correct;
              const isTimeout = r.timed_out;
              const cardBg     = isCorrect ? "#E9F2EE" : isTimeout ? "#FBF3E1" : "#fef2f2";
              const cardBorder = isCorrect ? "#BBDACE" : isTimeout ? "#E9D4A3" : "#fecaca";
              return (
                <div key={i} className="rounded-2xl border-[1.5px] p-4 flex gap-3" style={{ background: cardBg, borderColor: cardBorder }}>
                  <div className="shrink-0 mt-0.5">
                    {isCorrect
                      ? <CheckCircle2 className="w-4 h-4 text-pine" />
                      : isTimeout
                      ? <Clock className="w-4 h-4 text-gold" />
                      : <XCircle className="w-4 h-4 text-red-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md border"
                        style={r.type === "truefalse"
                          ? { background: "#FBF3E1", color: "#C99A3B", borderColor: "#E9D4A3" }
                          : { background: "#E9F2EE", color: "#0E6B52", borderColor: "#BBDACE" }}
                      >
                        {r.type === "truefalse" ? "T/F" : "MCQ"}
                      </span>
                      <span className="text-[10px] font-semibold text-ink/40 bg-ink/5 px-2 py-0.5 rounded-md">
                        {r.time_taken}s
                      </span>
                    </div>
                    <p className="text-[13px] font-semibold text-ink/80 leading-snug mb-2">
                      {r.question}
                    </p>
                    {isCorrect ? (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-pine" />
                        <p className="text-xs text-pine font-semibold">
                          {r.selected_option}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-4">
                        <p className="text-xs text-ink/55">
                          Your answer:{" "}
                          <span className={`font-bold ${isTimeout ? "text-gold" : "text-red-600"}`}>
                            {isTimeout ? "Timed out" : (r.selected_option || "—")}
                          </span>
                        </p>
                        <p className="text-xs text-ink/55">
                          Correct:{" "}
                          <span className="font-bold text-pine">{r.correct_answer}</span>
                        </p>
                      </div>
                    )}
                    {r.explanation && (
                      <p className="text-[11px] text-ink/40 mt-2 italic leading-relaxed border-t border-black/5 pt-2 flex items-start gap-1">
                        <Lightbulb className="w-3 h-3 shrink-0 mt-0.5" /> {r.explanation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 bg-gradient-to-br from-pine to-moss text-white text-sm font-bold py-3.5 rounded-2xl shadow-lg shadow-pine/30 hover:-translate-y-px transition-transform"
        >
          <RotateCcw className="w-3 h-3" /> Try Again
        </button>
        <button
          onClick={onViewHistory}
          className="flex items-center justify-center gap-2 bg-white text-pine text-sm font-bold py-3.5 rounded-2xl border-2 border-pine/25 hover:bg-pine/8 hover:border-pine/40 transition-colors"
        >
          <History className="w-3 h-3" /> View History
        </button>
      </div>
    </div>
  );
}
