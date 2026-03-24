import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { toast } from "react-hot-toast";
import { ArrowLeft, Briefcase } from "lucide-react";

/* ── Reusable field wrapper ── */
const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
      {label} {required && <span className="text-red-500 normal-case">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full border border-gray-200 bg-white rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#FF9933] focus:ring-2 focus:ring-orange-100 transition placeholder-gray-400";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    jobType: "Full-Time",
    experienceMin: 0,
    experienceMax: "",
    salaryMin: "",
    salaryMax: "",
    vacancies: 1,
    description: "",
    deadline: "",
  });

  /* =========================
      FETCH JOB BY ID
  ========================= */
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(
          `/api/jobs/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const job = res.data.data;
        setFormData({
          title: job.title || "",
          location: job.location || "",
          jobType: job.jobType || "Full-Time",
          experienceMin: job.experienceMin ?? 0,
          experienceMax: job.experienceMax || "",
          salaryMin: job.salaryMin || "",
          salaryMax: job.salaryMax || "",
          vacancies: job.vacancies || 1,
          description: job.description || "",
          deadline: job.deadline ? job.deadline.substring(0, 10) : "",
        });
        setSkills(Array.isArray(job.skills) ? job.skills : []);
      } catch {
        toast.error("Failed to load job");
        navigate("/recruiter/my-jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ── Skill tag helpers ── */
  const addSkill = (raw) => {
    const s = raw.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput("");
  };
  const removeSkill = (s) => setSkills(skills.filter((x) => x !== s));

  /* =========================
      HANDLE SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim() || !formData.description.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      await api.put(
        `/api/jobs/${id}`,
        { ...formData, skills },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Job updated successfully!");
      navigate("/recruiter/my-jobs");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* =========================
      LOADING
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FF9933] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  /* =========================
      UI
  ========================= */
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top Bar ── */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 md:px-8">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/recruiter/my-jobs")}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <Briefcase size={16} className="text-[#FF9933]" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Edit Job</h1>
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* ── Section: Basic Info ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 md:px-6 py-4 border-b border-gray-100 bg-orange-50">
              <span className="w-1 h-5 rounded-full bg-[#FF9933]" />
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Basic Information</h2>
            </div>
            <div className="px-5 md:px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div className="sm:col-span-2">
                <Field label="Job Title" required>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Senior Frontend Developer"
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Location" required>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Bangalore, India"
                  className={inputCls}
                />
              </Field>

              <Field label="Job Type">
                <select name="jobType" value={formData.jobType} onChange={handleChange} className={inputCls}>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                  <option value="Contract">Contract</option>
                </select>
              </Field>

              <Field label="Vacancies">
                <input
                  name="vacancies"
                  type="number"
                  min="1"
                  value={formData.vacancies}
                  onChange={handleChange}
                  className={inputCls}
                />
              </Field>

              <Field label="Application Deadline">
                <input
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={inputCls}
                />
              </Field>

            </div>
          </div>

          {/* ── Section: Experience & Salary ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 md:px-6 py-4 border-b border-gray-100 bg-orange-50">
              <span className="w-1 h-5 rounded-full bg-[#FF9933]" />
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Experience & Salary</h2>
            </div>
            <div className="px-5 md:px-6 py-5 grid grid-cols-2 gap-5">

              <Field label="Min Experience (yrs)">
                <input
                  name="experienceMin"
                  type="number"
                  min="0"
                  value={formData.experienceMin}
                  onChange={handleChange}
                  className={inputCls}
                />
              </Field>

              <Field label="Max Experience (yrs)">
                <input
                  name="experienceMax"
                  type="number"
                  min="0"
                  value={formData.experienceMax}
                  onChange={handleChange}
                  placeholder="Optional"
                  className={inputCls}
                />
              </Field>

              <Field label="Min Salary (₹)">
                <input
                  name="salaryMin"
                  type="number"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  placeholder="e.g. 300000"
                  className={inputCls}
                />
              </Field>

              <Field label="Max Salary (₹)">
                <input
                  name="salaryMax"
                  type="number"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  placeholder="e.g. 700000"
                  className={inputCls}
                />
              </Field>

            </div>
          </div>

          {/* ── Section: Skills ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 md:px-6 py-4 border-b border-gray-100 bg-orange-50">
              <span className="w-1 h-5 rounded-full bg-[#FF9933]" />
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Required Skills</h2>
            </div>
            <div className="px-5 md:px-6 py-5 flex flex-col gap-3">

              {/* Tag display */}
              <div className="flex flex-wrap gap-2 min-h-[36px]">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-orange-50 text-[#FF9933] border border-orange-200 text-xs font-semibold px-3 py-1.5 rounded-full"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="text-orange-300 hover:text-[#FF9933] transition leading-none text-base"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {skills.length === 0 && (
                  <p className="text-gray-400 text-sm">No skills added yet</p>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (["Enter", ",", "Tab"].includes(e.key)) {
                      e.preventDefault();
                      addSkill(skillInput);
                    }
                    if (e.key === "Backspace" && !skillInput && skills.length) {
                      removeSkill(skills[skills.length - 1]);
                    }
                  }}
                  placeholder="Type a skill and press Enter…"
                  className={`${inputCls} flex-1`}
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="bg-[#FF9933] hover:bg-[#e8871f] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-gray-400">Press Enter, comma, or Tab to add each skill</p>

            </div>
          </div>

          {/* ── Section: Description ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 md:px-6 py-4 border-b border-gray-100 bg-orange-50">
              <span className="w-1 h-5 rounded-full bg-[#FF9933]" />
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Job Description</h2>
            </div>
            <div className="px-5 md:px-6 py-5">
              <Field label="Description" required>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={7}
                  placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting…"
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex flex-col sm:flex-row gap-3 pb-8">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none bg-[#138808] hover:bg-[#0f6b06] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-sm text-sm"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/recruiter/my-jobs")}
              className="flex-1 sm:flex-none bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 font-semibold px-8 py-3 rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}