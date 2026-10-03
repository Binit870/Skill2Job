import { useState } from "react";
import toast from "react-hot-toast";
import {
  Calculator, Brain, BookOpen, Code2, Bot,
  Play, Clock, ListOrdered, CheckCircle2, Zap, SlidersHorizontal,
} from "lucide-react";
import API from "../../utils/api.js";

const TOPICS = [
  { id: "aptitude",  label: "Aptitude",          Icon: Calculator, desc: "Numbers, percentages, time & work",  accent: "#3b82f6", lightBg: "#eff6ff", border: "#bfdbfe" },
  { id: "reasoning", label: "Reasoning",         Icon: Brain,      desc: "Series, coding, logical deduction",  accent: "#8b5cf6", lightBg: "#f5f3ff", border: "#ddd6fe" },
  { id: "verbal",    label: "Verbal",            Icon: BookOpen,   desc: "Grammar, vocabulary, comprehension", accent: "#C99A3B", lightBg: "#FBF3E1", border: "#E9D4A3" },
  { id: "technical", label: "Technical / Coding",Icon: Code2,      desc: "DSA, OS, DBMS, networking",          accent: "#0E6B52", lightBg: "#E9F2EE", border: "#BBDACE" },
  { id: "ml",        label: "Machine Learning",  Icon: Bot,        desc: "ML concepts, algorithms, metrics",   accent: "#ef4444", lightBg: "#fef2f2", border: "#fecaca" },
];

const Q_COUNTS  = [5, 10, 15, 20];
const TIME_OPTS = [{ v: 20, l: "20s" }, { v: 30, l: "30s" }, { v: 45, l: "45s" }, { v: 60, l: "60s" }];

const SectionCard = ({ children }) => (
  <div className="bg-white rounded-2xl border border-mist shadow-card p-5 sm:p-6">
    {children}
  </div>
);

