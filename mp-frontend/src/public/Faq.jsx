import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Search, ArrowRight } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const faqData = [
  {
    category: "General",
    questions: [
      { q: "What is Skill2Job?", a: "Skill2Job is a skill-based hiring platform that connects job seekers with recruiters through intelligent AI matching. Instead of relying purely on traditional resume screening, we evaluate actual skills and competencies to ensure better job-candidate fits." },
      { q: "Is Skill2Job free to use?", a: "Yes! Skill2Job offers a free tier that includes basic profile creation, limited job matching, and access to core features. We also offer a Pro plan with unlimited matching, advanced analytics, mock interviews, and more." },
      { q: "Who can use Skill2Job?", a: "Skill2Job is designed for two types of users — Job Seekers (students, freshers, and experienced professionals looking for new opportunities) and Recruiters (companies and HR teams looking to hire quality candidates faster)." },
      { q: "How is Skill2Job different from other job portals?", a: "Unlike traditional job portals that rely on keyword matching, Skill2Job uses AI to match candidates based on verified skills, profile strength, and role fit. We also provide tools like mock interviews, skill gap analysis, and analytics to help both sides of the hiring equation." },
    ],
  },
  {
    category: "For Job Seekers",
    questions: [
      { q: "How do I create a profile?", a: "Simply sign up, upload your resume, and our AI will auto-extract your skills, education, and experience. You can then review and complete your profile in just a few minutes." },
      { q: "How does job matching work?", a: "Our AI compares your verified skill profile with job requirements and generates a fit score for each role. You'll see personalized job recommendations ranked by how well your profile matches." },
      { q: "What is the Mock Interview feature?", a: "Mock Interview lets you practice real interview questions tailored to your target role. After each response, our AI provides instant feedback on your answer quality, completeness, and confidence — helping you improve before the real thing." },
      { q: "What is Skill Gap Analysis?", a: "Skill Gap Analysis identifies the exact skills you're missing for your desired job role and provides curated learning resources and recommendations to help you close those gaps and become a stronger candidate." },
      { q: "Can I apply to jobs directly on Skill2Job?", a: "Yes. Once you find a job you're interested in, you can apply directly through the platform. Your profile is automatically shared with the recruiter, and you can track your application status in real time." },
    ],
  },
  {
    category: "For Recruiters",
    questions: [
      { q: "How do I post a job?", a: "After creating a recruiter account, navigate to 'Post Job' in your dashboard. Fill in the role details, required skills, and experience level. Your job will be live and matched to candidates immediately." },
      { q: "How does candidate matching work for recruiters?", a: "When you post a job, our AI automatically ranks all matching candidates by skill fit score. You see the best-matched profiles at the top, saving hours of manual screening." },
      { q: "Can I search for candidates proactively?", a: "Yes. Recruiters can use our Candidate Search tool to filter by skills, experience, location, and fit score. This lets you proactively source candidates even without an active job post." },
      { q: "What analytics does Skill2Job provide for recruiters?", a: "Our analytics dashboard shows pipeline health, application conversion rates, time-to-hire, candidate quality scores, and hiring trends — all updated in real time to help you optimize your recruitment process." },
    ],
  },
  {
    category: "Account & Billing",
    questions: [
      { q: "How do I upgrade to Pro?", a: "You can upgrade from your account settings. Click on 'Upgrade to Pro', choose your plan (monthly or annual), and complete the payment. Pro features are activated instantly." },
      { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel anytime from your account settings. Your Pro access remains active until the end of your billing period, and you won't be charged again after cancellation." },
      { q: "Is my data safe on Skill2Job?", a: "Absolutely. We take data privacy seriously. Your profile data is encrypted, never sold to third parties, and only shared with recruiters when you apply to their jobs. You have full control over your privacy settings." },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition">
        <span className="font-medium text-sm md:text-base text-gray-800 pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...faqData.map((f) => f.category)];

  const filtered = faqData
    .map((section) => ({
      ...section,
      questions: section.questions.filter(
        ({ q, a }) =>
          (activeCategory === "All" || section.category === activeCategory) &&
          (q.toLowerCase().includes(search.toLowerCase()) || a.toLowerCase().includes(search.toLowerCase()))
      ),
    }))
    .filter((s) => s.questions.length > 0);

  return (
    <div className="min-h-screen bg-white text-gray-900">
    

      {/* HERO */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-gray-100">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-100 blur-[120px] opacity-50 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold tracking-widest uppercase border border-green-100 mb-6">
              Help Center
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-5">
              Frequently Asked<br />
              <span className="text-green-600">Questions</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
              Find quick answers to the most common questions about Skill2Job.
            </p>
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition shadow-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ CONTENT */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                  activeCategory === cat
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Questions */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No questions found matching "{search}"</p>
            </div>
          ) : (
            filtered.map((section) => (
              <motion.div key={section.category} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  {section.category}
                </h2>
                <div className="space-y-3">
                  {section.questions.map((item) => (
                    <FAQItem key={item.q} {...item} />
                  ))}
                </div>
              </motion.div>
            ))
          )}

          {/* Still need help */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-12 bg-green-50 border border-green-100 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="font-bold text-lg mb-2">Still have questions?</h3>
            <p className="text-gray-500 text-sm mb-5">Can't find what you're looking for? Our team is happy to help.</p>
            <Link to="/contact"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-sm">
              Contact Support <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

     
    </div>
  );
}