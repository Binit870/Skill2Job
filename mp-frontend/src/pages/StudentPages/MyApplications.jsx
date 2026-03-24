import { useEffect, useState } from "react";
import API from "../../utils/api";

const STATUS_CFG = {
  Pending:     { icon: "🕐", color: "text-slate-600",  bg: "bg-slate-100",   border: "border-slate-200",  left: "border-l-slate-400"  },
  Reviewed:    { icon: "👁️",  color: "text-blue-700",   bg: "bg-blue-50",     border: "border-blue-200",   left: "border-l-blue-500"   },
  Shortlisted: { icon: "⭐", color: "text-amber-700",  bg: "bg-amber-50",    border: "border-amber-200",  left: "border-l-amber-500"  },
  Rejected:    { icon: "✕",  color: "text-red-600",    bg: "bg-red-50",      border: "border-red-200",    left: "border-l-red-400"    },
  Hired:       { icon: "🎉", color: "text-green-700",  bg: "bg-green-50",    border: "border-green-200",  left: "border-l-green-500"  },
};

const TABS = ["All", "Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"];

// ── Skeleton ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
        <div className="flex-1 flex flex-col gap-2.5">
          <div className="h-4 w-2/5 rounded-lg bg-slate-200" />
          <div className="h-3 w-1/4 rounded-lg bg-slate-200" />
          <div className="flex gap-2 mt-1">
            <div className="h-6 w-20 rounded-full bg-slate-200" />
            <div className="h-6 w-24 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Withdraw Confirm Modal ────────────────────────────────────────────────
function WithdrawModal({ app, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <polyline points="3 6 5 6 21 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            <path d="M19 6l-1 14H6L5 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10 11v6M14 11v6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h3 className="text-lg font-black text-slate-800 text-center mb-2">Withdraw Application?</h3>
        <p className="text-sm text-slate-500 text-center leading-relaxed mb-6">
          Your application for <strong className="text-slate-700">{app?.job?.title}</strong> will be permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            Keep It
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-black transition flex items-center justify-center gap-2"
          >
            {loading && <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
            {loading ? "Withdrawing…" : "Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [tab, setTab]                   = useState("All");
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [withdrawing, setWithdrawing]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/api/applications/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data?.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleWithdraw = async () => {
    setWithdrawing(true);
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/api/applications/${withdrawTarget._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications((p) => p.filter((a) => a._id !== withdrawTarget._id));
      setWithdrawTarget(null);
    } catch (e) {
      console.error(e);
    } finally {
      setWithdrawing(false);
    }
  };

  // Counts
  const counts = { All: applications.length };
  applications.forEach((a) => { counts[a.status] = (counts[a.status] || 0) + 1; });

  const filtered = tab === "All" ? applications : applications.filter((a) => a.status === tab);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Topbar ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">My Applications</h1>
          <p className="text-xs text-slate-400 mt-0.5">Track all your job applications</p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
          {loading ? "…" : `${applications.length} total`}
        </span>
      </div>

      {/* ── Status tabs ── */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex gap-2 overflow-x-auto">
        <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
        {TABS.map((t) => {
          const cfg    = STATUS_CFG[t];
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black whitespace-nowrap border transition-all
                ${active
                  ? t === "All"
                    ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                    : `${cfg.bg} ${cfg.color} ${cfg.border} shadow-sm`
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
            >
              {cfg && <span className={`w-1.5 h-1.5 rounded-full ${active && t !== "All" ? "bg-current opacity-70" : "bg-slate-300"}`} />}
              {t}
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${active ? "bg-black/10" : "bg-slate-100 text-slate-400"}`}>
                {counts[t] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Cards ── */}
      <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col gap-4">

        {loading ? (
          [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)

        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-base font-bold text-slate-500">
              {tab === "All" ? "No applications yet" : `No ${tab} applications`}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {tab === "All" ? "Start applying for jobs to track them here" : "Switch to another tab"}
            </p>
          </div>

        ) : (
          filtered.map((app, idx) => {
            const job        = app.job || {};
            const cfg        = STATUS_CFG[app.status] || STATUS_CFG.Pending;
            const canWithdraw = !["Shortlisted", "Hired"].includes(app.status);

            return (
              <div
                key={app._id}
                style={{ animationDelay: `${idx * 40}ms` }}
                className={`bg-white border border-slate-200 border-l-4 ${cfg.left} rounded-2xl p-5 hover:shadow-md hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-200`}
              >
                <div className="flex gap-4 items-start">
                  <img
                    src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={job.company}
                    className="w-12 h-12 rounded-xl border border-slate-200 object-cover bg-slate-50 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-slate-800 truncate">{job.title || "Untitled Job"}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{job.company}</p>
                      </div>
                      {/* Status badge */}
                      <span className={`shrink-0 flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        {cfg.icon} {app.status}
                      </span>
                    </div>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.location && (
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">📍 {job.location}</span>
                      )}
                      {job.jobType && (
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{job.jobType}</span>
                      )}
                      {(job.salaryMin || job.salaryMax) && (
                        <span className="text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                          ₹{job.salaryMin ? `${(job.salaryMin/1000).toFixed(0)}k` : "?"}–₹{job.salaryMax ? `${(job.salaryMax/1000).toFixed(0)}k` : "?"}
                        </span>
                      )}
                      {app.resume?.url && (
                        <span className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">📎 Resume</span>
                      )}
                    </div>

                    {/* Recruiter note */}
                    {app.recruiterNote && (
                      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-wide mb-1">Recruiter Note</p>
                        <p className="text-xs text-amber-800 leading-relaxed">{app.recruiterNote}</p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-400">
                        Applied {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      {canWithdraw && (
                        <button
                          onClick={() => setWithdrawTarget(app)}
                          className="text-xs font-bold text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {withdrawTarget && (
        <WithdrawModal
          app={withdrawTarget}
          onConfirm={handleWithdraw}
          onClose={() => setWithdrawTarget(null)}
          loading={withdrawing}
        />
      )}
    </div>
  );
}