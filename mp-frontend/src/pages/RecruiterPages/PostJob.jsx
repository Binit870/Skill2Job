import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ─── Toast System ──────────────────────────────────────────────────────── */
const toastStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@600;700;800&display=swap');

  @keyframes slideIn {
    from { transform: translateX(110%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0);    opacity: 1; }
    to   { transform: translateX(110%); opacity: 0; }
  }
  @keyframes progress {
    from { width: 100%; }
    to   { width: 0%; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .toast-enter { animation: slideIn 0.38s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .toast-exit  { animation: slideOut 0.3s ease-in forwards; }

  .field-row { animation: fadeUp 0.4s ease both; }

  .submit-btn {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 50%, #1d4ed8 100%);
    background-size: 200% auto;
    transition: background-position 0.5s, box-shadow 0.2s, transform 0.15s;
  }
  .submit-btn:hover:not(:disabled) {
    background-position: right center;
    box-shadow: 0 8px 32px rgba(29,78,216,0.4);
    transform: translateY(-1px);
  }
  .submit-btn:active:not(:disabled) { transform: translateY(0); }

  .section-card {
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px;
    background: #fafbfc;
    transition: box-shadow 0.2s;
  }
  .section-card:hover { box-shadow: 0 2px 16px rgba(0,0,0,0.06); }

  .field-input {
    width: 100%;
    border: 1.5px solid #e2e8f0;
    background: #fff;
    padding: 11px 14px;
    border-radius: 10px;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #1e293b;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .field-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
  }
  .field-input::placeholder { color: #94a3b8; }

  .field-label {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: 0.01em;
  }

  .logo-ring {
    background: linear-gradient(135deg, #dbeafe, #eff6ff);
    border: 2px solid #bfdbfe;
    border-radius: 14px;
    padding: 10px;
  }

  .skills-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 12.5px;
    font-weight: 500;
    margin: 3px;
  }
  .skills-tag button {
    background: none;
    border: none;
    cursor: pointer;
    color: #93c5fd;
    line-height: 1;
    padding: 0;
    font-size: 14px;
    transition: color 0.15s;
  }
  .skills-tag button:hover { color: #1d4ed8; }
`;

/* ─── Toast Component ───────────────────────────────────────────────────── */
const TOAST_DURATION = 4000;

const ToastIcon = ({ type }) => {
  if (type === "success") return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#22c55e" fillOpacity="0.15"/>
      <path d="M6 10l3 3 5-5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (type === "error") return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#ef4444" fillOpacity="0.15"/>
      <path d="M7 7l6 6M13 7l-6 6" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#3b82f6" fillOpacity="0.15"/>
      <path d="M10 9v5M10 7v.5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
};

const Toast = ({ toast, onRemove }) => {
  const [exiting, setExiting] = useState(false);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  }, [toast.id, onRemove]);

  useEffect(() => {
    const t = setTimeout(dismiss, TOAST_DURATION);
    return () => clearTimeout(t);
  }, [dismiss]);

  const colors = {
    success: { bar: "#22c55e", bg: "#fff", border: "#dcfce7" },
    error:   { bar: "#ef4444", bg: "#fff", border: "#fee2e2" },
    info:    { bar: "#3b82f6", bg: "#fff", border: "#dbeafe" },
  };
  const c = colors[toast.type] || colors.info;

  return (
    <div
      className={exiting ? "toast-exit" : "toast-enter"}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        background: c.bg,
        border: `1.5px solid ${c.border}`,
        borderRadius: "14px",
        padding: "14px 16px",
        minWidth: "320px",
        maxWidth: "380px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        overflow: "hidden",
        position: "relative",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* progress bar */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, height: "3px",
        borderRadius: "0 0 14px 14px",
        background: c.bar,
        animation: `progress ${TOAST_DURATION}ms linear forwards`,
      }}/>

      <ToastIcon type={toast.type} />

      <div style={{ flex: 1 }}>
        {toast.title && (
          <div style={{ fontWeight: 600, fontSize: "14px", color: "#0f172a", marginBottom: "2px" }}>
            {toast.title}
          </div>
        )}
        <div style={{ fontSize: "13.5px", color: "#475569", lineHeight: 1.45 }}>
          {toast.message}
        </div>
      </div>

      <button
        onClick={dismiss}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#94a3b8", fontSize: "18px", lineHeight: 1,
          padding: "0 0 0 4px", transition: "color 0.15s",
        }}
        onMouseOver={e => e.target.style.color = "#475569"}
        onMouseOut={e => e.target.style.color = "#94a3b8"}
      >
        ×
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, onRemove }) => (
  <div style={{
    position: "fixed", top: "24px", right: "24px",
    display: "flex", flexDirection: "column", gap: "10px",
    zIndex: 9999,
  }}>
    {toasts.map(t => <Toast key={t.id} toast={t} onRemove={onRemove} />)}
  </div>
);

/* ─── useToast Hook ─────────────────────────────────────────────────────── */
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
  }, []);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    toasts,
    removeToast: remove,
    success: (title, msg) => add("success", title, msg),
    error:   (title, msg) => add("error",   title, msg),
    info:    (title, msg) => add("info",    title, msg),
  };
};

/* ─── Step Config ───────────────────────────────────────────────────────── */
const STEPS = ["Company", "Job Details", "Requirements", "Review"];

const StepIndicator = ({ current }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: "32px" }}>
    {STEPS.map((label, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "13px",
            transition: "all 0.3s",
            background: i < current ? "#1d4ed8" : i === current ? "#1d4ed8" : "#e2e8f0",
            color: i <= current ? "#fff" : "#94a3b8",
            boxShadow: i === current ? "0 0 0 4px rgba(29,78,216,0.15)" : "none",
          }}>
            {i < current ? "✓" : i + 1}
          </div>
          <span style={{
            fontSize: "11px", fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.05em", color: i <= current ? "#1d4ed8" : "#94a3b8",
            fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
          }}>
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div style={{
            flex: 1, height: "2px", margin: "0 8px", marginBottom: "20px",
            background: i < current ? "#1d4ed8" : "#e2e8f0",
            transition: "background 0.4s",
          }} />
        )}
      </div>
    ))}
  </div>
);

/* ─── Field Components ──────────────────────────────────────────────────── */
const Field = ({ label, required, children, delay = 0 }) => (
  <div className="field-row" style={{ animationDelay: `${delay}ms` }}>
    <label className="field-label">
      {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
    </label>
    {children}
  </div>
);

const Input = (props) => <input className="field-input" {...props} />;
const Textarea = (props) => <textarea className="field-input" style={{ resize: "vertical" }} {...props} />;
const Select = ({ children, ...props }) => (
  <select className="field-input" {...props}>{children}</select>
);

/* ─── Skills Tag Input ──────────────────────────────────────────────────── */
const SkillsInput = ({ value, onChange }) => {
  const [input, setInput] = useState("");
  const skills = value ? value.split(",").map(s => s.trim()).filter(Boolean) : [];

  const addSkill = (raw) => {
    const skill = raw.trim();
    if (!skill || skills.includes(skill)) return;
    onChange([...skills, skill].join(", "));
    setInput("");
  };

  const removeSkill = (s) => onChange(skills.filter(x => x !== s).join(", "));

  return (
    <div>
      <div style={{
        border: "1.5px solid #e2e8f0", borderRadius: "10px", background: "#fff",
        padding: "8px 10px", minHeight: "48px", display: "flex", flexWrap: "wrap",
        alignItems: "center", gap: "2px", transition: "border-color 0.18s",
      }}
        onClick={e => e.currentTarget.querySelector("input").focus()}
      >
        {skills.map(s => (
          <span key={s} className="skills-tag">
            {s}
            <button type="button" onClick={() => removeSkill(s)}>×</button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (["Enter", ",", "Tab"].includes(e.key)) {
              e.preventDefault();
              addSkill(input);
            }
            if (e.key === "Backspace" && !input && skills.length) {
              removeSkill(skills[skills.length - 1]);
            }
          }}
          placeholder={skills.length ? "" : "Type a skill and press Enter…"}
          style={{
            border: "none", outline: "none", flex: 1, minWidth: "140px",
            fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#1e293b",
            background: "transparent", padding: "4px 4px",
          }}
        />
      </div>
      <p style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "4px" }}>
        Press Enter, comma, or Tab to add each skill
      </p>
    </div>
  );
};

/* ─── Review Row ────────────────────────────────────────────────────────── */
const ReviewRow = ({ label, value }) => (
  value ? (
    <div style={{
      display: "flex", gap: "12px", padding: "10px 0",
      borderBottom: "1px solid #f1f5f9",
    }}>
      <span style={{
        minWidth: "150px", fontSize: "12px", fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.04em",
        color: "#94a3b8", fontFamily: "'DM Sans', sans-serif",
      }}>{label}</span>
      <span style={{ fontSize: "14px", color: "#1e293b", fontFamily: "'DM Sans', sans-serif" }}>
        {value}
      </span>
    </div>
  ) : null
);

/* ─── Main Component ────────────────────────────────────────────────────── */
const PostJob = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "", company: "", companyWebsite: "", companyDescription: "",
    location: "", jobType: "Full-Time", experienceMin: 0, experienceMax: "",
    salaryMin: "", salaryMax: "", vacancies: 1, skills: "", description: "",
    deadline: "", contactEmail: "", companyLogo: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.role === "recruiter") {
          setFormData(prev => ({
            ...prev,
            company: data.companyName || "",
            companyWebsite: data.companyWebsite || "",
            companyDescription: data.companyDescription || "",
            contactEmail: data.email || "",
            companyLogo: data.companyLogo || "",
          }));
        } else if (data.role === "student") {
          setFormData(prev => ({ ...prev, contactEmail: data.email || "" }));
        }
      } catch {
        // silent
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSkills = (val) => setFormData({ ...formData, skills: val });

  const validateStep = () => {
    if (step === 0 && !formData.company.trim()) {
      toast.error("Required", "Company name is required."); return false;
    }
    if (step === 1 && !formData.title.trim()) {
      toast.error("Required", "Job title is required."); return false;
    }
    if (step === 1 && !formData.location.trim()) {
      toast.error("Required", "Location is required."); return false;
    }
    if (step === 2 && !formData.skills.trim()) {
      toast.error("Required", "Add at least one required skill."); return false;
    }
    if (step === 2 && !formData.description.trim()) {
      toast.error("Required", "Job description is required."); return false;
    }
    if (step === 2 && !formData.contactEmail.trim()) {
      toast.error("Required", "Contact email is required."); return false;
    }
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep(s => Math.min(s + 1, 3)); };
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/jobs", {
        ...formData,
        experienceMin: Number(formData.experienceMin),
        experienceMax: formData.experienceMax ? Number(formData.experienceMax) : undefined,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
        vacancies: Number(formData.vacancies),
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
        contact: { email: formData.contactEmail },
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success("Job Posted!", "Your listing is live and visible to candidates.");
      setTimeout(() => navigate("/recruiter-dashboard"), 1800);
    } catch {
      toast.error("Post Failed", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{toastStyles}</style>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #f0f5ff 0%, #fafbff 50%, #f8faff 100%)",
        padding: "40px 16px",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Header */}
        <div style={{ maxWidth: "720px", margin: "0 auto 28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "28px",
                color: "#0f172a", margin: 0, lineHeight: 1.2,
              }}>
                Post a New Job
              </h1>
              <p style={{ color: "#64748b", marginTop: "6px", fontSize: "14.5px" }}>
                Fill in the details below to publish your listing
              </p>
            </div>

            {formData.companyLogo && (
              <div className="logo-ring">
                <img
                  src={formData.companyLogo}
                  alt="Logo"
                  style={{ width: 56, height: 56, objectFit: "contain", display: "block" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Card */}
        <div style={{
          maxWidth: "720px", margin: "0 auto",
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 4px 40px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
          padding: "36px 40px",
          border: "1px solid rgba(255,255,255,0.8)",
        }}>
          <StepIndicator current={step} />

          <form onSubmit={e => e.preventDefault()}>

            {/* ── Step 0: Company ── */}
            {step === 0 && (
              <div className="section-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "8px",
                    background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="section-title">Company Information</span>
                </div>

                <Field label="Company Name" required delay={50}>
                  <Input name="company" value={formData.company} onChange={handleChange} placeholder="Acme Inc." required />
                </Field>
                <Field label="Company Website" delay={100}>
                  <Input name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} placeholder="https://acme.com" />
                </Field>
                <Field label="Company Description" delay={150}>
                  <Textarea name="companyDescription" rows={3} value={formData.companyDescription} onChange={handleChange} placeholder="Brief description of what your company does…" />
                </Field>
              </div>
            )}

            {/* ── Step 1: Job Details ── */}
            {step === 1 && (
              <div className="section-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "8px",
                    background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="7" width="20" height="14" rx="2" stroke="#3b82f6" strokeWidth="2"/>
                      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="#3b82f6" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="section-title">Job Details</span>
                </div>

                <Field label="Job Title" required delay={50}>
                  <Input name="title" value={formData.title} onChange={handleChange} placeholder="Senior Frontend Engineer" required />
                </Field>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <Field label="Location" required delay={100}>
                    <Input name="location" value={formData.location} onChange={handleChange} placeholder="Remote / New York" required />
                  </Field>
                  <Field label="Job Type" delay={120}>
                    <Select name="jobType" value={formData.jobType} onChange={handleChange}>
                      <option>Full-Time</option>
                      <option>Part-Time</option>
                      <option>Internship</option>
                      <option>Remote</option>
                    </Select>
                  </Field>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <Field label="Min Experience (yrs)" delay={150}>
                    <Input type="number" name="experienceMin" value={formData.experienceMin} onChange={handleChange} min={0} />
                  </Field>
                  <Field label="Max Experience (yrs)" delay={170}>
                    <Input type="number" name="experienceMax" value={formData.experienceMax} onChange={handleChange} placeholder="Optional" />
                  </Field>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <Field label="Min Salary ($)" delay={190}>
                    <Input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} placeholder="e.g. 60000" />
                  </Field>
                  <Field label="Max Salary ($)" delay={210}>
                    <Input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} placeholder="e.g. 100000" />
                  </Field>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <Field label="Vacancies" delay={230}>
                    <Input type="number" name="vacancies" value={formData.vacancies} onChange={handleChange} min={1} />
                  </Field>
                  <Field label="Application Deadline" delay={250}>
                    <Input type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
                  </Field>
                </div>
              </div>
            )}

            {/* ── Step 2: Requirements ── */}
            {step === 2 && (
              <div className="section-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "8px",
                    background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="section-title">Description & Requirements</span>
                </div>

                <Field label="Required Skills" required delay={50}>
                  <SkillsInput value={formData.skills} onChange={handleSkills} />
                </Field>
                <Field label="Job Description" required delay={100}>
                  <Textarea name="description" rows={6} value={formData.description} onChange={handleChange}
                    placeholder="Describe responsibilities, requirements, and what makes this role exciting…" />
                </Field>
                <Field label="Contact Email" required delay={150}>
                  <Input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="hr@company.com" />
                </Field>
              </div>
            )}

            {/* ── Step 3: Review ── */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{
                  background: "linear-gradient(135deg, #eff6ff, #f0fdf4)",
                  border: "1.5px solid #bfdbfe",
                  borderRadius: "12px", padding: "16px 20px",
                  display: "flex", alignItems: "center", gap: "12px",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="2"/>
                    <path d="M12 8v4l3 3" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: "13.5px", color: "#1e40af", fontWeight: 500 }}>
                    Review your listing before publishing. You can go back to edit.
                  </span>
                </div>

                {[
                  { label: "Job Title", value: formData.title },
                  { label: "Company", value: formData.company },
                  { label: "Website", value: formData.companyWebsite },
                  { label: "Location", value: formData.location },
                  { label: "Job Type", value: formData.jobType },
                  { label: "Experience", value: formData.experienceMax ? `${formData.experienceMin}–${formData.experienceMax} yrs` : `${formData.experienceMin}+ yrs` },
                  { label: "Salary", value: formData.salaryMin || formData.salaryMax ? `$${formData.salaryMin || "–"} – $${formData.salaryMax || "–"}` : null },
                  { label: "Vacancies", value: formData.vacancies },
                  { label: "Deadline", value: formData.deadline },
                  { label: "Skills", value: formData.skills },
                  { label: "Contact", value: formData.contactEmail },
                  { label: "Description", value: formData.description ? formData.description.slice(0, 120) + (formData.description.length > 120 ? "…" : "") : null },
                ].map(r => <ReviewRow key={r.label} {...r} />)}
              </div>
            )}

            {/* ── Navigation ── */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginTop: "32px", paddingTop: "24px",
              borderTop: "1px solid #f1f5f9",
            }}>
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 0}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "10px 20px", borderRadius: "10px",
                  border: "1.5px solid #e2e8f0", background: "#fff",
                  color: step === 0 ? "#cbd5e1" : "#475569",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                  fontSize: "14px", cursor: step === 0 ? "default" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                ← Back
              </button>

              <div style={{ display: "flex", gap: "8px" }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{
                    width: i === step ? 20 : 6, height: 6,
                    borderRadius: 3,
                    background: i <= step ? "#1d4ed8" : "#e2e8f0",
                    transition: "all 0.3s",
                  }} />
                ))}
              </div>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "10px 24px", borderRadius: "10px",
                    border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#fff",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                    fontSize: "14px", boxShadow: "0 4px 14px rgba(29,78,216,0.3)",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = "translateY(-1px)"}
                  onMouseOut={e => e.currentTarget.style.transform = "none"}
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "12px 28px", borderRadius: "10px",
                    border: "none", cursor: loading ? "not-allowed" : "pointer",
                    color: "#fff", fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700, fontSize: "15px",
                    opacity: loading ? 0.75 : 1,
                  }}
                >
                  {loading ? (
                    <>
                      <svg style={{ animation: "spin 0.8s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Publishing…
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Publish Job
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default PostJob;