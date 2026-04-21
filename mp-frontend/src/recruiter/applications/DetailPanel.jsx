import { useEffect, useState } from "react";
import {
  FiClock,
  FiEye,
  FiStar,
  FiX,
  FiDownload,
  FiFileText,
  FiExternalLink,
  FiAward, // ✅ added (replaces emoji)
} from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import API from "../../utils/api";
import { STATUS_CFG, STATUS_ACTIONS } from "./constants";

// Map icon string → react-icon component
const ICON_MAP = {
  clock: <FiClock size={14} />,
  eye: <FiEye size={14} />,
  star: <FiStar size={14} />,
  x: <FiX size={14} />,
  party: <FiAward size={14} />, // ✅ replaced emoji with icon
};

export default function DetailPanel({ app, onClose, onStatusUpdate }) {
  const [status, setStatus] = useState(app.status);
  const [note, setNote] = useState(app.recruiterNote || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setStatus(app.status);
    setNote(app.recruiterNote || "");
  }, [app._id]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem("token");
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

  const snap = app.applicantSnapshot || {};
  const live = app.applicant || {};
  const name = live.name || snap.name || "Unknown";
  const email = live.email || snap.email || "—";
  const phone = app.phone || live.phone || snap.phone || "—";
  const college = live.college || snap.college || "—";
  const branch = live.branch || snap.branch || "—";
  const gradYear = live.graduationYear || snap.graduationYear || "—";
  const cgpa = live.cgpa || snap.cgpa;
  const skills = (live.skills?.length ? live.skills : snap.skills) || [];
  const photo = live.profileImage || snap.profileImage;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const cfg = STATUS_CFG[status] || STATUS_CFG.Pending;
  const currentAction = STATUS_ACTIONS.find((s) => s.value === status);

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
                <img
                  src={photo}
                  alt={name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-blue-100 border-2 border-white shadow-md flex items-center justify-center text-blue-700 font-black text-lg">
                  {initials}
                </div>
              )}
              <div>
                <h2 className="text-lg font-black text-slate-800">{name}</h2>
                <a
                  href={`mailto:${email}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {email}
                </a>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
            >
              <FiX size={16} />
            </button>
          </div>

          <span
            className={`inline-flex items-center gap-2 text-[11px] font-black px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}
          >
            {currentAction && ICON_MAP[currentAction.icon]}
            <span>{status}</span>
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Profile */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Profile
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Phone", phone],
                ["College", college],
                ["Branch", branch],
                ["Grad Year", gradYear],
                ["CGPA", cgpa ? `${cgpa} / 10` : "—"],
              ].map(([label, val]) => (
                <div
                  key={label}
                  className="bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3"
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">
                    {val}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Resume */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Resume
            </h3>
            {app.resume?.url ? (
              <a
                href={
                  app.resume.url.startsWith("http")
                    ? app.resume.url
                    : `${API}${app.resume.url}`
                }
                target="_blank"
                rel="noreferrer"
                download={app.resume.originalName}
                className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-3 hover:bg-indigo-100 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-indigo-200 flex items-center justify-center shrink-0">
                  <FiFileText size={16} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-indigo-700 truncate">
                    {app.resume.originalName || "Resume"}
                  </p>
                </div>
                <FiDownload size={14} />
              </a>
            ) : (
              <p className="text-sm text-slate-400 italic">
                No resume submitted
              </p>
            )}
          </section>

          {/* Update Status */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Update Status
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              {STATUS_ACTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={`flex items-center gap-2 text-xs font-black px-3.5 py-2 rounded-xl border transition
                  ${
                    status === opt.value
                      ? `ring-2 ${STATUS_CFG[opt.value]?.ring} ring-offset-1 scale-105`
                      : ""
                  }
                  ${opt.cls}`}
                >
                  {ICON_MAP[opt.icon]}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm"
            />

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-3 w-full py-3 rounded-2xl bg-blue-600 text-white flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : saved ? (
                <>
                  <FaCheck size={13} /> Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}