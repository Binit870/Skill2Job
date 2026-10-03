import { useState } from "react";
import { generateQuestions } from "../../services/mockInterviewService";
import { ChevronDown, AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";

const DIFFICULTY_OPTIONS = [
  { label: "Easy",   value: "easy",   cls: "border-pine/25 bg-pine/8 text-pine" },
  { label: "Medium", value: "medium", cls: "border-gold/30 bg-gold/10 text-gold" },
  { label: "Hard",   value: "hard",   cls: "border-red-200 bg-red-50 text-red-600" },
];

const ROLE_GROUPS = [
  { label: "Development",            options: ["Frontend Developer", "Backend Developer", "Full Stack Developer"] },
  { label: "Data & AI",              options: ["Data Scientist", "Machine Learning Engineer"] },
  { label: "Infrastructure & Cloud", options: ["DevOps Engineer", "Cloud Engineer"] },
  { label: "Security & Database",    options: ["Cybersecurity Analyst", "Database Administrator"] },
  { label: "HR & Management",        options: ["HR Manager"] },
];

export default function InterviewSetup({ onReady, setLoading }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState(null);

  const startInterview = async () => {
    if (!selectedRole) {
      setError("Please select a role to continue.");
      return;
    }
    setError(null);
    try {
      setLocalLoading(true);
      setLoading(true);
      const data = await generateQuestions({ role: selectedRole, difficulty });
      onReady({ role: selectedRole, questions: data.questions });
    } catch {
      setError("Failed to generate questions. Please check your connection and try again.");
      setLoading(false);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-mist shadow-card px-5 sm:px-10 py-7 sm:py-12 max-w-[480px] mx-auto w-full">

      {/* Icon + title */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-pine/8 border border-pine/20 inline-flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6 text-pine" />
        </div>
        <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-1.5 tracking-tight">
          Start mock interview
        </h2>
        <p className="text-ink/50 text-sm leading-relaxed">
          Select your target role and difficulty level
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mb-5 flex items-start gap-2.5">
          <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Role select */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-ink/45 uppercase tracking-wider mb-2">
          Target role
        </label>
        <div className="relative">
          <select
            value={selectedRole}
            onChange={(e) => { setSelectedRole(e.target.value); setError(null); }}
            className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-sm appearance-none outline-none cursor-pointer transition-colors
              ${selectedRole ? "border-pine/25 text-ink font-medium" : "border-mist text-ink/40"}
              focus:border-pine`}
          >
            <option value="" disabled hidden>Select a role...</option>
            {ROLE_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-ink/35 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-7">
        <label className="block text-xs font-semibold text-ink/45 uppercase tracking-wider mb-2.5">
          Difficulty
        </label>
        <div className="flex gap-2">
          {DIFFICULTY_OPTIONS.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium text-center transition-colors border
                ${difficulty === d.value ? d.cls : "border-mist text-ink/40 bg-white hover:border-ink/20"}`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={startInterview}
        disabled={localLoading}
        className="w-full py-3.5 rounded-xl border border-pine/25 bg-pine/8 hover:bg-pine/15 disabled:opacity-60 disabled:cursor-not-allowed text-pine text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        {localLoading ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Generating questions…
          </>
        ) : (
          "Start interview →"
        )}
      </button>
    </div>
  );
}
