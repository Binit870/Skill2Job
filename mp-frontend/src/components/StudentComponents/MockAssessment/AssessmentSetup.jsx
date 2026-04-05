import { useState } from "react";
import axios from "axios";
import { FaCalculator, FaBrain, FaBook, FaCode, FaRobot, FaPlay, FaClock, FaListOl } from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";

const TOPICS = [
  { id: "aptitude",  label: "Aptitude",           Icon: FaCalculator, desc: "Numbers, percentages, time & work" },
  { id: "reasoning", label: "Reasoning",          Icon: FaBrain,      desc: "Series, coding, logical deduction" },
  { id: "verbal",    label: "Verbal",              Icon: FaBook,       desc: "Grammar, vocabulary, comprehension" },
  { id: "technical", label: "Technical / Coding",  Icon: FaCode,       desc: "DSA, OS, DBMS, networks" },
  { id: "ml",        label: "Machine Learning",    Icon: FaRobot,      desc: "ML concepts, algorithms, metrics" },
];

const QUESTION_COUNTS = [5, 10, 15, 20];
const TIME_OPTIONS    = [{ value: 20, label: "20s" }, { value: 30, label: "30s" }, { value: 45, label: "45s" }, { value: 60, label: "60s" }];

export default function AssessmentSetup({ onReady, setLoading }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [numQuestions,  setNumQuestions]  = useState(10);
  const [timePerQ,      setTimePerQ]      = useState(30);
  const [tfRatio,       setTfRatio]       = useState(30); // percent 0-60

  const nTF   = Math.round(numQuestions * tfRatio / 100);
  const nMCQ  = numQuestions - nTF;
  const estMin = Math.ceil((numQuestions * timePerQ) / 60);

  const handleStart = async () => {
    if (!selectedTopic) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/assessment/generate`,
        { topic: selectedTopic, num_questions: numQuestions, time_per_question: timePerQ, tf_ratio: tfRatio / 100 }
      );
      onReady({ topic: selectedTopic, questions: data.questions, timePerQuestion: data.time_per_question });
    } catch (err) {
      console.error(err);
      alert("Failed to generate questions. Is the server running?");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 p-7 text-white shadow-lg shadow-green-200">
        <div className="flex items-center gap-3 mb-2">
          <MdOutlineQuiz size={28} />
          <h1 className="text-2xl font-extrabold tracking-tight">Mock Assessment</h1>
        </div>
        <p className="text-green-50 text-sm leading-relaxed">
          Choose a topic, set your preferences, and tackle a timed MCQ + True/False test.
        </p>
      </div>

      {/* Topic Grid */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
        <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-4">Select Topic</p>
        <div className="grid grid-cols-2 gap-3">
          {TOPICS.map(({ id, label, Icon, desc }) => {
            const active = selectedTopic === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedTopic(id)}
                className={`rounded-xl p-4 text-left border-2 transition-all duration-150 cursor-pointer
                  ${active
                    ? "border-green-500 bg-green-50 shadow-sm shadow-green-200"
                    : "border-gray-100 bg-gray-50 hover:border-green-200 hover:bg-green-50"
                  }`}
              >
                <Icon className={`mb-2 ${active ? "text-green-600" : "text-gray-400"}`} size={22} />
                <p className={`text-sm font-bold ${active ? "text-green-700" : "text-gray-800"}`}>{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100 flex flex-col gap-5">

        {/* Questions + Time */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaListOl className="text-green-500" size={13} />
              <p className="text-xs font-bold text-green-700 uppercase tracking-widest">Questions</p>
            </div>
            <div className="flex gap-2">
              {QUESTION_COUNTS.map(n => (
                <button
                  key={n}
                  onClick={() => setNumQuestions(n)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold border-2 transition-all cursor-pointer
                    ${numQuestions === n
                      ? "bg-green-500 border-green-500 text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-green-300"
                    }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaClock className="text-green-500" size={13} />
              <p className="text-xs font-bold text-green-700 uppercase tracking-widest">Time / Q</p>
            </div>
            <div className="flex gap-2">
              {TIME_OPTIONS.map(t => (
                <button
                  key={t.value}
                  onClick={() => setTimePerQ(t.value)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold border-2 transition-all cursor-pointer
                    ${timePerQ === t.value
                      ? "bg-green-500 border-green-500 text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-green-300"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mix slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-green-700 uppercase tracking-widest">Question Mix</p>
            <div className="flex gap-2 text-xs font-semibold">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">{nMCQ} MCQ</span>
              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full">{nTF} True/False</span>
            </div>
          </div>
          {/* Tailwind can't style range track — use inline style */}
          <input
            type="range" min={0} max={60} step={10}
            value={tfRatio}
            onChange={e => setTfRatio(Number(e.target.value))}
            className="w-full h-2 rounded-full cursor-pointer appearance-none bg-gray-200"
            style={{ accentColor: "#16a34a" }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>All MCQ</span><span>60% T/F</span>
          </div>
        </div>
      </div>

      {/* Summary + Start */}
      {selectedTopic && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="text-sm text-green-800 leading-relaxed">
            <span className="font-bold">{TOPICS.find(t => t.id === selectedTopic)?.label}</span>
            {" · "}{nMCQ} MCQ + {nTF} T/F{" · "}{timePerQ}s each
            {" · "}<span className="font-bold">~{estMin} min</span>
          </div>
          <button
            onClick={handleStart}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-green-300 cursor-pointer shrink-0"
          >
            <FaPlay size={12} /> Start
          </button>
        </div>
      )}
    </div>
  );
}