import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  Target,
  TrendingUp,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Upload,
  Cpu,
  Sparkles,
  Briefcase,
} from "lucide-react";
import { useEffect, useState } from "react";

/* -------------------- NAVBAR -------------------- */
function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Student", path: "/student-dashboard" },
    { name: "Recruiter", path: "/recruiter-dashboard" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-sm">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-black">
            Skill2Job
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative group text-sm font-medium transition duration-200 ${
                  active ? "text-green-600" : "text-gray-700 hover:text-green-600"
                }`}
              >
                {item.name}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-green-600 transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            );
          })}
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl border border-green-600 text-green-700 font-medium hover:bg-green-50 transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition shadow-sm"
          >
            Signup
          </Link>
        </div>
      </div>
    </header>
  );
}

/* -------------------- BUTTON -------------------- */
function Button({ children, className = "", variant = "primary", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus:outline-none";

  const variants = {
    primary:
      "bg-green-600 text-white hover:bg-green-700 px-8 h-12 shadow-sm hover:shadow-md",
    outline:
      "border border-gray-300 text-black hover:bg-gray-100 px-8 h-12 bg-white",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

/* -------------------- DATA -------------------- */
const features = [
  {
    icon: FileText,
    title: "Smart Resume Parsing",
    description:
      "Automatically extract skills, education, and experience from resumes in seconds.",
  },
  {
    icon: Target,
    title: "Precision Job Matching",
    description:
      "Connect job seekers with highly relevant roles based on skills and profile fit.",
  },
  {
    icon: TrendingUp,
    title: "Placement Insights",
    description:
      "Get AI-backed career insights, hiring trends, and role-fit predictions.",
  },
  {
    icon: BookOpen,
    title: "Skill Gap Analysis",
    description:
      "Identify missing skills and get recommendations to improve employability.",
  },
];

const steps = [
  {
    step: 1,
    icon: Upload,
    title: "Upload Resume",
    description: "Add your resume and profile details in minutes.",
  },
  {
    step: 2,
    icon: Cpu,
    title: "AI Evaluation",
    description: "Our system analyzes your profile and skill readiness.",
  },
  {
    step: 3,
    icon: Sparkles,
    title: "Get Matched",
    description: "Discover jobs, insights, and career opportunities instantly.",
  },
];

/* -------------------- COUNTER -------------------- */
function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* -------------------- PAGE -------------------- */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
      <Navbar />

      {/* HERO */}
      <section className="pt-36 pb-24 relative border-b border-gray-100">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-green-100 blur-[140px] opacity-60"></div>

        <div className="max-w-6xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-6 border border-green-100">
              <Sparkles className="w-4 h-4" />
              Skill-Based Hiring Platform
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
              Bridge Skills with the
              <span className="block text-green-600">
                Right Opportunities
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto leading-8">
              Skill2Job helps job seekers showcase real skills and enables recruiters
              to discover the right candidates faster through intelligent matching,
              resume analysis, and career insights.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login">
                <Button>
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link to="/recruiter-dashboard">
                <Button variant="outline">For Recruiters</Button>
              </Link>
            </div>

            <div className="flex justify-center gap-6 mt-12 text-sm text-gray-600 flex-wrap">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                95% Accuracy
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Built for Smarter Hiring
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to connect skills with the right opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-7 rounded-2xl border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-green-600 text-white rounded-xl mb-5 shadow-sm">
                  <f.icon />
                </div>

                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-6">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE SKILL2JOB */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Why Choose Skill2Job
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A smarter, skill-first hiring platform designed to help candidates stand out
              and recruiters hire with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              {
                value: "Skill-Based",
                label: "Hiring Approach",
              },
              {
                value: "95%",
                label: "Matching Accuracy",
              },
              {
                value: "100+",
                label: "Opportunities Posted",
              },
              {
                value: "85%",
                label: "Profile Completion Success",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-gray-50 border border-gray-200 rounded-2xl py-10 px-6 shadow-sm hover:shadow-md transition"
              >
                <div className="text-3xl md:text-4xl font-bold mb-3 text-green-600">
                  {item.value}
                </div>
                <p className="text-gray-600 text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A simple and intelligent flow for both job seekers and recruiters.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div
                key={s.step}
                className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition"
              >
                <div className="w-20 h-20 mx-auto mb-5 bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-md">
                  <s.icon className="w-8 h-8" />
                </div>

                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-6">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-gray-200 text-center text-sm text-gray-500 bg-white">
        © {new Date().getFullYear()} Skill2Job • Skill-Based Hiring Platform
      </footer>
    </div>
  );
}