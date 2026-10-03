import { useEffect, useState, useContext, useMemo } from "react";
import { Search, X, MapPin, Users, ArrowRight, Briefcase, Bookmark, SlidersHorizontal, IndianRupee } from "lucide-react";
import API from "../../utils/api";
import JobDetails from "./JobDetails";
import { AuthContext } from "../../context/AuthContext";

const JOB_TYPES = ["All", "Full-Time", "Part-Time", "Internship", "Remote", "Contract"];
const SORT_OPTIONS = [
  { value: "match",   label: "Best match" },
  { value: "newest",  label: "Newest" },
  { value: "salary",  label: "Highest salary" },
];
// Absolute ceiling for the salary range slider (₹, per your typical listing range)
const SALARY_CEILING = 300000;

const TYPE_STYLES = {
  "Full-Time":  "bg-ink/5 text-ink/60 border-mist",
  "Part-Time":  "bg-ink/5 text-ink/60 border-mist",
  "Internship": "bg-blue-50 text-blue-600 border-blue-100",
  "Remote":     "bg-pine/8 text-pine border-pine/15",
  "Contract":   "bg-gold/10 text-gold border-gold/20",
};

const deadlineInfo = (deadline) => {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  if (days < 0) return null;
  if (days <= 3) return { label: `${days}d left`, cls: "bg-red-50 text-red-500 border-red-200" };
  if (days <= 7) return { label: `${days}d left`, cls: "bg-gold/10 text-gold border-gold/20" };
  return { label: `${days}d left`, cls: "bg-ink/5 text-ink/40 border-mist" };
};

// % of the job's required skills the student's profile already covers.
// Case/whitespace-insensitive comparison since skills are free-typed on
// both sides (profile skills vs. job posting skills).
const computeMatch = (jobSkills, userSkills) => {
  if (!jobSkills?.length) return null;
  const mine = new Set((userSkills || []).map((s) => s.trim().toLowerCase()));
  const hits = jobSkills.filter((s) => mine.has(s.trim().toLowerCase())).length;
  return Math.round((hits / jobSkills.length) * 100);
};

const matchStyle = (pct) => {
  if (pct === null) return null;
  if (pct >= 70) return "bg-pine/8 text-pine border-pine/20";
  if (pct >= 40) return "bg-gold/10 text-gold border-gold/25";
  return "bg-ink/5 text-ink/40 border-mist";
};

