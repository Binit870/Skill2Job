import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiCheck, FiArrowLeft, FiArrowRight, FiSend,
  FiLoader, FiInfo, FiBriefcase, FiMapPin,
  FiDollarSign, FiCalendar, FiMail, FiGlobe,
  FiUsers, FiFileText, FiX
} from "react-icons/fi";

/* ─── Step Config ─────────────────────────────────────────────────── */
const STEPS = ["Company", "Job Details", "Requirements", "Review"];

const StepIndicator = ({ current }) => (
  <div className="flex items-center mb-8">
    {STEPS.map((label, i) => (
      <div key={i} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
        <div className="flex flex-col items-center gap-1.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
            ${i < current
              ? "bg-green-600 text-white shadow-md shadow-green-200"
              : i === current
              ? "bg-green-500 text-white ring-4 ring-green-100 shadow-md shadow-green-200"
              : "bg-gray-100 text-gray-400"}`}
          >
            {i < current ? <FiCheck size={15} /> : i + 1}
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap
            ${i <= current ? "text-green-600" : "text-gray-400"}`}>
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all duration-500
            ${i < current ? "bg-green-500" : "bg-gray-200"}`}
          />
        )}
      </div>
    ))}
  </div>
);

/* ─── Skills Tag Input ────────────────────────────────────────────── */
const SkillsInput = ({ value, onChange }) => {
  const [input, setInput] = useState("");
  const skills = value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const addSkill = (raw) => {
    const skill = raw.trim();
    if (!skill || skills.includes(skill)) return;
    onChange([...skills, skill].join(", "));
    setInput("");
  };
  const removeSkill = (s) => onChange(skills.filter((x) => x !== s).join(", "));

  return (
    <div>
      <div
        className="min-h-[46px] border border-gray-200 rounded-lg bg-white px-3 py-2 flex flex-wrap items-center gap-1.5 cursor-text focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition"
        onClick={(e) => e.currentTarget.querySelector("input").focus()}
      >
        {skills.map((s) => (
          <span key={s} className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
            {s}
            <button
              type="button"
              onClick={() => removeSkill(s)}
              className="text-green-400 hover:text-green-700 transition leading-none ml-0.5"
            >
              <FiX size={11} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (["Enter", ",", "Tab"].includes(e.key)) { e.preventDefault(); addSkill(input); }
            if (e.key === "Backspace" && !input && skills.length) removeSkill(skills[skills.length - 1]);
          }}
          placeholder={skills.length ? "" : "Type a skill and press Enter…"}
          className="flex-1 min-w-[140px] border-none outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">Press Enter, comma, or Tab to add</p>
    </div>
  );
};

/* ─── Field ───────────────────────────────────────────────────────── */
const Field = ({ label, required, icon: Icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
      {Icon && <Icon size={11} className="text-green-500" />}
      {label} {required && <span className="text-red-400 normal-case font-black">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = "w-full border border-gray-200 bg-white rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition placeholder-gray-400";

/* ─── Review Row ──────────────────────────────────────────────────── */
const ReviewRow = ({ label, value }) =>
  value ? (
    <div className="flex gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <span className="min-w-[140px] text-xs font-bold uppercase tracking-wider text-gray-400">{label}</span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  ) : null;

/* ─── Section Card ────────────────────────────────────────────────── */
const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-2 px-5 md:px-6 py-4 border-b border-gray-100 bg-green-50">
      <span className="w-1 h-5 rounded-full bg-green-500" />
      <span className="text-sm font-bold text-green-800 uppercase tracking-wider">{title}</span>
    </div>
    <div className="px-5 md:px-6 py-5 flex flex-col gap-5">{children}</div>
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────── */
const PostJob = () => {
  const navigate = useNavigate();
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
        const { data } = await api.get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.role === "recruiter") {
          setFormData((prev) => ({
            ...prev,
            company: data.companyName || "",
            companyWebsite: data.companyWebsite || "",
            companyDescription: data.companyDescription || "",
            contactEmail: data.email || "",
            companyLogo: data.companyLogo || "",
          }));
        } else {
          setFormData((prev) => ({ ...prev, contactEmail: data.email || "" }));
        }
      } catch { /* silent */ }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSkills = (val) => setFormData({ ...formData, skills: val });

  const validateStep = () => {
    if (step === 0 && !formData.company.trim()) { toast.error("Company name is required"); return false; }
    if (step === 1 && !formData.title.trim()) { toast.error("Job title is required"); return false; }
    if (step === 1 && !formData.location.trim()) { toast.error("Location is required"); return false; }
    if (step === 2 && !formData.skills.trim()) { toast.error("Add at least one skill"); return false; }
    if (step === 2 && !formData.description.trim()) { toast.error("Job description is required"); return false; }
    if (step === 2 && !formData.contactEmail.trim()) { toast.error("Contact email is required"); return false; }
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep((s) => Math.min(s + 1, 3)); };
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/api/jobs",
        {
          ...formData,
          experienceMin: Number(formData.experienceMin),
          experienceMax: formData.experienceMax ? Number(formData.experienceMax) : undefined,
          salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
          salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
          vacancies: Number(formData.vacancies),
          skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
          contact: { email: formData.contactEmail },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Job posted successfully!");
      setTimeout(() => navigate("/recruiter-dashboard"), 1500);
    } catch {
      toast.error("Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-5 md:px-8 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shadow-md shadow-green-200">
              <FiBriefcase size={17} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 tracking-tight leading-none">Post a New Job</h1>
              <p className="text-gray-400 text-[11px] mt-0.5">Fill in the details to publish your listing</p>
            </div>
          </div>
          {formData.companyLogo && (
            <img
              src={formData.companyLogo}
              alt="Logo"
              className="w-12 h-12 object-contain rounded-xl border border-gray-100 bg-white p-1.5 shadow-sm"
            />
          )}
        </div>
      </div>

      {/* ── Card ── */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-8">

          <StepIndicator current={step} />

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">

            {/* ── Step 0: Company ── */}
            {step === 0 && (
              <SectionCard title="Company Information">
                <Field label="Company Name" required icon={FiBriefcase}>
                  <input name="company" value={formData.company} onChange={handleChange} placeholder="Acme Inc." className={inputCls} required />
                </Field>
                <Field label="Company Website" icon={FiGlobe}>
                  <input name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} placeholder="https://acme.com" className={inputCls} />
                </Field>
                <Field label="Company Description" icon={FiFileText}>
                  <textarea name="companyDescription" rows={3} value={formData.companyDescription} onChange={handleChange} placeholder="What does your company do?" className={`${inputCls} resize-none`} />
                </Field>
              </SectionCard>
            )}

            {/* ── Step 1: Job Details ── */}
            {step === 1 && (
              <SectionCard title="Job Details">
                <Field label="Job Title" required icon={FiBriefcase}>
                  <input name="title" value={formData.title} onChange={handleChange} placeholder="Senior Frontend Engineer" className={inputCls} required />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Location" required icon={FiMapPin}>
                    <input name="location" value={formData.location} onChange={handleChange} placeholder="Remote / Bangalore" className={inputCls} required />
                  </Field>
                  <Field label="Job Type" icon={FiBriefcase}>
                    <select name="jobType" value={formData.jobType} onChange={handleChange} className={inputCls}>
                      <option>Full-Time</option>
                      <option>Part-Time</option>
                      <option>Internship</option>
                      <option>Remote</option>
                      <option>Contract</option>
                    </select>
                  </Field>
                  <Field label="Min Experience (yrs)" icon={FiUsers}>
                    <input type="number" name="experienceMin" value={formData.experienceMin} onChange={handleChange} min={0} className={inputCls} />
                  </Field>
                  <Field label="Max Experience (yrs)" icon={FiUsers}>
                    <input type="number" name="experienceMax" value={formData.experienceMax} onChange={handleChange} placeholder="Optional" className={inputCls} />
                  </Field>
                  <Field label="Min Salary (₹)" icon={FiDollarSign}>
                    <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} placeholder="e.g. 300000" className={inputCls} />
                  </Field>
                  <Field label="Max Salary (₹)" icon={FiDollarSign}>
                    <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} placeholder="e.g. 700000" className={inputCls} />
                  </Field>
                  <Field label="Vacancies" icon={FiUsers}>
                    <input type="number" name="vacancies" value={formData.vacancies} onChange={handleChange} min={1} className={inputCls} />
                  </Field>
                  <Field label="Application Deadline" icon={FiCalendar}>
                    <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className={inputCls} />
                  </Field>
                </div>
              </SectionCard>
            )}

            {/* ── Step 2: Requirements ── */}
            {step === 2 && (
              <SectionCard title="Description & Requirements">
                <Field label="Required Skills" required>
                  <SkillsInput value={formData.skills} onChange={handleSkills} />
                </Field>
                <Field label="Job Description" required icon={FiFileText}>
                  <textarea name="description" rows={6} value={formData.description} onChange={handleChange}
                    placeholder="Describe responsibilities, requirements, and what makes this role exciting…"
                    className={`${inputCls} resize-none`} />
                </Field>
                <Field label="Contact Email" required icon={FiMail}>
                  <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="hr@company.com" className={inputCls} />
                </Field>
              </SectionCard>
            )}

            {/* ── Step 3: Review ── */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
                  <FiInfo size={16} className="text-green-600 shrink-0" />
                  <p className="text-sm text-green-800 font-medium">
                    Review your listing before publishing. Go back to make edits.
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 md:px-6 py-4">
                  {[
                    { label: "Job Title",    value: formData.title },
                    { label: "Company",      value: formData.company },
                    { label: "Website",      value: formData.companyWebsite },
                    { label: "Location",     value: formData.location },
                    { label: "Job Type",     value: formData.jobType },
                    { label: "Experience",   value: formData.experienceMax ? `${formData.experienceMin}–${formData.experienceMax} yrs` : `${formData.experienceMin}+ yrs` },
                    { label: "Salary",       value: formData.salaryMin ? `₹${Number(formData.salaryMin).toLocaleString()} – ₹${Number(formData.salaryMax).toLocaleString()}` : null },
                    { label: "Vacancies",    value: String(formData.vacancies) },
                    { label: "Deadline",     value: formData.deadline },
                    { label: "Skills",       value: formData.skills },
                    { label: "Contact",      value: formData.contactEmail },
                    { label: "Description",  value: formData.description ? formData.description.slice(0, 120) + (formData.description.length > 120 ? "…" : "") : null },
                  ].map((r) => <ReviewRow key={r.label} {...r} />)}
                </div>
              </div>
            )}

            {/* ── Navigation ── */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">

              <button
                type="button"
                onClick={prevStep}
                disabled={step === 0}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-default transition"
              >
                <FiArrowLeft size={14} /> Back
              </button>

              {/* Step dots */}
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300
                      ${i === step ? "w-5 bg-green-500" : i < step ? "w-1.5 bg-green-600" : "w-1.5 bg-gray-200"}`}
                  />
                ))}
              </div>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition shadow-sm shadow-green-200"
                >
                  Continue <FiArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-7 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition shadow-sm shadow-green-200"
                >
                  {loading ? (
                    <><FiLoader size={14} className="animate-spin" /> Publishing…</>
                  ) : (
                    <><FiSend size={14} /> Publish Job</>
                  )}
                </button>
              )}

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;