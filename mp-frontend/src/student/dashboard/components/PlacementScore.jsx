import { motion } from "framer-motion";
import SubScore from "./SubScore";

export default function PlacementScore({ placementProbability, analysis, jobs, normalizedUserSkills, normalize }) {
  const scoreColor =
    placementProbability >= 75
      ? "#16a34a"
      : placementProbability >= 45
        ? "#d97706"
        : "#dc2626";

  const scoreLabel =
    placementProbability >= 75
      ? "Strong Profile"
      : placementProbability >= 45
        ? "On Track"
        : "Needs Work";

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (placementProbability / 100) * circumference;

  const skillMatchValue = (() => {
    const allJobSkills = [...new Set(jobs.flatMap((j) => j.skills || []).map(normalize))];
    const matched = allJobSkills.filter((s) => normalizedUserSkills.includes(s));
    return allJobSkills.length > 0
      ? Math.round((matched.length / allJobSkills.length) * 100)
      : 0;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.22, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center"
    >
      <h2 className="text-base font-semibold text-gray-800 mb-6 self-start">
        Placement Score
      </h2>

      {/* Circular Progress */}
      <div className="relative w-36 h-36 mb-5">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#f0f0ee" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={scoreColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold"
            style={{ color: scoreColor, fontFamily: "'DM Serif Display', serif" }}
          >
            {placementProbability}%
          </span>
        </div>
      </div>

      <span
        className="text-sm font-semibold px-3 py-1 rounded-full"
        style={{ color: scoreColor, backgroundColor: `${scoreColor}14` }}
      >
        {scoreLabel}
      </span>

      <p className="mt-4 text-xs text-gray-400 text-center leading-relaxed">
        Based on your resume, skills, and market demand
      </p>

      <div className="mt-6 w-full space-y-3">
        <SubScore label="ATS Score" value={analysis?.atsScore || 0} />
        <SubScore label="Skill Match" value={skillMatchValue} />
      </div>
    </motion.div>
  );
}