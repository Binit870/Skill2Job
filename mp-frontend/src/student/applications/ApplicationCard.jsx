import {
  FiMapPin, FiBriefcase, FiDollarSign, FiPaperclip, FiTrash2,
} from "react-icons/fi";
import { STATUS_CFG } from "./constants";

export default function ApplicationCard({ app, idx, onWithdraw }) {
  const job         = app.job || {};
  const cfg         = STATUS_CFG[app.status] || STATUS_CFG.Pending;
  const canWithdraw = !["Shortlisted", "Hired"].includes(app.status);
  const StatusIcon  = cfg.icon;

  return (
    <div
      style={{ animationDelay: `${idx * 40}ms` }}
      className={`group bg-white border border-slate-100 border-l-4 ${cfg.left} rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-0.5 transition-all duration-250 shadow-sm`}
    >
      <div className="flex gap-3 sm:gap-4 items-start">
        {/* Logo */}
        <div className="relative shrink-0">
          <img
            src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            alt={job.company}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-slate-100 object-cover bg-slate-50"
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-black text-slate-800 truncate group-hover:text-green-700 transition-colors duration-200">
                {job.title || "Untitled Job"}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">{job.company}</p>
            </div>

            {/* Status badge */}
            <span className={`shrink-0 flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-black px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border ${cfg.badge}`}>
              <StatusIcon size={10} />
              <span className="hidden xs:inline">{app.status}</span>
              <span className="xs:hidden">{app.status}</span>
            </span>
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-3">
            {job.location && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-100 px-2 sm:px-2.5 py-1 rounded-full font-medium">
                <FiMapPin size={9} className="text-green-500" />
                {job.location}
              </span>
            )}
            {job.jobType && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-100 px-2 sm:px-2.5 py-1 rounded-full font-medium">
                <FiBriefcase size={9} className="text-green-500" />
                {job.jobType}
              </span>
            )}
            {(job.salaryMin || job.salaryMax) && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 sm:px-2.5 py-1 rounded-full">
                <FiDollarSign size={9} />
                ₹{job.salaryMin ? `${(job.salaryMin / 1000).toFixed(0)}k` : "?"}–₹{job.salaryMax ? `${(job.salaryMax / 1000).toFixed(0)}k` : "?"}
              </span>
            )}
            {app.resume?.url && (
              <span className="flex items-center gap-1 text-[11px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 sm:px-2.5 py-1 rounded-full font-medium">
                <FiPaperclip size={9} /> Resume
              </span>
            )}
          </div>

          {/* Recruiter note */}
          {app.recruiterNote && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-wide mb-1">
                Recruiter Note
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">{app.recruiterNote}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 font-medium">
              Applied{" "}
              {new Date(app.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            {canWithdraw && (
              <button
                onClick={() => onWithdraw(app)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 hover:bg-red-50 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all duration-200"
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
}