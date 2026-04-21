import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Upload, UserCheck, Cpu, Sparkles, Briefcase, ArrowRight,
  CheckCircle, Search, ClipboardList, BarChart3,
} from "lucide-react";

const seekerSteps = [
  { step: 1, icon: Upload, title: "Create Your Profile", desc: "Sign up and upload your resume. Our AI extracts your skills, education, and experience automatically." },
  { step: 2, icon: Cpu, title: "AI Skill Analysis", desc: "We analyze your profile, score your skills, and identify your strongest areas and gaps to improve." },
  { step: 3, icon: Sparkles, title: "Get Matched to Jobs", desc: "Browse personalized job recommendations ranked by how well your skills match each role." },
  { step: 4, icon: UserCheck, title: "Prepare & Apply", desc: "Use mock interviews, skill assessments, and resume tools to prepare — then apply with confidence." },
  { step: 5, icon: Briefcase, title: "Get Hired", desc: "Connect directly with recruiters, track your applications, and land the right opportunity." },
];

const recruiterSteps = [
  { step: 1, icon: UserCheck, title: "Post Your Job", desc: "Create a detailed job post with required skills, experience, and role expectations in minutes." },
  { step: 2, icon: Search, title: "AI Candidate Matching", desc: "Our system instantly surfaces the best-fit candidates based on verified skills and profile data." },
  { step: 3, icon: ClipboardList, title: "Review & Shortlist", desc: "Browse ranked candidate profiles, view skill scores, and shortlist your top picks easily." },
  { step: 4, icon: BarChart3, title: "Track & Hire", desc: "Manage your pipeline, schedule interviews, and close positions faster with real-time analytics." },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

function StepCard({ step, icon: Icon, title, desc, delay = 0 }) {
  return (
    <motion.div {...fadeUp} transition={{ delay }} className="flex gap-4 md:gap-5">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        <div className="w-0.5 bg-green-100 flex-1 mt-3 last:hidden min-h-[32px]" />
      </div>
      <div className="pb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
            Step {step}
          </span>
        </div>
        <h3 className="font-semibold text-base md:text-lg mb-1.5">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-gray-100">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-100 blur-[120px] opacity-50 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold tracking-widest uppercase border border-green-100 mb-6">
              The Process
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-5">
              How Skill2Job<br />
              <span className="text-green-600">Actually Works</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              A simple, intelligent process designed for both job seekers and recruiters to achieve results faster.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TWO COLUMN STEPS */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">

            {/* Job Seekers */}
            <div>
              <motion.div {...fadeUp} className="mb-8">
                <span className="text-green-600 text-xs font-bold uppercase tracking-widest">For Job Seekers</span>
                <h2 className="text-2xl md:text-3xl font-bold mt-2 tracking-tight">Your Path to the Right Job</h2>
                <p className="text-gray-500 text-sm mt-2">Five steps from profile to placement.</p>
              </motion.div>
              {seekerSteps.map((s, i) => (
                <StepCard key={s.step} {...s} delay={i * 0.08} />
              ))}
            </div>

            {/* Recruiters */}
            <div>
              <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="mb-8">
                <span className="text-emerald-700 text-xs font-bold uppercase tracking-widest">For Recruiters</span>
                <h2 className="text-2xl md:text-3xl font-bold mt-2 tracking-tight">Hire Smarter, Faster</h2>
                <p className="text-gray-500 text-sm mt-2">Four steps to close positions with confidence.</p>
              </motion.div>
              {recruiterSteps.map((s, i) => (
                <StepCard key={s.step} {...s} delay={i * 0.08 + 0.1} />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="py-12 md:py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: "< 5 min", label: "Profile Setup Time" },
              { value: "95%", label: "Match Accuracy" },
              { value: "3x", label: "Faster Than Traditional Hiring" },
              { value: "10K+", label: "Successful Placements" },
            ].map((stat) => (
              <motion.div key={stat.label} {...fadeUp}
                className="bg-white border border-gray-200 rounded-2xl py-6 px-4 hover:shadow-md transition">
                <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY BETTER */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Why We're Different</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 tracking-tight">Skill2Job vs Traditional Hiring</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { label: "Traditional Hiring", points: ["Keyword-based resume scanning", "Slow manual shortlisting", "High rate of mismatched hires", "No candidate preparation tools", "Limited hiring insights"], bad: true },
              { label: "Skill2Job", points: ["Skill-based AI matching", "Instant ranked candidate lists", "95% placement accuracy", "Built-in prep & interview tools", "Real-time analytics dashboard"], bad: false },
            ].map((col) => (
              <motion.div key={col.label} {...fadeUp}
                className={`rounded-2xl border p-6 md:p-8 ${col.bad ? "bg-gray-50 border-gray-200" : "bg-green-600 border-green-600"}`}>
                <h3 className={`font-bold text-lg mb-5 ${col.bad ? "text-gray-700" : "text-white"}`}>{col.label}</h3>
                <ul className="space-y-3">
                  {col.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm">
                      <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${col.bad ? "text-gray-300" : "text-green-200"}`} />
                      <span className={col.bad ? "text-gray-500" : "text-green-50"}>{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-green-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Ready to Get Started?</h2>
          <p className="text-green-100 mb-8 text-sm md:text-base">Join thousands already finding success on Skill2Job.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-white text-green-700 font-semibold px-8 py-3 rounded-xl hover:bg-green-50 transition text-sm shadow">
              Start as Job Seeker <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition text-sm">
              Post a Job
            </Link>
          </div>
        </div>
      </section>

    
    </div>
  );
}