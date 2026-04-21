import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Target, FileText, Briefcase, Heart } from "lucide-react";

const values = [
  {
    icon: FileText,
    title: "Resume Builder",
    desc: "Create ATS-optimized resumes in under 5 minutes. No design skills needed — just fill, preview, and download.",
  },
  {
    icon: Briefcase,
    title: "All Job Types",
    desc: "Full-time, part-time, work-from-home, freelance — recruiters post, candidates apply. One platform for every work arrangement.",
  },
  {
    icon: Target,
    title: "Skill-First Matching",
    desc: "We match based on what you can do, not just your degree. Fairer hiring for everyone.",
  },
  {
    icon: Heart,
    title: "Candidate-Centric",
    desc: "Easy apply, job alerts, and resume analytics — built to help job seekers win.",
  },
];

const team = [
  { name: "Your Name", role: "Founder & CEO", initial: "Y" },
  { name: "Co-founder Name", role: "Head of Product", initial: "C" },
  { name: "Lead Engineer", role: "Tech Lead", initial: "L" },
  { name: "Hiring Partner", role: "Recruitment Strategist", initial: "H" },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

// Professional palette:
// primary green: #3B6D11 (dark green)
// light green accents: #E8F5DF, #C5DFA8, #639922
// background: white

export default function About() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ── HERO ── */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-28 overflow-hidden border-b border-gray-100">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none bg-green-100 opacity-30 blur-[100px]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border bg-green-50 text-green-700 border-green-100 mb-6">
              About Skill2Job
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              Hire & Get Hired<br />
              <span className="text-green-700">On Your Terms</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Skill2Job gives recruiters a powerful dashboard to post full-time, part-time, or remote jobs —
              and helps job seekers build professional resumes, apply instantly, and track applications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MISSION + STATS ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* text */}
            <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
              <span className="text-xs font-bold uppercase tracking-widest text-green-600">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-5 leading-tight tracking-tight">
                Removing Barriers Between Talent & Opportunity
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4 text-sm md:text-base">
                Traditional job portals force candidates into rigid formats and overlook skills.
                Recruiters waste time filtering mismatched applications.
              </p>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                Skill2Job changes that. Our platform combines a smart job posting system with a seamless
                resume builder and one-click apply. The result? Faster, fairer hiring for everyone.
              </p>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 mt-7 bg-green-700 text-green-50 text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:bg-green-800 shadow-sm"
              >
                Explore Platform <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* stats */}
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="grid grid-cols-2 gap-4">
              {[
                { value: "1,200+", label: "Active Jobs" },
                { value: "180+", label: "Recruiters" },
                { value: "4.9★", label: "User Rating" },
                { value: "15k+", label: "Resumes Created" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:shadow-sm transition"
                >
                  <div className="text-3xl font-bold text-green-700 mb-1">{stat.value}</div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES / FEATURES ── */}
      <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-green-600">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 tracking-tight">Built for Modern Hiring</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-11 h-11 bg-green-100 text-green-700 rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-green-600">
              The People
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 tracking-tight">Leadership</h2>
            <p className="text-gray-500 mt-3 text-sm md:text-base max-w-xl mx-auto">
              A passionate team of engineers, designers, and hiring experts building the future of work.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="text-center bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md transition"
              >
                <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {member.initial}
                </div>
                <div className="font-semibold text-sm">{member.name}</div>
                <div className="text-xs text-gray-500 mt-1">{member.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-20 bg-green-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to Transform Your Hiring or Job Search?
          </h2>
          <p className="text-green-100 mb-8 text-sm md:text-base">
            Join hundreds of recruiters and thousands of job seekers already using Skill2Job.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/signup?type=recruiter"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-800 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition text-sm shadow"
            >
              Post a Job <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/signup?type=candidate"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition text-sm"
            >
              Create Resume
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}