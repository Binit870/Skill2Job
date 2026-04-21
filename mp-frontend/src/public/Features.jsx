import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText, Target, TrendingUp, BookOpen, MessageSquare,
  Sparkles, BarChart3, Shield, ArrowRight, CheckCircle,
} from "lucide-react";


const features = [
  {
    icon: FileText,
    title: "Smart Resume Builder",
    desc: "Build ATS-friendly resumes in minutes with our guided editor. Auto-suggest skills, formatting tips, and real-time scoring.",
    bullets: ["ATS-optimized templates", "Real-time score feedback", "One-click export to PDF"],
    tag: "For Job Seekers",
    color: "bg-green-600",
  },
  {
    icon: Target,
    title: "Precision Job Matching",
    desc: "Our AI compares your skill profile against thousands of listings to surface only the most relevant opportunities.",
    bullets: ["Skill-to-role fit score", "Personalized recommendations", "Daily match updates"],
    tag: "For Job Seekers",
    color: "bg-green-600",
  },
  {
    icon: MessageSquare,
    title: "AI Mock Interviews",
    desc: "Practice real interview questions tailored to your target role. Get instant feedback on your answers.",
    bullets: ["Role-specific questions", "Instant AI feedback", "Confidence scoring"],
    tag: "For Job Seekers",
    color: "bg-green-600",
  },
  {
    icon: BookOpen,
    title: "Skill Gap Analysis",
    desc: "Identify exactly what skills you're missing for your dream job and get curated learning paths to close the gap.",
    bullets: ["Gap identification report", "Curated learning paths", "Progress tracking"],
    tag: "For Job Seekers",
    color: "bg-green-600",
  },
  {
    icon: Sparkles,
    title: "Smart Candidate Search",
    desc: "Recruiters can search and filter candidates by skills, experience, and fit score — not just keywords.",
    bullets: ["Skill-based filtering", "AI-ranked candidate lists", "Bulk shortlisting"],
    tag: "For Recruiters",
    color: "bg-emerald-700",
  },
  {
    icon: BarChart3,
    title: "Hiring Analytics",
    desc: "Track pipeline health, time-to-hire, and candidate quality with a powerful real-time dashboard.",
    bullets: ["Pipeline health metrics", "Time-to-hire tracking", "Conversion analytics"],
    tag: "For Recruiters",
    color: "bg-emerald-700",
  },
  {
    icon: TrendingUp,
    title: "Placement Insights",
    desc: "Access industry hiring trends, salary benchmarks, and role demand forecasts to make smarter decisions.",
    bullets: ["Salary benchmarks", "Role demand trends", "Market comparisons"],
    tag: "Both",
    color: "bg-teal-600",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    desc: "All profiles go through skill verification to ensure authenticity and reduce hiring risk.",
    bullets: ["Skill verification badges", "Identity checks", "Trust scores"],
    tag: "Both",
    color: "bg-teal-600",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Features() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
   

      {/* HERO */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-gray-100">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-100 blur-[120px] opacity-50 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold tracking-widest uppercase border border-green-100 mb-6">
              Platform Features
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-5">
              Everything You Need to<br />
              <span className="text-green-600">Hire or Get Hired</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Skill2Job brings together AI-powered tools for job seekers and recruiters — all in one platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} {...fadeUp} transition={{ delay: i * 0.07 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 ${f.color} text-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    f.tag === "For Recruiters" ? "bg-emerald-50 text-emerald-700" :
                    f.tag === "Both" ? "bg-teal-50 text-teal-700" :
                    "bg-green-50 text-green-700"
                  }`}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{f.desc}</p>
                <ul className="space-y-1.5">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-16 md:py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Compare</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 tracking-tight">Free vs Pro</h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200 text-sm font-semibold">
              <div className="px-4 md:px-6 py-4 text-gray-600">Feature</div>
              <div className="px-4 md:px-6 py-4 text-center text-gray-600">Free</div>
              <div className="px-4 md:px-6 py-4 text-center text-green-600">Pro</div>
            </div>
            {[
              ["Resume Builder", true, true],
              ["Job Matching", "3/day", "Unlimited"],
              ["Mock Interviews", "2/month", "Unlimited"],
              ["Skill Gap Analysis", false, true],
              ["Analytics Dashboard", false, true],
              ["Priority Support", false, true],
              ["Verified Badge", false, true],
            ].map(([feature, free, pro], i) => (
              <div key={i} className={`grid grid-cols-3 border-b border-gray-100 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                <div className="px-4 md:px-6 py-3.5 text-gray-700 font-medium text-xs md:text-sm">{feature}</div>
                <div className="px-4 md:px-6 py-3.5 text-center">
                  {free === true ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> :
                   free === false ? <span className="text-gray-300 text-lg">—</span> :
                   <span className="text-xs text-gray-500">{free}</span>}
                </div>
                <div className="px-4 md:px-6 py-3.5 text-center">
                  {pro === true ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> :
                   <span className="text-xs text-green-600 font-medium">{pro}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-green-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Start Using Skill2Job Today</h2>
          <p className="text-green-100 mb-8 text-sm md:text-base">Free to get started. Upgrade anytime for full access.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold px-8 py-3 rounded-xl hover:bg-green-50 transition text-sm shadow">
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

     
    </div>
  );
}