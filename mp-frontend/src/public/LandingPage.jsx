import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Upload, Target, Brain, MessageSquare, FlaskConical, Clock,
  Briefcase, Users, PlusCircle, ArrowRight, CheckCircle2,
} from "lucide-react";
import Seo from "../components/Seo";

/* ══════════════════════════════════════════
   REAL PRODUCT CONTENT
   (kept from the original page — this is what the app actually does)
══════════════════════════════════════════ */
const features = [
  {
    icon: Upload,
    title: "Resume parsing",
    description: "Extract skills, experience, and education from any resume format in seconds — no manual data entry.",
  },
  {
    icon: Target,
    title: "Skill-based matching",
    description: "Get matched to roles by what you can actually do, not by keyword overlap. Stop applying blindly.",
  },
  {
    icon: Brain,
    title: "Skill gap analysis",
    description: "See exactly which skills stand between you and a role — with a clear path to close the gap.",
  },
  {
    icon: MessageSquare,
    title: "Mock interviews",
    description: "Practice with an ML-driven interview simulator and get scored feedback on your actual responses.",
  },
  {
    icon: FlaskConical,
    title: "Mock assessments",
    description: "Adaptive skill tests that calibrate to your level in real time — not generic prompt-based quizzes.",
  },
  {
    icon: Clock,
    title: "Application tracking",
    description: "Every application, one dashboard. Status, follow-ups, and outcomes — never lose track again.",
  },
];

const recruiterFeatures = [
  {
    icon: Briefcase,
    title: "Post a job",
    description: "Create a listing in minutes. Set skill requirements and experience level, and matching starts instantly.",
  },
  {
    icon: Users,
    title: "Manage applicants",
    description: "Review candidates ranked by skill-fit score. Shortlist, leave notes, and move people through stages.",
  },
  {
    icon: PlusCircle,
    title: "Recruiter dashboard",
    description: "One view of every open role, every pipeline, and every hiring metric that matters.",
  },
];

const stats = [
  { value: "95%", label: "Matching accuracy" },
  { value: "85%", label: "Placement success" },
  { value: "50+", label: "Live opportunities" },
  { value: "Skill-first", label: "Hiring approach" },
];

const pathStages = [
  { label: "Build skills", detail: "Resume + assessments", accent: false },
  { label: "Get scored", detail: "Real ATS + skill scoring", accent: false },
  { label: "Get matched", detail: "95% matching accuracy", accent: false },
  { label: "Get hired", detail: "85% placement success", accent: true },
];

