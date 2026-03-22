import { useEffect, useState } from "react";
import axios from "axios";
import JobDetails from "./JobDetails";

const API = "http://localhost:5000";

const JOB_TYPES = ["All", "Full-Time", "Part-Time", "Internship", "Remote", "Contract"];

const TYPE_STYLES = {
  "Full-Time":  "bg-blue-50 text-blue-700 border-blue-200",
  "Part-Time":  "bg-violet-50 text-violet-700 border-violet-200",
  "Internship": "bg-amber-50 text-amber-700 border-amber-200",
  "Remote":     "bg-teal-50 text-teal-700 border-teal-200",
  "Contract":   "bg-rose-50 text-rose-700 border-rose-200",
};

const deadlineInfo = (deadline) => {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  if (days < 0)  return null;
  if (days <= 3) return { label: `${days}d left`, cls: "bg-red-50 text-red-600 border border-red-200" };
  if (days <= 7) return { label: `${days}d left`, cls: "bg-amber-50 text-amber-600 border border-amber-200" };
  return          { label: `${days}d left`, cls: "bg-green-50 text-green-600 border border-green-200" };
};

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-13 h-13 rounded-xl bg-slate-200 shrink-0 w-[52px] h-[52px]" />
        <div className="flex-1 flex flex-col gap-3">
          <div className="h-4 w-1/2 rounded-lg bg-slate-200" />
          <div className="h-3 w-1/3 rounded-lg bg-slate-200" />
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full bg-slate-200" />
            <div className="h-5 w-20 rounded-full bg-slate-200" />
            <div className="h-5 w-14 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FindJobs() {
  const [jobs, setJobs]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filter, setFilter]           = useState("All");
  const [search, setSearch]           = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const raw = res.data;
        const list = Array.isArray(raw) ? raw
          : Array.isArray(raw?.jobs)    ? raw.jobs
          : Array.isArray(raw?.data)    ? raw.data
          : [];
        setJobs(list);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = jobs.filter((j) => {
    const matchType = filter === "All" || j.jobType === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      j.title?.toLowerCase().includes(q) ||
      j.company?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q) ||
      j.skills?.some((s) => s.toLowerCase().includes(q));
    return matchType && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Topbar ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Find Jobs</h1>
          <p className="text-xs text-slate-400 mt-0.5">Discover your next opportunity</p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
          {loading ? "Loading…" : `${filtered.length} listing${filtered.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* ── Search + Filters ── */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            placeholder="Search title, company, skill…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Type filters */}
        <div className="flex flex-wrap gap-2">
          {JOB_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all
                ${filter === t
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                  : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Job List ── */}
      <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col gap-4">

        {loading ? (
          [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)

        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔭</div>
            <h3 className="text-base font-bold text-slate-500">No jobs found</h3>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter</p>
          </div>

        ) : (
          filtered.map((job, idx) => {
            const dl         = deadlineInfo(job.deadline);
            const isSelected = selectedJob?._id === job._id;
            const typeStyle  = TYPE_STYLES[job.jobType] || TYPE_STYLES["Full-Time"];

            return (
              <div
                key={job._id}
                onClick={() => setSelectedJob(job)}
                style={{ animationDelay: `${idx * 50}ms` }}
                className={`relative bg-white rounded-2xl p-5 cursor-pointer border transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70
                  ${isSelected
                    ? "border-blue-400 shadow-md shadow-blue-100"
                    : "border-slate-200 hover:border-blue-300"
                  }`}
              >
                <div className="flex gap-4 items-start">

                  {/* Logo */}
                  <img
                    src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={job.company}
                    className="w-[52px] h-[52px] rounded-xl border border-slate-200 object-cover bg-slate-50 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    {/* Type badge */}
                    <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border mb-1.5 ${typeStyle}`}>
                      {job.jobType}
                    </span>

                    {/* Title + company */}
                    <h3 className="text-[15px] font-black text-slate-800 truncate leading-tight">{job.title}</h3>
                    <p className="text-sm text-slate-500 font-medium mt-0.5">{job.company}</p>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-3 mt-2.5">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/></svg>
                        {job.location}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        {job.experienceMin}{job.experienceMax ? `–${job.experienceMax}` : "+"} yrs
                      </span>
                      {job.vacancies > 1 && (
                        <span className="text-xs text-slate-500">👥 {job.vacancies} openings</span>
                      )}
                    </div>

                    {/* Skills */}
                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {job.skills.slice(0, 4).map((s, i) => (
                          <span key={i} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {s}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="text-[11px] text-slate-400 self-center">+{job.skills.length - 4} more</span>
                        )}
                      </div>
                    )}

                    {/* Footer row */}
                    <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">
                          {new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                        {dl && (
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${dl.cls}`}>
                            ⏰ {dl.label}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {(job.salaryMin || job.salaryMax) && (
                          <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                            ₹{job.salaryMin ? `${(job.salaryMin / 1000).toFixed(0)}k` : "?"}–₹{job.salaryMax ? `${(job.salaryMax / 1000).toFixed(0)}k` : "?"}
                          </span>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm shadow-blue-200"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedJob && (
        <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}