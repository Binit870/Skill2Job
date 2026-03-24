import { useEffect, useState } from "react";
import API from "../../utils/api";

const STATUS_CFG = {
  Pending:     { color: "text-slate-600",  bg: "bg-slate-100",  border: "border-slate-200",  ring: "ring-slate-300"  },
  Reviewed:    { color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-200",   ring: "ring-blue-300"   },
  Shortlisted: { color: "text-amber-700",  bg: "bg-amber-50",   border: "border-amber-200",  ring: "ring-amber-300"  },
  Rejected:    { color: "text-red-600",    bg: "bg-red-50",     border: "border-red-200",    ring: "ring-red-300"    },
  Hired:       { color: "text-green-700",  bg: "bg-green-50",   border: "border-green-200",  ring: "ring-green-400"  },
};

const STATUS_ACTIONS = [
  { value: "Pending",     label: "Pending",    icon: "🕐", cls: "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"   },
  { value: "Reviewed",    label: "Reviewed",   icon: "👁️",  cls: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"       },
  { value: "Shortlisted", label: "Shortlist",  icon: "⭐", cls: "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300"    },
  { value: "Rejected",    label: "Reject",     icon: "✕",  cls: "bg-red-50 hover:bg-red-100 text-red-600 border-red-300"           },
  { value: "Hired",       label: "Hire",       icon: "🎉", cls: "bg-green-50 hover:bg-green-100 text-green-700 border-green-300"   },
];

// ── Detail Drawer ─────────────────────────────────────────────────────────
function DetailPanel({ app, onClose, onStatusUpdate }) {
  const [status, setStatus] = useState(app.status);
  const [note, setNote]     = useState(app.recruiterNote || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  useEffect(() => {
    setStatus(app.status);
    setNote(app.recruiterNote || "");
  }, [app._id]);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await API.patch(
        `/api/applications/${app._id}/status`,
        { status, recruiterNote: note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onStatusUpdate(app._id, status, note);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Prefer live populated data, fall back to snapshot
  const snap     = app.applicantSnapshot || {};
  const live     = app.applicant || {};
  const name     = live.name           || snap.name           || "Unknown";
  const email    = live.email          || snap.email          || "—";
  const phone    = app.phone           || live.phone          || snap.phone          || "—";
  const college  = live.college        || snap.college        || "—";
  const branch   = live.branch         || snap.branch         || "—";
  const gradYear = live.graduationYear || snap.graduationYear || "—";
  const cgpa     = live.cgpa           || snap.cgpa;
  const skills   = (live.skills?.length ? live.skills : snap.skills) || [];
  const photo    = live.profileImage   || snap.profileImage;
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const cfg      = STATUS_CFG[status]  || STATUS_CFG.Pending;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[480px] h-full bg-white shadow-2xl flex flex-col animate-[panelIn_0.3s_cubic-bezier(0.34,1.1,0.64,1)]">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {photo ? (
                <img src={photo} alt={name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md" />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-blue-100 border-2 border-white shadow-md flex items-center justify-center text-blue-700 font-black text-lg">
                  {initials}
                </div>
              )}
              <div>
                <h2 className="text-lg font-black text-slate-800">{name}</h2>
                <a href={`mailto:${email}`} className="text-xs text-blue-600 hover:underline">{email}</a>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-lg transition"
            >
              ×
            </button>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
            {STATUS_ACTIONS.find((s) => s.value === status)?.icon} {status}
          </span>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Profile Info */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Profile</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Phone",      phone],
                ["College",    college],
                ["Branch",     branch],
                ["Grad Year",  gradYear],
                ["CGPA",       cgpa ? `${cgpa} / 10` : "—"],
              ].map(([label, val]) => (
                <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{val}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span key={i} className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Resume */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Resume</h3>
            {app.resume?.url ? (
              <a
                href={app.resume.url.startsWith("http") ? app.resume.url : `${API}${app.resume.url}`}
                target="_blank" rel="noreferrer"
                download={app.resume.originalName}
                className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-3 hover:bg-indigo-100 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-indigo-200 flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-indigo-600">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-indigo-700 truncate">{app.resume.originalName || "Resume"}</p>
                  <p className="text-xs text-indigo-400">{app.resume.source === "profile" ? "From profile" : "Uploaded for this job"}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-indigo-400 group-hover:text-indigo-600 transition shrink-0">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            ) : (
              <p className="text-sm text-slate-400 italic">No resume submitted</p>
            )}
          </section>

          {/* Portfolio */}
          {app.portfolioUrl && (
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Portfolio / LinkedIn</h3>
              <a href={app.portfolioUrl} target="_blank" rel="noreferrer"
                className="text-sm text-blue-600 hover:underline break-all">
                {app.portfolioUrl}
              </a>
            </section>
          )}

          {/* Cover letter */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Cover Letter</h3>
            {app.coverLetter ? (
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 border border-slate-100 rounded-2xl p-4">
                {app.coverLetter}
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic">No cover letter provided</p>
            )}
          </section>

          {/* Applied for */}
          {app.job?.title && (
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Applied For</h3>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <img
                  src={app.job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                  alt="" className="w-8 h-8 rounded-lg border border-slate-200 object-cover bg-white"
                />
                <div>
                  <p className="text-sm font-bold text-slate-700">{app.job.title}</p>
                  <p className="text-xs text-slate-400">{app.job.location} · {app.job.jobType}</p>
                </div>
              </div>
            </section>
          )}

          {/* Update Status */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Update Status</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {STATUS_ACTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={`flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl border transition
                    ${status === opt.value ? `ring-2 ${STATUS_CFG[opt.value]?.ring} ring-offset-1 scale-105` : ""}
                    ${opt.cls}`}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Add a private note about this applicant (only you can see this)…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 resize-none transition"
            />

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-3 w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-black transition flex items-center justify-center gap-2 shadow-md shadow-blue-200"
            >
              {saving ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : saved ? (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg> Saved!</>
              ) : "Save Changes"}
            </button>
          </section>
        </div>
      </div>

      <style>{`@keyframes panelIn { from{transform:translateX(100%)} to{transform:translateX(0)} }`}</style>
    </div>
  );
}

// ── Skeleton row ──────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4 animate-pulse">
      <div className="w-11 h-11 rounded-xl bg-slate-200 shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-4 w-1/3 rounded-lg bg-slate-200" />
        <div className="h-3 w-1/4 rounded-lg bg-slate-200" />
        <div className="flex gap-2 mt-1">
          <div className="h-6 w-20 rounded-full bg-slate-200" />
          <div className="h-6 w-16 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
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

  const STAT_TABS = ["All", "Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"];

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
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
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
                  <p className="text-xs text-slate-400 truncate mt-0.5">{email}</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                      {app.status}
                    </span>
                    {jobFilter === "all" && app.job?.title && (
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{app.job.title}</span>
                    )}
                    {app.resume?.url && (
                      <span className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">📎 Resume</span>
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