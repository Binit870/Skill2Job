import { useEffect, useState } from "react";
import API from "../../utils/api";
import {
  FiClock, FiEye, FiStar, FiX, FiGift,
  FiMapPin, FiBriefcase, FiDollarSign, FiPaperclip,
  FiTrash2, FiLoader, FiClipboard, FiChevronRight
} from "react-icons/fi";

const STATUS_CFG = {
  Pending:     { icon: FiClock,     color: "text-slate-500",  bg: "bg-slate-50",    border: "border-slate-200",  left: "border-l-slate-300",  badge: "bg-slate-100 text-slate-600 border-slate-200"   },
  Reviewed:    { icon: FiEye,       color: "text-blue-600",   bg: "bg-blue-50",     border: "border-blue-200",   left: "border-l-blue-400",   badge: "bg-blue-50 text-blue-700 border-blue-200"       },
  Shortlisted: { icon: FiStar,      color: "text-amber-600",  bg: "bg-amber-50",    border: "border-amber-200",  left: "border-l-amber-400",  badge: "bg-amber-50 text-amber-700 border-amber-200"    },
  Rejected:    { icon: FiX,         color: "text-red-500",    bg: "bg-red-50",      border: "border-red-200",    left: "border-l-red-400",    badge: "bg-red-50 text-red-600 border-red-200"          },
  Hired:       { icon: FiGift,      color: "text-green-600",  bg: "bg-green-50",    border: "border-green-200",  left: "border-l-green-500",  badge: "bg-green-50 text-green-700 border-green-200"    },
};

const TABS = ["All", "Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"];

const TAB_COLORS = {
  All:         { active: "bg-green-600 text-white border-green-600 shadow-green-200 shadow-md" },
  Pending:     { active: "bg-slate-100 text-slate-700 border-slate-300" },
  Reviewed:    { active: "bg-blue-50 text-blue-700 border-blue-300" },
  Shortlisted: { active: "bg-amber-50 text-amber-700 border-amber-300" },
  Rejected:    { active: "bg-red-50 text-red-600 border-red-300" },
  Hired:       { active: "bg-green-50 text-green-700 border-green-300" },
};

// ── Skeleton ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 animate-pulse shadow-sm">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
        <div className="flex-1 flex flex-col gap-2.5">
          <div className="h-4 w-2/5 rounded-lg bg-slate-100" />
          <div className="h-3 w-1/4 rounded-lg bg-slate-100" />
          <div className="flex gap-2 mt-1">
            <div className="h-6 w-20 rounded-full bg-slate-100" />
            <div className="h-6 w-24 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Withdraw Confirm Modal ────────────────────────────────────────────────
function WithdrawModal({ app, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full border border-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
          <FiTrash2 size={22} className="text-red-500" />
        </div>
        <h3 className="text-lg font-black text-slate-800 text-center mb-2">Withdraw Application?</h3>
        <p className="text-sm text-slate-500 text-center leading-relaxed mb-6">
          Your application for <strong className="text-slate-700">{app?.job?.title}</strong> will be permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all duration-200"
          >
            Keep It
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-black transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading
              ? <FiLoader size={15} className="animate-spin" />
              : <FiTrash2 size={15} />
            }
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

  const counts = { All: applications.length };
  applications.forEach((a) => { counts[a.status] = (counts[a.status] || 0) + 1; });

  const filtered = tab === "All" ? applications : applications.filter((a) => a.status === tab);

  return (
   <div className="min-h-screen overflow-y-auto bg-white [&::-webkit-scrollbar]:hidden">

      {/* ── Topbar ── */}
      <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shadow-md shadow-green-200">
            <FiBriefcase size={17} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">My Applications</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">Track all your job applications</p>
          </div>
        </div>
        <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3.5 py-1.5 rounded-full">
          {loading ? "—" : `${applications.length} total`}
        </span>
      </div>

      {/* ── Status tabs ── */}
      <div className="sticky top-[73px] z-10 bg-white border-b border-slate-100 px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none;}`}</style>
        {TABS.map((t) => {
          const cfg    = STATUS_CFG[t];
          const active = tab === t;
          const Icon   = cfg?.icon;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-200
                ${active
                  ? TAB_COLORS[t]?.active
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
            >
              {Icon && <Icon size={11} />}
              {t}
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ml-0.5
                ${active ? "bg-black/10" : "bg-slate-100 text-slate-400"}`}>
                {counts[t] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Cards ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-3">

        {loading ? (
          [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)

        ) : filtered.length === 0 ? (
          <div className="text-center py-28 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-4 shadow-sm">
              <FiClipboard size={28} className="text-green-400" />
            </div>
            <h3 className="text-base font-bold text-slate-600">
              {tab === "All" ? "No applications yet" : `No ${tab} applications`}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {tab === "All" ? "Start applying for jobs to track them here" : "Switch to another tab"}
            </p>
          </div>

        ) : (
          filtered.map((app, idx) => {
            const job         = app.job || {};
            const cfg         = STATUS_CFG[app.status] || STATUS_CFG.Pending;
            const canWithdraw = !["Shortlisted", "Hired"].includes(app.status);
            const StatusIcon  = cfg.icon;

            return (
              <div
                key={app._id}
                style={{ animationDelay: `${idx * 40}ms` }}
                className={`group bg-white border border-slate-100 border-l-4 ${cfg.left} rounded-2xl p-5 hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-0.5 transition-all duration-250 shadow-sm`}
              >
                <div className="flex gap-4 items-start">
                  {/* Logo */}
                  <div className="relative shrink-0">
                    <img
                      src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                      alt={job.company}
                      className="w-12 h-12 rounded-xl border border-slate-100 object-cover bg-slate-50"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-black text-slate-800 truncate group-hover:text-green-700 transition-colors duration-200">
                          {job.title || "Untitled Job"}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">{job.company}</p>
                      </div>

                      {/* Status badge */}
                      <span className={`shrink-0 flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1.5 rounded-full border ${cfg.badge}`}>
                        <StatusIcon size={11} />
                        {app.status}
                      </span>
                    </div>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.location && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full font-medium">
                          <FiMapPin size={9} className="text-green-500" /> {job.location}
                        </span>
                      )}
                      {job.jobType && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full font-medium">
                          <FiBriefcase size={9} className="text-green-500" /> {job.jobType}
                        </span>
                      )}
                      {(job.salaryMin || job.salaryMax) && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                          <FiDollarSign size={9} />
                          ₹{job.salaryMin ? `${(job.salaryMin/1000).toFixed(0)}k` : "?"}–₹{job.salaryMax ? `${(job.salaryMax/1000).toFixed(0)}k` : "?"}
                        </span>
                      )}
                      {app.resume?.url && (
                        <span className="flex items-center gap-1 text-[11px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full font-medium">
                          <FiPaperclip size={9} /> Resume
                        </span>
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
                      <span className="text-[11px] text-slate-400 font-medium">
                        Applied {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      {canWithdraw && (
                        <button
                          onClick={() => setWithdrawTarget(app)}
                          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all duration-200"
                        >
                          <FiTrash2 size={11} />
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