import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCheckCircle, FaTimesCircle, FaClock,
  FaChevronRight, FaArrowLeft, FaInbox
} from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";
import AssessmentResult from "./AssessmentResult";
import API from "../../utils/api.js"
const TOPIC_ICONS = { aptitude: "🧮", reasoning: "🧩", verbal: "📖", technical: "💻", ml: "🤖" };
const GRADE_COLOR = {
  "A+": "text-green-600", "A": "text-green-600",
  "B":  "text-blue-600",  "C": "text-amber-600",
  "D":  "text-orange-500","F": "text-red-500",
};
const GRADE_BG = {
  "A+": "bg-green-50 border-green-200", "A": "bg-green-50 border-green-200",
  "B":  "bg-blue-50 border-blue-200",   "C": "bg-amber-50 border-amber-200",
  "D":  "bg-orange-50 border-orange-200","F": "bg-red-50 border-red-200",
};

const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", {
  day: "numeric", month: "short", year: "numeric",
  hour: "2-digit", minute: "2-digit",
});
const fmtTime = (s) => !s ? "—" : s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;

export default function AssessmentHistory({ onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail,  setDetail]  = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);



  useEffect(() => {
    API.get(`/api/assessment/history`)
      .then(r => setHistory(r.data))
      .catch(e => { console.error(e); setFetchError("Could not load history."); })
      .finally(() => setLoading(false));
  }, []);

  const handleView = async (id) => {
    setDetailLoading(true);
    try {
      const r = await API.get(`/api/assessment/history/${id}`);
      setDetail(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  };

  // ── Detail view — reuse AssessmentResult component ───────────────────────
  if (detail) {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setDetail(null)}
          className="flex items-center gap-2 self-start text-green-700 text-sm font-bold bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-2 rounded-lg transition-all cursor-pointer"
        >
          <FaArrowLeft size={11} /> Back to History
        </button>
        {/* Pass the raw MongoDB doc — AssessmentResult.normalise() handles camelCase */}
        <AssessmentResult
          result={detail}
          topic={detail.topic}
          onRestart={onBack}
          onViewHistory={() => setDetail(null)}
        />
      </div>
    );
  }

  if (detailLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 pb-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-extrabold text-gray-800 flex items-center gap-2">
          <MdOutlineQuiz className="text-green-500" size={22} />
          Assessment History
        </h2>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-2 rounded-lg transition-all cursor-pointer"
        >
          <FaArrowLeft size={11} /> New Test
        </button>
      </div>

      {/* Error */}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          ⚠️ {fetchError}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && history.length === 0 && !fetchError && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <FaInbox size={36} className="mb-3 opacity-40" />
          <p className="font-semibold">No assessments yet.</p>
          <p className="text-sm mt-1">Complete a test to see your results here.</p>
        </div>
      )}

      {/* History list */}
      {!loading && history.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {history.map(h => {
            const grade = h.grade || "F";
            return (
              <button
                key={h._id}
                onClick={() => handleView(h._id)}
                className="bg-white rounded-xl p-4 border border-green-100 hover:border-green-300 hover:shadow-md hover:shadow-green-50 transition-all text-left w-full cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Topic + date */}
                    <p className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-1.5 flex-wrap">
                      <span>{TOPIC_ICONS[h.topic] || "📋"}</span>
                      <span>{h.topic?.charAt(0).toUpperCase() + h.topic?.slice(1)}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{fmtDate(h.createdAt)}</p>

                    {/* Tags row */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {h.totalQuestions} questions
                      </span>
                      <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        MCQ {h.mcqCorrect}/{h.mcqTotal}
                      </span>
                      <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        T/F {h.tfCorrect}/{h.tfTotal}
                      </span>
                      <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {fmtTime(h.totalTimeTaken)}
                      </span>
                    </div>
                  </div>

                  {/* Grade + chevron */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`flex flex-col items-center px-3 py-2 rounded-xl border ${GRADE_BG[grade] || "bg-gray-50 border-gray-200"}`}>
                      <span className={`text-xl font-black leading-none ${GRADE_COLOR[grade] || "text-gray-600"}`}>{grade}</span>
                      <span className="text-xs text-gray-400 font-semibold mt-0.5">{h.scorePercent}%</span>
                    </div>
                    <FaChevronRight className="text-gray-300 group-hover:text-green-400 transition-colors" size={12} />
                  </div>
                </div>

                {/* Mini progress bar */}
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      h.scorePercent >= 70 ? "bg-green-400" :
                      h.scorePercent >= 40 ? "bg-amber-400" : "bg-red-400"
                    }`}
                    style={{ width: `${h.scorePercent}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}