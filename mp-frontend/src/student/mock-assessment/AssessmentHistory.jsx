import { useState, useEffect } from "react";
import {
  XCircle, ChevronRight, ArrowLeft, Inbox, Clock, ClipboardList,
} from "lucide-react";
import AssessmentResult from "./AssessmentResult";
import API from "../../utils/api.js";

const TOPIC_ICONS = { aptitude: "🧮", reasoning: "🧩", verbal: "📖", technical: "💻", ml: "🤖" };

const GRADE_CFG = {
  "A+": { text: "#0E6B52", bg: "#E9F2EE", border: "#BBDACE" },
  "A":  { text: "#0E6B52", bg: "#E9F2EE", border: "#BBDACE" },
  "B":  { text: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  "C":  { text: "#C99A3B", bg: "#FBF3E1", border: "#E9D4A3" },
  "D":  { text: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
  "F":  { text: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", {
  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
});
const fmtTime = (s) => !s ? "—" : s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;

export default function AssessmentHistory({ onBack }) {
  const [history, setHistory]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [detail,  setDetail]              = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [fetchError, setFetchError]       = useState(null);

  useEffect(() => {
    API.get("/api/assessment/history")
      .then(r => setHistory(r.data))
      .catch(e => { console.error(e); setFetchError("Could not load history."); })
      .finally(() => setLoading(false));
  }, []);

  const handleView = async (id) => {
    setDetailLoading(true);
    try {
      const r = await API.get(`/api/assessment/history/${id}`);
      setDetail(r.data);
    } catch (e) { console.error(e); }
    finally { setDetailLoading(false); }
  };

  if (detail) return (
    <div className="flex flex-col gap-3.5">
      <button
        onClick={() => setDetail(null)}
        className="inline-flex items-center gap-1.5 self-start text-xs font-bold text-pine bg-pine/8 border border-pine/20 rounded-[10px] px-3.5 py-2 hover:bg-pine/15 transition-colors"
      >
        <ArrowLeft className="w-2.5 h-2.5" /> Back to History
      </button>
      <AssessmentResult
        result={detail}
        topic={detail.topic}
        onRestart={onBack}
        onViewHistory={() => setDetail(null)}
      />
    </div>
  );

  if (detailLoading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-[3px] border-pine/20 border-t-pine rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-3.5 pb-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-pine to-moss flex items-center justify-center">
            <ClipboardList className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h2 className="font-display text-base font-extrabold text-ink">Assessment History</h2>
            {history.length > 0 && (
              <p className="text-[11px] text-ink/40 font-medium mt-0.5">
                {history.length} assessment{history.length !== 1 ? "s" : ""} completed
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-pine bg-pine/8 border border-pine/20 rounded-[10px] px-4 py-2.5 hover:bg-pine/15 transition-colors"
        >
          <ArrowLeft className="w-2.5 h-2.5" /> New Test
        </button>
      </div>

      {/* Error */}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-[13px] font-semibold flex items-center gap-2">
          <XCircle className="w-3.5 h-3.5" /> {fetchError}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-14">
          <div className="w-10 h-10 border-[3px] border-pine/20 border-t-pine rounded-full animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && history.length === 0 && !fetchError && (
        <div className="flex flex-col items-center py-14 px-5 text-center bg-paper/60 rounded-2xl border-[1.5px] border-dashed border-mist">
          <div className="w-14 h-14 rounded-2xl bg-ink/5 flex items-center justify-center mb-3.5">
            <Inbox className="w-5.5 h-5.5 text-ink/25" />
          </div>
          <p className="font-bold text-ink/70 text-[15px] mb-1.5">No assessments yet</p>
          <p className="text-[13px] text-ink/40">Complete a test to see your results here.</p>
        </div>
      )}

      {/* List */}
      {!loading && history.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {history.map((h) => {
            const grade = h.grade || "F";
            const gc    = GRADE_CFG[grade] || GRADE_CFG["F"];
            return (
              <button
                key={h._id}
                onClick={() => handleView(h._id)}
                className="group bg-white rounded-2xl border border-mist px-4.5 py-4 text-left w-full transition-all duration-200 hover:border-pine/35 hover:shadow-card-hover hover:-translate-y-px"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-7 h-7 rounded-lg shrink-0 bg-pine/8 border border-pine/20 flex items-center justify-center text-sm">
                        {TOPIC_ICONS[h.topic] || "📋"}
                      </span>
                      <div>
                        <p className="text-[13px] font-bold text-ink">
                          {h.topic?.charAt(0).toUpperCase() + h.topic?.slice(1)}
                        </p>
                        <p className="text-[11px] text-ink/40 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {fmtDate(h.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[
                        { label: `${h.totalQuestions} Qs`, cls: "bg-ink/5 text-ink/50 border-mist" },
                        { label: `MCQ ${h.mcqCorrect}/${h.mcqTotal}`, cls: "bg-pine/8 text-pine border-pine/20" },
                        { label: `T/F ${h.tfCorrect}/${h.tfTotal}`, cls: "bg-gold/10 text-gold border-gold/25" },
                        { label: fmtTime(h.totalTimeTaken), cls: "bg-ink/5 text-ink/50 border-mist" },
                      ].map(({ label, cls }) => (
                        <span key={label} className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${cls}`}>
                          {label}
                        </span>
                      ))}
                    </div>

                    {/* Mini progress */}
                    <div className="mt-3 h-1 bg-ink/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${h.scorePercent}%`,
                          background: h.scorePercent >= 70 ? "linear-gradient(90deg,#4ade80,#0E6B52)" : h.scorePercent >= 40 ? "#C99A3B" : "#f87171",
                        }}
                      />
                    </div>
                  </div>

                  {/* Grade + chevron */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div
                      className="flex flex-col items-center rounded-xl px-3 py-2 min-w-[50px] border-[1.5px]"
                      style={{ background: gc.bg, borderColor: gc.border }}
                    >
                      <span className="text-xl font-extrabold leading-none" style={{ color: gc.text }}>{grade}</span>
                      <span className="text-[10px] text-ink/40 font-semibold mt-0.5">{h.scorePercent}%</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-ink/25 group-hover:text-pine transition-colors" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
