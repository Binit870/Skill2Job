import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Briefcase,
  Star,
  AlertCircle,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

/* BUTTON */
function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary:
      "bg-[#0f4c35] text-white hover:bg-[#0a3525] shadow-sm hover:shadow-md",
    outline:
      "border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* MAIN */
export default function StudentDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, jobsRes, appRes, analysisRes] = await Promise.all([
          API.get("/api/profile/student"),
          API.get("/api/jobs"),
          API.get("/api/applications/my"),
          API.get("/api/resume/latest").catch(() => null),
        ]);

        setUser(profile.data);
        setJobs(jobsRes.data.data || []);
        setApplications(appRes.data.data || []);
        if (analysisRes?.data) setAnalysis(analysisRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#0f4c35] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 tracking-wide font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const placementProbability = analysis?.placementProbability || 0;
  const matchedSkills = user?.skills || [];
  const missingSkills = analysis?.missingSkills || [];

  /* MATCHING */
  const matchedJobs = jobs
    .map((job) => {
      const matchCount = job.skills?.filter((skill) =>
        matchedSkills.includes(skill)
      ).length;
      return { ...job, matchScore: matchCount };
    })
    .filter((job) => job.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

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

  return (
    <div className="min-h-screen bg-[#f7f7f5] p-6 font-['DM_Sans',sans-serif]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display&display=swap');`}</style>

      <div className="max-w-6xl mx-auto space-y-5">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm px-7 py-5 flex justify-between items-center"
        >
          <div>
            <p className="text-xs font-semibold text-[#0f4c35] tracking-widest uppercase mb-1">
              Student Dashboard
            </p>
            <h1
              className="text-2xl font-bold text-gray-900 leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Welcome back, {user?.name}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Track your progress and opportunities
            </p>
          </div>

          <Button onClick={() => navigate("/student/edit-profile")}>
            View Profile
          </Button>
        </motion.div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06, ease: "easeOut" }}
          className="grid md:grid-cols-4 gap-4"
        >
          <Stat
            title="Placement Probability"
            value={`${placementProbability}%`}
            icon={TrendingUp}
            accent="#0f4c35"
          />
          <Stat
            title="Applications Sent"
            value={applications.length}
            icon={Briefcase}
            accent="#0f4c35"
          />
          <Stat
            title="ATS Score"
            value={`${analysis?.atsScore || 0}%`}
            icon={BarChart3}
            accent="#0f4c35"
          />
          <Stat
            title="Open Positions"
            value={jobs.length}
            icon={DollarSign}
            accent="#0f4c35"
          />
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-5">

            {/* SKILLS */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <h2 className="text-base font-semibold text-gray-800 mb-5">
                Skills Overview
              </h2>

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

              <div className="border-t border-gray-50 pt-5">
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
              </div>
            </motion.div>

            {/* JOBS */}
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
                      <div className="flex items-start justify-between gap-4">
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
                          </div>
                        </div>
                        <Button className="shrink-0 flex items-center gap-1.5 group-hover:bg-[#0a3525]">
                          Apply
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT — Placement Score */}
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
              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 120 120"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#f0f0ee"
                  strokeWidth="10"
                />
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
              style={{
                color: scoreColor,
                backgroundColor: `${scoreColor}14`,
              }}
            >
              {scoreLabel}
            </span>

            <p className="mt-4 text-xs text-gray-400 text-center leading-relaxed">
              Based on your resume, skills, and market demand
            </p>

            {/* Mini progress bars for sub-scores */}
            <div className="mt-6 w-full space-y-3">
              <SubScore label="ATS Score" value={analysis?.atsScore || 0} />
              <SubScore label="Skill Match" value={
                matchedSkills.length > 0
                  ? Math.round((matchedSkills.length / (matchedSkills.length + missingSkills.length || 1)) * 100)
                  : 0
              } />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

/* STAT */
function Stat({ title, value, icon: Icon, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accent}14` }}
      >
        <Icon className="w-4.5 h-4.5" style={{ color: accent }} size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium truncate">{title}</p>
        <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}

/* SUB SCORE BAR */
function SubScore({ label, value }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-semibold text-gray-700">{value}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#0f4c35] rounded-full transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}