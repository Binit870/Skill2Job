import { motion } from "framer-motion";
import { Star, AlertCircle, ArrowRight } from "lucide-react";
import Button from "./Button";

export default function RecommendedJobs({ matchedJobs, onSelectJob }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.18, ease: "easeOut" }}
    >
      <h2 className="text-base font-semibold text-gray-800 mb-3">
        Recommended Jobs
      </h2>

      {matchedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-sm text-gray-400">
          No matching jobs found at this time.
        </div>
      ) : (
        <div className="space-y-3">
          {matchedJobs.map((job, i) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {job.company} &middot; {job.location}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f4c35] bg-[#f0f7f4] px-2.5 py-1 rounded-full border border-[#d1ede3]">
                      <Star className="w-3 h-3" />
                      {job.matchScore} skills matched
                    </span>
                    {job.missingCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                        <AlertCircle className="w-3 h-3" />
                        {job.missingCount} skills missing
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => onSelectJob(job)}
                  className="shrink-0 self-start flex items-center gap-1.5 group-hover:bg-[#0a3525]"
                >
                  Apply
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}