const SectionLabel = ({ step, children, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4.5">
    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-pine to-moss flex items-center justify-center text-[11px] font-extrabold text-white shrink-0">
      {step}
    </div>
    {Icon && <Icon className="w-3.5 h-3.5 text-pine" />}
    <span className="text-[11px] font-bold tracking-widest uppercase text-pine">
      {children}
    </span>
  </div>
);

const SegButton = ({ active, ...props }) => (
  <button
    {...props}
    className={`flex-1 py-2.5 rounded-[10px] text-[13px] font-bold border-[1.5px] transition-all
      ${active
        ? "bg-gradient-to-br from-pine to-moss border-transparent text-white shadow-md shadow-pine/25"
        : "bg-paper/60 border-mist text-ink/50 hover:border-pine/40 hover:text-pine hover:bg-pine/8"
      }`}
  />
);

export default function AssessmentSetup({ onReady, setLoading }) {
  const [topic,    setTopic]    = useState(null);
  const [numQ,     setNumQ]     = useState(10);
  const [timePerQ, setTimePerQ] = useState(30);
  const [tfRatio,  setTfRatio]  = useState(30);

  const nTF   = Math.round(numQ * tfRatio / 100);
  const nMCQ  = numQ - nTF;
  const estMin = Math.ceil((numQ * timePerQ) / 60);
  const sel    = TOPICS.find(t => t.id === topic);

  const handleStart = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const { data } = await API.post("api/assessment/generate", {
        topic, num_questions: numQ, time_per_question: timePerQ, tf_ratio: tfRatio / 100,
      });
      onReady({ topic, questions: data.questions, timePerQuestion: data.time_per_question });
    } catch (err) {
      console.error("Generate error:", err?.response?.data || err.message);
      toast.error("Failed to generate questions. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-6">

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-moss via-pine to-pine p-6 sm:p-9 text-white shadow-lg shadow-pine/30">
        <div className="absolute -top-8 -right-8 w-[120px] h-[120px] rounded-full bg-white/[0.06] pointer-events-none" />
        <div className="absolute -bottom-10 right-16 w-[90px] h-[90px] rounded-full bg-white/[0.04] pointer-events-none" />

        <div className="relative flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.18] backdrop-blur flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase opacity-70 mb-0.5">
              Skill Assessment
            </p>
            <h1 className="font-display text-xl sm:text-2xl font-normal italic leading-none">
              Mock Assessment
            </h1>
          </div>
        </div>
        <p className="relative text-[13px] text-white/75 max-w-[420px] leading-relaxed">
          Pick a topic, configure your test, then tackle a timed mix of MCQ and True/False questions.
        </p>
      </div>

      {/* Topic Selection */}
      <SectionCard>
        <SectionLabel step="1" icon={Zap}>Select Topic</SectionLabel>
        <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {TOPICS.map(({ id, label, Icon, desc, accent, lightBg, border }) => {
            const active = topic === id;
            return (
              <button
                key={id}
                onClick={() => setTopic(id)}
                className={`relative text-left rounded-2xl p-4 transition-all duration-200
                  ${active ? "border-2 shadow-sm" : "border-[1.5px] border-mist bg-paper/60 hover:border-pine/40 hover:bg-pine/8 hover:-translate-y-px"}`}
                style={active ? { background: lightBg, borderColor: border } : {}}
              >
                {active && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-pine absolute top-3 right-3" />
                )}
                <div
                  className="w-8 h-8 rounded-lg mb-2.5 flex items-center justify-center transition-colors"
                  style={{ background: active ? `${accent}18` : "#F1EFE7" }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: active ? accent : "#9ca3af" }} />
                </div>
                <p className={`text-[13px] font-bold mb-1 ${active ? "text-ink" : "text-ink/70"}`}>
                  {label}
                </p>
                <p className="text-[11px] text-ink/40 leading-snug">{desc}</p>
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Configure Test */}
      <SectionCard>
        <SectionLabel step="2" icon={SlidersHorizontal}>Configure Test</SectionLabel>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <ListOrdered className="w-3 h-3 text-pine" />
              <span className="text-[11px] font-semibold text-ink/50 uppercase tracking-wider">
                Questions
              </span>
            </div>
            <div className="flex gap-2">
              {Q_COUNTS.map((n) => (
                <SegButton key={n} active={numQ === n} onClick={() => setNumQ(n)}>{n}</SegButton>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Clock className="w-3 h-3 text-pine" />
              <span className="text-[11px] font-semibold text-ink/50 uppercase tracking-wider">
                Time / Question
              </span>
            </div>
            <div className="flex gap-2">
              {TIME_OPTS.map(({ v, l }) => (
                <SegButton key={v} active={timePerQ === v} onClick={() => setTimePerQ(v)}>{l}</SegButton>
              ))}
            </div>
          </div>
        </div>

        {/* Mix slider */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-pine" />
              <span className="text-[11px] font-semibold text-ink/50 uppercase tracking-wider">
                Question Mix
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-[11px] font-bold bg-pine/8 text-pine px-2.5 py-0.5 rounded-full border border-pine/20">
                {nMCQ} MCQ
              </span>
              <span className="text-[11px] font-bold bg-gold/10 text-gold px-2.5 py-0.5 rounded-full border border-gold/25">
                {nTF} T/F
              </span>
            </div>
          </div>
          <input
            type="range" min={0} max={60} step={10} value={tfRatio}
            onChange={(e) => setTfRatio(Number(e.target.value))}
            className="w-full h-1.5 rounded-full cursor-pointer accent-pine"
            style={{ background: "linear-gradient(90deg, #BBDACE, #E9F2EE)" }}
          />
          <div className="flex justify-between mt-1.5">
            {["All MCQ", "Equal mix", "60% T/F"].map((l) => (
              <span key={l} className="text-[11px] text-ink/40">{l}</span>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* CTA / Summary */}
      {topic ? (
        <div className="bg-white rounded-2xl border-[1.5px] border-pine/25 p-5 sm:p-6 flex items-center justify-between flex-wrap gap-4 shadow-sm shadow-pine/10">
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="w-5 h-5 rounded-[5px] bg-gradient-to-br from-pine to-moss flex items-center justify-center">
                <span className="text-[9px] font-extrabold text-white">3</span>
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-pine">
                Ready to start
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: sel?.label, cls: "bg-pine/8 text-pine border-pine/20" },
                { label: `${nMCQ} MCQ + ${nTF} T/F`, cls: "bg-paper/60 text-ink/70 border-mist" },
                { label: `${timePerQ}s / question`, cls: "bg-paper/60 text-ink/70 border-mist" },
                { label: `~${estMin} min total`, cls: "bg-paper/60 text-ink/70 border-mist" },
              ].map(({ label, cls }) => (
                <span key={label} className={`text-xs font-semibold px-3 py-1 rounded-full border ${cls}`}>
                  {label}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={handleStart}
            className="flex items-center gap-2 bg-gradient-to-br from-pine to-moss text-white text-sm font-bold px-7 py-3 rounded-xl shrink-0 shadow-lg shadow-pine/30 hover:-translate-y-px transition-transform"
          >
            <Play className="w-3 h-3" /> Start Assessment
          </button>
        </div>
      ) : (
        <div className="bg-paper/60 rounded-2xl border-[1.5px] border-dashed border-ink/20 py-7 px-5 text-center text-ink/40 text-[13px] font-medium">
          Select a topic above to continue
        </div>
      )}
    </div>
  );
}
