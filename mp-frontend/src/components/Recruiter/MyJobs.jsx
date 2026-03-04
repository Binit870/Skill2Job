import { useEffect, useState } from "react";
import axios from "axios";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const token = localStorage.getItem("token");

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/jobs/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/jobs/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (job) => {
    setEditingId(job._id);
    setEditData({
      ...job,
      skills: job.skills?.join(", ") || "",
      contactEmail: job.contact?.email || "",
    });
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const updatedPayload = {
        ...editData,
        experienceMin: Number(editData.experienceMin),
        experienceMax: editData.experienceMax
          ? Number(editData.experienceMax)
          : undefined,
        salaryMin: editData.salaryMin
          ? Number(editData.salaryMin)
          : undefined,
        salaryMax: editData.salaryMax
          ? Number(editData.salaryMax)
          : undefined,
        vacancies: Number(editData.vacancies),
        skills: editData.skills
          .split(",")
          .map((s) => s.trim()),
        contact: {
          email: editData.contactEmail,
        },
      };

      const res = await axios.put(
        `http://localhost:5000/api/jobs/${id}`,
        updatedPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setJobs(
        jobs.map((job) =>
          job._id === id ? res.data : job
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (loading) return <p className="p-6">Loading jobs...</p>;

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-gray-800">
        My Posted Jobs
      </h2>

      <div className="grid gap-8">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200"
          >
            {editingId === job._id ? (
              <>
                <h3 className="text-xl font-semibold mb-6 border-b pb-2">
                  Edit Job
                </h3>

                <div className="space-y-4">

                  <div>
                    <label className="text-sm font-medium text-gray-600">Job Title</label>
                    <input name="title" value={editData.title} onChange={handleChange}
                      className="border p-3 w-full rounded-xl mt-1" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Company</label>
                    <input name="company" value={editData.company} onChange={handleChange}
                      className="border p-3 w-full rounded-xl mt-1" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Company Website</label>
                    <input name="companyWebsite" value={editData.companyWebsite || ""} onChange={handleChange}
                      className="border p-3 w-full rounded-xl mt-1" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Company Description</label>
                    <textarea name="companyDescription" value={editData.companyDescription || ""} onChange={handleChange}
                      className="border p-3 w-full rounded-xl mt-1" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <input name="location" value={editData.location} onChange={handleChange}
                      className="border p-3 w-full rounded-xl mt-1" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Job Type</label>
                    <select name="jobType" value={editData.jobType} onChange={handleChange}
                      className="border p-3 w-full rounded-xl mt-1">
                      <option>Full-Time</option>
                      <option>Part-Time</option>
                      <option>Internship</option>
                      <option>Remote</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Min Experience</label>
                      <input type="number" name="experienceMin" value={editData.experienceMin}
                        onChange={handleChange} className="border p-3 w-full rounded-xl mt-1" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Max Experience</label>
                      <input type="number" name="experienceMax" value={editData.experienceMax || ""}
                        onChange={handleChange} className="border p-3 w-full rounded-xl mt-1" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Min Salary</label>
                      <input type="number" name="salaryMin" value={editData.salaryMin || ""}
                        onChange={handleChange} className="border p-3 w-full rounded-xl mt-1" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Max Salary</label>
                      <input type="number" name="salaryMax" value={editData.salaryMax || ""}
                        onChange={handleChange} className="border p-3 w-full rounded-xl mt-1" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Vacancies</label>
                    <input type="number" name="vacancies" value={editData.vacancies}
                      onChange={handleChange} className="border p-3 w-full rounded-xl mt-1" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Deadline</label>
                    <input type="date" name="deadline"
                      value={editData.deadline ? editData.deadline.substring(0,10) : ""}
                      onChange={handleChange}
                      className="border p-3 w-full rounded-xl mt-1" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Skills</label>
                    <input name="skills" value={editData.skills}
                      onChange={handleChange}
                      className="border p-3 w-full rounded-xl mt-1" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <textarea name="description" value={editData.description}
                      onChange={handleChange}
                      className="border p-3 w-full rounded-xl mt-1" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Contact Email</label>
                    <input name="contactEmail" value={editData.contactEmail}
                      onChange={handleChange}
                      className="border p-3 w-full rounded-xl mt-1" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <select name="status" value={editData.status}
                      onChange={handleChange}
                      className="border p-3 w-full rounded-xl mt-1">
                      <option>Active</option>
                      <option>Closed</option>
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => handleUpdate(job._id)}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                    >
                      Save Changes
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="px-6 py-3 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>

                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {job.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {job.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                  <p><strong>Company:</strong> {job.company}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Experience:</strong> {job.experienceMin} - {job.experienceMax || "+"} yrs</p>
                  <p><strong>Salary:</strong> ₹{job.salaryMin} - ₹{job.salaryMax}</p>
                  <p><strong>Vacancies:</strong> {job.vacancies}</p>
                  <p><strong>Deadline:</strong> {job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}</p>
                </div>

                <div className="mt-4">
                  <p><strong>Skills:</strong> {job.skills?.join(", ")}</p>
                  <p className="mt-2"><strong>Description:</strong> {job.description}</p>
                  <p className="mt-2"><strong>Contact:</strong> {job.contact?.email}</p>
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => handleEditClick(job)}
                    className="px-5 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);
}
