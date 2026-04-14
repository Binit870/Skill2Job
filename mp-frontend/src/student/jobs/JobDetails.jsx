import { useState, useEffect } from "react";
import axios from "axios";
import ApplyModal from "./ApplyModal";

const API = "http://localhost:5000";

const TYPE_STYLES = {
  "Full-Time":  "bg-blue-50 text-blue-700 border-blue-200",
  "Part-Time":  "bg-violet-50 text-violet-700 border-violet-200",
  "Internship": "bg-amber-50 text-amber-700 border-amber-200",
  "Remote":     "bg-teal-50 text-teal-700 border-teal-200",
  "Contract":   "bg-rose-50 text-rose-700 border-rose-200",
};

const deadlineCls = (deadline) => {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 0)  return null;
  if (days <= 3) return { label: `${days}d left`, cls: "bg-red-50 text-red-600 border-red-200" };
  if (days <= 7) return { label: `${days}d left`, cls: "bg-amber-50 text-amber-600 border-amber-200" };
  return          { label: `${days}d left`, cls: "bg-green-50 text-green-600 border-green-200" };
};

export default function JobDetails({ job: jobProp, onClose }) {
  const [job, setJob]           = useState(jobProp || null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applied, setApplied]   = useState(false);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    if (!jobProp) return;
    setJob(jobProp);
  }, [jobProp]);

  // Auto-check if already applied when job panel opens
  useEffect(() => {
    if (!jobProp?._id) return;
    setApplied(false);
    const check = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${API}/api/applications/check/${jobProp._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.applied) setApplied(true);
      } catch (_) {}
    };
    check();
  }, [jobProp?._id]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!job) return null;

  const dl         = deadlineCls(job.deadline);
  const typeStyle  = TYPE_STYLES[job.jobType] || TYPE_STYLES["Full-Time"];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[560px] bg-white shadow-2xl flex flex-col animate-[slideIn_0.32s_cubic-bezier(0.34,1.1,0.64,1)]">

        {/* ── Header ── */}
        <div className="px-7 pt-6 pb-5 border-b border-slate-100 flex-shrink-0 bg-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 text-lg transition"
          >
            ×
          </button>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt={job.company}
              className="w-14 h-14 rounded-2xl border border-slate-200 object-cover bg-slate-50 shrink-0"
            />
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">{job.company}</p>
              <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${typeStyle}`}>
                {job.jobType}
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight mb-4">{job.title}</h2>

          {/* Chip row */}
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/></svg>
              {job.location}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              {job.experienceMin}{job.experienceMax ? `–${job.experienceMax}` : "+"} yrs
            </span>
            {job.vacancies && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                👥 {job.vacancies} opening{job.vacancies > 1 ? "s" : ""}
              </span>
            )}
            {(job.salaryMin || job.salaryMax) && (
              <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                ₹{job.salaryMin ? `${(job.salaryMin / 1000).toFixed(0)}k` : "?"}–₹{job.salaryMax ? `${(job.salaryMax / 1000).toFixed(0)}k` : "?"}
              </span>
            )}
            {dl && (
              <span className={`text-xs font-bold border px-3 py-1.5 rounded-full ${dl.cls}`}>
                ⏰ {dl.label}
              </span>
            )}
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">

          {/* Overview grid */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Overview</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Job Type",    job.jobType],
                ["Experience",  `${job.experienceMin}${job.experienceMax ? `–${job.experienceMax}` : "+"} yrs`],
                ...(job.salaryMin || job.salaryMax ? [["Salary", `₹${job.salaryMin || "—"} – ₹${job.salaryMax || "—"}`]] : []),
                ["Vacancies",   job.vacancies],
                ...(job.deadline ? [["Deadline", new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })]] : []),
                ["Posted",      new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })],
              ].map(([label, val]) => (
                <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{val}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s, i) => (
                  <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Description */}
          {job.description && (
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Job Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </section>
          )}

          {/* Company */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">About the Company</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                  alt={job.company}
                  className="w-10 h-10 rounded-xl border border-slate-200 object-cover bg-white"
                />
                <p className="text-sm font-black text-slate-800">{job.company}</p>
              </div>
              {job.companyDescription && (
                <p className="text-sm text-slate-500 leading-relaxed">{job.companyDescription}</p>
              )}
              {job.companyWebsite && (
                <a
                  href={job.companyWebsite} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline mt-3"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="2"/></svg>
                  {job.companyWebsite.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </section>

          {/* Contact */}
          {job.contact?.email && (
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Contact</h3>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-slate-400 shrink-0">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <a href={`mailto:${job.contact.email}`} className="text-sm font-medium text-blue-600 hover:underline">
                  {job.contact.email}
                </a>
              </div>
            </section>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-7 py-5 border-t border-slate-100 bg-white flex items-center gap-3 flex-shrink-0">
          {/* Save button */}
          <button
            onClick={() => setSaved((s) => !s)}
            title={saved ? "Saved" : "Save job"}
            className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all
              ${saved
                ? "border-amber-300 bg-amber-50 text-amber-500"
                : "border-slate-200 bg-white text-slate-400 hover:border-amber-300 hover:text-amber-500 hover:bg-amber-50"
              }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"}>
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Apply button */}
          <button
            onClick={() => !applied && setApplyOpen(true)}
            disabled={applied}
            className={`flex-1 py-3 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2
              ${applied
                ? "bg-green-50 border border-green-200 text-green-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-200 hover:-translate-y-0.5"
              }`}
          >
            {applied ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Applied
              </>
            ) : (
              <>
                Apply Now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {applyOpen && (
        <ApplyModal
          job={job}
          onClose={() => setApplyOpen(false)}
          onSuccess={() => setApplied(true)}
        />
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}