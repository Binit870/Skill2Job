import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../../utils/api";
import { INITIAL_FORM_DATA } from "./editJobConstants";

export function useEditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  /* ── Fetch job by ID ── */
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  /* ── Field change handler ── */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ── Skill helpers ── */
  const addSkill = (raw) => {
    const s = raw.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput("");
  };

  const removeSkill = (s) => setSkills(skills.filter((x) => x !== s));

  /* ── Submit handler ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.location.trim() ||
      !formData.description.trim()
    ) {
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

  return {
    loading,
    saving,
    formData,
    skills,
    skillInput,
    setSkillInput,
    handleChange,
    handleSubmit,
    addSkill,
    removeSkill,
    navigate,
  };
}