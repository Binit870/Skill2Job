import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Upload, UserCheck, Cpu, Sparkles, Briefcase, ArrowRight,
  CheckCircle, Search, ClipboardList, BarChart3,
} from "lucide-react";

// ---------- REAL DATA FOR JOB SEEKERS ----------
const seekerSteps = [
  { step: 1, icon: Upload, title: "Create Your Profile", desc: "Sign up and upload your resume or build a new one using the platform’s resume tools. Your profile captures key skills and experience in a structured format." },
  { step: 2, icon: Cpu, title: "Skill-Based Analysis", desc: "Your profile is evaluated based on listed skills and experience to help identify suitable job opportunities." },
  { step: 3, icon: Sparkles, title: "Explore Relevant Jobs", desc: "Browse job listings tailored to your profile, including full-time, part-time, and work-from-home opportunities." },
  { step: 4, icon: UserCheck, title: "Apply with Ease", desc: "Apply to jobs quickly using a simple and streamlined application process." },
  { step: 5, icon: Briefcase, title: "Track Your Progress", desc: "Monitor your applications and stay updated on your job search progress." },
];

// ---------- REAL DATA FOR RECRUITERS ----------
const recruiterSteps = [
  { step: 1, icon: UserCheck, title: "Post Job Requirements", desc: "Create detailed job postings by defining required skills, roles, and expectations." },
  { step: 2, icon: Search, title: "Find Suitable Candidates", desc: "Browse candidate profiles and identify applicants that match your job requirements." },
  { step: 3, icon: ClipboardList, title: "Review & Shortlist", desc: "Evaluate candidate profiles and shortlist the most relevant applicants efficiently." },
  { step: 4, icon: BarChart3, title: "Manage Hiring Process", desc: "Track applications and manage the hiring workflow in an organized manner." },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

function StepCard({ step, icon: Icon, title, desc, delay = 0 }) {
  return (
    <motion.div {...fadeUp} transition={{ delay }} className="flex gap-3 md:gap-5">
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-sm">
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        <div className="w-0.5 bg-gray-200 flex-1 mt-2 md:mt-3 last:hidden min-h-[28px] md:min-h-[32px]" />
      </div>
      <div className="pb-6 md:pb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
            Step {step}
          </span>
        </div>
        <h3 className="font-semibold text-sm md:text-lg mb-1 text-gray-800">{title}</h3>
        <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* HERO */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-20 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-100 blur-[120px] opacity-30 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold tracking-widest uppercase border border-green-200 mb-6">
              The Process
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4 text-gray-800">
              How Skill2Job<br />
              <span className="text-green-600">Actually Works</span>
            </h1>
            <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              A structured and practical platform that helps job seekers find relevant opportunities and enables recruiters to manage hiring efficiently.
            </p>
          </motion.div>
        </div>
      </section>

      {/* STEPS */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">

            {/* Job Seekers */}
            <div>
              <motion.div {...fadeUp} className="mb-6 md:mb-8">
                <span className="text-green-700 text-xs font-bold uppercase tracking-widest">For Job Seekers</span>
                <h2 className="text-xl md:text-3xl font-bold mt-1 md:mt-2 text-gray-800">Your Job Search Journey</h2>
                <p className="text-gray-500 text-xs md:text-sm mt-1">Simple steps from profile to application.</p>
              </motion.div>
              {seekerSteps.map((s, i) => (
                <StepCard key={s.step} {...s} delay={i * 0.08} />
              ))}
            </div>

            {/* Recruiters */}
            <div>
              <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="mb-6 md:mb-8">
                <span className="text-emerald-700 text-xs font-bold uppercase tracking-widest">For Recruiters</span>
                <h2 className="text-xl md:text-3xl font-bold mt-1 md:mt-2 text-gray-800">Efficient Hiring Process</h2>
                <p className="text-gray-500 text-xs md:text-sm mt-1">Organized workflow to manage candidates.</p>
              </motion.div>
              {recruiterSteps.map((s, i) => (
                <StepCard key={s.step} {...s} delay={i * 0.08 + 0.1} />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-green-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">Get Started Today</h2>
          <p className="text-green-100 mb-6 md:mb-8 text-sm md:text-base">
            Start exploring job opportunities or hire the right candidates with ease.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/signup?type=candidate" className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition text-sm shadow">
              Job Seeker <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/signup?type=recruiter" className="inline-flex items-center gap-2 border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition text-sm">
              Recruiter
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}