import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../../utils/api";
import { INITIAL_FORM_DATA } from "./postJobConstants";

export function usePostJob() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  /* ── Pre-fill from recruiter profile ── */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");
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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSkills = (val) =>
    setFormData({ ...formData, skills: val });

  /* ── Per-step validation ── */
  const validateStep = () => {
    if (step === 0 && !formData.company.trim()) {
      toast.error("Company name is required");
      return false;
    }
    if (step === 1 && !formData.title.trim()) {
      toast.error("Job title is required");
      return false;
    }
    if (step === 1 && !formData.location.trim()) {
      toast.error("Location is required");
      return false;
    }
    if (step === 2 && !formData.skills.trim()) {
      toast.error("Add at least one skill");
      return false;
    }
    if (step === 2 && !formData.description.trim()) {
      toast.error("Job description is required");
      return false;
    }
    if (step === 2 && !formData.contactEmail.trim()) {
      toast.error("Contact email is required");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 3));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      await api.post(
        "/api/jobs",
        {
          ...formData,
          experienceMin: Number(formData.experienceMin),
          experienceMax: formData.experienceMax
            ? Number(formData.experienceMax)
            : undefined,
          salaryMin: formData.salaryMin
            ? Number(formData.salaryMin)
            : undefined,
          salaryMax: formData.salaryMax
            ? Number(formData.salaryMax)
            : undefined,
          vacancies: Number(formData.vacancies),
          skills: formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
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

  return {
    step,
    loading,
    formData,
    handleChange,
    handleSkills,
    nextStep,
    prevStep,
    handleSubmit,
  };
}