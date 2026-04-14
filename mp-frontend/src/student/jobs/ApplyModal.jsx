import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function Field({ label, optional, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
        {label}
        {optional && (
          <span className="normal-case font-normal text-slate-400 text-[11px]">(optional)</span>
        )}
      </label>
      {children}
      {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition";

const readonlyCls =
  "w-full rounded-xl border border-slate-100 bg-slate-100 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed";

function StepBar({ current }) {
  const steps = ["Profile Info", "Resume & Links", "Cover Letter"];
  return (
    <div className="flex items-center gap-0 mb-7">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300
                ${i < current   ? "bg-blue-500 text-white" : ""}
                ${i === current ? "bg-blue-600 text-white ring-4 ring-blue-100" : ""}
                ${i > current   ? "bg-slate-100 text-slate-400" : ""}
              `}
            >
              {i < current ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : i + 1}
            </div>
            <span className={`text-[10px] font-semibold whitespace-nowrap hidden sm:block ${i === current ? "text-blue-600" : "text-slate-400"}`}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all duration-300 ${i < current ? "bg-blue-500" : "bg-slate-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ApplyModal({ job, onClose, onSuccess }) {
  const [step, setStep]                     = useState(0);
  const [profile, setProfile]               = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting]         = useState(false);
  const [submitted, setSubmitted]           = useState(false);
  const [error, setError]                   = useState("");

  // ── Use a ref for the hidden file input to avoid id collisions ──────────
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", college: "", branch: "",
    graduationYear: "", cgpa: "", skills: "",
    portfolioUrl: "", coverLetter: "",
    resumeChoice: "profile",
    resumeFile: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const p = res.data?.data || res.data?.user || res.data;
        setProfile(p);
        setForm((prev) => ({
          ...prev,
          name:           p.name           || "",
          email:          p.email          || "",
          phone:          p.phone          || "",
          college:        p.college        || "",
          branch:         p.branch         || "",
          graduationYear: p.graduationYear || "",
          cgpa:           p.cgpa           || "",
          skills:         (p.skills || []).join(", "),
          resumeChoice:   p.resume ? "profile" : "upload",
        }));
      } catch (e) {
        console.error("Profile fetch error:", e);
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("jobId",            job._id);
      fd.append("coverLetter",      form.coverLetter);
      fd.append("phone",            form.phone);
      fd.append("portfolioUrl",     form.portfolioUrl);
      fd.append("useProfileResume", form.resumeChoice === "profile" ? "true" : "false");
      if (form.resumeChoice === "upload" && form.resumeFile) {
        fd.append("resume", form.resumeFile);
      }
      await axios.post(`${API}/api/applications`, fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setSubmitted(true);
      setTimeout(() => { onSuccess(); onClose(); }, 2400);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="fixed inset-0 z-[60] bg-black/25 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-3xl p-10 flex flex-col items-center gap-4 shadow-2xl">
          <div className="w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[60] bg-black/25 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-5">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">Application Sent! 🎉</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your application for <strong className="text-slate-700">{job.title}</strong> at{" "}
            <strong className="text-slate-700">{job.company}</strong> has been submitted successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/25 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-xl sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt={job.company}
              className="w-11 h-11 rounded-xl border border-slate-200 object-cover bg-slate-50"
            />
            <div>
              <h2 className="text-sm font-black text-slate-800">{job.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{job.company} · {job.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-lg transition"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          <StepBar current={step} />

          {/* ── STEP 0: Profile Info ── */}
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-blue-500 mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p className="text-xs text-blue-700">Pre-filled from your profile. You can edit before submitting.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name">
                  <input className={readonlyCls} value={form.name} readOnly />
                </Field>
                <Field label="Email">
                  <input className={readonlyCls} value={form.email} readOnly />
                </Field>
              </div>

              <Field label="Phone" optional>
                <input className={inputCls} type="tel" placeholder="+91 98765 43210"
                  value={form.phone} onChange={set("phone")} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="College">
                  <input className={inputCls} placeholder="IIT Bombay"
                    value={form.college} onChange={set("college")} />
                </Field>
                <Field label="Branch">
                  <input className={inputCls} placeholder="Computer Science"
                    value={form.branch} onChange={set("branch")} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Grad Year">
                  <input className={inputCls} type="number" placeholder="2025"
                    value={form.graduationYear} onChange={set("graduationYear")} />
                </Field>
                <Field label="CGPA" optional>
                  <input className={inputCls} type="number" step="0.01" placeholder="8.5"
                    value={form.cgpa} onChange={set("cgpa")} />
                </Field>
              </div>

              <Field label="Skills" optional hint="Comma-separated">
                <input className={inputCls} placeholder="React, Node.js, Python…"
                  value={form.skills} onChange={set("skills")} />
              </Field>
            </div>
          )}

          {/* ── STEP 1: Resume & Links ── */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <Field label="Resume">
                <div className="flex flex-col gap-3">

                  {/* ── Option A: profile resume — plain div, NOT a label ── */}
                  <div
                    onClick={() => setForm((p) => ({ ...p, resumeChoice: "profile" }))}
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition
                      ${form.resumeChoice === "profile"
                        ? "border-blue-400 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                  >
                    <input
                      type="radio" name="resumeChoice" value="profile"
                      checked={form.resumeChoice === "profile"}
                      onChange={() => setForm((p) => ({ ...p, resumeChoice: "profile" }))}
                      className="mt-0.5 accent-blue-500 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-700">Use my profile resume</p>
                      {profile?.resume ? (
                        <a
                          href={profile.resume} target="_blank" rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-blue-500 hover:underline mt-0.5 inline-block"
                        >
                          View current resume →
                        </a>
                      ) : (
                        <p className="text-xs text-amber-600 mt-0.5">⚠️ No resume on profile — upload one below.</p>
                      )}
                    </div>
                  </div>

                  {/* ── Option B: upload new — plain div, NOT a label ── */}
                  <div
                    onClick={() => setForm((p) => ({ ...p, resumeChoice: "upload" }))}
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition
                      ${form.resumeChoice === "upload"
                        ? "border-blue-400 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                  >
                    <input
                      type="radio" name="resumeChoice" value="upload"
                      checked={form.resumeChoice === "upload"}
                      onChange={() => setForm((p) => ({ ...p, resumeChoice: "upload" }))}
                      className="mt-0.5 accent-blue-500 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-700">Upload a different resume</p>
                      <p className="text-xs text-slate-400 mt-0.5">PDF, DOC, DOCX — max 5 MB</p>

                      {/* ── Drop zone — only shown when this option is selected ── */}
                      {form.resumeChoice === "upload" && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation(); // stop the parent div toggling radio
                            fileInputRef.current?.click();
                          }}
                          className="mt-3 border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-blue-400 hover:bg-white transition cursor-pointer"
                        >
                          {/* Hidden file input — controlled by ref, no id needed */}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              const f = e.target.files[0];
                              if (f) setForm((p) => ({ ...p, resumeFile: f }));
                            }}
                          />

                          {form.resumeFile ? (
                            <div className="flex items-center justify-center gap-2">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-green-500 shrink-0">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2"/>
                                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                              <p className="text-sm font-bold text-green-600 truncate">{form.resumeFile.name}</p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setForm((p) => ({ ...p, resumeFile: null }));
                                  if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="ml-1 text-xs text-slate-400 hover:text-red-500 shrink-0"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mx-auto mb-1.5 text-slate-400">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <p className="text-xs text-slate-500 font-medium">Click to select file</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">PDF, DOC, DOCX up to 5MB</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Field>

              <Field label="Portfolio / LinkedIn" optional>
                <input
                  className={inputCls} type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={form.portfolioUrl} onChange={set("portfolioUrl")}
                />
              </Field>

              {job.contact?.email && (
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-slate-400 shrink-0">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" />
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <p className="text-xs text-slate-500">
                    Application will be sent to{" "}
                    <span className="font-semibold text-blue-600">{job.contact.email}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Cover Letter ── */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <Field label="Cover Letter" optional>
                <textarea
                  className={`${inputCls} resize-none`} rows={7}
                  placeholder={`Hi ${job.company} team,\n\nI'm excited to apply for the ${job.title} role…`}
                  value={form.coverLetter}
                  onChange={set("coverLetter")}
                />
                <span className="text-[11px] text-slate-400">{form.coverLetter.length} characters</span>
              </Field>

              {/* Summary card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Application Summary</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  {[
                    ["Name",      form.name],
                    ["Phone",     form.phone      || "—"],
                    ["College",   form.college    || "—"],
                    ["Branch",    form.branch     || "—"],
                    ["Grad Year", form.graduationYear || "—"],
                    ["CGPA",      form.cgpa       || "—"],
                    ["Resume",    form.resumeChoice === "profile"
                                    ? "Profile resume"
                                    : form.resumeFile?.name || "Not selected"],
                  ].map(([l, v]) => (
                    <div key={l} className="flex flex-col">
                      <span className="text-slate-400">{l}</span>
                      <span className="font-semibold text-slate-700 truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                  ⚠️ {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="px-7 py-5 border-t border-slate-100 flex gap-3 flex-shrink-0 bg-white">
          <button
            onClick={() => step === 0 ? onClose() : setStep((s) => s - 1)}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            {step === 0 ? "Cancel" : "← Back"}
          </button>

          {step < 2 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-black transition shadow-md shadow-blue-200"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-black transition shadow-md shadow-blue-200 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Submitting…
                </>
              ) : "Submit Application 🚀"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}