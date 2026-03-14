import { useState, useEffect } from "react";
import axios from "axios";

/* ── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800&family=Literata:ital,wght@0,400;0,500;1,400&display=swap');

  /* Overlay */
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
  @keyframes slideRight { from{transform:translateX(100%)} to{transform:translateX(0)} }
  @keyframes slideDown{ from{transform:translateY(-20px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes scaleIn { from{transform:scale(0.95);opacity:0} to{transform:scale(1);opacity:1} }

  .jd-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(6px);
    animation: fadeIn 0.25s ease;
    display: flex; justify-content: flex-end;
  }

  .jd-panel {
    width: 100%; max-width: 560px; height: 100vh;
    background: #0d0f14;
    border-left: 1px solid rgba(255,255,255,0.08);
    display: flex; flex-direction: column;
    font-family: 'Cabinet Grotesk', sans-serif;
    animation: slideRight 0.32s cubic-bezier(0.34,1.1,0.64,1);
    overflow: hidden;
  }

  /* Header */
  .jd-header {
    padding: 24px 28px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: #141720;
    flex-shrink: 0;
  }
  .jd-close {
    position: absolute; top: 20px; right: 24px;
    width: 32px; height: 32px; border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    color: #94a3b8; cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.15s;
  }
  .jd-close:hover { background: rgba(255,255,255,0.1); color: #f1f5f9; }

  .jd-company-row {
    display: flex; align-items: center; gap: 14px; margin-bottom: 14px;
  }
  .jd-company-logo {
    width: 56px; height: 56px; border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.1); object-fit: cover;
    background: #1e2330; flex-shrink: 0;
  }
  .jd-company-name { font-size: 13.5px; color: #64748b; font-weight: 500; margin-bottom: 2px; }
  .jd-title { font-size: 21px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.02em; line-height: 1.2; }

  /* Type badge */
  .jd-type {
    display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.05em;
    text-transform: uppercase; padding: 3px 9px; border-radius: 6px; margin-bottom: 4px;
  }
  .jd-type-full   { background: rgba(99,102,241,0.12); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.2); }
  .jd-type-part   { background: rgba(168,85,247,0.12); color: #c4b5fd; border: 1px solid rgba(168,85,247,0.2); }
  .jd-type-intern { background: rgba(234,179,8,0.12);  color: #fde68a; border: 1px solid rgba(234,179,8,0.2); }
  .jd-type-remote { background: rgba(20,184,166,0.12); color: #5eead4; border: 1px solid rgba(20,184,166,0.2); }

  /* Chips row */
  .jd-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  .jd-chip {
    display: flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 8px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    font-size: 12.5px; color: #94a3b8; font-weight: 500;
  }
  .jd-chip svg { opacity: 0.6; }
  .jd-salary-chip {
    background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.2); color: #4ade80; font-weight: 700;
  }
  .jd-deadline-chip-urgent { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.2); color: #f87171; }
  .jd-deadline-chip-soon   { background: rgba(234,179,8,0.08);  border-color: rgba(234,179,8,0.2);  color: #fbbf24; }
  .jd-deadline-chip-ok     { background: rgba(34,197,94,0.08);  border-color: rgba(34,197,94,0.2);  color: #4ade80; }

  /* Scrollable body */
  .jd-body {
    flex: 1; overflow-y: auto; padding: 24px 28px;
    scrollbar-width: thin; scrollbar-color: #1e2330 transparent;
  }
  .jd-body::-webkit-scrollbar { width: 4px; }
  .jd-body::-webkit-scrollbar-thumb { background: #1e2330; border-radius: 4px; }

  /* Section */
  .jd-section { margin-bottom: 28px; }
  .jd-section-title {
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
    color: #475569; margin-bottom: 12px; padding-bottom: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  /* Stats grid */
  .jd-stats {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  }
  .jd-stat {
    background: #141720; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px; padding: 12px 14px;
  }
  .jd-stat-label { font-size: 11px; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
  .jd-stat-value { font-size: 15px; font-weight: 700; color: #e2e8f0; margin-top: 4px; }

  /* Description */
  .jd-description {
    font-family: 'Literata', serif; font-size: 14.5px; line-height: 1.75;
    color: #94a3b8; white-space: pre-wrap;
  }

  /* Skills */
  .jd-skills { display: flex; flex-wrap: wrap; gap: 8px; }
  .jd-skill {
    padding: 5px 12px; border-radius: 20px; font-size: 12.5px; font-weight: 600;
    background: rgba(59,130,246,0.08); color: #93c5fd;
    border: 1px solid rgba(59,130,246,0.15);
    transition: all 0.15s;
  }
  .jd-skill:hover { background: rgba(59,130,246,0.15); border-color: rgba(59,130,246,0.3); }

  /* Company info */
  .jd-company-card {
    background: #141720; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; padding: 16px;
  }
  .jd-company-card-name { font-size: 14px; font-weight: 700; color: #f1f5f9; margin-bottom: 6px; }
  .jd-company-card-desc { font-size: 13px; color: #64748b; line-height: 1.6; }
  .jd-company-link {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12.5px; color: #3b82f6; margin-top: 10px; text-decoration: none; font-weight: 500;
    transition: color 0.15s;
  }
  .jd-company-link:hover { color: #60a5fa; }

  /* Footer / apply */
  .jd-footer {
    padding: 18px 28px;
    border-top: 1px solid rgba(255,255,255,0.06);
    background: #141720; flex-shrink: 0;
    display: flex; align-items: center; gap: 12px;
  }
  .jd-apply-btn {
    flex: 1; padding: 13px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #fff; font-family: 'Cabinet Grotesk', sans-serif;
    font-weight: 700; font-size: 15px; cursor: pointer;
    box-shadow: 0 4px 18px rgba(29,78,216,0.35);
    transition: all 0.2s; letter-spacing: -0.01em;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .jd-apply-btn:hover:not(:disabled) { 
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    box-shadow: 0 6px 24px rgba(29,78,216,0.5); transform: translateY(-1px);
  }
  .jd-apply-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .jd-apply-btn.applied {
    background: linear-gradient(135deg, #16a34a, #15803d);
    box-shadow: 0 4px 18px rgba(22,163,74,0.3);
  }
  .jd-save-btn {
    width: 46px; height: 46px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04); color: #64748b;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.18s;
  }
  .jd-save-btn:hover { border-color: #f59e0b; color: #f59e0b; background: rgba(245,158,11,0.08); }
  .jd-save-btn.saved { border-color: #f59e0b; color: #f59e0b; background: rgba(245,158,11,0.1); }

  /* ── Apply Modal ── */
  .jd-modal-bg {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center; padding: 20px;
    animation: fadeIn 0.2s ease;
  }
  .jd-modal {
    background: #141720; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px; padding: 32px; width: 100%; max-width: 480px;
    animation: scaleIn 0.25s cubic-bezier(0.34,1.2,0.64,1);
    font-family: 'Cabinet Grotesk', sans-serif;
  }
  .jd-modal-title { font-size: 20px; font-weight: 800; color: #f1f5f9; margin-bottom: 4px; }
  .jd-modal-sub { font-size: 13.5px; color: #64748b; margin-bottom: 24px; }

  .jd-modal label {
    display: block; font-size: 11.5px; font-weight: 700; color: #475569;
    text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;
  }
  .jd-modal-field {
    width: 100%; background: #0d0f14; border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 10px; padding: 11px 14px;
    color: #e2e8f0; font-family: 'Cabinet Grotesk', sans-serif; font-size: 14px;
    outline: none; transition: border-color 0.18s; margin-bottom: 16px;
  }
  .jd-modal-field:focus { border-color: #3b82f6; }
  .jd-modal-field::placeholder { color: #334155; }

  .jd-modal-actions { display: flex; gap: 10px; margin-top: 8px; }
  .jd-modal-cancel {
    flex: 1; padding: 11px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    background: transparent; color: #64748b;
    font-family: 'Cabinet Grotesk', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.18s;
  }
  .jd-modal-cancel:hover { border-color: rgba(255,255,255,0.2); color: #94a3b8; }
  .jd-modal-submit {
    flex: 2; padding: 11px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #fff; font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 14px; font-weight: 700; cursor: pointer;
    transition: all 0.2s; box-shadow: 0 4px 14px rgba(29,78,216,0.3);
  }
  .jd-modal-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(29,78,216,0.45); }
  .jd-modal-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Success state */
  @keyframes bounceIn { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
  .jd-success {
    text-align: center; padding: 12px 0;
  }
  .jd-success-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(34,197,94,0.12); border: 2px solid rgba(34,197,94,0.3);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px; animation: bounceIn 0.5s ease;
  }
  .jd-success-title { font-size: 20px; font-weight: 800; color: #f1f5f9; margin-bottom: 6px; }
  .jd-success-sub { font-size: 13.5px; color: #64748b; line-height: 1.5; }

  /* File upload area */
  .jd-upload-area {
    border: 1.5px dashed rgba(255,255,255,0.1); border-radius: 10px;
    padding: 16px; text-align: center; cursor: pointer;
    transition: all 0.18s; margin-bottom: 16px; background: #0d0f14;
  }
  .jd-upload-area:hover { border-color: #3b82f6; background: rgba(59,130,246,0.04); }
  .jd-upload-area input { display: none; }
  .jd-upload-text { font-size: 13px; color: #475569; margin-top: 6px; }
  .jd-upload-name { font-size: 12.5px; color: #4ade80; margin-top: 4px; }
`;

/* ── Deadline helper ─────────────────────────────────────────────────────── */
const deadlineCls = (deadline) => {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 0) return null;
  if (days <= 3) return { label: `${days}d left`, cls: "urgent" };
  if (days <= 7) return { label: `${days}d left`, cls: "soon" };
  return { label: `${days}d left`, cls: "ok" };
};

const typeClass = (t) => {
  if (t === "Full-Time") return "jd-type-full";
  if (t === "Part-Time") return "jd-type-part";
  if (t === "Internship") return "jd-type-intern";
  if (t === "Remote") return "jd-type-remote";
  return "jd-type-full";
};

/* ── Apply Modal ─────────────────────────────────────────────────────────── */
function ApplyModal({ job, onClose, onSuccess }) {
  const [form, setForm] = useState({ coverLetter: "", resumeFile: null });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) setForm(p => ({ ...p, resumeFile: f }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("jobId", job._id);
      fd.append("coverLetter", form.coverLetter);
      if (form.resumeFile) fd.append("resume", form.resumeFile);

      await axios.post("http://localhost:5000/api/applications", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmitted(true);
      setTimeout(() => { onSuccess(); onClose(); }, 2200);
    } catch (err) {
      console.error(err);
      // you can add toast here
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="jd-modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="jd-modal">
        {submitted ? (
          <div className="jd-success">
            <div className="jd-success-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="jd-success-title">Application Sent! 🎉</div>
            <div className="jd-success-sub">
              Your application for <strong style={{ color: "#e2e8f0" }}>{job.title}</strong> at{" "}
              <strong style={{ color: "#e2e8f0" }}>{job.company}</strong> has been submitted.
              <br />We'll notify you of any updates.
            </div>
          </div>
        ) : (
          <>
            <div className="jd-modal-title">Apply for this Role</div>
            <div className="jd-modal-sub">{job.title} · {job.company}</div>

            <label>Resume / CV</label>
            <div
              className="jd-upload-area"
              onClick={() => document.getElementById("jd-resume-input").click()}
            >
              <input id="jd-resume-input" type="file" accept=".pdf,.doc,.docx" onChange={handleFile} />
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto", display: "block" }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="jd-upload-text">Click to upload PDF or DOC</div>
              {form.resumeFile && <div className="jd-upload-name">✓ {form.resumeFile.name}</div>}
            </div>

            <label>Cover Letter <span style={{ color: "#334155", textTransform: "none", fontSize: "11px", fontWeight: 400 }}>(optional)</span></label>
            <textarea
              className="jd-modal-field"
              rows={4}
              placeholder="Tell the recruiter why you're a great fit for this role…"
              value={form.coverLetter}
              onChange={(e) => setForm(p => ({ ...p, coverLetter: e.target.value }))}
              style={{ resize: "vertical" }}
            />

            <div style={{
              background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)",
              borderRadius: "8px", padding: "10px 14px", marginBottom: "16px",
              fontSize: "12.5px", color: "#64748b", lineHeight: 1.5,
            }}>
              📬 Your application will be sent to <strong style={{ color: "#93c5fd" }}>{job.contact?.email}</strong>
            </div>

            <div className="jd-modal-actions">
              <button className="jd-modal-cancel" onClick={onClose}>Cancel</button>
              <button
                className="jd-modal-submit"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <svg style={{ animation: "spin 0.8s linear infinite" }} width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Submitting…
                  </span>
                ) : "Submit Application →"}
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Main JobDetails ─────────────────────────────────────────────────────── */
export default function JobDetails({ job: jobProp, onClose }) {
  const [job, setJob] = useState(jobProp || null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  // If used standalone via route (no prop), fetch by id
  useEffect(() => {
    if (!jobProp) return;
    setJob(jobProp);
  }, [jobProp]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!job) return null;

  const dl = deadlineCls(job.deadline);

  return (
    <>
      <style>{styles}</style>

      <div className="jd-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
        <div className="jd-panel">

          {/* HEADER */}
          <div className="jd-header" style={{ position: "relative" }}>
            <button className="jd-close" onClick={onClose}>×</button>

            <div className="jd-company-row">
              <img
                src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                alt={job.company}
                className="jd-company-logo"
              />
              <div>
                <div className="jd-company-name">{job.company}</div>
                <div className={`jd-type ${typeClass(job.jobType)}`}>{job.jobType}</div>
              </div>
            </div>

            <div className="jd-title">{job.title}</div>

            <div className="jd-chips">
              <span className="jd-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/>
                </svg>
                {job.location}
              </span>
              <span className="jd-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {job.experienceMin}{job.experienceMax ? `–${job.experienceMax}` : "+"} yrs exp
              </span>
              {job.vacancies && (
                <span className="jd-chip">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {job.vacancies} opening{job.vacancies > 1 ? "s" : ""}
                </span>
              )}
              {(job.salaryMin || job.salaryMax) && (
                <span className="jd-chip jd-salary-chip">
                  ₹{job.salaryMin ? `${(job.salaryMin/1000).toFixed(0)}k` : "?"}
                  {" – "}
                  ₹{job.salaryMax ? `${(job.salaryMax/1000).toFixed(0)}k` : "?"}
                </span>
              )}
              {dl && (
                <span className={`jd-chip jd-deadline-chip-${dl.cls}`}>
                  ⏰ {dl.label}
                </span>
              )}
            </div>
          </div>

          {/* SCROLLABLE BODY */}
          <div className="jd-body">

            {/* Stats */}
            <div className="jd-section">
              <div className="jd-section-title">Overview</div>
              <div className="jd-stats">
                <div className="jd-stat">
                  <div className="jd-stat-label">Job Type</div>
                  <div className="jd-stat-value">{job.jobType}</div>
                </div>
                <div className="jd-stat">
                  <div className="jd-stat-label">Experience</div>
                  <div className="jd-stat-value">
                    {job.experienceMin}{job.experienceMax ? `–${job.experienceMax}` : "+"} yrs
                  </div>
                </div>
                {(job.salaryMin || job.salaryMax) && (
                  <div className="jd-stat">
                    <div className="jd-stat-label">Salary Range</div>
                    <div className="jd-stat-value" style={{ color: "#4ade80" }}>
                      ₹{job.salaryMin || "–"} – ₹{job.salaryMax || "–"}
                    </div>
                  </div>
                )}
                <div className="jd-stat">
                  <div className="jd-stat-label">Vacancies</div>
                  <div className="jd-stat-value">{job.vacancies}</div>
                </div>
                {job.deadline && (
                  <div className="jd-stat">
                    <div className="jd-stat-label">Deadline</div>
                    <div className="jd-stat-value" style={{ fontSize: 14 }}>
                      {new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                )}
                <div className="jd-stat">
                  <div className="jd-stat-label">Posted</div>
                  <div className="jd-stat-value" style={{ fontSize: 14 }}>
                    {new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="jd-section">
                <div className="jd-section-title">Required Skills</div>
                <div className="jd-skills">
                  {job.skills.map((s, i) => (
                    <span key={i} className="jd-skill">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {job.description && (
              <div className="jd-section">
                <div className="jd-section-title">Job Description</div>
                <div className="jd-description">{job.description}</div>
              </div>
            )}

            {/* Company */}
            <div className="jd-section">
              <div className="jd-section-title">About the Company</div>
              <div className="jd-company-card">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <img
                    src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", objectFit: "cover" }}
                    alt={job.company}
                  />
                  <div className="jd-company-card-name">{job.company}</div>
                </div>
                {job.companyDescription && (
                  <div className="jd-company-card-desc">{job.companyDescription}</div>
                )}
                {job.companyWebsite && (
                  <a className="jd-company-link" href={job.companyWebsite} target="_blank" rel="noreferrer">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {job.companyWebsite.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>

            {/* Contact */}
            {job.contact?.email && (
              <div className="jd-section">
                <div className="jd-section-title">Contact</div>
                <div style={{
                  background: "#141720", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "10px", padding: "12px 14px",
                  display: "flex", alignItems: "center", gap: 10,
                  fontSize: "13.5px", color: "#94a3b8",
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#475569" strokeWidth="2"/>
                    <polyline points="22,6 12,13 2,6" stroke="#475569" strokeWidth="2"/>
                  </svg>
                  <a href={`mailto:${job.contact.email}`} style={{ color: "#60a5fa", textDecoration: "none" }}>
                    {job.contact.email}
                  </a>
                </div>
              </div>
            )}

          </div>

          {/* FOOTER */}
          <div className="jd-footer">
            <button
              className={`jd-save-btn${saved ? " saved" : ""}`}
              onClick={() => setSaved(s => !s)}
              title={saved ? "Saved" : "Save job"}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"}>
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              className={`jd-apply-btn${applied ? " applied" : ""}`}
              onClick={() => !applied && setApplyOpen(true)}
              disabled={applied}
            >
              {applied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Applied
                </>
              ) : (
                <>
                  Apply Now
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Apply Modal */}
      {applyOpen && (
        <ApplyModal
          job={job}
          onClose={() => setApplyOpen(false)}
          onSuccess={() => setApplied(true)}
        />
      )}
    </>
  );
}