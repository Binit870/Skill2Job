export const STEPS = ["Company", "Job Details", "Requirements", "Review"];

export const JOB_TYPES = [
  "Full-Time",
  "Part-Time",
  "Internship",
  "Remote",
  "Contract",
];

export const INITIAL_FORM_DATA = {
  title: "",
  company: "",
  companyWebsite: "",
  companyDescription: "",
  location: "",
  jobType: "Full-Time",
  experienceMin: 0,
  experienceMax: "",
  salaryMin: "",
  salaryMax: "",
  vacancies: 1,
  skills: "",
  description: "",
  deadline: "",
  contactEmail: "",
  companyLogo: "",
};

export const inputCls =
  "w-full border border-gray-200 bg-white rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition placeholder-gray-400";