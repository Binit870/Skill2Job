import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  FileText, Target, TrendingUp, Upload, Cpu, Sparkles,
  ChevronLeft, ChevronRight, Briefcase, BarChart3,
  Users, Search, Zap, Clock, Award, Brain,
  MessageSquare, LayoutDashboard, PlusCircle, CheckCircle,
  ArrowRight, FlaskConical,
} from "lucide-react";

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const jobSeekerFeatures = [
  {
    icon: Upload,
    title: "Resume Upload & Parsing",
    tag: "AI-Powered",
    tagColor: "bg-green-100 text-green-700",
    accent: "#16a34a",
    description:
      "Instantly extract skills, experience, and education from any resume format. Build a complete, recruiter-ready profile in seconds.",
  },
  {
    icon: Target,
    title: "Job Matching",
    tag: "Smart Match",
    tagColor: "bg-emerald-100 text-emerald-700",
    accent: "#059669",
    description:
      "Get matched to roles that truly fit — based on real skills, not just keywords. Stop applying blindly, start getting noticed.",
  },
  {
    icon: Brain,
    title: "Skill Gap Analysis",
    tag: "Personalized",
    tagColor: "bg-teal-100 text-teal-700",
    accent: "#0d9488",
    description:
      "Pinpoint exactly which skills you're missing for your dream role and get a step-by-step roadmap to close those gaps fast.",
  },
  {
    icon: TrendingUp,
    title: "Career Insights & Trends",
    tag: "Live Data",
    tagColor: "bg-green-100 text-green-700",
    accent: "#15803d",
    description:
      "Stay ahead with real-time salary benchmarks, demand forecasts, and in-demand skill reports tailored to your industry.",
  },
  {
    icon: Clock,
    title: "Application Tracker",
    tag: "Organized",
    tagColor: "bg-emerald-100 text-emerald-700",
    accent: "#059669",
    description:
      "Track every application in one dashboard. Monitor status, set follow-up reminders, and never miss an opportunity again.",
  },
  {
    icon: LayoutDashboard,
    title: "Candidate Dashboard",
    tag: "Command Center",
    tagColor: "bg-teal-100 text-teal-700",
    accent: "#0d9488",
    description:
      "Your personal career hub — view matches, track progress, manage skills, and access all tools from one clean interface.",
  },
  {
    icon: MessageSquare,
    title: "Mock Interview",
    tag: "ML-Based",
    tagColor: "bg-violet-100 text-violet-700",
    accent: "#7c3aed",
    description:
      "Practice with our ML-driven interview simulator trained on thousands of real interviews. Get scored feedback on your responses.",
    isMl: true,
  },
  {
    icon: FlaskConical,
    title: "Mock Assessment",
    tag: "ML-Based",
    tagColor: "bg-violet-100 text-violet-700",
    accent: "#6d28d9",
    description:
      "Take adaptive skill assessments powered by ML models — not generic AI prompts. Each test calibrates to your level in real time.",
    isMl: true,
  },
];

const recruiterFeatures = [
  {
    icon: LayoutDashboard,
    title: "Recruiter Dashboard",
    description:
      "One unified command center — view active roles, candidate pipelines, application stats, and hiring metrics at a glance.",
    detail: ["Live pipeline overview", "Role-wise analytics", "Team collaboration tools"],
  },
  {
    icon: Users,
    title: "Manage Applicants",
    description:
      "Review, filter, and rank applicants by skill fit score. Shortlist candidates, add notes, and move them through stages effortlessly.",
    detail: ["Skill-fit scoring", "Stage management", "Bulk actions & filters"],
  },
  {
    icon: PlusCircle,
    title: "Post a Job",
    description:
      "Create detailed job listings in minutes. Set skill requirements, experience level, and let the platform auto-match candidates instantly.",
    detail: ["Smart requirement builder", "Instant candidate matching", "Visibility controls"],
  },
];

const steps = [
  { step: "01", icon: Upload, title: "Upload Resume", description: "Add your resume. Supports PDF, DOCX, and LinkedIn. Our parser does the rest." },
  { step: "02", icon: Cpu, title: "ML Model Evaluation", description: "Deep skill mapping, gap detection, and role-fit scoring — all automated." },
  { step: "03", icon: Sparkles, title: "Get Matched", description: "Discover tailored jobs, insights, and assessments built around your profile." },
];

const stats = [
  { value: "Skill-Based", label: "Hiring Approach", icon: Award },
  { value: "95%", label: "Matching Accuracy", icon: Target },
  { value: "50+", label: "Opportunities Posted", icon: Briefcase },
  { value: "85%", label: "Placement Success", icon: TrendingUp },
];

