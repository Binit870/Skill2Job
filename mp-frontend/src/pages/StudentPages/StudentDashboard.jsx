import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Briefcase,
  Star,
  Zap,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

/* ---------------- MOCK DATA ---------------- */
const mockSkills = {
  matched: ["React", "TypeScript", "Node.js", "Python", "Git"],
  missing: ["Docker", "AWS", "GraphQL", "Kubernetes"],
};

const mockJobs = [
  {
    company: "TechCorp",
    title: "Frontend Developer",
    location: "San Francisco, CA",
    matchScore: 92,
    skills: ["React", "TypeScript", "Tailwind"],
    salary: "$120K - $150K",
  },
  {
    company: "DataFlow Inc",
    title: "Full Stack Engineer",
    location: "New York, NY",
    matchScore: 85,
    skills: ["Node.js", "React", "PostgreSQL"],
    salary: "$130K - $160K",
  },
  {
    company: "AI Solutions",
    title: "Software Engineer",
    location: "Remote",
    matchScore: 78,
    skills: ["Python", "TensorFlow", "React"],
    salary: "$110K - $140K",
  },
];

/* ---------------- BASIC BUTTON ---------------- */
function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-black text-white hover:bg-black/90",
    outline: "border border-gray-300 hover:bg-gray-100",
    ghost: "hover:bg-gray-100",
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------- PROGRESS BAR ---------------- */
function ProgressBar({ value }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full">
      <div
        className="h-2 bg-black rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

/* ---------------- CIRCULAR PROGRESS ---------------- */
function CircularProgress({ value }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width="160" height="160">
      <circle
        cx="80"
        cy="80"
        r={radius}
        stroke="#e5e7eb"
        strokeWidth="12"
        fill="none"
      />
      <circle
        cx="80"
        cy="80"
        r={radius}
        stroke="#000"
        strokeWidth="12"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.3em"
        className="text-xl font-bold"
      >
        {value}%
      </text>
    </svg>
  );
}

/* ---------------- PAGE ---------------- */
export default function StudentDashboard() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const placementProbability = 78;

  const handleFileChange = (e) => {
    setUploadedFile(e.target.files[0]);
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* WELCOME */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-100 rounded-2xl p-6 border"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, Alex 👋</h1>
              <p className="text-gray-600">
                Your profile is 85% complete. Upload your resume.
              </p>
            </div>
            <Button className="hidden md:flex gap-2">
              Complete Profile <ArrowUpRight size={16} />
            </Button>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ["Placement Probability", `${placementProbability}%`, TrendingUp],
            ["Expected Salary", "$85K-$120K", DollarSign],
            ["Profile Strength", "85%", BarChart3],
            ["Job Matches", "24", Briefcase],
          ].map(([title, value, Icon]) => (
            <div key={title} className="bg-white p-4 rounded-xl border">
              <div className="flex items-center gap-3">
                <Icon size={24} />
                <div>
                  <p className="text-sm text-gray-500">{title}</p>
                  <p className="text-lg font-bold">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* UPLOAD */}
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-semibold mb-4">Upload Resume</h2>
              <input type="file" onChange={handleFileChange} />
              {isAnalyzing && (
                <p className="text-sm text-gray-500 mt-2">Analyzing...</p>
              )}
            </div>

            {/* SKILLS */}
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-semibold mb-4">Skill Analysis</h2>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} />
                  Matched Skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockSkills.matched.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 text-xs bg-green-100 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={16} />
                  Skills to Improve
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockSkills.missing.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 text-xs bg-red-100 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* JOBS */}
            <div>
              <h2 className="font-semibold mb-4">Top Job Matches</h2>
              <div className="space-y-4">
                {mockJobs.map((job) => (
                  <div
                    key={job.company}
                    className="bg-white p-4 rounded-xl border"
                  >
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.company}</p>
                    <p className="text-sm">{job.salary}</p>
                    <Button className="mt-2">Apply</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border text-center">
              <h2 className="font-semibold mb-6">Placement Prediction</h2>
              <CircularProgress value={placementProbability} />
              <span className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-100 rounded-full text-sm">
                <Zap size={16} /> High Probability
              </span>

              <div className="mt-6">
                {[
                  ["Technical Skills", 85],
                  ["Experience", 70],
                  ["Projects", 90],
                  ["Education", 75],
                ].map(([label, val]) => (
                  <div key={label} className="mb-3 text-left">
                    <div className="flex justify-between text-sm">
                      <span>{label}</span>
                      <span>{val}%</span>
                    </div>
                    <ProgressBar value={val} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BarChart3 size={16} /> Skill Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Briefcase size={16} /> Browse Jobs
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Star size={16} /> Courses
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
