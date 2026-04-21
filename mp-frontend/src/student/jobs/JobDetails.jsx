import { useState, useEffect } from "react";
import ApplyModal from "./ApplyModal";
import API from "../../utils/api";

const TYPE_STYLES = {
  "Full-Time":  "bg-slate-50 text-slate-600 border-slate-200",
  "Part-Time":  "bg-slate-50 text-slate-600 border-slate-200",
  "Internship": "bg-blue-50 text-blue-700 border-blue-200",
  "Remote":     "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Contract":   "bg-amber-50 text-amber-700 border-amber-200",
};

const deadlineCls = (deadline) => {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 0)  return null;
  if (days <= 3) return { label: `${days}d left`, cls: "bg-red-50 text-red-600 border-red-200" };
  if (days <= 7) return { label: `${days}d left`, cls: "bg-amber-50 text-amber-600 border-amber-200" };
  return           { label: `${days}d left`, cls: "bg-emerald-50 text-emerald-600 border-emerald-200" };
};

export default function JobDetails({ job: jobProp, onClose }) {
  const [job, setJob]               = useState(jobProp || null);
  const [applyOpen, setApplyOpen]   = useState(false);
  const [applied, setApplied]       = useState(false);
  const [saved, setSaved]           = useState(false);

  useEffect(() => { if (jobProp) setJob(jobProp); }, [jobProp]);

  useEffect(() => {
    if (!jobProp?._id) return;
    setApplied(false);
    const check = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;
        const res = await API.get(`/api/applications/check/${jobProp._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.applied) setApplied(true);
      } catch (_) {}
    };
    check();
  }, [jobProp?._id]);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!job) return null;

  const dl        = deadlineCls(job.deadline);
  const typeStyle = TYPE_STYLES[job.jobType] || TYPE_STYLES["Full-Time"];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Side panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-[540px] bg-white shadow-2xl flex flex-col animate-[slideIn_0.3s_cubic-bezier(0.34,1.08,0.64,1)]">

        {/* ── Header ── */}
        <div className="px-5 sm:px-7 pt-4 pb-4 border-b border-slate-100 flex-shrink-0 bg-white">

          {/* Top row: close button pinned right */}
          <div className="flex justify-end mb-3">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 text-lg leading-none transition"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Company row — no pr padding, full width available */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt={job.company}
              className="w-12 h-12 rounded-xl border border-slate-200 object-cover bg-slate-50 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium mb-1 truncate">{job.company}</p>
              <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${typeStyle}`}>
                {job.jobType}
              </span>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-4 tracking-tight">{job.title}</h2>

          {/* Chip strip — scrollable on small screens, wraps on larger */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
            <span className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
              </svg>
              {job.location}
            </span>
            <span className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              {job.experienceMin}{job.experienceMax ? `–${job.experienceMax}` : "+"} yrs
            </span>
            {job.vacancies && (
              <span className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
                {job.vacancies} opening{job.vacancies > 1 ? "s" : ""}
              </span>
            )}
            {(job.salaryMin || job.salaryMax) && (
              <span className="flex-shrink-0 text-xs font-bold text-[#0f4c35] bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                ₹{job.salaryMin ? `${(job.salaryMin / 1000).toFixed(0)}k` : "?"}–₹{job.salaryMax ? `${(job.salaryMax / 1000).toFixed(0)}k` : "?"}
              </span>
            )}
            {dl && (
              <span className={`flex-shrink-0 text-xs font-semibold border px-3 py-1.5 rounded-full ${dl.cls}`}>
                {dl.label}
              </span>
            )}
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-6">

          {/* Overview grid */}
          <section>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Overview</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                ["Job type",    job.jobType],
                ["Experience",  `${job.experienceMin}${job.experienceMax ? `–${job.experienceMax}` : "+"} yrs`],
                ...(job.salaryMin || job.salaryMax ? [["Salary", `₹${job.salaryMin || "—"} – ₹${job.salaryMax || "—"}`]] : []),
                ["Vacancies",  job.vacancies],
                ...(job.deadline ? [["Deadline", new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })]] : []),
                ["Posted",     new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })],
              ].map(([label, val]) => (
                <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                  <p className="text-[13px] font-semibold text-slate-800 mt-1">{val}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <section>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Required skills</h3>
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
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Job description</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </section>
          )}

          {/* Company */}
          <section>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">About the company</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2.5">
                <img
                  src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                  alt={job.company}
                  className="w-10 h-10 rounded-xl border border-slate-200 object-cover bg-white"
                />
                <p className="text-sm font-bold text-slate-900">{job.company}</p>
              </div>
              {job.companyDescription && (
                <p className="text-sm text-slate-500 leading-relaxed">{job.companyDescription}</p>
              )}
              {job.companyWebsite && (
                <a
                  href={job.companyWebsite} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f4c35] hover:underline mt-3"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
                  </svg>
                  {job.companyWebsite.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </section>

          {/* Contact */}
          {job.contact?.email && (
            <section>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Contact</h3>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <a href={`mailto:${job.contact.email}`} className="text-sm font-medium text-[#0f4c35] hover:underline">
                  {job.contact.email}
                </a>
              </div>
            </section>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 sm:px-7 py-4 border-t border-slate-100 bg-white flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setSaved((s) => !s)}
            title={saved ? "Saved" : "Save job"}
            className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all shrink-0
              ${saved
                ? "border-amber-300 bg-amber-50 text-amber-500"
                : "border-slate-200 bg-white text-slate-400 hover:border-amber-300 hover:text-amber-500 hover:bg-amber-50"
              }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
          </button>

          <button
            onClick={() => !applied && setApplyOpen(true)}
            disabled={applied}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
              ${applied
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700 cursor-not-allowed"
                : "bg-[#0f4c35] hover:bg-[#0a3525] text-white shadow-sm shadow-[#0f4c35]/20 hover:-translate-y-0.5 active:scale-[0.98]"
              }`}
          >
            {applied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                Applied
              </>
            ) : (
              <>
                Apply now
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
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