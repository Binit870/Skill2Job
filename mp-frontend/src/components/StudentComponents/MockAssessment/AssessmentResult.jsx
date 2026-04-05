import { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock, FaTrophy, FaRedo, FaHistory } from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";

const GRADE_STYLE = {
  "A+": { ring: "border-green-400",  bg: "bg-green-50",  text: "text-green-700" },
  "A":  { ring: "border-green-400",  bg: "bg-green-50",  text: "text-green-700" },
  "B":  { ring: "border-blue-400",   bg: "bg-blue-50",   text: "text-blue-700" },
  "C":  { ring: "border-amber-400",  bg: "bg-amber-50",  text: "text-amber-700" },
  "D":  { ring: "border-orange-400", bg: "bg-orange-50", text: "text-orange-700" },
  "F":  { ring: "border-red-400",    bg: "bg-red-50",    text: "text-red-700" },
};

const fmt = (s) => !s ? "—" : s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;

export default function AssessmentResult({ result, topic, onRestart, onViewHistory }) {
  const [tab, setTab] = useState("all");
  if (!result) return null;

  const {
    score_percent, grade, grade_label,
    correct, wrong, total_questions,
    mcq_total = 0, mcq_correct = 0,
    tf_total  = 0, tf_correct  = 0,
    total_time_taken = 0,
    results = [],
  } = result;

  const gs = GRADE_STYLE[grade] || GRADE_STYLE["C"];

  const filtered =
    tab === "mcq" ? results.filter(r => r.type === "mcq") :
    tab === "tf"  ? results.filter(r => r.type === "truefalse") :
    results;

  return (
    <div className="flex flex-col gap-4">

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 p-6 text-white text-center shadow-lg shadow-green-200">
        <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-3">
          {topic.charAt(0).toUpperCase() + topic.slice(1)} · Complete
        </p>

        {/* Grade circle */}
        <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex flex-col items-center justify-center border-4 border-white/40 bg-white/15`}>
          <span className="text-3xl font-black">{grade}</span>
          <span className="text-xs font-bold opacity-80">{score_percent}%</span>
        </div>

        <p className="text-xl font-extrabold mb-1">{grade_label}</p>
        <p className="text-green-100 text-sm">{correct} / {total_questions} correct · {fmt(total_time_taken)}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Correct", value: correct,                color: "text-green-600", bg: "bg-green-50 border-green-100" },
          { label: "Wrong",   value: wrong,                  color: "text-red-500",   bg: "bg-red-50 border-red-100" },
          { label: "MCQ",     value: `${mcq_correct}/${mcq_total}`, color: "text-green-700", bg: "bg-green-50 border-green-100" },
          { label: "T / F",   value: `${tf_correct}/${tf_total}`,   color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-3 text-center border ${s.bg}`}>
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { id: "all", label: `All (${total_questions})` },
            { id: "mcq", label: `MCQ (${mcq_total})` },
            { id: "tf",  label: `T/F (${tf_total})` },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
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

        <div className="flex flex-col gap-2.5">
          {filtered.map((r, i) => (
            <div
              key={i}
              className={`rounded-xl p-3.5 border ${
                r.is_correct ? "bg-green-50 border-green-200" :
                r.timed_out  ? "bg-amber-50 border-amber-200" :
                               "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md mb-1.5 ${
                    r.type === "truefalse"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {r.type === "truefalse" ? "T/F" : "MCQ"}
                  </span>
                  <p className="text-sm font-semibold text-gray-800 leading-snug">{r.question}</p>

                  {!r.is_correct && (
                    <p className="text-xs text-gray-500 mt-1">
                      Your answer:{" "}
                      <span className={`font-bold ${r.timed_out ? "text-amber-600" : "text-red-600"}`}>
                        {r.timed_out ? "Timed out" : (r.selected_option || "—")}
                      </span>
                      {" · "}
                      Correct: <span className="font-bold text-green-700">{r.correct_answer}</span>
                    </p>
                  )}
                  {r.explanation && (
                    <p className="text-xs text-gray-400 mt-1 italic">💡 {r.explanation}</p>
                  )}
                </div>

                <div className="shrink-0 flex flex-col items-center gap-1">
                  {r.is_correct
                    ? <FaCheckCircle className="text-green-500" size={18} />
                    : r.timed_out
                    ? <FaClock className="text-amber-500" size={18} />
                    : <FaTimesCircle className="text-red-400" size={18} />
                  }
                  <span className="text-xs text-gray-400">{r.time_taken}s</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm shadow-green-200 cursor-pointer"
        >
          <FaRedo size={13} /> Try Again
        </button>
        <button
          onClick={onViewHistory}
          className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-green-50 text-green-700 font-bold py-3.5 rounded-xl border-2 border-green-200 transition-all cursor-pointer"
        >
          <FaHistory size={13} /> History
        </button>
      </div>
    </div>
  );
}