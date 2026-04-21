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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .ra-root { font-family: 'Plus Jakarta Sans', sans-serif; }

        /* Card hover */
        .app-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .app-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(16,24,40,0.09);
          border-color: #bfdbfe;
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
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
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

      <div className="ra-root min-h-screen bg-slate-50">

        {/* ════════════════════════════════
            TOPBAR
        ════════════════════════════════ */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 px-4 sm:px-6 py-3 sm:py-4">

          {/* Row 1: title + mobile filter toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight leading-tight">
                Applications
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-medium">
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
                    className="custom-select bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer transition"
                  >
                    <option value="all">All Jobs</option>
                    {jobs.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
                  </select>
                  <FiChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              )}

              <div className="relative">
                <FiSearch size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, job…"
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-700 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 w-52 transition font-medium"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition"
                  >
                    <FiX size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile: filter toggle button */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="sm:hidden flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              <FiFilter size={13} />
              Filters
              {(search || jobFilter !== "all") && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              )}
            </button>
          </div>

          {/* Mobile filter drawer */}
          <div className={`filter-drawer ${showFilters ? "open" : "shut"} sm:hidden mt-3 flex flex-col gap-2`}>
            <div className="relative">
              <FiSearch size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, job…"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition"
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
                  className="custom-select w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400 cursor-pointer transition"
                >
                  <option value="all">All Jobs</option>
                  {jobs.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
                </select>
                <FiChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════
            STATUS TABS
        ════════════════════════════════ */}
        <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3">
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
                        ? "bg-slate-800 text-white border-slate-800 shadow-sm shadow-slate-300"
                        : `${cfg.bg} ${cfg.color} ${cfg.border} shadow-sm`
                      : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600"
                    }`}
                >
                  {t}
                  <span className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center
                    ${active ? "bg-black/10" : "bg-slate-100 text-slate-400"}`}>
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
              <h3 className="text-sm sm:text-base font-bold text-slate-500">
                {applications.length === 0 ? "No applications yet" : "No results found"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                {applications.length === 0
                  ? "Applications appear here when candidates apply to your jobs"
                  : "Try adjusting your search or filters"}
              </p>
              {(search || jobFilter !== "all" || statusFilter !== "All") && (
                <button
                  onClick={() => { setSearch(""); setJobFilter("all"); setStatusFilter("All"); }}
                  className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2 transition"
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
                className="app-card fade-up bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex gap-3 sm:gap-4 items-start sm:items-center cursor-pointer"
              >
                {/* Avatar */}
                <div className="shrink-0 mt-0.5 sm:mt-0">
                  {photo ? (
                    <img
                      src={photo}
                      alt={name}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-extrabold text-sm border border-blue-200">
                      {initials}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">

                  {/* Name + NEW badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-extrabold text-slate-800 leading-tight">{name}</span>
                    {!app.seenByRecruiter && (
                      <span className="text-[9px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full tracking-wider">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <p className="text-[11px] sm:text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1 font-medium">
                    <MdOutlineEmail size={12} className="shrink-0" />
                    {email}
                  </p>

                  {/* Badges row */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                      {app.status}
                    </span>
                    {jobFilter === "all" && app.job?.title && (
                      <span className="text-[10px] sm:text-[11px] text-slate-500 bg-slate-100 px-2.5 py-0.5 sm:py-1 rounded-full font-medium max-w-[160px] truncate">
                        {app.job.title}
                      </span>
                    )}
                    {app.resume?.url && (
                      <span className="text-[10px] sm:text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1 font-medium">
                        <FiPaperclip size={9} /> Resume
                      </span>
                    )}
                    {app.coverLetter && (
                      <span className="text-[10px] sm:text-[11px] text-slate-500 bg-slate-100 px-2.5 py-0.5 sm:py-1 rounded-full font-medium">
                        📝 Cover
                      </span>
                    )}
                  </div>
                </div>

                {/* Right col: date + button */}
                <div className="shrink-0 flex flex-col items-end gap-2 self-start sm:self-center">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium whitespace-nowrap">
                    {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelected(app); }}
                    className="text-[11px] sm:text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border border-blue-200 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl transition whitespace-nowrap"
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