/* ══════════════════════════════════════════
   SIGNATURE ELEMENT — The Career Path
   Mirrors the app's real application pipeline (Applied → Reviewed →
   Shortlisted → Hired). Desktop shows it as a horizontal route; mobile
   collapses to a vertical stepper rather than shrinking the SVG.
══════════════════════════════════════════ */
function CareerPath() {
  const nodes = [
    { x: 40, y: 150 },
    { x: 420, y: 70 },
    { x: 760, y: 170 },
    { x: 1120, y: 80 },
  ];

  const d = `M ${nodes[0].x} ${nodes[0].y}
    C 180 210, 280 30, ${nodes[1].x} ${nodes[1].y}
    C 520 0, 620 240, ${nodes[2].x} ${nodes[2].y}
    C 860 240, 980 10, ${nodes[3].x} ${nodes[3].y}`;

  return (
    <>
      <Seo
        title="Turn Your Skills Into Your Next Job"
        description="Build an ATS-ready resume, practice with AI mock interviews and assessments, and get matched to full-time, part-time, and remote jobs based on your real skills."
        path="/"
      />
      {/* Desktop / tablet: horizontal route */}
      <div className="hidden md:block w-full">
        <svg viewBox="0 0 1160 260" className="w-full h-auto" aria-hidden="true">
          <defs>
            <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0E6B52" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#0E6B52" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#C99A3B" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <motion.path
            d={d}
            stroke="url(#pathGrad)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
          {nodes.map((n, i) => {
            const stage = pathStages[i];
            return (
              <g key={stage.label}>
                <circle cx={n.x} cy={n.y} r={i === 3 ? 13 : 11} fill="none"
                  stroke={stage.accent ? "#C99A3B" : "#0E6B52"} strokeOpacity="0.25" strokeWidth="6" />
                <circle cx={n.x} cy={n.y} r={i === 3 ? 6 : 5.5} fill={stage.accent ? "#C99A3B" : "#0E6B52"} />
                <text
                  x={i === 0 ? n.x + 4 : i === 3 ? n.x - 4 : n.x}
                  y={n.y > 100 ? n.y - 28 : n.y + 42}
                  textAnchor={i === 0 ? "start" : i === 3 ? "end" : "middle"}
                  className="fill-ink font-display"
                  style={{ fontSize: 17, fontWeight: 700 }}
                >
                  {stage.label}
                </text>
                <text
                  x={i === 0 ? n.x + 4 : i === 3 ? n.x - 4 : n.x}
                  y={n.y > 100 ? n.y - 8 : n.y + 62}
                  textAnchor={i === 0 ? "start" : i === 3 ? "end" : "middle"}
                  className="fill-ink/45"
                  style={{ fontSize: 13 }}
                >
                  {stage.detail}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mobile: vertical stepper */}
      <div className="md:hidden flex flex-col gap-0">
        {pathStages.map((stage, i) => (
          <div key={stage.label} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`w-3.5 h-3.5 rounded-full shrink-0 ${stage.accent ? "bg-gold" : "bg-pine"}`}
              />
              {i < pathStages.length - 1 && (
                <span className="w-px flex-1 bg-mist my-1" style={{ minHeight: 32 }} />
              )}
            </div>
            <div className="pb-6">
              <p className="font-display font-bold text-ink text-[15px]">{stage.label}</p>
              <p className="text-sm text-ink/45">{stage.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="bg-paper">
      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 pt-16 md:pt-24 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pine/8 text-pine text-xs font-display font-semibold uppercase tracking-widest mb-6">
            Backed by real ML scoring
          </span>
          <h1 className="font-display font-extrabold text-ink text-[2.5rem] sm:text-5xl md:text-[3.4rem] leading-[1.08] tracking-tight mb-6">
            Turn your skills into an offer letter.
          </h1>
          <p className="text-ink/60 text-base md:text-lg leading-relaxed mb-9 max-w-xl">
            Skill2Career scores your resume, tests your skills, and matches you to roles that
            actually fit — so you spend less time applying and more time interviewing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/signup"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-pine text-white font-display font-semibold text-sm hover:bg-moss transition-colors"
            >
              Get started as a job seeker
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-mist text-ink font-display font-semibold text-sm hover:bg-ink/5 transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              I'm hiring
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── SIGNATURE: CAREER PATH ── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 pt-14 md:pt-20 pb-16 md:pb-24">
        <CareerPath />
      </section>

      {/* ── FEATURES ── */}
      <section className="border-t border-mist bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 md:py-24">
          <div className="max-w-xl mb-12 md:mb-16">
            <h2 className="font-display font-extrabold text-ink text-3xl md:text-4xl tracking-tight mb-3">
              Everything between skill and hire
            </h2>
            <p className="text-ink/55 text-base leading-relaxed">
              One connected toolset — not six disconnected apps you have to stitch together yourself.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-mist border border-mist rounded-2xl overflow-hidden">
            {features.map((f) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-7 md:p-8"
              >
                <div className="w-10 h-10 rounded-lg bg-pine/8 flex items-center justify-center mb-5">
                  <f.icon className="w-5 h-5 text-pine" strokeWidth={1.75} />
                </div>
                <h3 className="font-display font-bold text-ink text-base mb-2">{f.title}</h3>
                <p className="text-sm text-ink/55 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECRUITERS ── */}
      <section className="border-t border-mist">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
            <div className="max-w-xl">
              <h2 className="font-display font-extrabold text-ink text-3xl md:text-4xl tracking-tight mb-3">
                Hiring? Skip the resume pile.
              </h2>
              <p className="text-ink/55 text-base leading-relaxed">
                See candidates ranked by real skill fit, not who applied first.
              </p>
            </div>
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ink text-white font-display font-semibold text-sm hover:bg-moss transition-colors w-fit shrink-0"
            >
              Go to recruiter dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {recruiterFeatures.map((f) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-mist p-7 md:p-8 bg-white"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/12 flex items-center justify-center mb-5">
                  <f.icon className="w-5 h-5 text-gold" strokeWidth={1.75} />
                </div>
                <h3 className="font-display font-bold text-ink text-base mb-2">{f.title}</h3>
                <p className="text-sm text-ink/55 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-t border-mist bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-14 md:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <div className="font-display font-extrabold text-ink text-3xl md:text-4xl tracking-tight mb-1">
                  {s.value}
                </div>
                <p className="text-sm text-ink/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="border-t border-mist bg-moss">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 py-16 md:py-24 text-center">
          <h2 className="font-display font-extrabold text-white text-3xl md:text-[2.75rem] tracking-tight leading-tight mb-5">
            Your next role is closer than you think.
          </h2>
          <p className="text-white/60 text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Create a profile, get scored, and start matching with roles — free to start, no recruiter middleman.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-moss font-display font-semibold text-sm hover:bg-paper transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Create your profile
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/25 text-white font-display font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
