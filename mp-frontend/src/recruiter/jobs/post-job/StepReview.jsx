import { FiInfo } from "react-icons/fi";
import { ReviewRow } from "./SharedUI";

export default function StepReview({ formData }) {
  const rows = [
    { label: "Job Title",   value: formData.title },
    { label: "Company",     value: formData.company },
    { label: "Website",     value: formData.companyWebsite },
    { label: "Location",    value: formData.location },
    { label: "Job Type",    value: formData.jobType },
    {
      label: "Experience",
      value: formData.experienceMax
        ? `${formData.experienceMin}–${formData.experienceMax} yrs`
        : `${formData.experienceMin}+ yrs`,
    },
    {
      label: "Salary",
      value: formData.salaryMin
        ? `₹${Number(formData.salaryMin).toLocaleString()} – ₹${Number(formData.salaryMax).toLocaleString()}`
        : null,
    },
    { label: "Vacancies",   value: String(formData.vacancies) },
    { label: "Deadline",    value: formData.deadline },
    { label: "Skills",      value: formData.skills },
    { label: "Contact",     value: formData.contactEmail },
    {
      label: "Description",
      value: formData.description
        ? formData.description.slice(0, 120) +
          (formData.description.length > 120 ? "…" : "")
        : null,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-start sm:items-center gap-3">
        <FiInfo size={16} className="text-green-600 shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-sm text-green-800 font-medium">
          Review your listing before publishing. Go back to make edits.
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 md:px-6 py-4">
        {rows.map((r) => (
          <ReviewRow key={r.label} {...r} />
        ))}
      </div>
    </div>
  );
}