/* ══════════════════════════════════════════
   SLIDER
══════════════════════════════════════════ */
function JobSeekerSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = jobSeekerFeatures.length;

  const prev = useCallback(() => setActive((a) => (a - 1 + total) % total), [total]);
  const next = useCallback(() => setActive((a) => (a + 1) % total), [total]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next, paused]);

  const indices = [
    (active - 1 + total) % total,
    active,
    (active + 1) % total,
  ];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Cards */}
      <div className="flex items-center justify-center gap-4 md:gap-5 py-6 overflow-visible">
        {indices.map((fi, pos) => {
          const f = jobSeekerFeatures[fi];
          const isCenter = pos === 1;
          return (
            <motion.div
              key={`${fi}-${pos}`}
              animate={{
                scale: isCenter ? 1 : 0.84,
                opacity: isCenter ? 1 : 0.38,
                y: isCenter ? 0 : 20,
                filter: isCenter ? "blur(0px)" : "blur(1.5px)",
              }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              onClick={() => { if (!isCenter) pos === 0 ? prev() : next(); }}
              className={[
                "relative flex-shrink-0 rounded-3xl border flex flex-col overflow-hidden cursor-pointer select-none",
                isCenter
                  ? "w-[288px] sm:w-[340px] md:w-[380px] min-h-[290px] shadow-2xl border-green-200 bg-white"
                  : "w-[200px] sm:w-[260px] md:w-[300px] min-h-[240px] border-gray-200 bg-gray-50 hidden sm:flex",
              ].join(" ")}
            >
              {/* Accent bar */}
              <div className="h-1 w-full flex-shrink-0" style={{ backgroundColor: isCenter ? f.accent : "#e5e7eb" }} />

              {/* Inner glow */}
              {isCenter && (
                <div
                  className="absolute inset-0 opacity-[0.06] rounded-3xl pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 30% 20%, ${f.accent}, transparent 70%)` }}
                />
              )}

              <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: f.accent }}
                  >
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  {f.isMl && isCenter && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 text-[10px] font-black uppercase tracking-wider border border-violet-200">
                      <FlaskConical className="w-2.5 h-2.5" /> ML Engine
                    </span>
                  )}
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold mb-3 w-fit ${f.tagColor}`}>
                  {f.tag}
                </span>
                <h3 className="font-black text-gray-900 text-base md:text-lg mb-2 leading-snug tracking-tight">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{f.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-center gap-5 mt-2">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full border-2 border-gray-200 bg-white hover:border-green-400 hover:bg-green-50 flex items-center justify-center shadow-sm transition-all group"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-green-600" />
        </button>
        <div className="flex items-center gap-2">
          {jobSeekerFeatures.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`transition-all duration-300 rounded-full ${
                i === active ? "w-7 h-2 bg-green-600 shadow-sm" : "w-2 h-2 bg-gray-300 hover:bg-green-400"
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-10 h-10 rounded-full border-2 border-gray-200 bg-white hover:border-green-400 hover:bg-green-50 flex items-center justify-center shadow-sm transition-all group"
        >
          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-green-600" />
        </button>
      </div>

      {/* Progress */}
      <div className="mt-5 max-w-xs mx-auto h-0.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
          animate={{ width: `${((active + 1) / total) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <p className="text-center text-xs text-gray-400 mt-2 font-medium tracking-wide">
        {active + 1} of {total} features
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN
══════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative pt-10 sm:pt-20 md:pt-30 pb-20 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-green-200 rounded-full blur-[130px] opacity-25" />
          <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] bg-emerald-300 rounded-full blur-[110px] opacity-15" />
          <div className="absolute bottom-0 -left-20 w-[300px] h-[300px] bg-teal-200 rounded-full blur-[90px] opacity-20" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(#16a34a 1px, transparent 1px), linear-gradient(90deg, #16a34a 1px, transparent 1px)`,
              backgroundSize: "52px 52px",
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-green-200 shadow-md text-xs sm:text-sm font-bold text-green-700 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Skill-Based Hiring Platform — Now Live
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black leading-[1.04] mb-6 tracking-tight">
              Bridge Skills with the
              <span className="relative block mt-1">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-green-700">
                  Right Opportunities
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] w-56 md:w-80 bg-gradient-to-r from-green-400 via-emerald-400 to-green-600 rounded-full origin-left block"
                />
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed font-light px-2">
              Skill2Job connects job seekers with the right roles through intelligent matching, ML-powered assessments,
              and real career insights — while giving recruiters precision hiring tools.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 20px 40px -10px rgba(22,163,74,0.4)" }}
                  whileTap={{ scale: 0.96 }}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl font-black bg-gradient-to-br from-green-500 to-green-700 text-white px-8 py-4 shadow-lg shadow-green-200 transition-all text-base"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl font-bold border-2 border-gray-200 text-gray-800 hover:border-green-400 hover:bg-green-50 px-8 py-4 bg-white transition-all text-base"
                >
                  <Briefcase className="w-4 h-4" />
                  I'm a Recruiter
                </motion.button>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-12"
            >
              {["95% Match Accuracy", "Free to Join", "ML-Powered Assessments", "No Credit Card"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── JOB SEEKER SLIDER ── */}
      <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-black uppercase tracking-widest mb-5 border border-green-200">
              <Zap className="w-3 h-3" /> For Job Seekers
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
              Everything to Land
              <span className="text-green-600"> Your Dream Job</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-4">
              From resume parsing to ML-powered mock interviews — 8 powerful tools built for the modern job seeker.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold">
              <FlaskConical className="w-3.5 h-3.5" />
              Mock Interview & Mock Assessment use real ML models — not generic AI
            </div>
          </motion.div>

          <JobSeekerSlider />
        </div>
      </section>

      {/* ── RECRUITER SECTION ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest mb-5 border border-emerald-200">
              <Users className="w-3 h-3" /> For Recruiters
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              Hire Smarter,
              <span className="text-green-600"> Not Harder</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Post jobs, review applicants by skill fit, and track hiring performance — all from one powerful dashboard.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-10">
            {recruiterFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="group relative bg-white border-2 border-gray-100 rounded-3xl p-7 md:p-8 hover:border-green-300 hover:shadow-2xl hover:shadow-green-50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                <div className="relative z-10">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-black text-gray-900 text-base md:text-lg mb-2 tracking-tight">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{f.description}</p>
                  <ul className="space-y-2">
                    {f.detail.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 16px 32px -8px rgba(22,163,74,0.35)" }}
                whileTap={{ scale: 0.96 }}
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gray-900 text-white font-black hover:bg-green-600 transition-all shadow-md text-base"
              >
                Go to Recruiter Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 md:py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Why Teams Choose Skill2Job</h2>
            <p className="text-gray-500 text-sm">Numbers that reflect real impact.</p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white border-2 border-gray-100 rounded-3xl p-6 md:p-8 text-center overflow-hidden hover:border-green-300 hover:shadow-xl hover:shadow-green-50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300">
                    <item.icon className="w-5 h-5 text-green-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-green-600 mb-1 tracking-tight">{item.value}</div>
                  <p className="text-gray-500 text-xs md:text-sm font-semibold">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-black uppercase tracking-widest mb-5 border border-green-200">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">Three steps. Intelligent results. Built for speed.</p>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <div className="hidden md:block absolute top-[3.25rem] left-[calc(16.66%+3rem)] right-[calc(16.66%+3rem)] h-px bg-gradient-to-r from-green-300 via-emerald-400 to-green-300 z-0" />
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="relative mb-6">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-[28px] bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 flex items-center justify-center shadow-2xl shadow-green-200">
                    <s.icon className="w-9 h-9 md:w-10 md:h-10 text-white" />
                  </div>
                  <span className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-black flex items-center justify-center border-2 border-white shadow-md">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-black text-gray-900 text-base md:text-lg mb-2 tracking-tight">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[220px]">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-emerald-900" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-400 rounded-full blur-[80px] opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-300 rounded-full blur-[80px] opacity-15" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 mx-auto mb-7 rounded-3xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 tracking-tight leading-tight">
              Ready to Find
              <br />
              <span className="text-green-200">Your Perfect Match?</span>
            </h2>
            <p className="text-green-100 text-base md:text-lg mb-10 leading-relaxed max-w-xl mx-auto">
              Join thousands using Skill2Job to make smarter career moves — powered by real ML, real insights, and real results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}
                  whileTap={{ scale: 0.96 }}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-green-700 font-black text-base hover:shadow-2xl transition-all"
                >
                  Start as Job Seeker
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 text-white font-bold border-2 border-white/30 hover:border-white hover:bg-white/20 transition-all text-base backdrop-blur-sm"
                >
                  <Briefcase className="w-4 h-4" />
                  Post as Recruiter
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}