import { useState, useEffect } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaClock, FaChevronRight, FaArrowLeft } from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";

const TOPIC_ICONS = { aptitude: "🧮", reasoning: "🧩", verbal: "📖", technical: "💻", ml: "🤖" };
const GRADE_COLOR = { "A+": "text-green-600", "A": "text-green-600", "B": "text-blue-600", "C": "text-amber-600", "D": "text-orange-500", "F": "text-red-500" };

const fmt = (s) => !s ? "—" : s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function AssessmentHistory({ onBack }) {
  const [history,   setHistory]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [detail,    setDetail]    = useState(null);
  const [detailTab, setDetailTab] = useState("all");
  const [detailLoading, setDetailLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    axios.get(`${API}/api/assessment/history`)
      .then(r => setHistory(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleView = async (id) => {
    setDetailLoading(true);
    setDetailTab("all");
    try {
      const r = await axios.get(`${API}/api/assessment/history/${id}`);
      setDetail(r.data);
    } catch(e) { console.error(e); }
    finally { setDetailLoading(false); }
  };

  // Detail view
  if (detail) {
    const filtered =
      detailTab === "mcq" ? detail.results?.filter(r => r.type === "mcq") :
      detailTab === "tf"  ? detail.results?.filter(r => r.type === "truefalse") :
      detail.results || [];

    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setDetail(null)}
          className="flex items-center gap-2 self-start text-green-700 text-sm font-bold bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-2 rounded-lg transition-all cursor-pointer"
        >
          <FaArrowLeft size={12} /> Back to History
        </button>

        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 p-5 text-white">
          <p className="text-xs opacity-70 mb-1">{fmtDate(detail.createdAt)}</p>
          <p className="text-lg font-extrabold">{TOPIC_ICONS[detail.topic] || "📋"} {detail.topic?.charAt(0).toUpperCase() + detail.topic?.slice(1)}</p>
          <p className="text-3xl font-black my-1">{detail.grade} — {detail.scorePercent}%</p>
          <p className="text-green-100 text-sm">
            {detail.correct}/{detail.totalQuestions} correct · MCQ {detail.mcqCorrect}/{detail.mcqTotal} · T/F {detail.tfCorrect}/{detail.tfTotal} · {fmt(detail.totalTimeTaken)}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[{ id: "all", label: `All (${detail.totalQuestions})` }, { id: "mcq", label: `MCQ (${detail.mcqTotal})` }, { id: "tf", label: `T/F (${detail.tfTotal})` }].map(t => (
            <button key={t.id} onClick={() => setDetailTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                detailTab === t.id ? "bg-green-500 text-white border-green-500" : "bg-white text-green-600 border-green-200 hover:bg-green-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          {filtered.map((r, i) => (
            <div key={i} className={`rounded-xl p-3.5 border ${r.is_correct ? "bg-green-50 border-green-200" : r.timed_out ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
              <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md mb-1.5 ${r.type === "truefalse" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                {r.type === "truefalse" ? "T/F" : "MCQ"}
              </span>
              <p className="text-sm font-semibold text-gray-800">{r.question}</p>
              <p className="text-xs text-gray-500 mt-1">
                Your answer: <span className={`font-bold ${r.timed_out ? "text-amber-600" : r.is_correct ? "text-green-700" : "text-red-600"}`}>{r.timed_out ? "Timed out" : (r.selected_option || "—")}</span>
                {" · "}Correct: <span className="font-bold text-green-700">{r.correct_answer}</span>
              </p>
              {r.explanation && <p className="text-xs text-gray-400 mt-1 italic">💡 {r.explanation}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
          <MdOutlineQuiz className="text-green-500" size={22} /> Assessment History
        </h2>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-green-700 text-sm font-bold bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-2 rounded-lg transition-all cursor-pointer"
        >
          <FaArrowLeft size={12} /> New Test
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading…</div>
      ) : history.length === 0 ? (
        <div className="text-center py-16 bg-green-50 rounded-2xl text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-semibold">No assessments yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {history.map(h => (
            <button
              key={h._id}
              onClick={() => handleView(h._id)}
              className="bg-white rounded-xl p-4 border border-green-100 hover:border-green-300 hover:shadow-sm transition-all text-left w-full cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-base font-bold text-gray-800">
                    {TOPIC_ICONS[h.topic] || "📋"} {h.topic?.charAt(0).toUpperCase() + h.topic?.slice(1)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{fmtDate(h.createdAt)} · {h.totalQuestions}Q · {fmt(h.totalTimeTaken)}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">MCQ {h.mcqCorrect}/{h.mcqTotal}</span>
                    <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">T/F {h.tfCorrect}/{h.tfTotal}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className={`text-2xl font-black ${GRADE_COLOR[h.grade] || "text-gray-600"}`}>{h.grade}</p>
                    <p className="text-xs text-gray-400">{h.correct}/{h.totalQuestions} · {h.scorePercent}%</p>
                  </div>
                  <FaChevronRight className="text-gray-300" size={14} />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}