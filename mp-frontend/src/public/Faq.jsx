import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Search, ArrowRight } from "lucide-react";

const faqData = [
  {
    category: "General",
    questions: [
      { 
        q: "What exactly is Skill2Job?", 
        a: "Skill2Job is a hiring platform that focuses on actual skills rather than just degrees or keywords. We help job seekers build proper resumes and match with companies that care about what you can do. For recruiters, we provide tools to post jobs and find candidates faster." 
      },
      { 
        q: "Do I have to pay to use Skill2Job?", 
        a: "No, it is completely free  . Job seekers can use the resume builder, apply to jobs, and get matches for free. Recruiters get three active job posts for free. If you need unlimited posts, advanced search, or analytics, we have a Pro plan starting at ₹999/month." 
      },
      { 
        q: "Who is Skill2Job for?", 
        a: "Anyone looking for a job – freshers, experienced folks, anyone. And any company or recruiter who wants to hire better. We don't limit by industry; if you have skills, you're welcome." 
      },
      { 
        q: "How is Skill2Job different from LinkedIn or Naukri?", 
        a: "Those platforms are mostly keyword-based. We focus on skill matching and give you tools like a proper resume builder and job alerts that actually work. Also, recruiters get ranked candidate lists based on fit, not just random applications." 
      },
    ],
  },
  {
    category: "For Job Seekers",
    questions: [
      { 
        q: "How do I sign up and create a profile?", 
        a: "Just click Sign Up, choose 'Job Seeker', and fill in your details. You can either upload an existing resume or build a new one using our template. The system will pull out your skills and experience automatically – you can edit anything later." 
      },
      { 
        q: "How does job matching work?", 
        a: "Once your profile is ready, our algorithm compares your skills, experience, and preferences with the jobs posted. You'll see a match score for each job, and we'll send you alerts when something relevant comes up. No more scrolling through hundreds of irrelevant listings." 
      },
      { 
        q: "What's this Mock Interview thing?", 
        a: "It's a practice tool. You pick a role, and we give you common interview questions. You answer verbally or type, and the AI gives you feedback on how clear and confident your answer sounds. It's not perfect, but it helps you prepare before the real interview." 
      },
      { 
        q: "What is Skill Gap Analysis? Do I need it?", 
        a: "It shows you which skills you're missing for a particular job role. For example, if you want a data analyst job but don't know SQL, it'll tell you. Then it suggests free or paid courses to learn those skills. Useful if you're trying to switch domains." 
      },
      { 
        q: "Can I apply to jobs directly from Skill2Job?", 
        a: "Yes. When you find a job you like, click Apply. Your profile (resume + details) is sent to the recruiter. You can track the status – whether they viewed it, shortlisted you, or rejected – right from your dashboard." 
      },
    ],
  },
  {
    category: "For Recruiters",
    questions: [
      { 
        q: "How do I post a job?", 
        a: "After signing up as a recruiter, go to your dashboard and click 'Post a Job'. Fill in the title, description, required skills, job type (full-time, part-time, WFH, etc.), and experience level. That's it – the job goes live and candidates start seeing it." 
      },
      { 
        q: "How does candidate matching work for me?", 
        a: "Once your job is live, our system automatically ranks all job seekers whose profiles match your requirements. You'll see a list ordered by fit score – the best matches first. No need to manually scan hundreds of resumes." 
      },
      { 
        q: "Can I search for candidates even if I don't have a job posted?", 
        a: "Absolutely. We have a candidate search tool where you can filter by skills, location, experience, and even trust score. You can reach out to promising candidates directly. Great for building a talent pipeline." 
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="font-medium text-sm md:text-base text-gray-800 pr-4">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
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
          (q.toLowerCase().includes(search.toLowerCase()) ||
            a.toLowerCase().includes(search.toLowerCase()))
      ),
    }))
    .filter((s) => s.questions.length > 0);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-gray-100">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-100 blur-[120px] opacity-50 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold tracking-widest uppercase border border-green-100 mb-6">
              Help Center
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-5">
              Frequently Asked<br />
              <span className="text-green-600">Questions</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
              Real answers from the people who built Skill2Job.
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
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                  activeCategory === cat
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                }`}
              >
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
              <motion.div
                key={section.category}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-10"
              >
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-green-50 border border-green-100 rounded-2xl p-6 md:p-8 text-center"
          >
            <h3 className="font-bold text-lg mb-2">Still have questions?</h3>
            <p className="text-gray-500 text-sm mb-5">
              Didn't find what you were looking for? Just ask us directly.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-sm"
            >
              Contact Support <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}