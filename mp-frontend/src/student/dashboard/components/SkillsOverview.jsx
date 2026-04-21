import { motion } from "framer-motion";

export default function SkillsOverview({ matchedSkills, missingSkills }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6"
    >
      <h2 className="text-base font-semibold text-gray-800 mb-5">Skills Overview</h2>

      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#0f4c35]" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Your Skills
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {matchedSkills.map((s) => (
            <span
              key={s}
              className="px-3 py-1 bg-[#f0f7f4] text-[#0f4c35] rounded-full text-xs font-medium border border-[#d1ede3]"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* <div className="border-t border-gray-50 pt-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Missing Skills
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {missingSkills.map((s) => (
            <span
              key={s}
              className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium border border-red-100"
            >
              {s}
            </span>
          ))}
        </div>
      </div> */}
    </motion.div>
  );
}