import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(
          "http://localhost:5000/api/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.role === "recruiter") {
          setFormData((prev) => ({
            ...prev,
            company: data.companyName || "",
            companyWebsite: data.companyWebsite || "",
            companyDescription: data.companyDescription || "",
            contactEmail: data.email || "",
            companyLogo: data.companyLogo || "",
          }));
        }

        if (data.role === "student") {
          setFormData((prev) => ({
            ...prev,
            contactEmail: data.email || "",
          }));
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/jobs",
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
            .map((skill) => skill.trim()),
          contact: { email: formData.contactEmail },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Job posted successfully!");
      navigate("/recruiter-dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <div className="mb-8 flex items-start justify-between">
  
  {/* Left Side - Title */}
  <div>
    <h2 className="text-3xl font-bold text-gray-800">
      Post a New Job
    </h2>
    <p className="text-gray-500 mt-2">
      Fill in the details below to publish your job listing
    </p>
  </div>

  {/* Right Side - Company Logo */}
  {formData.companyLogo && (
    <div className="bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200">
      <img
        src={formData.companyLogo}
        alt="Company Logo"
        className="h-16 w-16 object-contain"
      />
    </div>
  )}

</div>

        <form onSubmit={handleSubmit} className="space-y-8">

  {/* Basic Info */}
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
      Basic Information
    </h3>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Job Title *
      </label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition"
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Company Name *
      </label>
      <input
        type="text"
        name="company"
        value={formData.company}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition"
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Company Website
      </label>
      <input
        type="text"
        name="companyWebsite"
        value={formData.companyWebsite}
        onChange={handleChange}
        className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition"
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Company Description
      </label>
      <textarea
        name="companyDescription"
        rows="3"
        value={formData.companyDescription}
        onChange={handleChange}
        className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition"
      />
    </div>
  </div>


  {/* Job Details */}
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
      Job Details
    </h3>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Location *
      </label>
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition"
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Job Type
      </label>
      <select
        name="jobType"
        value={formData.jobType}
        onChange={handleChange}
        className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition"
      >
        <option>Full-Time</option>
        <option>Part-Time</option>
        <option>Internship</option>
        <option>Remote</option>
      </select>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Minimum Experience (Years)
        </label>
        <input
          type="number"
          name="experienceMin"
          value={formData.experienceMin}
          onChange={handleChange}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Maximum Experience (Years)
        </label>
        <input
          type="number"
          name="experienceMax"
          value={formData.experienceMax}
          onChange={handleChange}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition"
        />
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Minimum Salary
        </label>
        <input
          type="number"
          name="salaryMin"
          value={formData.salaryMin}
          onChange={handleChange}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Maximum Salary
        </label>
        <input
          type="number"
          name="salaryMax"
          value={formData.salaryMax}
          onChange={handleChange}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition"
        />
      </div>
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Number of Vacancies
      </label>
      <input
        type="number"
        name="vacancies"
        value={formData.vacancies}
        onChange={handleChange}
        className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition"
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Application Deadline
      </label>
      <input
        type="date"
        name="deadline"
        value={formData.deadline}
        onChange={handleChange}
        className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition"
      />
    </div>
  </div>


  {/* Description & Skills */}
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
      Description & Skills
    </h3>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Required Skills *
      </label>
      <input
        type="text"
        name="skills"
        value={formData.skills}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition"
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Job Description *
      </label>
      <textarea
        name="description"
        rows="5"
        value={formData.description}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition"
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Contact Email *
      </label>
      <input
        type="email"
        name="contactEmail"
        value={formData.contactEmail}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition"
      />
    </div>
  </div>

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
  >
    {loading ? "Posting..." : "Post Job"}
  </button>

</form>
      </div>
    </div>
  );
};

export default PostJob;