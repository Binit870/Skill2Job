import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function SkillsOverview({ matchedSkills, missingSkills }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-mist shadow-card p-4 sm:p-6"
    >
      <h2 className="font-display text-base font-semibold text-ink mb-5">Skills Overview</h2>

      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-pine" />
          <p className="text-xs font-semibold text-ink/45 uppercase tracking-wider">
            Your Skills
          </p>
        </div>
        {matchedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((s) => (
              <span
                key={s}
                className="px-3 py-1 bg-pine/8 text-pine rounded-full text-xs font-medium border border-pine/15"
              >
                {s}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/40">
            Add skills to your profile to see how they match up.
          </p>
        )}
      </div>

      {missingSkills.length > 0 && (
        <div className="border-t border-mist pt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              <p className="text-xs font-semibold text-ink/45 uppercase tracking-wider">
                Worth learning next
              </p>
            </div>
            <span className="text-[10px] text-ink/35 font-medium hidden sm:block">
              Click a skill to find a course
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((s) => (
              <a
                key={s}
                href={`https://www.google.com/search?q=${encodeURIComponent(`${s} course`)}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-medium border border-gold/20 hover:bg-gold/20 hover:border-gold/35 transition-colors"
              >
                {s}
                <ExternalLink className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
