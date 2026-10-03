import { useEffect, useState } from "react";
import { FiSearch, FiChevronDown, FiPaperclip, FiFilter, FiX } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import API from "../../utils/api";
import { STATUS_CFG, STAT_TABS } from "./constants";
import SkeletonRow from "./SkeletonRow";
import DetailPanel from "./DetailPanel";

export default function RecruiterApplications() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs]                 = useState([]);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobFilter, setJobFilter]       = useState("all");
  const [search, setSearch]             = useState("");
  const [selected, setSelected]         = useState(null);
  const [statusCounts, setStatusCounts] = useState({});
  const [showFilters, setShowFilters]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = sessionStorage.getItem("token");
        const h = { Authorization: `Bearer ${token}` };
        const [appsRes, jobsRes] = await Promise.all([
          API.get("/api/applications/recruiter", { headers: h }),
          API.get("/api/jobs/recruiter/my-jobs", { headers: h }),
        ]);
        setApplications(appsRes.data?.data || []);
        setStatusCounts(appsRes.data?.statusCounts || {});
        setJobs(jobsRes.data?.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleStatusUpdate = (id, newStatus, newNote) => {
    setApplications((prev) =>
      prev.map((a) => a._id === id ? { ...a, status: newStatus, recruiterNote: newNote } : a)
    );
    if (selected?._id === id) setSelected((p) => ({ ...p, status: newStatus, recruiterNote: newNote }));
  };

  const filtered = applications.filter((a) => {
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    const matchJob    = jobFilter === "all"    || a.job?._id === jobFilter;
    const q = search.toLowerCase();
    const snap = a.applicantSnapshot || {};
    const live = a.applicant || {};
    const matchSearch =
      !q ||
      (live.name  || snap.name  || "").toLowerCase().includes(q) ||
      (live.email || snap.email || "").toLowerCase().includes(q) ||
      (a.job?.title || "").toLowerCase().includes(q);
    return matchStatus && matchJob && matchSearch;
  });

  return (
    <>
      <style>{`
        /* Card hover */
        .app-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .app-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(13,21,18,0.10);
          border-color: #BBDACE;
        }
        .app-card:active { transform: translateY(0); }

        /* Fade-in for cards */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          opacity: 0;
          animation: fadeUp 0.32s ease forwards;
        }

        /* Scrollable tabs without scrollbar */
        .tabs-scroll {
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .tabs-scroll::-webkit-scrollbar { display: none; }

        /* Mobile filter drawer */
        .filter-drawer {
          transition: max-height 0.25s ease, opacity 0.2s ease;
          overflow: hidden;
        }
        .filter-drawer.open  { max-height: 200px; opacity: 1; }
        .filter-drawer.shut  { max-height: 0;     opacity: 0; }

        /* Pulse skeleton */
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #F1EFE7 25%, #E7E4DA 50%, #F1EFE7 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }

        /* Select arrow override */
        .custom-select {
          appearance: none;
          -webkit-appearance: none;
          background-image: none;
        }
      `}</style>

      <div className="min-h-screen bg-paper/60">

        {/* ════════════════════════════════
            TOPBAR
        ════════════════════════════════ */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-mist px-4 sm:px-6 py-3 sm:py-4">

          {/* Row 1: title + mobile filter toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-display text-lg sm:text-xl font-extrabold text-ink tracking-tight leading-tight">
                Applications
              </h1>
              <p className="text-[11px] sm:text-xs text-ink/40 mt-0.5 font-medium">
                {loading ? "Loading…" : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {/* Desktop controls */}
            <div className="hidden sm:flex items-center gap-2">
              {jobs.length > 0 && (
                <div className="relative">
                  <select
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                    className="custom-select bg-paper/60 border border-mist rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-ink/70 outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 cursor-pointer transition-colors"
                  >
                    <option value="all">All Jobs</option>
                    {jobs.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
                  </select>
                  <FiChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/35 pointer-events-none" />
                </div>
              )}

              <div className="relative">
                <FiSearch size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35 pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, job…"
                  className="bg-paper/60 border border-mist rounded-xl pl-9 pr-4 py-2 text-xs text-ink/70 placeholder:text-ink/30 outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 w-52 transition-colors font-medium"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/25 hover:text-ink/50 transition-colors"
                  >
                    <FiX size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile: filter toggle button */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="sm:hidden flex items-center gap-1.5 bg-ink/5 hover:bg-ink/10 text-ink/60 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            >
              <FiFilter size={13} />
              Filters
              {(search || jobFilter !== "all") && (
                <span className="w-1.5 h-1.5 rounded-full bg-pine inline-block" />
              )}
            </button>
          </div>

          {/* Mobile filter drawer */}
          <div className={`filter-drawer ${showFilters ? "open" : "shut"} sm:hidden mt-3 flex flex-col gap-2`}>
            <div className="relative">
              <FiSearch size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, job…"
                className="w-full bg-paper/60 border border-mist rounded-xl pl-9 pr-4 py-2.5 text-sm text-ink/70 placeholder:text-ink/30 outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-colors font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/25 hover:text-ink/50 transition-colors"
                >
                  <FiX size={13} />
                </button>
              )}
            </div>

            {jobs.length > 0 && (
              <div className="relative">
                <select
                  value={jobFilter}
                  onChange={(e) => setJobFilter(e.target.value)}
                  className="custom-select w-full bg-paper/60 border border-mist rounded-xl px-4 py-2.5 pr-8 text-sm font-semibold text-ink/70 outline-none focus:border-pine cursor-pointer transition-colors"
                >
                  <option value="all">All Jobs</option>
                  {jobs.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
                </select>
                <FiChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/35 pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════
            STATUS TABS
        ════════════════════════════════ */}
        <div className="bg-white border-b border-mist px-4 sm:px-6 py-3">
          <div className="tabs-scroll flex gap-2">
            {STAT_TABS.map((t) => {
              const cfg    = STATUS_CFG[t];
              const count  = t === "All" ? applications.length : (statusCounts[t] || 0);
              const active = statusFilter === t;
              return (
                <button
                  key={t}
                  onClick={() => setStatusFilter(t)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap border transition-all duration-150
                    ${active
                      ? t === "All"
                        ? "bg-ink text-white border-ink shadow-sm shadow-ink/20"
                        : `${cfg.bg} ${cfg.color} ${cfg.border} shadow-sm`
                      : "bg-white text-ink/40 border-mist hover:border-ink/20 hover:text-ink/60"
                    }`}
                >
                  {t}
                  <span className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center
                    ${active ? "bg-black/10" : "bg-ink/5 text-ink/40"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════
            APPLICATION LIST
        ════════════════════════════════ */}
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-2.5 sm:gap-3">

          {/* Loading skeletons */}
          {loading && [0, 1, 2, 3].map((i) => <SkeletonRow key={i} />)}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 sm:py-24 px-4">
              <div className="text-5xl mb-4 opacity-80">📭</div>
              <h3 className="text-sm sm:text-base font-bold text-ink/55">
                {applications.length === 0 ? "No applications yet" : "No results found"}
              </h3>
              <p className="text-xs sm:text-sm text-ink/40 mt-1.5 max-w-xs mx-auto leading-relaxed">
                {applications.length === 0
                  ? "Applications appear here when candidates apply to your jobs"
                  : "Try adjusting your search or filters"}
              </p>
              {(search || jobFilter !== "all" || statusFilter !== "All") && (
                <button
                  onClick={() => { setSearch(""); setJobFilter("all"); setStatusFilter("All"); }}
                  className="mt-4 text-xs font-semibold text-pine hover:text-moss underline underline-offset-2 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Cards */}
          {!loading && filtered.map((app, idx) => {
            const snap     = app.applicantSnapshot || {};
            const live     = app.applicant || {};
            const name     = live.name  || snap.name  || "Unknown";
            const email    = live.email || snap.email || "—";
            const photo    = live.profileImage || snap.profileImage;
            const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
            const cfg      = STATUS_CFG[app.status] || STATUS_CFG.Pending;

            return (
              <div
                key={app._id}
                onClick={() => setSelected(app)}
                style={{ animationDelay: `${idx * 35}ms` }}
                className="app-card fade-up bg-white border border-mist rounded-2xl p-4 sm:p-5 flex gap-3 sm:gap-4 items-start sm:items-center cursor-pointer"
              >
                {/* Avatar */}
                <div className="shrink-0 mt-0.5 sm:mt-0">
                  {photo ? (
                    <img
                      src={photo}
                      alt={name}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-mist"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-pine/15 to-pine/25 flex items-center justify-center text-pine font-extrabold text-sm border border-pine/20">
                      {initials}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">

                  {/* Name + NEW badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-extrabold text-ink leading-tight">{name}</span>
                    {!app.seenByRecruiter && (
                      <span className="text-[9px] font-black bg-pine text-white px-2 py-0.5 rounded-full tracking-wider">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <p className="text-[11px] sm:text-xs text-ink/40 truncate mt-0.5 flex items-center gap-1 font-medium">
                    <MdOutlineEmail size={12} className="shrink-0" />
                    {email}
                  </p>

                  {/* Badges row */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                      {app.status}
                    </span>
                    {jobFilter === "all" && app.job?.title && (
                      <span className="text-[10px] sm:text-[11px] text-ink/50 bg-ink/5 px-2.5 py-0.5 sm:py-1 rounded-full font-medium max-w-[160px] truncate">
                        {app.job.title}
                      </span>
                    )}
                    {app.resume?.url && (
                      <span className="text-[10px] sm:text-[11px] text-pine bg-pine/8 border border-pine/20 px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1 font-medium">
                        <FiPaperclip size={9} /> Resume
                      </span>
                    )}
                    {app.coverLetter && (
                      <span className="text-[10px] sm:text-[11px] text-ink/50 bg-ink/5 px-2.5 py-0.5 sm:py-1 rounded-full font-medium">
                        📝 Cover
                      </span>
                    )}
                  </div>
                </div>

                {/* Right col: date + button */}
                <div className="shrink-0 flex flex-col items-end gap-2 self-start sm:self-center">
                  <span className="text-[10px] sm:text-xs text-ink/40 font-medium whitespace-nowrap">
                    {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelected(app); }}
                    className="text-[11px] sm:text-xs font-bold text-pine bg-pine/8 hover:bg-pine/15 active:bg-pine/20 border border-pine/20 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-colors whitespace-nowrap"
                  >
                    Review →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {selected && (
          <DetailPanel
            app={selected}
            onClose={() => setSelected(null)}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </div>
    </>
  );
}