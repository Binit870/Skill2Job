import { useState, useEffect, useRef } from "react";
import { X, Info, FileText, Upload, Mail, AlertCircle, Check } from "lucide-react";
import API from "../../utils/api";

function Field({ label, optional, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-ink/55 uppercase tracking-widest flex items-center gap-1">
        {label}
        {optional && (
          <span className="normal-case font-normal text-ink/35 text-[10px] tracking-normal">(optional)</span>
        )}
      </label>
      {children}
      {hint && <span className="text-[11px] text-ink/40">{hint}</span>}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-mist bg-paper/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/25 outline-none focus:border-pine focus:bg-white focus:ring-2 focus:ring-pine/15 transition-colors";

const readonlyCls =
  "w-full rounded-xl border border-mist bg-ink/5 px-3.5 py-2.5 text-sm text-ink/40 cursor-not-allowed";

function StepBar({ current }) {
  const steps = ["Profile info", "Resume & links", "Cover letter"];
  return (
    <div className="flex items-center gap-0 mb-6">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300
                ${i < current   ? "bg-pine text-white" : ""}
                ${i === current ? "bg-pine text-white ring-4 ring-pine/15" : ""}
                ${i > current   ? "bg-ink/5 text-ink/35" : ""}
              `}
            >
              {i < current ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : i + 1}
            </div>
            <span className={`text-[9px] font-semibold whitespace-nowrap hidden sm:block ${i === current ? "text-pine" : "text-ink/35"}`}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-[1.5px] mx-2 mb-5 rounded-full transition-all duration-300 ${i < current ? "bg-pine" : "bg-mist"}`} />
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
        const token = sessionStorage.getItem("token");
        const res = await API.get("/api/auth/me", {
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
      const token = sessionStorage.getItem("token");
      const fd = new FormData();
      fd.append("jobId",            job._id);
      fd.append("coverLetter",      form.coverLetter);
      fd.append("phone",            form.phone);
      fd.append("portfolioUrl",     form.portfolioUrl);
      fd.append("useProfileResume", form.resumeChoice === "profile" ? "true" : "false");
      if (form.resumeChoice === "upload" && form.resumeFile) {
        fd.append("resume", form.resumeFile);
      }
      await API.post("/api/applications", fd, {
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
      <div className="fixed inset-0 z-[60] bg-ink/25 backdrop-blur-[2px] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 flex flex-col items-center gap-4 shadow-2xl">
          <div className="w-10 h-10 rounded-full border-4 border-pine/20 border-t-pine animate-spin" />
          <p className="text-sm font-semibold text-ink/55">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[60] bg-ink/25 backdrop-blur-[2px] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-pine/8 border border-pine/20 flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-pine" strokeWidth={2.5} />
          </div>
          <h3 className="font-display text-xl font-bold text-ink mb-2">Application sent!</h3>
          <p className="text-sm text-ink/55 leading-relaxed">
            Your application for <strong className="text-ink">{job.title}</strong> at{" "}
            <strong className="text-ink">{job.company}</strong> was submitted successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-ink/25 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-mist flex-shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt={job.company}
              className="w-10 h-10 rounded-xl border border-mist object-cover bg-paper/60 shrink-0"
            />
            <div>
              <h2 className="text-sm font-bold text-ink">{job.title}</h2>
              <p className="text-xs text-ink/40 mt-0.5">{job.company} · {job.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-ink/5 hover:bg-ink/10 text-ink/40 hover:text-ink flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          <StepBar current={step} />

          {/* ── STEP 0: Profile info ── */}
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2.5 bg-pine/8 border border-pine/20 rounded-xl px-3.5 py-3">
                <Info className="w-3.5 h-3.5 text-pine shrink-0 mt-0.5" />
                <p className="text-xs text-pine">Pre-filled from your profile. You can edit before submitting.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Full name">
                  <input className={readonlyCls} value={form.name} readOnly />
                </Field>
                <Field label="Email">
                  <input className={readonlyCls} value={form.email} readOnly />
                </Field>
              </div>

              <Field label="Phone" optional>
                <input className={inputCls} type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="College">
                  <input className={inputCls} placeholder="IIT Bombay" value={form.college} onChange={set("college")} />
                </Field>
                <Field label="Branch">
                  <input className={inputCls} placeholder="Computer Science" value={form.branch} onChange={set("branch")} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Grad year">
                  <input className={inputCls} type="number" placeholder="2025" value={form.graduationYear} onChange={set("graduationYear")} />
                </Field>
                <Field label="CGPA" optional>
                  <input className={inputCls} type="number" step="0.01" placeholder="8.5" value={form.cgpa} onChange={set("cgpa")} />
                </Field>
              </div>

              <Field label="Skills" optional hint="Comma-separated">
                <input className={inputCls} placeholder="React, Node.js, Python…" value={form.skills} onChange={set("skills")} />
              </Field>
            </div>
          )}

          {/* ── STEP 1: Resume & links ── */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <Field label="Resume">
                <div className="flex flex-col gap-2.5">

                  {/* Option A: profile resume */}
                  <div
                    onClick={() => setForm((p) => ({ ...p, resumeChoice: "profile" }))}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition
                      ${form.resumeChoice === "profile"
                        ? "border-pine bg-pine/8"
                        : "border-mist hover:border-ink/20 bg-white"
                      }`}
                  >
                    <input
                      type="radio" name="resumeChoice" value="profile"
                      checked={form.resumeChoice === "profile"}
                      onChange={() => setForm((p) => ({ ...p, resumeChoice: "profile" }))}
                      className="mt-0.5 accent-pine shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-ink">Use my profile resume</p>
                      {profile?.resume ? (
                        <a
                          href={profile.resume} target="_blank" rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-pine hover:underline mt-0.5 inline-block font-medium"
                        >
                          View current resume →
                        </a>
                      ) : (
                        <p className="text-xs text-gold mt-0.5 font-medium">No resume on profile — upload one below.</p>
                      )}
                    </div>
                  </div>

                  {/* Option B: upload new */}
                  <div
                    onClick={() => setForm((p) => ({ ...p, resumeChoice: "upload" }))}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition
                      ${form.resumeChoice === "upload"
                        ? "border-pine bg-pine/8"
                        : "border-mist hover:border-ink/20 bg-white"
                      }`}
                  >
                    <input
                      type="radio" name="resumeChoice" value="upload"
                      checked={form.resumeChoice === "upload"}
                      onChange={() => setForm((p) => ({ ...p, resumeChoice: "upload" }))}
                      className="mt-0.5 accent-pine shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink">Upload a different resume</p>
                      <p className="text-xs text-ink/40 mt-0.5">PDF, DOC, DOCX — max 5 MB</p>

                      {form.resumeChoice === "upload" && (
                        <div
                          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                          className="mt-3 border-2 border-dashed border-mist rounded-xl p-4 text-center hover:border-pine hover:bg-white transition-colors cursor-pointer"
                        >
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
                              <FileText className="w-3.5 h-3.5 text-pine shrink-0" />
                              <p className="text-sm font-semibold text-pine truncate">{form.resumeFile.name}</p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setForm((p) => ({ ...p, resumeFile: null }));
                                  if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="ml-1 text-xs text-ink/40 hover:text-red-500 shrink-0 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-4.5 h-4.5 text-ink/30 mx-auto mb-1.5" />
                              <p className="text-xs text-ink/55 font-medium">Click to select file</p>
                              <p className="text-[10px] text-ink/40 mt-0.5">PDF, DOC, DOCX up to 5 MB</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Field>

              <Field label="Portfolio / LinkedIn" optional>
                <input className={inputCls} type="url" placeholder="https://linkedin.com/in/yourprofile" value={form.portfolioUrl} onChange={set("portfolioUrl")} />
              </Field>

              {job.contact?.email && (
                <div className="flex items-center gap-2.5 bg-paper/60 border border-mist rounded-xl px-3.5 py-3">
                  <Mail className="w-3 h-3 text-ink/30 shrink-0" />
                  <p className="text-xs text-ink/55">
                    Application will be sent to{" "}
                    <span className="font-semibold text-pine">{job.contact.email}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Cover letter ── */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <Field label="Cover letter" optional>
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={6}
                  placeholder={`Hi ${job.company} team,\n\nI'm excited to apply for the ${job.title} role…`}
                  value={form.coverLetter}
                  onChange={set("coverLetter")}
                />
                <span className="text-[11px] text-ink/40">{form.coverLetter.length} characters</span>
              </Field>

              {/* Summary card */}
              <div className="bg-paper/60 border border-mist rounded-2xl p-4">
                <p className="text-[9px] font-bold text-ink/40 uppercase tracking-widest mb-3">Application summary</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                  {[
                    ["Name",      form.name],
                    ["Phone",     form.phone      || "—"],
                    ["College",   form.college    || "—"],
                    ["Branch",    form.branch     || "—"],
                    ["Grad year", form.graduationYear || "—"],
                    ["CGPA",      form.cgpa       || "—"],
                    ["Resume",    form.resumeChoice === "profile"
                                    ? "Profile resume"
                                    : form.resumeFile?.name || "Not selected"],
                  ].map(([l, v]) => (
                    <div key={l} className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-ink/40 font-medium">{l}</span>
                      <span className="font-semibold text-ink truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-mist flex gap-3 flex-shrink-0 bg-white">
          <button
            onClick={() => step === 0 ? onClose() : setStep((s) => s - 1)}
            className="flex-1 py-3 rounded-xl border border-mist text-sm font-semibold text-ink/65 hover:bg-ink/5 transition-colors active:scale-[0.98]"
          >
            {step === 0 ? "Cancel" : "← Back"}
          </button>

          {step < 2 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 py-3 rounded-xl bg-pine hover:bg-moss text-white text-sm font-bold transition-colors shadow-sm shadow-pine/20 active:scale-[0.98]"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl bg-pine hover:bg-moss disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors shadow-sm shadow-pine/20 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Submitting…
                </>
              ) : "Submit application"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}