import { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock, FaRedo, FaHistory, FaTrophy } from "react-icons/fa";

// ── Normalise field names ────────────────────────────────────────────────────
// Backend submit returns ML snake_case: score_percent, mcq_total, etc.
// History detail returns MongoDB camelCase: scorePercent, mcqTotal, etc.
// This function returns a single consistent shape.
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
  "A+": { bar: "bg-green-500",  text: "text-green-600",  soft: "bg-green-50  border-green-200"  },
  "A":  { bar: "bg-green-500",  text: "text-green-600",  soft: "bg-green-50  border-green-200"  },
  "B":  { bar: "bg-blue-500",   text: "text-blue-600",   soft: "bg-blue-50   border-blue-200"   },
  "C":  { bar: "bg-amber-500",  text: "text-amber-600",  soft: "bg-amber-50  border-amber-200"  },
  "D":  { bar: "bg-orange-500", text: "text-orange-600", soft: "bg-orange-50 border-orange-200" },
  "F":  { bar: "bg-red-500",    text: "text-red-600",    soft: "bg-red-50    border-red-200"    },
};

const fmt = (s) => !s ? "—" : s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;

export default function AssessmentResult({ result: raw, topic, onRestart, onViewHistory }) {
  const [tab, setTab] = useState("all");

  const result = normalise(raw);
  if (!result) return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-4xl mb-3">😕</p>
      <p className="font-semibold">No result data found.</p>
      <button onClick={onRestart} className="mt-4 text-green-600 font-bold underline cursor-pointer">Try again</button>
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

  // Score ring circumference
  const R   = 44;
  const circ = 2 * Math.PI * R;
  const dash = circ * (score_percent / 100);

  return (
    <div className="flex flex-col gap-5 pb-6">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 p-6 sm:p-8 text-white shadow-lg shadow-green-200/60">
        <div className="flex flex-col sm:flex-row items-center gap-6">

          {/* Score ring */}
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
              <span className="text-3xl font-black leading-none">{grade}</span>
              <span className="text-sm font-bold opacity-90">{score_percent}%</span>
            </div>
          </div>

          {/* Text */}
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-widest opacity-75 mb-1">
              {(topic || result.topic).charAt(0).toUpperCase() + (topic || result.topic).slice(1)} · Complete
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold mb-1">{grade_label}</p>
            <p className="text-green-100 text-sm">
              {correct} of {total_questions} correct · finished in {fmt(total_time_taken)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Correct",   value: correct,                     color: "text-green-600", bg: "bg-green-50  border-green-100"  },
          { label: "Wrong",     value: wrong,                       color: "text-red-500",   bg: "bg-red-50    border-red-100"    },
          { label: "MCQ",       value: `${mcq_correct}/${mcq_total}`, color: "text-green-700", bg: "bg-green-50  border-green-100"  },
          { label: "True/False",value: `${tf_correct}/${tf_total}`,  color: "text-amber-600", bg: "bg-amber-50  border-amber-100"  },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 text-center border ${s.bg}`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Score bar ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Overall Score</p>
          <span className={`text-sm font-black ${gc.text}`}>{score_percent}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${gc.bar} rounded-full transition-all duration-1000`}
            style={{ width: `${score_percent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-300 mt-1">
          <span>0%</span><span>50%</span><span>100%</span>
        </div>
      </div>

      {/* ── Question breakdown ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Question Review</p>
          <div className="flex gap-1.5">
            {[
              { id: "all", label: `All (${total_questions})` },
              { id: "mcq", label: `MCQ (${mcq_total})` },
              { id: "tf",  label: `T/F (${tf_total})` },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  tab === t.id
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-green-600 border-green-200 hover:bg-green-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">No questions in this category.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((r, i) => (
              <div
                key={i}
                className={`rounded-xl p-4 border ${
                  r.is_correct ? "bg-green-50 border-green-200" :
                  r.timed_out  ? "bg-amber-50 border-amber-200" :
                                 "bg-red-50   border-red-200"
                }`}
              >
                <div className="flex gap-3">
                  {/* Status icon */}
                  <div className="shrink-0 mt-0.5">
                    {r.is_correct
                      ? <FaCheckCircle className="text-green-500" size={16} />
                      : r.timed_out
                      ? <FaClock className="text-amber-500" size={16} />
                      : <FaTimesCircle className="text-red-400" size={16} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Type + time badges */}
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        r.type === "truefalse" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                      }`}>
                        {r.type === "truefalse" ? "T/F" : "MCQ"}
                      </span>
                      <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded-md">
                        {r.time_taken}s
                      </span>
                    </div>

                    {/* Question */}
                    <p className="text-sm font-semibold text-gray-800 leading-snug mb-1.5">
                      {r.question}
                    </p>

                    {/* Answer row */}
                    {r.is_correct ? (
                      <p className="text-xs text-green-700 font-medium">
                        ✓ You answered: <span className="font-bold">{r.selected_option}</span>
                      </p>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:gap-4 gap-0.5">
                        <p className="text-xs text-gray-500">
                          Your answer:{" "}
                          <span className={`font-bold ${r.timed_out ? "text-amber-600" : "text-red-600"}`}>
                            {r.timed_out ? "Timed out" : (r.selected_option || "—")}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Correct: <span className="font-bold text-green-700">{r.correct_answer}</span>
                        </p>
                      </div>
                    )}

                    {/* Explanation */}
                    {r.explanation && (
                      <p className="text-xs text-gray-400 mt-1.5 italic leading-relaxed">
                        💡 {r.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Actions ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-green-200 cursor-pointer"
        >
          <FaRedo size={13} /> Try Again
        </button>
        <button
          onClick={onViewHistory}
          className="flex items-center justify-center gap-2 bg-white hover:bg-green-50 active:bg-green-100 text-green-700 font-bold py-3.5 rounded-xl border-2 border-green-200 transition-all cursor-pointer"
        >
          <FaHistory size={13} /> View History
        </button>
      </div>
    </div>
  );
}