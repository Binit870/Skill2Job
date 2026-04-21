import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Faq from "./Faq";
import {
  FileText, Target, TrendingUp, BookOpen,
  ArrowRight, CheckCircle, Upload, Cpu, Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

const features = [
  { icon: FileText, title: "Smart Resume Parsing", description: "Automatically extract skills, education, and experience from resumes in seconds." },
  { icon: Target, title: "Precision Job Matching", description: "Connect job seekers with highly relevant roles based on skills and profile fit." },
  { icon: TrendingUp, title: "Placement Insights", description: "Get AI-backed career insights, hiring trends, and role-fit predictions." },
  { icon: BookOpen, title: "Skill Gap Analysis", description: "Identify missing skills and get recommendations to improve employability." },
];

const steps = [
  { step: 1, icon: Upload, title: "Upload Resume", description: "Add your resume and profile details in minutes." },
  { step: 2, icon: Cpu, title: "AI Evaluation", description: "Our system analyzes your profile and skill readiness." },
  { step: 3, icon: Sparkles, title: "Get Matched", description: "Discover jobs, insights, and career opportunities instantly." },
];

const stats = [
  { value: "Skill-Based", label: "Hiring Approach" },
  { value: "95%", label: "Matching Accuracy" },
  { value: "100+", label: "Opportunities Posted" },
  { value: "85%", label: "Profile Completion Success" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">


      {/* HERO */}
      <section className="pt-20 md:pt-32 pb-16 md:pb-24 relative border-b border-gray-100">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-green-100 blur-[140px] opacity-60 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-xs md:text-sm font-medium mb-6 border border-green-100">
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Skill-Based Hiring Platform
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 md:mb-6 tracking-tight">
              Bridge Skills with the
              <span className="block text-green-600">Right Opportunities</span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-10 max-w-3xl mx-auto leading-7 md:leading-8 px-2">
              Skill2Job helps job seekers showcase real skills and enables recruiters
              to discover the right candidates faster through intelligent matching,
              resume analysis, and career insights.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4 sm:px-0">
              <Link to="/login">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 px-8 h-12 shadow-sm hover:shadow-md transition-all">
                  Get Started <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="/recruiter-dashboard">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl font-semibold border border-gray-300 text-black hover:bg-gray-100 px-8 h-12 bg-white transition-all">
                  For Recruiters
                </button>
              </Link>
            </div>

            <div className="flex justify-center mt-10 md:mt-12">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                95% Accuracy
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 md:mb-4">Built for Smarter Hiring</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">Everything you need to connect skills with the right opportunities.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 md:p-7 rounded-2xl border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center bg-green-600 text-white rounded-xl mb-4 md:mb-5 shadow-sm">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base md:text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-6">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 md:mb-4">Why Choose Skill2Job</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              A smarter, skill-first hiring platform designed to help candidates stand out and recruiters hire with confidence.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-center">
            {stats.map((item) => (
              <div key={item.label} className="bg-gray-50 border border-gray-200 rounded-2xl py-8 md:py-10 px-4 md:px-6 shadow-sm hover:shadow-md transition">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3 text-green-600">{item.value}</div>
                <p className="text-gray-600 text-xs md:text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 md:mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">A simple and intelligent flow for both job seekers and recruiters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((s) => (
              <div key={s.step} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg transition">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-5 bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-md">
                  <s.icon className="w-7 h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="font-semibold text-base md:text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-6">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Faq />
    </div>
  );
}