import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, BarChart3, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import JobDetails from "../jobs/JobDetails";
import Button from "./components/Button";
import Stat from "./components/Stat";
import SkillsOverview from "./components/SkillsOverview";
import RecommendedJobs from "./components/RecommendedJobs";
import PlacementScore from "./components/PlacementScore";

const normalize = (s) =>
  s.toLowerCase().trim()
    .replace(/\./g, "")
    .replace(/\s+/g, "");

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, jobsRes, appRes, analysisRes] = await Promise.all([
          API.get("/api/profile"),
          API.get("/api/jobs").catch(() => ({ data: { data: [] } })),
          API.get("/api/applications/my").catch(() => ({ data: { data: [] } })),
          API.get("/api/resume/latest").catch(() => ({ data: { data: null } })),
        ]);

        setUser(profile.data);
        setJobs(jobsRes.data.data || []);
        setApplications(appRes.data.data || []);
        setAnalysis(analysisRes.data.data);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
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
  const missingSkills = analysis?.missingSkills || [];

  const matchedSkills = (user?.skills || []).map((s) => s.toLowerCase().trim());
  const normalizedUserSkills = matchedSkills.map(normalize);

  const matchedJobs = jobs
    .map((job) => {
      const jobSkills = job.skills || [];
      const matched = jobSkills.filter((s) => normalizedUserSkills.includes(normalize(s)));
      const missing = jobSkills.filter((s) => !normalizedUserSkills.includes(normalize(s)));
      return { ...job, matchScore: matched.length, missingCount: missing.length };
    })
    .filter((job) => job.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

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
          <Stat title="Placement Probability" value={`${placementProbability}%`} icon={TrendingUp} accent="#0f4c35" />
          <Stat title="Applications Sent" value={applications.length} icon={Briefcase} accent="#0f4c35" />
          <Stat title="ATS Score" value={`${analysis?.atsScore || 0}%`} icon={BarChart3} accent="#0f4c35" />
          <Stat title="Open Positions" value={jobs.length} icon={DollarSign} accent="#0f4c35" />
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-5">
            <SkillsOverview matchedSkills={matchedSkills} missingSkills={missingSkills} />
            <RecommendedJobs matchedJobs={matchedJobs} onSelectJob={setSelectedJob} />
          </div>

          {/* RIGHT */}
          <PlacementScore
            placementProbability={placementProbability}
            analysis={analysis}
            jobs={jobs}
            normalizedUserSkills={normalizedUserSkills}
            normalize={normalize}
          />
        </div>
      </div>

      {selectedJob && (
        <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}