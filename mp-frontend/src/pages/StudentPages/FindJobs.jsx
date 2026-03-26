import { useEffect, useState } from "react";
import API from "../../utils/api";
import JobDetails from "../../components/StudentComponents/Jobs/JobDetails";

const JOB_TYPES = ["All", "Full-Time", "Part-Time", "Internship", "Remote", "Contract"];

const TYPE_STYLES = {
  "Full-Time":  "bg-slate-100 text-slate-600 border-slate-200",
  "Part-Time":  "bg-slate-100 text-slate-600 border-slate-200",
  "Internship": "bg-blue-50 text-blue-600 border-blue-100",
  "Remote":     "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Contract":   "bg-amber-50 text-amber-700 border-amber-100",
};

const deadlineInfo = (deadline) => {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  if (days < 0) return null;
  if (days <= 3) return { label: `${days}d left`, cls: "bg-red-50 text-red-500 border-red-200" };
  if (days <= 7) return { label: `${days}d left`, cls: "bg-amber-50 text-amber-600 border-amber-200" };
  return { label: `${days}d left`, cls: "bg-slate-100 text-slate-400 border-slate-200" };
};

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 animate-pulse">
      <div className="flex gap-4 items-start">
        <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-md bg-slate-100" />
          </div>
          <div className="h-4 w-2/5 rounded-md bg-slate-100" />
          <div className="h-3 w-1/4 rounded-md bg-slate-100" />
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-14 rounded-full bg-slate-100" />
            <div className="h-5 w-16 rounded-full bg-slate-100" />
            <div className="h-5 w-12 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FindJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Inject Plus Jakarta Sans
  useEffect(() => {
    if (document.getElementById("pjs-font")) return;
    const link = document.createElement("link");
    link.id = "pjs-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const raw = res.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.jobs)
          ? raw.jobs
          : Array.isArray(raw?.data)
          ? raw.data
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
    <div
      className=" bg-slate-50"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Sticky Header ── */}
      <div className=" bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Brand row */}
          <div className="flex items-center justify-between pt-4 pb-3 gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2.5"/>
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                </svg>
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-none tracking-tight">
                  Find Jobs
                </h1>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium hidden sm:block">
                  Discover your next opportunity
                </p>
              </div>
            </div>

            {/* Result count pill */}
            <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
              {loading ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Loading…
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {filtered.length} {filtered.length === 1 ? "result" : "results"}
                </>
              )}
            </span>
          </div>

          {/* Search bar */}
          <div className="relative pb-3">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-[65%] text-slate-400 pointer-events-none"
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              placeholder="Search title, company, skill or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-[65%] text-slate-400 hover:text-slate-600 transition-colors p-0.5"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
            {JOB_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                className={`shrink-0 px-3.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all duration-150
                  ${filter === t
                    ? "bg-green-600 text-white border-green-600 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-3">

        {/* Loading skeletons */}
        {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-700">No jobs found</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Try adjusting your search or filter</p>
            <button
              onClick={() => { setSearch(""); setFilter("All"); }}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="mt-5 px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Job cards */}
        {!loading && filtered.map((job, idx) => {
          const dl = deadlineInfo(job.deadline);
          const isSelected = selectedJob?._id === job._id;
          const typeStyle = TYPE_STYLES[job.jobType] || TYPE_STYLES["Full-Time"];

          return (
            <div
              key={job._id}
              onClick={() => setSelectedJob(job)}
              className={`group relative bg-white rounded-2xl border cursor-pointer transition-all duration-200
                hover:shadow-md hover:-translate-y-px
                ${isSelected
                  ? "border-green-500 shadow-md ring-1 ring-green-500/10"
                  : "border-slate-100 hover:border-slate-200 hover:shadow-slate-100"
                }`}
            >
              {/* Selected left bar */}
              {isSelected && (
                <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-green-500 rounded-full" />
              )}

              <div className="p-4 sm:p-5">
                <div className="flex gap-3 sm:gap-4 items-start">

                  {/* Company logo */}
                  <img
                    src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={job.company}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-slate-100 object-cover bg-slate-50 shrink-0"
                  />

                  {/* Main content */}
                  <div className="flex-1 min-w-0">

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${typeStyle}`}>
                        {job.jobType}
                      </span>
                      {dl && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${dl.cls}`}>
                          {dl.label}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-[15px] sm:text-base font-bold text-slate-900 truncate leading-snug">
                      {job.title}
                    </h3>

                    {/* Company */}
                    <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                      {job.company}
                    </p>

                    {/* Meta – location & exp */}
                    <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-slate-400 font-medium">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          {job.location}
                        </span>
                      )}
                      {job.experienceMin !== undefined && (
                        <span className="flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4"/>
                            <path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
                          </svg>
                          {job.experienceMin}{job.experienceMax ? `–${job.experienceMax}` : "+"} yrs
                        </span>
                      )}
                    </div>

                    {/* Skills */}
                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {job.skills.slice(0, 4).map((s, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200"
                          >
                            {s}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
                            +{job.skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">

                      {/* Date + Salary */}
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(job.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {(job.salaryMin || job.salaryMax) && (
                          <span className="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                            ₹{job.salaryMin ? `${(job.salaryMin / 1000).toFixed(0)}k` : "?"}
                            {" – "}
                            ₹{job.salaryMax ? `${(job.salaryMax / 1000).toFixed(0)}k` : "?"}
                          </span>
                        )}
                      </div>

                      {/* CTA */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 active:scale-95 text-white text-xs font-semibold transition-all shadow-sm"
                      >
                        View Job
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-[11px] text-slate-400 font-medium pt-1 pb-6">
            Showing {filtered.length} of {jobs.length} listings
          </p>
        )}
      </div>

      {selectedJob && (
        <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}