import { useState } from "react";
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
  });

  const [loading, setLoading] = useState(false);

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
          contact: {
            email: formData.contactEmail,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Post a New Job
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="companyWebsite"
            placeholder="Company Website (optional)"
            value={formData.companyWebsite}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            name="companyDescription"
            placeholder="Company Description (optional)"
            value={formData.companyDescription}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Internship</option>
            <option>Remote</option>
          </select>

          {/* Experience */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="experienceMin"
              placeholder="Minimum Experience (years)"
              value={formData.experienceMin}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="experienceMax"
              placeholder="Maximum Experience (years)"
              value={formData.experienceMax}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
          </div>

          {/* Salary */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="salaryMin"
              placeholder="Minimum Salary"
              value={formData.salaryMin}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="salaryMax"
              placeholder="Maximum Salary"
              value={formData.salaryMax}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
          </div>

          <input
            type="number"
            name="vacancies"
            placeholder="Number of Vacancies"
            value={formData.vacancies}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="skills"
            placeholder="Required Skills (comma separated)"
            value={formData.skills}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Job Description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="email"
            name="contactEmail"
            placeholder="Contact Email"
            value={formData.contactEmail}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
