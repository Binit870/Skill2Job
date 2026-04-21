import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Heart, Zap, Shield, Users, TrendingUp } from "lucide-react";


const values = [
  { icon: Target, title: "Skill-First Hiring", desc: "We believe talent should be measured by capability, not just credentials. Our platform puts skills at the center of every hiring decision." },
  { icon: Heart, title: "Candidate-Centric", desc: "Every feature is built with job seekers in mind — from resume tools to mock interviews, we invest in your growth." },
  { icon: Zap, title: "AI-Powered Precision", desc: "Smart algorithms match the right people to the right roles, eliminating noise and surfacing genuine opportunities." },
  { icon: Shield, title: "Trust & Transparency", desc: "We believe hiring should be fair, transparent, and bias-free. Our platform is built on integrity and equal opportunity." },
];

const team = [
  { name: "Aryan Sharma", role: "Founder & CEO", initial: "A" },
  { name: "Priya Mehta", role: "Head of Product", initial: "P" },
  { name: "Rohan Das", role: "Lead Engineer", initial: "R" },
  { name: "Sneha Gupta", role: "AI/ML Lead", initial: "S" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function About() {
  return (
    <div className="min-h-screen bg-white text-gray-900">


      {/* HERO */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-28 overflow-hidden border-b border-gray-100">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-100 blur-[120px] opacity-50 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold tracking-widest uppercase border border-green-100 mb-6">
              Our Story
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              Built to Bridge the<br />
              <span className="text-green-600">Skill Gap</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Skill2Job was founded with a simple belief — the right job should find the right person,
              based on what they can do, not just what their resume says.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
              <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-5 leading-tight tracking-tight">
                Empowering Every Job Seeker to Compete on Merit
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4 text-sm md:text-base">
                Millions of talented individuals are overlooked because traditional hiring focuses too much
                on degrees and too little on actual ability. We're changing that.
              </p>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                Skill2Job uses intelligent matching, resume analytics, and AI-driven career tools to help
                every candidate put their best foot forward — and every recruiter find exactly who they need.
              </p>
              <Link to="/features" className="inline-flex items-center gap-2 mt-7 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md">
                Explore Features <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="grid grid-cols-2 gap-4">
              {[
                { value: "10K+", label: "Job Seekers" },
                { value: "500+", label: "Recruiters" },
                { value: "95%", label: "Match Accuracy" },
                { value: "3x", label: "Faster Hiring" },
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center hover:shadow-md transition">
                  <div className="text-3xl font-bold text-green-600 mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest">What We Stand For</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 tracking-tight">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div key={v.title} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-11 h-11 bg-green-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <v.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest">The People</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 tracking-tight">Meet Our Team</h2>
            <p className="text-gray-500 mt-3 text-sm md:text-base max-w-xl mx-auto">
              A passionate group of engineers, designers, and hiring experts united by one goal.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <motion.div key={member.name} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="text-center bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
                <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-3 shadow-sm">
                  {member.initial}
                </div>
                <div className="font-semibold text-sm">{member.name}</div>
                <div className="text-xs text-gray-500 mt-1">{member.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-green-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Ready to Find Your Match?</h2>
          <p className="text-green-100 mb-8 text-sm md:text-base">Join thousands of job seekers and recruiters already on Skill2Job.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-white text-green-700 font-semibold px-8 py-3 rounded-xl hover:bg-green-50 transition text-sm shadow">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    
    </div>
  );
}