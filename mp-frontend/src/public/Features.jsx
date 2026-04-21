import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FileText, Target, Briefcase, Search, Bell, BarChart3,
  Shield, CheckCircle, ArrowRight, Users, Star,
  Sparkles, Lock, Database, Cloud, MessageCircle, Zap,
  Headphones
} from "lucide-react";

// ---------- FEATURES DATA ----------
const features = [
  {
    icon: FileText,
    title: "Professional Resume Builder",
    desc: "Create ATS-friendly resumes in minutes with guided templates and real-time editing.",
    bullets: ["10+ ATS-optimized templates", "Real-time preview & editing", "One-click PDF export", "Save multiple versions"],
    tag: "Job Seekers",
    color: "bg-green-600",
  },
  {
    icon: Target,
    title: "Smart Job Matching",
    desc: "AI-powered algorithm matches your skills and preferences to the most relevant roles.",
    bullets: ["Personalized job recommendations", "Skill-based match score", "Daily email alerts", "Saved searches"],
    tag: "Job Seekers",
    color: "bg-green-600",
  },
  {
    icon: Bell,
    title: "Instant Job Alerts",
    desc: "Get notified the moment a matching job is posted — never miss an opportunity.",
    bullets: ["Email & push notifications", "Custom frequency control", "Role & location filters"],
    tag: "Job Seekers",
    color: "bg-green-600",
  },
  {
    icon: Briefcase,
    title: "One-Click Apply",
    desc: "Apply to jobs instantly using your saved profile. No repetitive forms.",
    bullets: ["Apply with saved profile", "Track application status", "Application history", "Interview call logs"],
    tag: "Job Seekers",
    color: "bg-green-600",
  },
  {
    icon: Sparkles,
    title: "Post All Job Types",
    desc: "Recruiters can post full-time, part-time, remote, freelance, and contract roles.",
    bullets: ["Full-time / Part-time / WFH", "Freelance / Contract", "Custom application questions", "Featured job boost"],
    tag: "Recruiters",
    color: "bg-emerald-700",
  },
  {
    icon: Search,
    title: "Advanced Candidate Search",
    desc: "Find the right talent using skill-based filters, experience, location, and availability.",
    bullets: ["Skill & keyword search", "Experience & location filters", "Saved candidate lists", "Bulk shortlisting"],
    tag: "Recruiters",
    color: "bg-emerald-700",
  },
  {
    icon: BarChart3,
    title: "Recruiter Analytics",
    desc: "Track job performance, application volume, source of hire, and time-to-fill.",
    bullets: ["Views & applications per job", "Candidate source tracking", "Time-to-hire metrics", "Export reports"],
    tag: "Recruiters",
    color: "bg-emerald-700",
  },
  {
    icon: Shield,
    title: "Verified Profiles & Trust Score",
    desc: "Job seekers verify skills and identity; recruiters see trust badges for reliable candidates.",
    bullets: ["Email & phone verification", "Skill test badges", "Employer reviews", "Trust score display"],
    tag: "Both",
    color: "bg-teal-600",
  },
];

// ---------- STATS ----------
const stats = [
  { value: "10,000+", label: "Active Job Seekers", icon: Users },
  { value: "500+", label: "Recruiters", icon: Briefcase },
  { value: "2,000+", label: "Jobs Posted", icon: Target },
  { value: "4.9★", label: "User Rating", icon: Star },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Features() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredFeatures = activeTab === "all" 
    ? features 
    : features.filter(f => f.tag.toLowerCase() === (activeTab === "jobseekers" ? "job seekers" : "recruiters"));

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-20 overflow-hidden border-b border-gray-100">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-100 blur-[120px] opacity-50 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold tracking-widest uppercase border border-green-100 mb-6">
              Platform Features
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4 md:mb-5">
              Everything You Need to<br />
              <span className="text-green-600">Hire or Get Hired</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed px-4">
              Skill2Job brings job posting, smart matching, resume builder, and analytics — all in one seamless platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} {...fadeUp} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="text-xl md:text-3xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="pt-8 pb-4 md:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            <button onClick={() => setActiveTab("all")} className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition ${activeTab === "all" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>All Features</button>
            <button onClick={() => setActiveTab("jobseekers")} className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition ${activeTab === "jobseekers" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>For Job Seekers</button>
            <button onClick={() => setActiveTab("recruiters")} className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition ${activeTab === "recruiters" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>For Recruiters</button>
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredFeatures.map((f, i) => (
              <motion.div key={f.title} {...fadeUp} transition={{ delay: i * 0.07 }}
                className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className={`w-10 h-10 md:w-11 md:h-11 ${f.color} text-white rounded-xl flex items-center justify-center shadow-sm`}>
                    <f.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                    f.tag === "Recruiters" ? "bg-emerald-50 text-emerald-700" :
                    f.tag === "Both" ? "bg-teal-50 text-teal-700" : "bg-green-50 text-green-700"
                  }`}>{f.tag}</span>
                </div>
                <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">{f.title}</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-3 md:mb-4 flex-1">{f.desc}</p>
                <ul className="space-y-1">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-1.5 md:gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-green-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">Ready to Transform Your Career or Hiring?</h2>
          <p className="text-green-100 mb-6 md:mb-8 text-sm md:text-base">Join thousands of job seekers and recruiters on Skill2Job.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup?type=candidate" className="inline-flex items-center justify-center gap-2 bg-white text-green-700 font-semibold px-6 md:px-8 py-2.5 md:py-3 rounded-xl hover:bg-green-50 transition text-sm shadow">
              Job Seeker Sign Up <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/signup?type=recruiter" className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-semibold px-6 md:px-8 py-2.5 md:py-3 rounded-xl hover:bg-white/10 transition text-sm">
              Recruiter Sign Up
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}