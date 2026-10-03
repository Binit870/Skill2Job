import { Trophy, RotateCcw, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

const SCORE_BANDS = {
  good: { bg: "bg-pine/8",   text: "text-pine",   border: "border-pine/20",   bar: "bg-pine" },
  fair: { bg: "bg-gold/10",  text: "text-gold",   border: "border-gold/25",   bar: "bg-gold" },
  poor: { bg: "bg-red-50",   text: "text-red-600", border: "border-red-200",  bar: "bg-red-500" },
};

const getScoreBand = (s) => (s >= 8 ? SCORE_BANDS.good : s >= 6 ? SCORE_BANDS.fair : SCORE_BANDS.poor);

const getScoreLabel = (s) => {
  if (s >= 8) return "Excellent";
  if (s >= 6) return "Good";
  if (s >= 4) return "Fair";
  return "Needs work";
};

export default function FeedbackReport({ feedback, role, setStep }) {
  const score = feedback?.overall_score ?? 0;
  const results = feedback?.results ?? [];

  const band = getScoreBand(score);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 10) * circumference;

  return (
    <div className="max-w-[680px] mx-auto w-full flex flex-col gap-3.5">

      {/* Header / Score card */}
      <div className="bg-white rounded-2xl border border-mist shadow-card px-5 sm:px-9 py-6 sm:py-10 text-center">
        <div className="inline-flex items-center justify-center w-13 h-13 rounded-full bg-pine/8 border border-pine/20 mb-4">
          <Trophy size={22} className="text-pine" />
        </div>

        <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-1.5 tracking-tight">
          Interview complete!
        </h2>
        <p className="text-ink/50 text-sm mb-7 leading-relaxed">
          Performance report for <strong className="text-ink/75 font-semibold">{role}</strong>
        </p>

        {/* Score ring */}
        <div className="flex justify-center mb-4.5">
          <div className="relative w-[110px] h-[110px]">
            <svg width="110" height="110" viewBox="0 0 120 120" className="-rotate-90">
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#E7E4DA" strokeWidth="8" />
              <circle
                cx="60" cy="60" r={radius}
                fill="none" stroke="#0E6B52"
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-ink leading-none">{score}</span>
              <span className="text-xs text-ink/40 font-normal">/10</span>
            </div>
          </div>
        </div>

        <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium border ${band.bg} ${band.text} ${band.border}`}>
          {score >= 6 ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
          {getScoreLabel(score)}
        </div>
      </div>

      {/* Per-question breakdown */}
      <div className="bg-white rounded-2xl border border-mist shadow-card px-4 sm:px-8 py-5 sm:py-8">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-pine/8 border border-pine/20 flex items-center justify-center">
            <TrendingUp size={15} className="text-pine" />
          </div>
          <h3 className="font-display text-[15px] font-bold text-ink">Question breakdown</h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {results.map((item, index) => {
            const c = getScoreBand(item.score);
            const barW = `${(item.score / 10) * 100}%`;
            return (
              <div key={index} className="bg-paper/60 rounded-xl border border-mist px-3.5 sm:px-4.5 py-3 sm:py-4.5">
                <div className="flex justify-between items-start gap-3 mb-2.5 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-medium text-ink/40 uppercase tracking-wider">
                      Q{index + 1}
                    </span>
                    <p className="text-[13px] font-medium text-ink/75 mt-1 leading-snug">
                      {item.question}
                    </p>
                  </div>
                  <div className={`shrink-0 rounded-lg px-3 py-1 text-[13px] font-bold whitespace-nowrap border ${c.bg} ${c.text} ${c.border}`}>
                    {item.score}/10
                  </div>
                </div>

                {/* Score bar */}
                <div className="h-1 bg-mist rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${c.bar}`}
                    style={{ width: barW }}
                  />
                </div>

                {item.feedback && (
                  <p className="text-[13px] text-ink/55 mt-2 leading-relaxed">
                    {item.feedback}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Retry button */}
      <button
        onClick={() => setStep("setup")}
        className="w-full py-3.5 rounded-xl border border-pine/25 bg-pine/8 hover:bg-pine/15 text-pine text-sm font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <RotateCcw size={15} />
        Take another interview
      </button>
    </div>
  );
}
