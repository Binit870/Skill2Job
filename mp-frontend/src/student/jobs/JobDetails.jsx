import { useState, useEffect } from "react";
import {
  X, MapPin, Users, Building2, Globe, Mail, Bookmark,
  Check, ArrowRight,
} from "lucide-react";
import ApplyModal from "./ApplyModal";
import API from "../../utils/api";

const TYPE_STYLES = {
  "Full-Time":  "bg-ink/5 text-ink/60 border-mist",
  "Part-Time":  "bg-ink/5 text-ink/60 border-mist",
  "Internship": "bg-blue-50 text-blue-700 border-blue-200",
  "Remote":     "bg-pine/8 text-pine border-pine/20",
  "Contract":   "bg-gold/10 text-gold border-gold/25",
};

const deadlineCls = (deadline) => {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 0)  return null;
  if (days <= 3) return { label: `${days}d left`, cls: "bg-red-50 text-red-600 border-red-200" };
  if (days <= 7) return { label: `${days}d left`, cls: "bg-gold/10 text-gold border-gold/25" };
  return           { label: `${days}d left`, cls: "bg-pine/8 text-pine border-pine/20" };
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
    setSaved(!!jobProp.isSaved);
    const check = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;
        const res = await API.get(`/api/applications/check/${jobProp._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.applied) setApplied(true);
      } catch { /* best-effort, ignore */ }
    };
    check();
  }, [jobProp?._id]);

  const handleToggleSave = async () => {
    // Optimistic update — bookmarking should feel instant
    setSaved((s) => !s);
    try {
      const { data } = await API.patch(`/api/jobs/${job._id}/save`);
      setSaved(data.saved);
    } catch (err) {
      setSaved((s) => !s); // revert on failure
      console.error("Failed to save job:", err);
    }
  };

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
        className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Side panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-[540px] bg-white shadow-2xl flex flex-col animate-[slideIn_0.3s_cubic-bezier(0.34,1.08,0.64,1)]">

        {/* ── Header ── */}
        <div className="px-5 sm:px-7 pt-4 pb-4 border-b border-mist flex-shrink-0 bg-white">

          {/* Top row: close button pinned right */}
          <div className="flex justify-end mb-3">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-ink/5 hover:bg-ink/10 flex items-center justify-center text-ink/40 hover:text-ink transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Company row */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt={job.company}
              className="w-12 h-12 rounded-xl border border-mist object-cover bg-paper/60 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs text-ink/50 font-medium mb-1 truncate">{job.company}</p>
              <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${typeStyle}`}>
                {job.jobType}
              </span>
            </div>
          </div>

          <h2 className="font-display text-lg sm:text-xl font-bold text-ink leading-snug mb-4 tracking-tight">{job.title}</h2>

          {/* Chip strip */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-0.5">
            <span className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-ink/60 bg-ink/5 px-3 py-1.5 rounded-full">
              <MapPin className="w-2.5 h-2.5" />
              {job.location}
            </span>
            <span className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-ink/60 bg-ink/5 px-3 py-1.5 rounded-full">
              <Users className="w-2.5 h-2.5" />
              {job.experienceMin}{job.experienceMax ? `–${job.experienceMax}` : "+"} yrs
            </span>
            {job.vacancies && (
              <span className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-ink/60 bg-ink/5 px-3 py-1.5 rounded-full">
                <Users className="w-2.5 h-2.5" />
                {job.vacancies} opening{job.vacancies > 1 ? "s" : ""}
              </span>
            )}
            {(job.salaryMin || job.salaryMax) && (
              <span className="flex-shrink-0 text-xs font-bold text-pine bg-pine/8 border border-pine/20 px-3 py-1.5 rounded-full">
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
            <h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-widest mb-3">Overview</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                ["Job type",    job.jobType],
                ["Experience",  `${job.experienceMin}${job.experienceMax ? `–${job.experienceMax}` : "+"} yrs`],
                ...(job.salaryMin || job.salaryMax ? [["Salary", `₹${job.salaryMin || "—"} – ₹${job.salaryMax || "—"}`]] : []),
                ["Vacancies",  job.vacancies],
                ...(job.deadline ? [["Deadline", new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })]] : []),
                ["Posted",     new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })],
              ].map(([label, val]) => (
                <div key={label} className="bg-paper/60 border border-mist rounded-xl px-3.5 py-3">
                  <p className="text-[9px] font-bold text-ink/40 uppercase tracking-wide">{label}</p>
                  <p className="text-[13px] font-semibold text-ink mt-1">{val}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <section>
              <h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-widest mb-3">Required skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s, i) => (
                  <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Description */}
          {job.description && (
            <section>
              <h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-widest mb-3">Job description</h3>
              <p className="text-sm text-ink/65 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </section>
          )}

          {/* Company */}
          <section>
            <h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-widest mb-3">About the company</h3>
            <div className="bg-paper/60 border border-mist rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2.5">
                <img
                  src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                  alt={job.company}
                  className="w-10 h-10 rounded-xl border border-mist object-cover bg-white"
                />
                <p className="text-sm font-bold text-ink flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-ink/30" />
                  {job.company}
                </p>
              </div>
              {job.companyDescription && (
                <p className="text-sm text-ink/55 leading-relaxed">{job.companyDescription}</p>
              )}
              {job.companyWebsite && (
                <a
                  href={job.companyWebsite} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-pine hover:underline mt-3"
                >
                  <Globe className="w-2.5 h-2.5" />
                  {job.companyWebsite.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </section>

          {/* Contact */}
          {job.contact?.email && (
            <section>
              <h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-widest mb-3">Contact</h3>
              <div className="flex items-center gap-3 bg-paper/60 border border-mist rounded-xl px-4 py-3">
                <Mail className="w-3.5 h-3.5 text-ink/30 shrink-0" />
                <a href={`mailto:${job.contact.email}`} className="text-sm font-medium text-pine hover:underline">
                  {job.contact.email}
                </a>
              </div>
            </section>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 sm:px-7 py-4 border-t border-mist bg-white flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleToggleSave}
            title={saved ? "Saved" : "Save job"}
            className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors shrink-0
              ${saved
                ? "border-gold/40 bg-gold/10 text-gold"
                : "border-mist bg-white text-ink/35 hover:border-gold/40 hover:text-gold hover:bg-gold/10"
              }`}
          >
            <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
          </button>

          <button
            onClick={() => !applied && setApplyOpen(true)}
            disabled={applied}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
              ${applied
                ? "bg-pine/8 border border-pine/20 text-pine cursor-not-allowed"
                : "bg-pine hover:bg-moss text-white shadow-sm shadow-pine/20 hover:-translate-y-0.5 active:scale-[0.98]"
              }`}
          >
            {applied ? (
              <>
                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                Applied
              </>
            ) : (
              <>
                Apply now
                <ArrowRight className="w-3.5 h-3.5" />
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
