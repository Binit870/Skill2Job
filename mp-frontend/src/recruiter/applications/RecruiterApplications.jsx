import { useEffect, useState } from "react";
import { FiSearch, FiChevronDown, FiPaperclip } from "react-icons/fi";
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

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
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
    <div className="min-h-screen bg-slate-50">

      {/* ── Topbar ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Applications</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {loading ? "Loading…" : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Job filter */}
        {jobs.length > 0 && (
          <div className="relative">
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400 cursor-pointer"
            >
              <option value="all">All Jobs</option>
              {jobs.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
            </select>
            <FiChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <FiSearch size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, job…"
            className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-blue-400 w-48 transition"
          />
        </div>
      </div>

      {/* ── Status tabs ── */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex gap-2 overflow-x-auto">
        {STAT_TABS.map((t) => {
          const cfg    = STATUS_CFG[t];
          const count  = t === "All" ? applications.length : (statusCounts[t] || 0);
          const active = statusFilter === t;
          return (
            <button
              key={t}
              onClick={() => setStatusFilter(t)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black whitespace-nowrap border transition-all
                ${active
                  ? t === "All"
                    ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                    : `${cfg.bg} ${cfg.color} ${cfg.border} shadow-sm`
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
            >
              {t}
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${active ? "bg-black/10" : "bg-slate-100 text-slate-400"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── List ── */}
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col gap-3">
        {loading ? (
          [0, 1, 2, 3].map((i) => <SkeletonRow key={i} />)

        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-base font-bold text-slate-500">
              {applications.length === 0 ? "No applications yet" : "No results found"}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {applications.length === 0 ? "Applications appear here when candidates apply" : "Try adjusting your filters"}
            </p>
          </div>

        ) : (
          filtered.map((app, idx) => {
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
                className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4 items-center cursor-pointer hover:shadow-md hover:shadow-slate-200/60 hover:-translate-y-0.5 hover:border-blue-200 transition-all duration-200"
              >
                {/* Avatar */}
                <div className="shrink-0">
                  {photo ? (
                    <img src={photo} alt={name} className="w-11 h-11 rounded-xl object-cover border border-slate-200" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-sm border border-blue-200">
                      {initials}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-slate-800">{name}</span>
                    {!app.seenByRecruiter && (
                      <span className="text-[9px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full tracking-wider">NEW</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1">
                    <MdOutlineEmail size={12} /> {email}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                      {app.status}
                    </span>
                    {jobFilter === "all" && app.job?.title && (
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{app.job.title}</span>
                    )}
                    {app.resume?.url && (
                      <span className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <FiPaperclip size={10} /> Resume
                      </span>
                    )}
                    {app.coverLetter && (
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">📝 Cover Letter</span>
                    )}
                  </div>
                </div>

                {/* Right */}
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className="text-xs text-slate-400">
                    {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelected(app); }}
                    className="text-xs font-black text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-xl transition"
                  >
                    Review →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selected && (
        <DetailPanel
          app={selected}
          onClose={() => setSelected(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}