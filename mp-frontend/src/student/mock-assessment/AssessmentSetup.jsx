import { useState } from "react";
import axios from "axios";
import {
  FaCalculator, FaBrain, FaBook, FaCode, FaRobot,
  FaPlay, FaClock, FaListOl, FaCheckCircle
} from "react-icons/fa";
import { MdOutlineQuiz, MdTune } from "react-icons/md";
import API from "../../utils/api.js"
const TOPICS = [
  { id: "aptitude",  label: "Aptitude",          Icon: FaCalculator, desc: "Numbers, percentages, time & work", color: "text-blue-500",   activeBg: "bg-blue-50",   activeBorder: "border-blue-400" },
  { id: "reasoning", label: "Reasoning",         Icon: FaBrain,      desc: "Series, coding, logical deduction", color: "text-purple-500", activeBg: "bg-purple-50", activeBorder: "border-purple-400" },
  { id: "verbal",    label: "Verbal",             Icon: FaBook,       desc: "Grammar, vocabulary, comprehension", color: "text-amber-500",  activeBg: "bg-amber-50",  activeBorder: "border-amber-400" },
  { id: "technical", label: "Technical / Coding", Icon: FaCode,       desc: "DSA, OS, DBMS, networking", color: "text-green-600",  activeBg: "bg-green-50",  activeBorder: "border-green-500" },
  { id: "ml",        label: "Machine Learning",   Icon: FaRobot,      desc: "ML concepts, algorithms, metrics", color: "text-rose-500",   activeBg: "bg-rose-50",   activeBorder: "border-rose-400" },
];

const Q_COUNTS    = [5, 10, 15, 20];
const TIME_OPTS   = [{ v: 20, l: "20s" }, { v: 30, l: "30s" }, { v: 45, l: "45s" }, { v: 60, l: "60s" }];

export default function AssessmentSetup({ onReady, setLoading }) {
  const [topic,    setTopic]    = useState(null);
  const [numQ,     setNumQ]     = useState(10);
  const [timePerQ, setTimePerQ] = useState(30);
  const [tfRatio,  setTfRatio]  = useState(30); // 0-60 %

  const nTF   = Math.round(numQ * tfRatio / 100);
  const nMCQ  = numQ - nTF;
  const estMin = Math.ceil((numQ * timePerQ) / 60);

  const handleStart = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const { data } = await API.post(
        `api/assessment/generate`,
        { topic, num_questions: numQ, time_per_question: timePerQ, tf_ratio: tfRatio / 100 }
      );
      onReady({ topic, questions: data.questions, timePerQuestion: data.time_per_question });
    } catch (err) {
      console.error("Generate error:", err?.response?.data || err.message);
      alert("Failed to generate questions. Check that both servers are running.");
      setLoading(false);
    }
  };

  const sel = TOPICS.find(t => t.id === topic);

  return (
    <div className="flex flex-col gap-5 pb-6">

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 p-6 sm:p-8 text-white shadow-lg shadow-green-200/60">
        <div className="flex items-center gap-3 mb-2">
          <MdOutlineQuiz size={26} />
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Mock Assessment</h1>
        </div>
        <p className="text-green-100 text-sm leading-relaxed max-w-lg">
          Pick a topic, configure your test, then tackle a timed mix of MCQ and True/False questions.
        </p>
      </div>

      {/* Topic grid */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
        <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-4">
          1 · Select Topic
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOPICS.map(({ id, label, Icon, desc, color, activeBg, activeBorder }) => {
            const active = topic === id;
            return (
              <button
                key={id}
                onClick={() => setTopic(id)}
                className={`relative rounded-xl p-4 text-left border-2 transition-all duration-150 cursor-pointer group
                  ${active ? `${activeBorder} ${activeBg}` : "border-gray-100 bg-gray-50 hover:border-green-200 hover:bg-green-50/50"}`}
              >
                {active && (
                  <FaCheckCircle className="absolute top-3 right-3 text-green-500" size={14} />
                )}
                <Icon className={`mb-2.5 ${active ? color : "text-gray-300 group-hover:text-gray-400"} transition-colors`} size={20} />
                <p className={`text-sm font-bold ${active ? "text-gray-800" : "text-gray-700"}`}>{label}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">{desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100 flex flex-col gap-6">
        <p className="text-xs font-bold text-green-700 uppercase tracking-widest">
          2 · Configure Test
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Question count */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaListOl className="text-green-500" size={12} />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Number of Questions</p>
            </div>
            <div className="flex gap-2">
              {Q_COUNTS.map(n => (
                <button key={n} onClick={() => setNumQ(n)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold border-2 transition-all cursor-pointer
                    ${numQ === n ? "bg-green-500 border-green-500 text-white shadow-sm" : "bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Time per question */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaClock className="text-green-500" size={12} />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time per Question</p>
            </div>
            <div className="flex gap-2">
              {TIME_OPTS.map(({ v, l }) => (
                <button key={v} onClick={() => setTimePerQ(v)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold border-2 transition-all cursor-pointer
                    ${timePerQ === v ? "bg-green-500 border-green-500 text-white shadow-sm" : "bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mix slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MdTune className="text-green-500" size={14} />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Question Mix</p>
            </div>
            <div className="flex gap-2">
              <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">{nMCQ} MCQ</span>
              <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">{nTF} True/False</span>
            </div>
          </div>
          <input
            type="range" min={0} max={60} step={10} value={tfRatio}
            onChange={e => setTfRatio(Number(e.target.value))}
            className="w-full h-2 rounded-full cursor-pointer appearance-none bg-gray-200"
            style={{ accentColor: "#16a34a" }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1.5">
            <span>All MCQ</span>
            <span>Equal mix</span>
            <span>60% T/F</span>
          </div>
        </div>
      </div>

      {/* Summary + CTA */}
      {topic ? (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-green-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">3 · Ready to start</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                {sel?.label}
              </span>
              <span className="bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-semibold">
                {nMCQ} MCQ + {nTF} T/F
              </span>
              <span className="bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-semibold">
                {timePerQ}s / question
              </span>
              <span className="bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-semibold">
                ~{estMin} min total
              </span>
            </div>
          </div>
          <button
            onClick={handleStart}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-bold px-7 py-3 rounded-xl transition-all shadow-md shadow-green-200 cursor-pointer shrink-0"
          >
            <FaPlay size={11} /> Start Assessment
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center text-gray-400 text-sm">
          Select a topic above to continue
        </div>
      )}
    </div>
  );
}