function SkeletonCard() {
  return (
    <div className="bg-white border border-mist rounded-2xl p-5 animate-pulse">
      <div className="flex gap-4 items-start">
        <div className="w-12 h-12 rounded-xl bg-mist shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-md bg-mist" />
          </div>
          <div className="h-4 w-2/5 rounded-md bg-mist" />
          <div className="h-3 w-1/4 rounded-md bg-mist" />
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-14 rounded-full bg-mist" />
            <div className="h-5 w-16 rounded-full bg-mist" />
            <div className="h-5 w-12 rounded-full bg-mist" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FindJobs() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [salaryMin, setSalaryMin] = useState(0);
  const [sortBy, setSortBy] = useState("match");

  useEffect(() => {
    (async () => {
      try {
        const token = sessionStorage.getItem("token");
        const [jobsRes, savedRes] = await Promise.all([
          API.get("/api/jobs", { headers: { Authorization: `Bearer ${token}` } }),
          API.get("/api/jobs/saved", { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
        ]);
        const raw = jobsRes.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.jobs)
          ? raw.jobs
          : Array.isArray(raw?.data)
          ? raw.data
          : [];

        const savedIds = new Set((savedRes?.data?.data || []).map((j) => j._id));
        setJobs(list.map((j) => ({ ...j, isSaved: savedIds.has(j._id) })));
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const jobsWithMatch = useMemo(
    () => jobs.map((j) => ({ ...j, matchPct: computeMatch(j.skills, user?.skills) })),
    [jobs, user?.skills]
  );

  const filtered = useMemo(() => {
    let list = jobsWithMatch.filter((j) => {
      const matchType = filter === "All" || j.jobType === filter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        j.title?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.skills?.some((s) => s.toLowerCase().includes(q));
      const matchSalary = !salaryMin || (j.salaryMax ?? j.salaryMin ?? 0) >= salaryMin;
      return matchType && matchSearch && matchSalary;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "salary") return (b.salaryMax ?? b.salaryMin ?? 0) - (a.salaryMax ?? a.salaryMin ?? 0);
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      // "match" — jobs with no skills data fall to the bottom rather than the top
      return (b.matchPct ?? -1) - (a.matchPct ?? -1);
    });

    return list;
  }, [jobsWithMatch, filter, search, salaryMin, sortBy]);

  const activeFilterCount = (salaryMin > 0 ? 1 : 0) + (sortBy !== "match" ? 1 : 0);

  return (
    <div className="bg-paper">
      {/* ── Sticky Header ── */}
      <div className="bg-white border-b border-mist shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Brand row */}
          <div className="flex items-center justify-between pt-4 pb-3 gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-pine flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4 text-white" strokeWidth={2.2} />
              </div>
              <div>
                <h1 className="font-display text-base font-bold text-ink leading-none tracking-tight">
                  Find Jobs
                </h1>
                <p className="text-[11px] text-ink/40 mt-0.5 font-medium hidden sm:block">
                  Discover your next opportunity
                </p>
              </div>
            </div>

            {/* Result count pill */}
            <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink/55 bg-ink/5 border border-mist px-3 py-1.5 rounded-full">
              {loading ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-pine/60 animate-pulse" />
                  Loading…
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-pine" />
                  {filtered.length} {filtered.length === 1 ? "result" : "results"}
                </>
              )}
            </span>
          </div>

          {/* Search bar */}
          <div className="relative pb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-[65%] w-3.5 h-3.5 text-ink/35 pointer-events-none" strokeWidth={2.2} />
            <input
              className="w-full bg-paper/60 border border-mist rounded-xl pl-10 pr-10 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-colors"
              placeholder="Search title, company, skill or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-[65%] text-ink/35 hover:text-ink/60 transition-colors p-0.5"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-1.5 pb-3">
            <div className="flex gap-1.5 overflow-x-auto flex-1">
              {JOB_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors duration-150
                    ${filter === t
                      ? "bg-pine text-white border-pine shadow-sm"
                      : "bg-white text-ink/55 border-mist hover:border-ink/20 hover:text-ink hover:bg-ink/5"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors duration-150
                ${showFilters || activeFilterCount > 0
                  ? "bg-pine/8 text-pine border-pine/25"
                  : "bg-white text-ink/55 border-mist hover:border-ink/20 hover:text-ink hover:bg-ink/5"
                }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-pine text-white text-[9px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Advanced filters panel */}
          {showFilters && (
            <div className="pb-4 flex flex-col sm:flex-row gap-4 sm:gap-8 border-t border-mist pt-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-ink/50 uppercase tracking-wider flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" /> Minimum salary
                  </label>
                  <span className="text-xs font-bold text-pine">
                    {salaryMin > 0 ? `₹${(salaryMin / 1000).toFixed(0)}k+` : "Any"}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={SALARY_CEILING}
                  step={5000}
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(Number(e.target.value))}
                  className="w-full accent-pine cursor-pointer"
                />
              </div>

              <div className="sm:w-56">
                <label className="text-[11px] font-bold text-ink/50 uppercase tracking-wider mb-2 block">
                  Sort by
                </label>
                <div className="flex gap-1.5">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors
                        ${sortBy === opt.value
                          ? "bg-pine text-white border-pine"
                          : "bg-white text-ink/55 border-mist hover:border-ink/20"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-3">

        {/* Loading skeletons */}
        {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-14 h-14 rounded-2xl bg-ink/5 flex items-center justify-center mb-4">
              <Search className="w-5 h-5 text-ink/35" strokeWidth={1.8} />
            </div>
            <h3 className="text-sm font-semibold text-ink/70">No jobs found</h3>
            <p className="text-xs text-ink/40 mt-1 font-medium">Try adjusting your search or filter</p>
            <button
              onClick={() => { setSearch(""); setFilter("All"); setSalaryMin(0); setSortBy("match"); }}
              className="mt-5 px-5 py-2 rounded-xl bg-pine hover:bg-moss text-white text-xs font-semibold transition-colors"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Job cards */}
        {!loading && filtered.map((job) => {
          const dl = deadlineInfo(job.deadline);
          const isSelected = selectedJob?._id === job._id;
          const typeStyle = TYPE_STYLES[job.jobType] || TYPE_STYLES["Full-Time"];

          return (
            <div
              key={job._id}
              onClick={() => setSelectedJob(job)}
              className={`group relative bg-white rounded-2xl border cursor-pointer transition-all duration-200
                hover:shadow-card-hover hover:-translate-y-px
                ${isSelected
                  ? "border-pine shadow-card-hover ring-1 ring-pine/10"
                  : "border-mist hover:border-ink/10"
                }`}
            >
              {/* Selected left bar */}
              {isSelected && (
                <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-pine rounded-full" />
              )}

              {job.isSaved && (
                <div className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center z-10">
                  <Bookmark className="w-3 h-3 text-gold" fill="currentColor" />
                </div>
              )}

              <div className="p-4 sm:p-5">
                <div className="flex gap-3 sm:gap-4 items-start">

                  {/* Company logo */}
                  <img
                    src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={job.company}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-mist object-cover bg-paper/60 shrink-0"
                  />

                  {/* Main content */}
                  <div className="flex-1 min-w-0">

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${typeStyle}`}>
                        {job.jobType}
                      </span>
                      {job.matchPct !== null && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${matchStyle(job.matchPct)}`}>
                          {job.matchPct}% match
                        </span>
                      )}
                      {dl && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${dl.cls}`}>
                          {dl.label}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-[15px] sm:text-base font-bold text-ink truncate leading-snug">
                      {job.title}
                    </h3>

                    {/* Company */}
                    <p className="text-xs text-ink/50 font-medium mt-0.5 truncate">
                      {job.company}
                    </p>

                    {/* Meta – location & exp */}
                    <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-ink/40 font-medium">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" strokeWidth={2.2} />
                          {job.location}
                        </span>
                      )}
                      {job.experienceMin !== undefined && (
                        <span className="flex items-center gap-1">
                          <Users className="w-2.5 h-2.5" strokeWidth={2.2} />
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
                            className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-ink/5 text-ink/55 border border-mist"
                          >
                            {s}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-ink/5 text-ink/40 border border-mist">
                            +{job.skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-mist">

                      {/* Date + Salary */}
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-[11px] text-ink/40 font-medium">
                          {new Date(job.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {(job.salaryMin || job.salaryMax) && (
                          <span className="text-[11px] font-semibold text-pine bg-pine/8 border border-pine/15 px-2.5 py-1 rounded-full">
                            ₹{job.salaryMin ? `${(job.salaryMin / 1000).toFixed(0)}k` : "?"}
                            {" – "}
                            ₹{job.salaryMax ? `${(job.salaryMax / 1000).toFixed(0)}k` : "?"}
                          </span>
                        )}
                      </div>

                      {/* CTA */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pine hover:bg-moss active:scale-95 text-white text-xs font-semibold transition-all shadow-sm"
                      >
                        View Job
                        <ArrowRight className="w-2.5 h-2.5" strokeWidth={2.5} />
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
          <p className="text-center text-[11px] text-ink/40 font-medium pt-1 pb-6">
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
